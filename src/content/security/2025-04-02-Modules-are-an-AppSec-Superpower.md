---
title: "Custom Modules are an AppSec Superpower"
description: "The part few people talk about when discussing 'security paved roads'"
pubDate: 2025-04-02T00:00:00.000Z
slug: "2025-04-02-Modules-are-an-AppSec-Superpower"
tags:
  - security
  - engineering
  - aws
  - typescript
---
Throughout most of my career, I’ve noticed a pattern of:

1.  Software engineers get sent off to build the worlds coolest feature
2.  There is no library for X, so they use the other modules already availble to them to solve a problem
3.  SWE team does code review - everything works, and we even updated our dependencies as part of the release… it’s secure… right?
4.  Someone notices a business logic problem that exposes the company to significant risk.

The problem is: while it’s really easy to find a library that will help you access files in S3, render cool buttons, and compress data so that pages load faster… It’s hard to find an off the shelf module that will enforce the logical controls unique to your organization. I’ll use S3 access for my example below, but this also applies to:

-   Validating that a user has the appropriate entitlements to use an API endpoint
-   Logging in a privacy focused manner
-   Managing LLM contexts on a per-user basis

## The Trouble with S3

If I were to ask you, “how do I give a user access to a sensitive file in this bucket”… your answer would likely be “Generate a presigned url, and have them use that”… it’s a really simple concept to discuss, and the code you’ll start out with probably looks like this:

```
export async function getSignedS3Url(s3Path: string, expiresIn = 900): Promise<string> {
  const stripped = s3path.split('//')[1] // remove s3:// from the path
  const parts = strippled.split('/')
  const bucket = parts[0]
  const key = parts.slice(1).join('/')

  const client = new S3Client({ region: "us-east-1" }); // change region if needed

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn });

  return signedUrl;
}
```

## But you just…

So, what did we just create? A typescript function that solves our problem, right?

-   How do I ensure that that we only give this link to a person who should have it?
-   How do I track the requests users make compared to this function executing?
-   How to I ensure that if Bill asks for Pat’s files… we don’t actually give them a link?

The answer to all of those questions is - we can’t. Every time an engineer needs to push/pull a file from S3, they have to remember to apply this logic themselves. Most of the time, it’s a quick fix, and the team does a great job handling it… But other times we end up with something like this:

```
export async function getSignedS3Url(s3Path: string, userId: string, expiresIn = 900): Promise<string> {
  if (!s3Path.contains(userId)) {
   throw new Error('File does not belong to user')
  }
  const stripped = s3path.split('//')[1]
  const parts = strippled.split('/')
  const bucket = parts[0]
  const key = parts.slice(1).join('/')

  const client = new S3Client({ region: "us-east-1" }); // change region if needed

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn });

  return signedUrl;
}
```

At first glance, this is a great solution to the problem… we’re ensuring that the s3 path provided contains the usersId, with the goal being the user can only access paths like `s3://bucketname/<myuserid>/mydata.txt`. However what if the API receives: `<attackerUserId>s3://bucketname/<targetUserId>/mydata.txt`? The first check will pass, `stripped` will contain a valid S3 path, and the attacker will receive a signed url with access to their targets data.

## Solving the problem

Life get’s a lot easier when we introduce a module that handles all these checks in one place. We call these `UserClients`, and they can be applied to any situation where we will be reading/writing data on behalf of the user. Instead of importing the AWS libraries directly anywhere we need to access S3, we expose an `AWSUserClient` class that engineers can instantiate using the JWT provided to them by the user. It still lets us push/pull files… but now the checks are built in.

```
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken"; // or your preferred JWT library

class AWSUserClient {
  private userId: string;
  private jwtToken: string;
  private s3: S3Client;
  private bucketName: string;

  constructor(jwtToken: string, bucketName: string) {
    this.jwtToken = jwtToken;
    this.bucketName = bucketName;
    this.validateJWT(); // sets this.userId
    this.s3 = new S3Client({ region: "us-east-1" }); // Customize as needed
  }

  private validateJWT(): void {
    // Replace this with your real JWT validation logic
    const decoded = jwt.verify(this.jwtToken, "your-public-key-or-secret") as { sub: string };
    if (!decoded?.sub) {
      throw new Error("Invalid JWT");
    }
    this.userId = decoded.sub;
  }

  private validatePath(s3Path: string): string {
    const prefix = `s3://${this.bucketName}/${this.userId}/`;
    if (!s3Path.startsWith(prefix)) {
      throw new Error("Unauthorized path");
    }
    return s3Path.replace(`s3://${this.bucketName}/`, ""); // return just the key
  }

  async uploadFile(s3Path: string, body: Buffer | string): Promise<void> {
    const key = this.validatePath(s3Path);
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
    }));
  }

  async getFile(s3Path: string): Promise<any> {
    const key = this.validatePath(s3Path);
    const response = await this.s3.send(new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    }));
    return response.Body;
  }
}
```

With the class above now available, SAFELY working with S3 is pretty easy:

```

const jwtToken = "eyJ..."; // User's JWT
const bucket = "user-files-eu-west-1";

const client = new AWSUserClient(jwtToken, bucket);

await client.uploadFile(`s3://${bucket}/abc123/docs/report.pdf`, "PDF content");
// Throws if userId != "abc123"
```

## Going further

The magic of creating these modules is that you can now:

-   create CI lint rule that blocks the direct use of AWSClient, and reccomends AWSUserClient instead
-   place `aws-user-client.ts` under a CODEOWNERS rule that requires your security team to review any changes before they are merged
-   extend the class in the future to:
    -   tag files with the userId prior to uploading them
    -   assume a different role based on the users JWT to clearly scope their permissions
    -   tag the roleSession with the userId and implement a tag based access policy in AWS
