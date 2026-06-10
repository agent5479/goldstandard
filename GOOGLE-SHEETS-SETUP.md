# Google Sheets setup — contact form backend

This document describes everything required to connect the Gold Standard Dog Training contact form to a Google Sheet using Google Apps Script.

The website stays fully static on GitHub Pages. Form submissions are sent from the browser to your deployed Apps Script web app, which writes a row to the Sheet and optionally emails you.

---

## What you need

| Requirement | Details |
|---|---|
| Google account | Same account you use for Gmail / Drive |
| Google Sheet | One spreadsheet to store enquiries |
| Apps Script | Bound to that Sheet; handles incoming POST requests |
| Web app deployment | Public `/exec` URL the site posts to |
| Site config | Paste the URL into `form-config.js` and push to GitHub |

**Repository files involved:**

- [`google-apps-script/Code.gs`](google-apps-script/Code.gs) — script to paste into Apps Script
- [`form-config.js`](form-config.js) — holds your deployed web app URL
- [`contact-form.js`](contact-form.js) — sends form data (do not edit unless changing fields)

---

## Sheet requirements

### Spreadsheet name

Recommended: **Gold Standard Enquiries**

Any name works; the script uses the **active (first) sheet tab**.

### Column headers (row 1)

Create these headers **in this exact order** in row 1:

| Column | Header | Required | Source |
|---|---|---|---|
| A | `Timestamp` | Yes | Set automatically by the script |
| B | `Name` | Yes | Form field: Your name |
| C | `Phone` | Yes | Form field: Phone |
| D | `Email` | Yes | Form field: Email |
| E | `Dog Name` | No | Form field: Dog's name (optional on form) |
| F | `Service` | Yes | Form field: Service interest |
| G | `Message` | Yes | Form field: Message |

Example row 1:

```
Timestamp | Name | Phone | Email | Dog Name | Service | Message
```

### Recommended Sheet formatting

- **Freeze row 1** (View → Freeze → 1 row) so headers stay visible when scrolling.
- **Widen columns** B–G for readability.
- **Turn on filters** (Data → Create a filter) to sort or search enquiries.
- Leave row 2 onward empty — the script appends new rows starting at row 2.

### Service interest values

The contact form sends one of these strings in the **Service** column:

- General obedience
- Safety and reactivity
- Rehabilitation
- Owner coaching
- Other

---

## Apps Script requirements

### Where to add the script

