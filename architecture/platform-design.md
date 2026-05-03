# SaasPro Labs Platform Architecture

## Overview
Multi-tenant AI automation platform where each client gets:
- Custom voice AI agent
- Prior authorization automation
- Analytics dashboard

---

## Infrastructure

### Cloud Server (OpenClaw Host)
**Option A: AWS EC2**
- Instance: t3.medium or t3.large
- Cost: ~$30-50/month
- Location: eu-west-1 (closest to Nigeria)

**Option B: DigitalOcean**
- Droplet: 4GB RAM, 2 vCPUs
- Cost: ~$24/month
- Simpler setup

**Option C: Hetzner (Cheapest)**
- CX21: 4GB RAM, 2 vCPUs
- Cost: ~€6/month (~$7)
- Great for starting out

### Recommended Stack
```
┌─────────────────────────────────────┐
│           VPS Server                │
│  ┌─────────────────────────────┐   │
│  │      OpenClaw Gateway       │   │
│  │  - Handles all AI agents    │   │
│  │  - Skills per client        │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │      n8n (Automation)       │   │
│  │  - WhatsApp webhooks        │   │
│  │  - Email processing         │   │
│  │  - Database queries         │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │     PostgreSQL / SQLite     │   │
│  │  - Client data              │   │
│  │  - Logs & analytics         │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │     Dashboard (Next.js)     │   │
│  │  - Client portal            │   │
│  │  - Analytics                │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## Per-Client Skills Structure

```
/openclaw/workspace/
├── skills/
│   ├── aman-hmo/
│   │   ├── SKILL.md           # HMO-specific instructions
│   │   ├── prompts/
│   │   │   ├── voice-agent.md # Voice AI system prompt
│   │   │   └── prior-auth.md  # Prior auth bot prompt
│   │   ├── data/
│   │   │   ├── members.json   # Member database
│   │   │   ├── plans.json     # Plan coverage rules
│   │   │   └── providers.json # Network providers
│   │   └── config.json        # Client settings
│   │
│   ├── outsource-global/
│   │   ├── SKILL.md
│   │   ├── prompts/
│   │   └── data/
│   │
│   └── client-template/       # Copy for new clients
│       ├── SKILL.md
│       ├── prompts/
│       └── data/
```

---

## Skill Template (SKILL.md)

```markdown
# [Client Name] - Voice AI & Automation

## Client Info
- **Name:** Aman HMO
- **Industry:** Healthcare / HMO
- **Contact:** [Name], [Phone]
- **WhatsApp:** +234xxxxxxxxxx
- **Go-live date:** 2026-05-15

## Voice Agent
- **Agent ID:** agent_xxxx (ElevenLabs)
- **Phone:** +234xxxxxxxxxx (Twilio)
- **Hours:** 24/7

## Prior Auth Bot
- **WhatsApp Number:** +234xxxxxxxxxx
- **Workflow:** n8n workflow ID: xxx

## Data Sources
- Members: /skills/aman-hmo/data/members.json
- Plans: /skills/aman-hmo/data/plans.json
- Providers: /skills/aman-hmo/data/providers.json

