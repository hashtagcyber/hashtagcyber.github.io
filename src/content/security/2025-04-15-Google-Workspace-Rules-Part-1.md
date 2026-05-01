---
title: "Rules for Google Workspace Management : Part 1"
description: "Three Google Workspace patterns we often fail to follow"
pubDate: 2025-04-15T00:00:00.000Z
slug: "2025-04-15-Google-Workspace-Rules-Part-1"
tags:
  - security
  - engineering
  - googleworkspace
  - corpit
---
The first “Corp IT” addition to my [CTO Guide Series](/leadership/posts/2025-04-06-CTO-Guide-Lessons-Learned-Along-The-Way)

## Rule 1: Google Accounts are for Humans

As your organization grows, you’ll find yourself in need of at least one of the following email addresses:

-   [socialmedia@totallylegitsite.com](mailto:socialmedia@totallylegitsite.com)
-   [support@totallylegitsite.com](mailto:support@totallylegitsite.com)
-   [jobs@totallylegitsite.com](mailto:jobs@totallylegitsite.com)
-   [security@totallylegitsite.com](mailto:security@totallylegitsite.com)

These are known as “utility mailboxes” — they exist so that people outside of the organization have a clear way of connecting with the company via email. The naive approach to creating them would be:

1.  Login to [admin.google.com](https://admin.google.com)
2.  Create a new user with the name “Social Media”
3.  Send the password to whoever manages your social media presence

**The downside to this approach?**

-   You’ve just created what will likely be a “shared account.” Google’s built-in account takeover protections will struggle to believe that you’ve made it acceptable for multiple humans to share a password. This results in account security notifications, forced logouts, and more MFA prompts than anyone wants to deal with.
-   If an employee leaves the company, you will need to rotate the password of every shared account they had access to.
-   You’re now paying $27.99 a month to Google for something that they already give you a way to do for free.

**So, what do we do instead?**

-   Create a new Google Group at [groups.google.com](https://groups.google.com) (ensure you’re logged in with your corporate account)
-   Enable the _Collaborative Inbox_ feature
-   Add anyone who needs access to that mailbox as a member

Everyone in that group will now receive mail sent to [socialmedia@totallylegitsite.com](mailto:socialmedia@totallylegitsite.com)

* * *

## Rule 2: Delegate Brand Accounts

`With a shiny new email address in hand, the avid marketer browses to Twitter, ready to create their new Brand account.`

Most services with an advertising platform have a way to delegate access to their employees:

-   Twitter has the [Delegate feature](https://help.x.com/en/managing-your-account/how-to-use-the-delegate-feature)
-   Facebook has the [Business Suite](https://www.facebook.com/business/tools/meta-business-suite) that covers all of their platforms (Facebook, Instagram, and Messenger)
-   YouTube has [Brand Accounts](https://support.google.com/youtube/topic/9267757)

Instead of having everyone log in as [socialmedia@totallylegitsite.com](mailto:socialmedia@totallylegitsite.com), have them create an account using their corporate email. Then, delegate access to them.

* * *

## Rule 3: If it Doesn’t Support SAML, You Probably Shouldn’t Use It

Sure, when you’re bootstrapping, it’s okay to use free-tier and individually licensed tools. We make trade-offs to keep the business alive all the time. However, as you approach the point where Google Hangouts says, “we’ve automatically muted you due to the size of the call”… it’s time to think about:

-   **Can I build a dependency on this product? Are they at least as stable as I am?**
    
    -   Products designed to support individual users, without an enterprise plan, will likely have gaps that introduce risks to your company over the long term. Things like _Audit Logging_ and _Data Export_ typically come standard with an enterprise plan.
-   **How will I manage access and licensing of this tool once we reach 100 employees?**
    
    -   Many SaaS products charge based on the number of users (Jira, GitHub, Figma, etc.). Having a centralized way to offboard users will save you money.
    -   You’ll want to grant access to some tools based on the team they are on:
        -   The marketing team will all need access to Mailchimp
        -   The support team will all need access to Zendesk

Google Workspace allows you to create _Custom Apps_ and grant access to them based on group membership. A solid workflow looks something like this:

1.  Create a Google Group called `acl-app-admins`
    
    -   We will use this group to grant ourselves access to the app once SSO is configured
    -   The `acl` prefix is important. It’s how you tag a group as being used to grant permissions
        -   In the future, you can set up automation so that membership for most groups is self-service for 24 hours. This allows your team to unblock themselves in an emergency.
2.  Create the new _Custom SAML app_ using the Google Workspace Admin console
    
    -   [Google Support: Set up SAML app](https://support.google.com/a/answer/6087519?hl=en)
3.  Configure SSO for the product, and grant your `acl-app-admins` group access to it
    
4.  Go to Gmail, click the 9-dot box in the top right corner, then scroll down and click the app you just created
    
5.  Once things are working, create a new group `acl-product-name-access` and enable the SAML App for that group
    
6.  Employees in that group will now see the app you created in their “9-dot” dropdown
