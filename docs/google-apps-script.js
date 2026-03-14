// LUMI Atelier — Google Sheets Booking Logger + Reader
// Paste this into Extensions > Apps Script in your Google Sheet
// Then deploy as Web App (Execute as: Me, Access: Anyone)
//
// Create 2 sheets (tabs) in the spreadsheet:
//   1. "Tatuagem" — with headers: Date | Artist | Name | Email | Phone | City | Idea | Zone | Size | First Tattoo | Schedule | Health | Notes | References | Consent | Marketing | Lang
//   2. "Piercing" — with headers: Date | Artist | Name | Email | Phone | City | Type | Location | First Piercing | Jewelry | Schedule | Health | Notes | Consent | Marketing | Lang

// ─── READ bookings (GET) ─────────────────────────────
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var limit = parseInt((e && e.parameter && e.parameter.limit) || '50', 10);
    var bookings = [];

    // Read tattoo bookings
    var tattooSheet = ss.getSheetByName('Tatuagem') || ss.getSheetByName('Tattoo');
    if (tattooSheet && tattooSheet.getLastRow() > 1) {
      var tattooHeaders = ['date','artist','name','email','phone','city','idea','zone','size','first_tattoo','schedule','health','notes','references','consent','marketing','lang'];
      var lastRow = tattooSheet.getLastRow();
      var startRow = Math.max(2, lastRow - limit + 1);
      var data = tattooSheet.getRange(startRow, 1, lastRow - startRow + 1, tattooHeaders.length).getValues();
      for (var i = data.length - 1; i >= 0; i--) {
        var row = {};
        row['service'] = 'tattoo';
        row['id'] = 'T' + (startRow + i);
        for (var j = 0; j < tattooHeaders.length; j++) {
          row[tattooHeaders[j]] = data[i][j] !== undefined && data[i][j] !== '' ? String(data[i][j]) : '—';
        }
        bookings.push(row);
      }
    }

    // Read piercing bookings
    var piercingSheet = ss.getSheetByName('Piercing');
    if (piercingSheet && piercingSheet.getLastRow() > 1) {
      var piercingHeaders = ['date','artist','name','email','phone','city','piercing_type','piercing_location','first_piercing','jewelry_material','schedule','health','notes','consent','marketing','lang'];
      var lastRowP = piercingSheet.getLastRow();
      var startRowP = Math.max(2, lastRowP - limit + 1);
      var dataP = piercingSheet.getRange(startRowP, 1, lastRowP - startRowP + 1, piercingHeaders.length).getValues();
      for (var k = dataP.length - 1; k >= 0; k--) {
        var rowP = {};
        rowP['service'] = 'piercing';
        rowP['id'] = 'P' + (startRowP + k);
        for (var m = 0; m < piercingHeaders.length; m++) {
          rowP[piercingHeaders[m]] = dataP[k][m] !== undefined && dataP[k][m] !== '' ? String(dataP[k][m]) : '—';
        }
        bookings.push(rowP);
      }
    }

    // Sort all bookings by date (newest first)
    bookings.sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok', bookings: bookings.slice(0, limit) }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── WRITE bookings (POST) ────────────────────────────
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
