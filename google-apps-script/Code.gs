const SHEET_NAME = 'Messages';

function doPost(e) {
  try {
    const name = String(e.parameter.name || '').trim();
    const email = String(e.parameter.email || '').trim();
    const message = String(e.parameter.message || '').trim();
    const website = String(e.parameter.website || '').trim();
    const source = String(e.parameter.source || '').trim();

    if (website) {
      return jsonResponse({ ok: false, message: 'Spam blocked.' });
    }

    if (!name || !email || !message) {
      return jsonResponse({ ok: false, message: 'Missing required fields.' });
    }

    const sheet = getOrCreateSheet_();
    sheet.appendRow([
      new Date(),
      name,
      email,
      message,
      source
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({
      ok: false,
      message: error.message || 'Unexpected server error.'
    });
  }
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['Submitted At', 'Name', 'Email', 'Message', 'Source']);
  }

  return sheet;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
