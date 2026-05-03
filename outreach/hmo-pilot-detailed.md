# HMO Pilot — Detailed Scope

## Client Profile
- **Volume:** 50-70 calls/day
- **Call types:** Complaints & enquiries
- **Prior Auth channels:** Email & WhatsApp
- **Auth checks:** Eligibility → Plan → Utilisation

---

## USE CASE 1: Voice AI (Calls)

### What It Handles
| Call Type | AI Response |
|-----------|-------------|
| "Is Dr. X / Hospital Y in network?" | Check provider list, confirm yes/no |
| "What does my plan cover?" | Look up plan details, explain coverage |
| "What's my claim status?" | Check claims database, give update |
| "I have a complaint about..." | Log complaint, escalate to human if needed |
| "How do I get pre-authorization?" | Explain process, offer to transfer to WhatsApp |
| "My hospital said I'm not covered" | Check eligibility, clarify issue |

### Data Needed
- [ ] Provider/hospital list (network)
- [ ] Plan types & coverage details
- [ ] FAQ document (common complaints)
- [ ] Claims status API or spreadsheet

### Setup
1. Create ElevenLabs agent with HMO prompt
2. Connect to a phone number (Twilio or ElevenLabs number)
3. Forward their existing line → AI number
4. AI handles tier-1, transfers complex to human

### Success Metrics
- 60%+ calls fully resolved by AI
- <2 min average call time
- 24/7 availability
- Cost reduction: ~₦200/call → ~₦30/call

---

## USE CASE 2: Prior Authorization Automation (Email/WhatsApp)

### Current Flow (Manual)
```
Request comes in (Email/WhatsApp)
       ↓
Staff manually checks eligibility
       ↓
Staff manually checks plan coverage
       ↓
Staff manually checks utilisation limits
       ↓
Staff approves or rejects
       ↓
Staff replies to requester
```

### Automated Flow
```
Request comes in (Email/WhatsApp)
       ↓
AI parses request (patient ID, procedure, provider)
       ↓
Auto-check eligibility (is patient active?)
       ↓
Auto-check plan (does plan cover this procedure?)
       ↓
Auto-check utilisation (within limits?)
       ↓
IF all pass → Auto-approve, send approval message
IF any fail → Flag for human review with reason
       ↓
Reply sent via same channel (Email/WhatsApp)
```

### Data Needed
- [ ] Member database (ID, plan type, status)
- [ ] Plan coverage rules (what each plan covers)
- [ ] Utilisation tracker (how much each member has used)
- [ ] Procedure/service codes list
- [ ] Approval message templates

### Tech Stack Options

**Option A: WhatsApp Bot + Simple Backend**
- WhatsApp Business API (or Twilio WhatsApp)
- Simple database (Airtable, Supabase, or their existing system)
- Logic checks via code or n8n/Make automation

**Option B: AI-Powered (Claude/GPT)**
- AI reads incoming message
- AI queries database for eligibility/plan/utilisation
- AI makes decision based on rules
- AI sends response

**Option C: Hybrid**
- WhatsApp bot collects info
- Backend does rule checks
- AI handles edge cases and responses

### Sample WhatsApp Flow
```
Provider: "Prior auth request for John Doe, ID 12345, 
          for MRI scan at Reddington Hospital"

Bot: "Checking authorization for John Doe...
      ✓ Eligibility: Active member
      ✓ Plan: Premium Gold - MRI covered
      ✓ Utilisation: ₦450,000 / ₦1,000,000 used
      
      ✅ APPROVED
      Authorization Code: PA-2026-05-7821
      Valid for: 14 days
      Provider: Reddington Hospital
      Procedure: MRI Scan
      
      Approval sent to provider and member."
```

### For Rejections
```
Bot: "Checking authorization for Jane Doe...
      ✓ Eligibility: Active member
      ✗ Plan: Basic - MRI NOT covered
      
      ❌ NOT APPROVED
      Reason: MRI scan not covered under Basic plan
      
      Options:
      1. Upgrade to Premium plan
      2. Pay out-of-pocket (est. ₦85,000)
      3. Request human review
      
      Reply 1, 2, or 3"
```

---

## Implementation Timeline

| Week | Voice AI | Prior Auth Automation |
|------|----------|----------------------|
| 1 | Setup agent, test calls | Design flow, setup WhatsApp |
| 2 | Soft launch (30% calls) | Connect to member database |
| 3 | Full launch | Test with sample requests |
| 4 | Optimize based on data | Go live |

---

## Pricing (Post-Pilot)

### Voice AI
- Per minute: ₦15-25/min
- Or flat monthly: ₦150,000-300,000 for 50-70 calls/day

### Prior Auth Automation
- Per request: ₦100-200/request
- Or flat monthly: ₦100,000-200,000 unlimited

### Bundle Deal
- Both for ₦350,000/month (saves ₦100k+)

---

## Next Steps

1. **Get sample data:**
   - 10 sample calls (recordings or transcripts)
   - 10 sample prior auth requests
   - Member database structure
   - Plan coverage rules

2. **Build Voice Agent** (Week 1)
   - Use ElevenLabs + the HMO prompt we created

3. **Build WhatsApp Bot** (Week 1-2)
   - Twilio WhatsApp or WhatsApp Business API
   - Connect to their database

4. **Test internally** (Week 2)

5. **Go live** (Week 3)

---

## Questions for Your Friend

1. What system do they use for member data? (Excel, custom software, etc.)
2. Can we get API access or will we need to sync a spreadsheet?
3. How many prior auth requests per day?
4. What's their current turnaround time for approvals?
5. Do they want AI to auto-approve, or just recommend + human confirms?
