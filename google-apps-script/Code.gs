/**
 * Gold Standard Dog Training — enquiry form handler
 *
 * Setup:
 * 1. Create a Google Sheet named "Gold Standard Enquiries".
 * 2. Row 1 headers: Timestamp | Name | Phone | Email | Dog Name | Service | Message
 * 3. Extensions → Apps Script → paste this file → Save.
 * 4. Set NOTIFY_EMAIL below to your inbox (or leave blank to skip email).
 * 5. Deploy → New deployment → Web app:
 *      Execute as: Me
 *      Who has access: Anyone
 * 6. Copy the Web app URL into form-config.js on the site.
 */

const NOTIFY_EMAIL = "goldstandardtakaka@gmail.com";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const honeypot = String(data.website || "").trim();

    if (honeypot) {
      return jsonResponse({ success: true });
    }

    const name = String(data.name || "").trim();
    const phone = String(data.phone || "").trim();
    const email = String(data.email || "").trim();
    const dogName = String(data.dog_name || "").trim();
    const service = String(data.service_interest || "").trim();
    const message = String(data.message || "").trim();

    if (!name || !phone || !email || !service || !message) {
      return jsonResponse({ success: false, message: "Missing required fields." });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      new Date(),
      name,
      phone,
      email,
      dogName,
      service,
      message
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "New Gold Standard enquiry (" + service + ")",
        replyTo: email,
        body:
          "Name: " + name + "\n" +
          "Phone: " + phone + "\n" +
          "Email: " + email + "\n" +
          "Dog: " + (dogName || "(not provided)") + "\n" +
          "Service: " + service + "\n\n" +
          message
      });
    }

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ success: false, message: error.message || "Server error." });
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
