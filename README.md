# Gold Standard Dog Training

**Gold Standard Dog Training** offers structured dog training and rehabilitation in **Golden Bay, New Zealand** (Takaka and surrounds). Run by Warwick Marshall, the service uses methods aligned with Beckman's dog training philosophy: clear structure, consistent correction, and owner coaching so results last at home.

## What we do

- **General obedience & shaping** — sit, lie, fetch, wait, heel; sessions tailored to your goals with hands-on owner coaching.
- **Safety & control** — lunge control, fixation interruption, safe walking, road awareness.
- **Facilitated socialisation** — structured sessions with suitable dogs for calm, regulated behaviour.
- **Rehabilitation** — for dogs with difficult histories or high anxiety; building trust before formal training.
- **Owner coaching** — your energy, attention, and consistency as the main training tools.
- **In-environment training** — markets, beaches, roads, and real-world triggers so behaviour holds where it matters.

## Location & contact

- **Area:** Golden Bay, Takaka, New Zealand  
- **Phone:** [027 814 2222](tel:+64278142222)  
- **Email:** goldstandardtakaka@gmail.com  
- **Address:** Rangihaeata, Takaka, Golden Bay  
- **Facebook:** [Gold Standard Dog Training](https://www.facebook.com/profile.php?id=61580061262910)

## Site

- **Live site:** [agent5479.github.io/goldstandard](https://agent5479.github.io/goldstandard/)  
- **Client guide:** [guide.html](https://agent5479.github.io/goldstandard/guide.html) — reference for clients (principles, corrections, leash work, access training, timing, rewards, daily practice).
- **About page:** [about.html](https://agent5479.github.io/goldstandard/about.html)  
- **Contact page:** [contact.html](https://agent5479.github.io/goldstandard/contact.html)

Open Graph / social previews use `images/dog1024.jpg`. Favicons and install icons use `images/dog16.jpg` through `dog512.jpg` plus `site.webmanifest`. For best LinkedIn and Facebook large previews, a dedicated **1200×627 px** image is still ideal; `1024×1024` works but may be cropped by some platforms.

## Contact form setup (Google Sheets + Apps Script)

Full requirements and step-by-step walkthrough: **[GOOGLE-SHEETS-SETUP.md](GOOGLE-SHEETS-SETUP.md)**

The contact page posts to a Google Apps Script web app so the site stays fully static on GitHub Pages. Enquiries are saved to a Google Sheet and optionally emailed to you.

### Step 1 — Create the Sheet

1. In Google Drive, create a spreadsheet named **Gold Standard Enquiries**.
2. In row 1, add these headers:

   `Timestamp` | `Name` | `Phone` | `Email` | `Dog Name` | `Service` | `Message`

3. Optional: freeze row 1, widen columns, and turn on filters.

### Step 2 — Add the script

1. In the sheet, open **Extensions → Apps Script**.
2. Delete any default code and paste the contents of [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
3. Set `NOTIFY_EMAIL` at the top of the script to your inbox (or leave it blank to skip email notifications).
4. Click **Save**.

### Step 3 — Deploy as a web app

1. Click **Deploy → New deployment**.
2. Type: **Web app**.
3. Settings:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy** and **Authorize** when prompted (Google Sheets + Gmail if using email notify).
5. Copy the **Web app URL** (ends in `/exec`).

Each time you change the script, use **Deploy → Manage deployments → Edit → New version → Deploy** so the live URL picks up changes.

### Step 4 — Connect the site

1. Open [`form-config.js`](form-config.js).
2. Set `window.GSDT_FORM_ENDPOINT` to your Web app URL:

   ```javascript
   window.GSDT_FORM_ENDPOINT = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
   ```

3. Commit and push. GitHub Pages will serve the updated config.

If the URL is blank, the form still works for direct phone/email contact; the submit button shows an error only when someone tries to send.

### Step 5 — Test

1. Open [contact.html](contact.html) on the live site (or locally).
2. Submit a test enquiry with all required fields filled in.
3. Confirm a new row appears in the Sheet with the correct timestamp.
4. Confirm the success message appears in the browser.
5. Optional: confirm the notification email arrives.
6. Honeypot check: if the hidden `website` field is filled, no row should be added.

### Troubleshooting

- **Form submits but no success message:** The site uses `Content-Type: text/plain` to avoid CORS preflight issues with Google Apps Script. Redeploy the script after changes and hard-refresh the contact page.
- **Authorization errors:** Re-run deployment and accept all requested permissions.
- **No email notification:** Check spam, confirm `NOTIFY_EMAIL` is set, and that Gmail permission was granted during authorization.
- **Script URL is public:** This is normal for static sites. The honeypot field and server-side validation reduce spam; do not store secrets in the repo.

## Keywords (for search and discovery)

Dog training Golden Bay, dog training Takaka, dog trainer Nelson, dog rehabilitation NZ, Beckman dog training NZ, Warwick Marshall dog training, obedience training, recall, slack-leash walking, impulse control, puppy training, behavioural rehabilitation.
