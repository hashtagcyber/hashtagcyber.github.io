---
title: "Welcome to Corpo Valley"
description: "Where good ideas from non-technical people get to grow up without giving security a heart attack."
pubDate: 2026-06-09T00:00:00.000Z
slug: "2026-06-09-Welcome-to-Corpo-Valley"
tags:
  - security
  - ai
---

## Everyone has good ideas now

Here's the thing nobody wants to say out loud: for most of my career, the bottleneck on a good idea wasn't the idea — it was whether the person who had it could write the code to prove it.

That's changing. The marketing person who's been quietly running the most important spreadsheet in the company for three years can now describe what they want to an agent and get a working microservice. The support lead who knows EXACTLY where the process breaks can build a little tool that fixes it. AI didn't make these people smart — they were already smart. It just removed the part where they had to wait six months for an engineer to have a free sprint.

And honestly? Their ideas are often better than mine, because they're closer to the actual problem.

## …and that's where I come in to ruin it

You know what really grinds my gears? It's me. I'm the thing that grinds my own gears.

Because the second someone shows me their shiny new app, my brain does the thing it's been trained to do for a decade:

- "This is great! But… where's the CI/CD? You don't even have GitHub."
- "Have you thought about how you're going to keep these dependencies up to date?"
- "Wait. Wait. Where did you put the API key. WHERE DID YOU PUT THE API KEY."
- "Cool, where's it deployed? …it's on a free-tier box with a public IP and no auth, isn't it."

Every one of those questions is _correct_. That's the trap. They're all reasonable, and stacked together they add up to "no." Or worse, they add up to "sure, go ahead" — and now I've got a skunkworks app holding real data, sitting on the public internet, built by someone who (very reasonably) doesn't know what an ExternalSecretsOperator is.

This is the same thing I've written about [a hundred times](/security/posts/2023-03-17-Security-is-made-up): security is a made-up job. The "fix" for almost all of these is just engineering excellence — CI, dependency hygiene, secrets management, an auth boundary. The non-technical person isn't missing those things because they're careless. They're missing them because [we spent years](/security/posts/2022-09-04-Iteration-Is-The-Goal) building all of that for OUR teams and never made it available to anyone else.

So if I really believe that good ideas should be able to come from anywhere… I need to give "anywhere" a safe place to land.

## Enter Corpo Valley

Corpo Valley is a place for skunkworks projects to exist without giving me a heart attack. The whole pitch is: a person (or their agent) shows up with an idea, clicks a few buttons, and gets a real project — repo, pipeline, deployment, secrets, and an auth boundary — without having to know that any of those things exist.

The entire thing sits behind a ZTNA boundary. There's no "open to the internet" tier. None. Even if you _ask_ for one, you can't have it (more on that below). Inside that boundary, someone on the team can:

- spin up a simple microservice
- bolt on a Postgres-backed JSON API with per-user data isolation
- stand up their own MCP server so their tool becomes something the rest of our agents can use
- store secrets in a _safer_ way than `.env` committed to a repo named `final-FINAL-v2`

Is it perfect? No. Will it evolve? Absolutely. The goal isn't to build the world's most secure platform — it's to give people a way to experiment without breaking the bank or exposing us to real risk. It's a ~~paved~~ well-oiled dirt road, not a fortress.

## How it actually works

The trick to all of this is that the guardrails aren't suggestions you have to remember — they're the default, and in a few cases they're things you literally cannot turn off. Let me walk through the parts I care about most.

### Self-hosted auth + git (a blast radius I can actually draw)

The first decision that made everything else easier: Corpo Valley runs its own identity and its own git, completely separate from our enterprise GitHub and our corporate IdP.

This matters more than it sounds. When the marketing-person's-cool-idea lives in our enterprise version control system, every conversation about it starts with risk — what does it have access to, whose token built it, what's it one misconfig away from touching. When it lives in Corpo Valley's self-hosted Gitea, gated by its own Ory Kratos sessions, I can draw a box around the entire thing and say "the worst case stays in this box." The cookie that gets you into the portal is the same one that gets you into a deployed project — and a workload can't forge it, because every backend re-validates the session against Kratos to figure out who's calling. No valid session, no entry. There's no anonymous tier to misconfigure your way into.

