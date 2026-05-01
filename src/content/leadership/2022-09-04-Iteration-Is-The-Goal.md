---
title: "Iteration is the goal"
description: "Remind yourself, the goal is iteration, even with engineering excellence"
pubDate: 2022-09-04T00:00:00.000Z
slug: "2022-09-04-Iteration-Is-The-Goal"
tags:
  - leadership
  - management
  - security
---
## **“Remind yourself the goal is iteration, even with engineering excellence.”**

Have you ever worked at a place that:

-   Has a strong **culture of code reviews and automated testing**?
-   Builds everything with a **CI/CD mindset**?
-   Makes **on-call a breeze** with service health dashboards and alarms that point to runbooks?

One thing I’ve noticed recently is how easy it is to think:  
_“This is the standard, and we should do that everywhere.”_

Having those “basics” down is **essential** for moving fast and quick iteration. The problem? Those basics take a lot of time to:

-   **Set up**
-   **Train people to use**
-   **Train people to fix**
-   **Build a culture around**

**“Focus on Iteration”** is one of our team tenets, and I’m sad that it’s taken me so long to fully accept that this applies to **engineering excellence** as well.

* * *

## **The CI/CD Journey: A Comedy in Several Acts**

It’s really easy to start with a generic statement like:

> _I want CI/CD._

Then spend **months** finding all the use cases you need to cover:

### **Step 1: “Everything needs a PR”**

✅ Teach people to do PRs and code reviews  
✅ Build a culture of small (squashed) diffs

### **Step 2: “Wait, but it needs to be enforced”**

✅ Configure branch protection on `main`  
✅ Configure unit tests to run as PR checks

### **Step 3: “Wait, but we don’t have unit tests”**

✅ Train team on unit test basics  
✅ Select unit test frameworks that work with our code  
✅ Provide a unit testing template and tutorial

### **Step 4: “Wait, but what about infrastructure as code?”**

✅ Choose a deployment strategy (Canary, Blue-Green, etc.)  
✅ Redo everything you just did

### **Step 5: “But wait, what about upstream/downstream services?”**

✅ Schedule a meeting with your therapist  
✅ Redo everything you just did  
✅ Cry

And the list goes on… and on… and on.

* * *

## **The TL;DR here is:**

1️⃣ **If you have these things, don’t take for granted all the iterations that went into getting your team where they are today.**

2️⃣ **Iteration is key**, even when it comes to engineering excellence. Start with something small (_PRs_), and keep layering on all the fun things you want to do to keep your services healthy.

(And if **building this type of culture sounds fun**, reminder that I’m hiring a **tech lead and senior security engineer**… don’t be shy about reaching out :p [https://lnkd.in/gxaVFW4N](https://lnkd.in/gxaVFW4N))
