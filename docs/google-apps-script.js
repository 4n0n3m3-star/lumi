// LUMI Atelier — Google Sheets Booking Logger
// Paste this into Extensions > Apps Script in your Google Sheet
// Then deploy as Web App (Execute as: Me, Access: Anyone)
//
// Create 2 sheets (tabs) in the spreadsheet:
//   1. "Tatuagem" — with headers: Date | Artist | Name | Email | Phone | City | Idea | Zone | Size | First Tattoo | Schedule | Health | Notes | References | Consent | Marketing | Lang
//   2. "Piercing" — with headers: Date | Artist | Name | Email | Phone | City | Type | Location | First Piercing | Jewelry | Schedule | Health | Notes | Consent | Marketing | Lang

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var isTattoo = data.service === 'tattoo';

    var sheet = ss.getSheetByName(isTattoo ? 'Tatuagem' : 'Piercing');
    if (!sheet) {
      sheet = ss.getSheetByName(isTattoo ? 'Tattoo' : 'Piercing');
    }
    if (!sheet) {
      sheet = ss.getActiveSheet();
    }

    var row;

    if (isTattoo) {
      row = [
        new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' }),
        data.artist || '—',
        data.name || '—',
        data.email || '—',
        data.phone || '—',
        data.city || '—',
        data.idea || '—',
        data.zone || '—',
        data.size || '—',
        data.first_tattoo || '—',
        data.schedule || '—',
        data.health || '—',
        data.notes || '—',
        data.references || '—',
        data.consent_tattoo || '—',
        data.consent_marketing || '—',
        data.lang || 'pt',
      ];
    } else {
      row = [
        new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' }),
        data.artist || '—',
        data.name || '—',
        data.email || '—',
        data.phone || '—',
        data.city || '—',
        data.piercing_type || '—',
        data.piercing_location || '—',
        data.first_piercing || '—',
        data.jewelry_material || '—',
        data.schedule || '—',
        data.health || '—',
        data.notes || '—',
        data.consent_piercing || '—',
        data.consent_marketing || '—',
        data.lang || 'pt',
      ];
    }

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