Clear blast radius is the most underrated security control there is.

### Templates that help agents build securely

Every project is generated from a Community Center template that already carries the patterns — website, database, and MCP capabilities all wired up the same way every time. When someone's agent goes to add a database, it's not freelancing an auth scheme; it's getting the per-user data scoping that's baked into the template helper. The secure way is also the path of least resistance, which is the only version of "secure" that survives contact with a deadline.

This is the [custom-modules-are-a-superpower](/security/posts/2025-04-02-Modules-are-an-AppSec-Superpower) idea, except the consumer isn't a senior engineer who knows to reach for the safe module. It's an agent. And agents are GREAT at following a paved road if you actually pave one.

### CI/CD scaffolds so everything looks the same

Every repo ships with the pipeline already in it. Push to `main` and two workflows run whether you asked for them or not:

- a **Build** that builds the container, pushes it to the in-cluster registry with an immutable timestamp tag, and pins the deployment — the workflow itself holds no git push credentials, so it can't go rogue. Rollback is a `git revert`. No force pushes, ever.
- a **Scan** that runs semgrep and osv-scanner. Findings exit non-zero, and branch protection won't let a PR merge until both come back green.

Nobody had to set that up. Nobody had to remember to add dependency scanning. The "you need to keep your dependencies up to date" lecture I gave at the top of this post? It's just… on. By default. For someone who has never heard the word "osv-scanner" in their life.

### Guardrails that protect things regardless of what the user asks for

You know what's really cool about creating a "special place" for all the non-production code? We can enforce things... and be a lot more firm about the rules than we ever could be in a "traditional" engineering environment.

In a normal engineering org, "best practice" is a wiki page and a code review and a lot of hoping. Here, the rules live in the cluster as `ValidatingAdmissionPolicies` — CEL expressions that `Deny` at admission time, `failurePolicy: Fail`. They don't warn. They don't open a ticket. They just say no, to the user AND to their agent, no matter how nicely either one asks:

- **You can't skip the front door.** A project Ingress _must_ live at `{slug}.projects.corpo-valley.com` and carry the auth annotation pointing at our identity gate. Try to claim `portal.corpo-valley.com`, or quietly drop the auth annotation to ship "a public version for the demo," and the policy rejects the Ingress outright. There is no unauthenticated tier to misconfigure your way into.
- **You can't wander out of your own namespace.** Project `taco-tracker` deploys into namespace `taco-tracker`, full stop. A manifest that declares its own `metadata.namespace` pointing at `cv-portal`, `kube-system`, or a neighbor's slug gets denied — even though it's the same ArgoCD controller doing the applying.
- **You can't break out to the node.** No `privileged: true`, no `hostPath` mounts, no `hostNetwork`/`hostPID`/`hostIPC`, no `hostPort`, and none of the host-reaching capabilities (`SYS_ADMIN`, `NET_ADMIN`, `NET_RAW`, friends). Bring whatever scrappy container image you want — it still can't touch the box it's running on. This is the un-removable floor, regardless of what the manifest says.
- **You can't grant yourself the keys to the kingdom.** The only cluster-scoped resource a project is allowed to create is its own Namespace. ClusterRoleBindings, CRDs, the rest — denied. If the ArgoCD AppProject whitelist ever got loosened by accident, this backstop still holds.

The pattern that makes me happy: every one of those is something a user (or an over-eager agent) can absolutely _ask_ for, and the platform just… doesn't do it. The protection holds **regardless of what the user asks for.**

## So what

I spent a long time being the person whose job was to find the reason a good idea couldn't ship safely. Corpo Valley is my attempt to flip that — to make the safe version the easy version, so that "anyone can contribute" doesn't have to end with me wincing.

Is Corpo Valley perfect? Still no. But it's a place where a good idea from someone who's never heard of CI/CD can grow up a little before it ever gets near anything that matters — and that feels like exactly the kind of made-up job worth doing.

More to come as it evolves. I have a feeling it's going to. Come see it at [corpo-valley.com](https://www.corpo-valley.com).
