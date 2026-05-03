# Email Integration for Prior Authorization

## Overview
Monitor client's email inbox for prior auth requests, auto-process, and reply.

---

## n8n Workflow

### Trigger: Email Received (IMAP)

```json
{
  "nodes": [
    {
      "name": "Email Trigger",
      "type": "n8n-nodes-base.emailReadImap",
      "parameters": {
        "mailbox": "INBOX",
        "options": {
          "forceReconnect": true
        }
      },
      "credentials": {
        "imap": "aman-hmo-email"
      }
    }
  ]
}
```

### n8n Credentials Setup

1. Go to n8n → Settings → Credentials
2. Add new IMAP credential:
   - **Name:** aman-hmo-email
   - **User:** approvals@aman-hmo.com
   - **Password:** [app password]
   - **Host:** imap.gmail.com (or their provider)
   - **Port:** 993
   - **SSL:** true

3. Add new SMTP credential (for sending replies):
   - **Name:** aman-hmo-smtp
   - **User:** approvals@aman-hmo.com
   - **Password:** [app password]
   - **Host:** smtp.gmail.com
   - **Port:** 587
   - **SSL:** true

---

## Parsing the Email

### Sample Incoming Email:
```
From: provider@reddington.com
Subject: Prior Authorization Request - John Doe

Dear Aman HMO,

Please approve the following:

Patient: John Doe
Member ID: HMO-12345
Procedure: MRI Brain Scan
Provider: Reddington Hospital
Date: 2026-05-10

Regards,
Dr. Smith
```

### Parse with AI (Claude via OpenClaw):

```javascript
// n8n Function node
const emailBody = $input.first().json.text;

// Send to OpenClaw/Claude for parsing
const parsed = await $http.request({
  method: 'POST',
  url: 'http://localhost:18789/api/chat',
  body: {
    message: `Parse this prior auth email and extract as JSON:
    {member_id, patient_name, procedure, provider, date}
    
    Email:
    ${emailBody}`
  }
});

return parsed;
```

### Or Parse with Regex (Simpler):
```javascript
const text = $input.first().json.text;

const member_id = text.match(/Member ID:\s*(\S+)/i)?.[1];
const patient_name = text.match(/Patient:\s*(.+)/i)?.[1]?.trim();
const procedure = text.match(/Procedure:\s*(.+)/i)?.[1]?.trim();
const provider = text.match(/Provider:\s*(.+)/i)?.[1]?.trim();

return {
  member_id,
  patient_name,
  procedure,
  provider
};
```

---

## Check Eligibility, Plan, Utilisation

### Using Google Sheets as Database:

```javascript
// n8n HTTP Request node - Get Member
const member = await $http.request({
  method: 'GET',
  url: `https://sheets.googleapis.com/v4/spreadsheets/SHEET_ID/values/Members!A:F`,
  headers: {
    'Authorization': 'Bearer ' + $credentials.google.accessToken
  }
});

// Find member by ID
const memberRow = member.values.find(row => row[0] === member_id);

if (!memberRow) {
  return { status: 'REJECTED', reason: 'Member not found' };
}

const [id, name, plan_type, status, used, limit] = memberRow;

// Check eligibility
if (status !== 'Active') {
  return { status: 'REJECTED', reason: 'Member not active' };
}

// Check plan coverage (separate sheet)
const coverage = await checkPlanCoverage(plan_type, procedure);
if (!coverage.covered) {
  return { status: 'REJECTED', reason: `${procedure} not covered under ${plan_type}` };
}

// Check utilisation
const remaining = parseInt(limit) - parseInt(used);
if (coverage.cost > remaining) {
  return { status: 'REJECTED', reason: 'Utilisation limit exceeded' };
}

// All checks passed
return { 
  status: 'APPROVED',
  auth_code: 'PA-' + Date.now(),
  valid_days: 14
};
```

---

## Send Reply Email

### Approved Template:
```
Subject: RE: Prior Authorization Request - {{patient_name}} - APPROVED

Dear Provider,

Your prior authorization request has been APPROVED.

Patient: {{patient_name}}
Member ID: {{member_id}}
Procedure: {{procedure}}
Provider: {{provider}}

✅ AUTHORIZATION APPROVED
Authorization Code: {{auth_code}}
Valid Until: {{valid_date}}

This approval is subject to the terms of the member's plan.

Regards,
Aman HMO
Automated Authorization System
```

### Rejected Template:
```
Subject: RE: Prior Authorization Request - {{patient_name}} - NOT APPROVED

Dear Provider,

Your prior authorization request could not be approved.

Patient: {{patient_name}}
Member ID: {{member_id}}
Procedure: {{procedure}}

❌ NOT APPROVED
Reason: {{rejection_reason}}

If you believe this is an error, please contact our team at support@aman-hmo.com.

Regards,
Aman HMO
Automated Authorization System
```

---

## Full n8n Workflow Structure

```
┌─────────────────┐
│  Email Trigger  │ (IMAP - check every 1 min)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Parse Email    │ (Extract member_id, procedure, etc.)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check Eligibility│ (Is member active?)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   YES        NO → Send Rejection Email
    │
    ▼
┌─────────────────┐
│  Check Plan     │ (Is procedure covered?)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   YES        NO → Send Rejection Email
    │
    ▼
┌─────────────────┐
│Check Utilisation│ (Within limits?)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   YES        NO → Send Rejection Email
    │
    ▼
┌─────────────────┐
│ Generate Auth   │ (Create auth code)
│ Update Database │ (Deduct from utilisation)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Send Approval    │ (Reply to provider)
│Email            │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Log to DB      │ (For dashboard)
└─────────────────┘
```

---

## Gmail App Password Setup

If Aman uses Gmail:

1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Go to App Passwords
4. Generate new app password for "Mail"
5. Use that password in n8n (not the regular Gmail password)

---

## Office 365 Setup

If Aman uses Outlook/Office 365:

1. Admin needs to enable IMAP access
2. Or use Microsoft Graph API (more complex but better)
3. n8n has built-in Microsoft OAuth

---

## Testing

1. Send test email to the inbox
2. Check n8n execution logs
3. Verify parsing worked
4. Check if reply was sent
5. Verify database was updated
