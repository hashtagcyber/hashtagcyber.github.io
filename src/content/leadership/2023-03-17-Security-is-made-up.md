---
title: "Security is..."
description: "a madeup job. Let me explain...\""
pubDate: 2023-03-17T00:00:00.000Z
slug: "2023-03-17-Security-is-made-up"
tags:
  - leadership
  - management
  - security
---
# Security is a Made-Up Job

I’ve found a phrase I like, but now realize it probably warrants some explanation:

> **“Security is a made-up job.”**

## What do I mean by that?

Well, I don’t mean that I expect everyone to know everything… We hire DBAs, data scientists, and UX engineers for a reason: there will always be a time when having an expert deep dive into an area is valuable.

But… the majority of what I’ve done over the last few years has been supporting SWEs and SREs in their quest for engineering excellence.

### Vulnerability Management

Security folks can help with identification and prioritization, but the fix usually belongs to an asset owner outside of security.

What’s the best way to save money on your vulnerability management program? **Invest heavily** in CI/CD processes that allow you to PR > Test > Release more frequently. A container image, VMSS, or ASG that gets redeployed once a week with the latest OS patches doesn’t have very many vulns to manage.

### Application Security (AppSec)

If a team can block PRs that fail basic lint checks… they can block PRs that contain security bugs. They can use their automated tests to validate that bumping the version on a dependency doesn’t break anything.

Once you give them the tools (and some hints about what questions to ask), **SWEs** make the best security engineers.

### Compliance

This is a tough one… but we can do it with a much smaller team if we **codify** (spelled _“automate”_ and _“technically enforce”_) our recurring audit requirements.

Nobody wants to answer the question, _“What version of TLS do you use and how often do you rotate secrets?”_ ten times per year.

Let’s build a **dashboard** that presents the data to answer those questions.

* * *

And before someone chimes in with how cool DevSecOps is… what challenges are you solving that don’t just boil down to **engineering excellence**?  
(Seriously, if you find some… tell me.)

### Do security professionals provide value?

Absolutely.

But wouldn’t it be great to live in a world where we weren’t needed most of the time?

(Some of my SWE/SRE friends already live in this world… you’re awesome… thank you for all you do, and for all you’ve taught me over the last decade.)