1. Open your spreadsheet.
2. Go to **Extensions → Apps Script**.
3. Delete any default code in `Code.gs`.
4. Paste the full contents of [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
5. Click **Save**.

### Configuration inside the script

At the top of `Code.gs`, set:

```javascript
const NOTIFY_EMAIL = "goldstandardtakaka@gmail.com";
```

| Setting | Purpose |
|---|---|
| `NOTIFY_EMAIL` | Inbox that receives an email for each new enquiry. Set to `""` (empty string) to disable email notifications and only log to the Sheet. |

### Permissions the script uses

When you deploy and authorize, Google will ask for:

| Permission | Used for |
|---|---|
| Google Sheets | Append enquiry rows |
| Gmail (`MailApp`) | Send notification emails (only if `NOTIFY_EMAIL` is set) |

### What the script does on each submission

1. Parses JSON from the POST body.
2. **Honeypot check:** if `website` is non-empty, returns success without saving (spam trap).
3. **Validation:** rejects if `name`, `phone`, `email`, `service_interest`, or `message` is missing.
4. **Appends one row** to the active sheet: timestamp + all fields.
5. **Optional email** to `NOTIFY_EMAIL` with enquiry details and `replyTo` set to the submitter's email.
6. Returns JSON: `{ "success": true }` or `{ "success": false, "message": "..." }`.

---

## Web app deployment requirements

### Deployment settings

1. In Apps Script, click **Deploy → New deployment**.
2. Click the gear icon → select **Web app**.
3. Use these settings:

| Setting | Required value |
|---|---|
| **Execute as** | Me (`your@gmail.com`) |
| **Who has access** | Anyone |

4. Click **Deploy**.
5. Complete **Authorize access** when prompted.
6. Copy the **Web app URL**. It must end in `/exec`, for example:

   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

### After script changes

The deployment URL stays the same, but you must publish a new version:

1. **Deploy → Manage deployments**
2. Click the pencil (Edit) on the active deployment
3. **Version → New version**
4. **Deploy**

---

## Site configuration requirements

### `form-config.js`

Set your deployed URL:

```javascript
window.GSDT_FORM_ENDPOINT = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

Replace `YOUR_DEPLOYMENT_ID` with the ID from your deployment URL.

Commit and push so GitHub Pages serves the updated file:

```bash
git add form-config.js
git commit -m "Configure contact form Google Apps Script endpoint."
git push
```

If `GSDT_FORM_ENDPOINT` is blank, visitors can still call or email directly; the form shows an error only when someone tries to submit.

---

## Data sent from the website

Each POST body is JSON with these fields:

| JSON field | Form field | Required | Stored in Sheet |
|---|---|---|---|
| `name` | Your name | Yes | Name |
| `phone` | Phone | Yes | Phone |
| `email` | Email | Yes | Email |
| `dog_name` | Dog's name | No | Dog Name |
| `service_interest` | Service interest | Yes | Service |
| `message` | Message | Yes | Message |
| `website` | Hidden honeypot | Must be empty | Not stored |

**HTTP details:**

- Method: `POST`
- Header: `Content-Type: text/plain;charset=utf-8`
- Body: JSON string (plain text content type avoids CORS preflight issues with Apps Script)

---

## Testing checklist

After setup, verify each item:

- [ ] Submit a test enquiry on [contact.html](contact.html) (live site or locally with `form-config.js` set).
- [ ] A new row appears in the Sheet with the correct timestamp and field values.
- [ ] The browser shows the green success message.
- [ ] If `NOTIFY_EMAIL` is set, a notification email arrives (check spam).
- [ ] Reply-to on the notification email is the submitter's address.
- [ ] Honeypot: filling the hidden `website` field does **not** add a row (form appears to succeed silently to bots).
- [ ] Missing required fields return an error without writing a row.

---

## Troubleshooting

### Form submits but no success message in the browser

- Hard-refresh the contact page (Ctrl+F5).
- Confirm `form-config.js` on the live site contains your `/exec` URL.
- Redeploy the script as a **new version** after any code change.
- The site uses `Content-Type: text/plain` specifically for Google Apps Script CORS — do not change this without retesting.

### No row appears in the Sheet

- Confirm headers in row 1 match the table above.
- Check **Executions** in Apps Script (left sidebar) for errors.
- Ensure the script is bound to the correct spreadsheet (Extensions → Apps Script from that Sheet).
- Verify deployment is **Execute as: Me** and **Who has access: Anyone**.

### Authorization or permission errors

- Redeploy and re-authorize.
- If using email notify, ensure Gmail permission was granted.
- Run the deployment from the same Google account that owns the Sheet.

### No notification email

- Confirm `NOTIFY_EMAIL` is set and not empty.
- Check spam/junk.
- Verify Gmail permission was granted during authorization.
- Test with a simple submission after redeploying.

### Script URL is public

This is normal for static sites. The URL will be visible in `form-config.js` in the public repo. Mitigations already in place:

- Honeypot field (`website`)
- Server-side required-field validation
- No secrets stored in the repository

Do **not** put API keys or passwords in the Sheet or script for this setup.

---

## Quick setup summary

1. Create Sheet **Gold Standard Enquiries** with 7 column headers in row 1.
2. **Extensions → Apps Script** → paste [`google-apps-script/Code.gs`](google-apps-script/Code.gs) → set `NOTIFY_EMAIL` → Save.
3. **Deploy → New deployment → Web app** → Execute as **Me**, access **Anyone** → copy `/exec` URL.
4. Paste URL into [`form-config.js`](form-config.js) → commit and push.
5. Submit a test enquiry and confirm the row (and email, if enabled).