## Escalation
- Complex issues → [Operations Manager Phone]
- Complaints → [Email]
```

---

## Dashboard Features

### Client View (What Aman sees)
```
┌─────────────────────────────────────────────────┐
│  Welcome, Aman HMO                    [Logout]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Today's Stats                                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐│
│  │  Calls  │ │  Prior  │ │Approved │ │ Saved ││
│  │   47    │ │  Auths  │ │   89%   │ │ ₦125k ││
│  │  today  │ │   23    │ │         │ │ today ││
│  └─────────┘ └─────────┘ └─────────┘ └───────┘│
│                                                 │
│  Prior Authorizations (Last 7 days)            │
│  ┌─────────────────────────────────────────┐   │
│  │  📊 [Chart: Approved vs Rejected]       │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Recent Requests                               │
│  ┌─────────────────────────────────────────┐   │
│  │ ✅ John Doe - MRI Scan - Approved       │   │
│  │ ✅ Jane Doe - X-Ray - Approved          │   │
│  │ ❌ Bob Smith - CT Scan - Plan limit     │   │
│  │ ✅ Alice Brown - Lab Test - Approved    │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [Export Report]  [Update Member Data]         │
└─────────────────────────────────────────────────┘
```

### Admin View (What you see)
```
┌─────────────────────────────────────────────────┐
│  SaasPro Labs Admin                  [Settings] │
├─────────────────────────────────────────────────┤
│                                                 │
│  All Clients                                    │
│  ┌─────────────────────────────────────────┐   │
│  │ Client      │ Calls │ Auths │ MRR       │   │
│  │─────────────┼───────┼───────┼───────────│   │
│  │ Aman HMO    │ 1,247 │  342  │ ₦200,000  │   │
│  │ Outsource   │ 5,420 │    -  │ ₦500,000  │   │
│  │ BetKing     │ 8,901 │    -  │ ₦750,000  │   │
│  │─────────────┼───────┼───────┼───────────│   │
│  │ TOTAL       │15,568 │  342  │ ₦1,450,000│   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [+ Add Client]  [View Logs]  [Billing]        │
└─────────────────────────────────────────────────┘
```

---

## Tech Stack for Dashboard

### Simple Version (MVP)
- **Frontend:** Next.js + Tailwind
- **Backend:** Next.js API routes
- **Database:** Supabase (free tier)
- **Auth:** Supabase Auth
- **Hosting:** Vercel (free)

### Data Flow
```
WhatsApp/Call → OpenClaw processes → Logs to Supabase → Dashboard reads
```

---

## Database Schema

### Tables

**clients**
| id | name | industry | contact_email | phone | plan | mrr | created_at |
|----|------|----------|---------------|-------|------|-----|------------|

**calls**
| id | client_id | timestamp | duration_sec | resolved | transcript |
|----|-----------|-----------|--------------|----------|------------|

**prior_auths**
| id | client_id | member_id | procedure | provider | status | auth_code | created_at |
|----|-----------|-----------|-----------|----------|--------|-----------|------------|

**members** (per client)
| id | client_id | member_id | name | plan_type | status | utilisation_used | utilisation_limit |
|----|-----------|-----------|------|-----------|--------|------------------|-------------------|

---

## Implementation Plan

### Week 1: Infrastructure
- [ ] Spin up VPS (Hetzner or DO)
- [ ] Install OpenClaw
- [ ] Set up n8n
- [ ] Connect Twilio WhatsApp

### Week 2: First Client (Aman HMO)
- [ ] Create skill folder
- [ ] Import their member data
- [ ] Build voice agent (ElevenLabs)
- [ ] Build prior auth workflow (n8n)
- [ ] Test end-to-end

### Week 3: Dashboard MVP
- [ ] Create Next.js app
- [ ] Supabase database
- [ ] Client login
- [ ] Basic stats display
- [ ] Prior auth log view

### Week 4: Go Live
- [ ] Connect Aman's WhatsApp
- [ ] Forward calls to AI
- [ ] Monitor and fix issues
- [ ] Daily check-ins with Aman

---

## Costs

| Item | Monthly |
|------|---------|
| VPS (Hetzner CX21) | $7 |
| Supabase (free tier) | $0 |
| Vercel (free tier) | $0 |
| Twilio WhatsApp | $15-30 |
| ElevenLabs | $22-99 |
| Domain | $1 |
| **Total** | **~$50-150/month** |

Revenue from 1 client: ₦200,000 (~$125)
**Profit margin: 60-80%**

---

## Scaling

When you have 5+ clients:
- Upgrade VPS
- Move to Supabase Pro ($25/month)
- Consider dedicated Twilio numbers per client
- Hire a support person (part-time)

When you have 20+ clients:
- Dedicated server
- Full-time ops person
- Enterprise features (API access, custom integrations)
