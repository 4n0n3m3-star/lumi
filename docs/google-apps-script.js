// LUMI Atelier — Google Sheets Booking Logger + Reader + Session Tracker
// Paste this into Extensions > Apps Script in your Google Sheet
// Then deploy as Web App (Execute as: Me, Access: Anyone)
//
// Create 2 sheets (tabs) in the spreadsheet:
//   1. "Tatuagem" — with headers: Date | Artist | Name | Email | Phone | City | Idea | Zone | Size | First Tattoo | Schedule | Health | Notes | References | Consent | Marketing | Lang | Session Date | Session Duration | Booking UID | Sessao Sent | Lembrete Sent | Aftercare Sent | Healing Sent
//   2. "Piercing" — with headers: Date | Artist | Name | Email | Phone | City | Type | Location | First Piercing | Jewelry | Schedule | Health | Notes | Consent | Marketing | Lang | Session Date | Session Duration | Booking UID | Sessao Sent | Lembrete Sent | Aftercare Sent | Healing Sent

// ─── READ bookings (GET) ─────────────────────────────
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var limit = parseInt((e && e.parameter && e.parameter.limit) || '50', 10);
    var bookings = [];

    // Read tattoo bookings
    var tattooSheet = ss.getSheetByName('Tatuagem') || ss.getSheetByName('Tattoo');
    if (tattooSheet && tattooSheet.getLastRow() > 1) {
      var tattooHeaders = ['date','artist','name','email','phone','city','idea','zone','size','first_tattoo','schedule','health','notes','references','consent','marketing','lang','session_date','session_duration','booking_uid','sessao_sent','lembrete_sent','aftercare_sent','healing_sent'];
      var lastRow = tattooSheet.getLastRow();
      var startRow = Math.max(2, lastRow - limit + 1);
      var numCols = Math.min(tattooHeaders.length, tattooSheet.getLastColumn());
      var data = tattooSheet.getRange(startRow, 1, lastRow - startRow + 1, numCols).getValues();
      for (var i = data.length - 1; i >= 0; i--) {
        var row = {};
        row['service'] = 'tattoo';
        row['id'] = 'T' + (startRow + i);
        row['row_num'] = startRow + i;
        for (var j = 0; j < numCols && j < tattooHeaders.length; j++) {
          row[tattooHeaders[j]] = data[i][j] !== undefined && data[i][j] !== '' ? String(data[i][j]) : '—';
        }
        bookings.push(row);
      }
    }

    // Read piercing bookings
    var piercingSheet = ss.getSheetByName('Piercing');
    if (piercingSheet && piercingSheet.getLastRow() > 1) {
      var piercingHeaders = ['date','artist','name','email','phone','city','piercing_type','piercing_location','first_piercing','jewelry_material','schedule','health','notes','consent','marketing','lang','session_date','session_duration','booking_uid','sessao_sent','lembrete_sent','aftercare_sent','healing_sent'];
      var lastRowP = piercingSheet.getLastRow();
      var startRowP = Math.max(2, lastRowP - limit + 1);
      var numColsP = Math.min(piercingHeaders.length, piercingSheet.getLastColumn());
      var dataP = piercingSheet.getRange(startRowP, 1, lastRowP - startRowP + 1, numColsP).getValues();
      for (var k = dataP.length - 1; k >= 0; k--) {
        var rowP = {};
        rowP['service'] = 'piercing';
        rowP['id'] = 'P' + (startRowP + k);
        rowP['row_num'] = startRowP + k;
        for (var m = 0; m < numColsP && m < piercingHeaders.length; m++) {
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

// ─── WRITE / UPDATE bookings (POST) ──────────────────
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    // Route to the right action
    if (data.action === 'update_session') {
      return updateSession(ss, data);
    }
    if (data.action === 'get_pending_emails') {
      return getPendingEmails(ss);
    }
    if (data.action === 'mark_email_sent') {
      return markEmailSent(ss, data);
    }

    // Default: append new booking row
    var isTattoo = data.service === 'tattoo';
    var sheet = ss.getSheetByName(isTattoo ? 'Tatuagem' : 'Piercing');
    if (!sheet) sheet = ss.getSheetByName(isTattoo ? 'Tattoo' : 'Piercing');
    if (!sheet) sheet = ss.getActiveSheet();

    var row;
    if (isTattoo) {
      row = [
        new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' }),
        data.artist || '—', data.name || '—', data.email || '—',
        data.phone || '—', data.city || '—', data.idea || '—',
        data.zone || '—', data.size || '—', data.first_tattoo || '—',
        data.schedule || '—', data.health || '—', data.notes || '—',
        data.references || '—', data.consent_tattoo || '—',
        data.consent_marketing || '—', data.lang || 'pt',
      ];
    } else {
      row = [
        new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' }),
        data.artist || '—', data.name || '—', data.email || '—',
        data.phone || '—', data.city || '—', data.piercing_type || '—',
        data.piercing_location || '—', data.first_piercing || '—',
        data.jewelry_material || '—', data.schedule || '—',
        data.health || '—', data.notes || '—',
        data.consent_piercing || '—', data.consent_marketing || '—',
        data.lang || 'pt',
      ];
    }

    sheet.appendRow(row);
    return ok();
  } catch (err) {
    return error(err);
  }
}

// ─── Update session date from Cal.com webhook ────────
function updateSession(ss, data) {
  var email = (data.email || '').toLowerCase().trim();
  if (!email) return error('Missing email');

  var sheets = [
    { sheet: ss.getSheetByName('Tatuagem') || ss.getSheetByName('Tattoo'), emailCol: 4, langCol: 17, artistCol: 2, nameCol: 3, sessionCol: 18, durationCol: 19, uidCol: 20, sessaoCol: 21 },
    { sheet: ss.getSheetByName('Piercing'), emailCol: 4, langCol: 16, artistCol: 2, nameCol: 3, sessionCol: 17, durationCol: 18, uidCol: 19, sessaoCol: 20 },
  ];

  for (var s = 0; s < sheets.length; s++) {
    var cfg = sheets[s];
    if (!cfg.sheet) continue;
    var lastRow = cfg.sheet.getLastRow();
    if (lastRow < 2) continue;

    // Search from bottom (most recent) to top
    var emails = cfg.sheet.getRange(2, cfg.emailCol, lastRow - 1, 1).getValues();
    for (var i = emails.length - 1; i >= 0; i--) {
      if (String(emails[i][0]).toLowerCase().trim() === email) {
        var rowNum = i + 2;
        // Ensure enough columns exist
        var needed = Math.max(cfg.sessaoCol, cfg.uidCol, cfg.durationCol, cfg.sessionCol);
        while (cfg.sheet.getLastColumn() < needed) {
          cfg.sheet.insertColumnAfter(cfg.sheet.getLastColumn());
        }
        // Write session info
        cfg.sheet.getRange(rowNum, cfg.sessionCol).setValue(data.session_date || '');
        cfg.sheet.getRange(rowNum, cfg.durationCol).setValue(data.session_duration || '');
        cfg.sheet.getRange(rowNum, cfg.uidCol).setValue(data.booking_uid || '');

        // Return row data for the webhook handler
        var name = cfg.sheet.getRange(rowNum, cfg.nameCol).getValue();
        var lang = cfg.sheet.getRange(rowNum, cfg.langCol).getValue() || 'pt';
        var artist = cfg.sheet.getRange(rowNum, cfg.artistCol).getValue() || 'stephany-ribeiro';

        return ContentService
          .createTextOutput(JSON.stringify({
            result: 'ok',
            matched: true,
            row_num: rowNum,
            sheet_name: cfg.sheet.getName(),
            name: String(name),
            lang: String(lang),
            artist: String(artist),
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok', matched: false }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── Get pending lembrete/aftercare emails ───────────
function getPendingEmails(ss) {
  var now = new Date();
  var lisbon = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Lisbon' }));
  // Tomorrow
  var tomorrow = new Date(lisbon);
  tomorrow.setDate(tomorrow.getDate() + 1);
  var tomorrowStr = Utilities.formatDate(tomorrow, 'Europe/Lisbon', 'yyyy-MM-dd');

  // Yesterday
  var yesterday = new Date(lisbon);
  yesterday.setDate(yesterday.getDate() - 1);
  var yesterdayStr = Utilities.formatDate(yesterday, 'Europe/Lisbon', 'yyyy-MM-dd');

  var pending = [];

  // 6 days ago
  var sixDaysAgo = new Date(lisbon);
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
  var sixDaysAgoStr = Utilities.formatDate(sixDaysAgo, 'Europe/Lisbon', 'yyyy-MM-dd');

  var sheets = [
    { sheet: ss.getSheetByName('Tatuagem') || ss.getSheetByName('Tattoo'), emailCol: 4, nameCol: 3, langCol: 17, artistCol: 2, sessionCol: 18, durationCol: 19, lembreteCol: 22, aftercareCol: 23, healingCol: 24 },
    { sheet: ss.getSheetByName('Piercing'), emailCol: 4, nameCol: 3, langCol: 16, artistCol: 2, sessionCol: 17, durationCol: 18, lembreteCol: 21, aftercareCol: 22, healingCol: 23 },
  ];

  for (var s = 0; s < sheets.length; s++) {
    var cfg = sheets[s];
    if (!cfg.sheet) continue;
    var lastRow = cfg.sheet.getLastRow();
    if (lastRow < 2) continue;

    // Ensure columns exist
    while (cfg.sheet.getLastColumn() < cfg.healingCol) {
      cfg.sheet.insertColumnAfter(cfg.sheet.getLastColumn());
    }

    var numRows = lastRow - 1;
    var sessionDates = cfg.sheet.getRange(2, cfg.sessionCol, numRows, 1).getValues();
    var durations = cfg.sheet.getRange(2, cfg.durationCol, numRows, 1).getValues();
    var names = cfg.sheet.getRange(2, cfg.nameCol, numRows, 1).getValues();
    var emails = cfg.sheet.getRange(2, cfg.emailCol, numRows, 1).getValues();
    var langs = cfg.sheet.getRange(2, cfg.langCol, numRows, 1).getValues();
    var artists = cfg.sheet.getRange(2, cfg.artistCol, numRows, 1).getValues();
    var lembreteSent = cfg.sheet.getRange(2, cfg.lembreteCol, numRows, 1).getValues();
    var aftercareSent = cfg.sheet.getRange(2, cfg.aftercareCol, numRows, 1).getValues();
    var healingSent = cfg.sheet.getRange(2, cfg.healingCol, numRows, 1).getValues();

    for (var i = 0; i < numRows; i++) {
      var sessionRaw = String(sessionDates[i][0] || '').trim();
      if (!sessionRaw || sessionRaw === '—') continue;

      var sessionDay = sessionRaw.substring(0, 10); // yyyy-MM-dd

      // Lembrete: session is tomorrow, not yet sent
      if (sessionDay === tomorrowStr && !lembreteSent[i][0]) {
        pending.push({
          type: 'lembrete',
          row_num: i + 2,
          sheet_name: cfg.sheet.getName(),
          name: String(names[i][0]),
          email: String(emails[i][0]),
          lang: String(langs[i][0] || 'pt'),
          artist: String(artists[i][0] || 'stephany-ribeiro'),
          session_date: sessionRaw,
          duration: String(durations[i][0] || ''),
          lembrete_col: cfg.lembreteCol,
        });
      }

      // Aftercare: session was yesterday, not yet sent
      if (sessionDay === yesterdayStr && !aftercareSent[i][0]) {
        pending.push({
          type: 'aftercare',
          row_num: i + 2,
          sheet_name: cfg.sheet.getName(),
          name: String(names[i][0]),
          email: String(emails[i][0]),
          lang: String(langs[i][0] || 'pt'),
          artist: String(artists[i][0] || 'stephany-ribeiro'),
          aftercare_col: cfg.aftercareCol,
        });
      }

      // Healing check-in: 6 days after aftercare was sent, not yet sent
      var aftercareTs = String(aftercareSent[i][0] || '').trim();
      if (aftercareTs && !healingSent[i][0]) {
        var aftercareDate = new Date(aftercareTs);
        if (!isNaN(aftercareDate.getTime())) {
          var aftercareDay = Utilities.formatDate(aftercareDate, 'Europe/Lisbon', 'yyyy-MM-dd');
          if (aftercareDay <= sixDaysAgoStr) {
            pending.push({
              type: 'healing',
              row_num: i + 2,
              sheet_name: cfg.sheet.getName(),
              name: String(names[i][0]),
              email: String(emails[i][0]),
              lang: String(langs[i][0] || 'pt'),
              artist: String(artists[i][0] || 'stephany-ribeiro'),
              healing_col: cfg.healingCol,
            });
          }
        }
      }
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok', pending: pending }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── Mark email as sent ──────────────────────────────
function markEmailSent(ss, data) {
  var sheetName = data.sheet_name;
  var rowNum = data.row_num;
  var col = data.col;

  if (!sheetName || !rowNum || !col) return error('Missing sheet_name, row_num, or col');

  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return error('Sheet not found: ' + sheetName);

  sheet.getRange(rowNum, col).setValue(new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' }));

  return ok();
}

// ─── Helpers ─────────────────────────────────────────
function ok() {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function error(err) {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'error', error: err.toString ? err.toString() : String(err) }))
    .setMimeType(ContentService.MimeType.JSON);
}
