const { google } = require("googleapis");

const SPREADSHEET_ID = "1SUFysxSZYXKNcLAUg6pZC4rhucQL0ghu1CECYo7Q8w4";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: "bti-voting@bti-voting.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDX5S5gOeMLvlsh\nqPCzr7q1WxUXGVY7XVsQRrBK2IZNif1GPRr8tKWwEckhrg0zH3FJ6i4fKcW3Gs3X\n8dlcwEsK2FIYmuHheMSUqiglCPVp0fNHztOWq3IqpkoR397edFbiaUhBWVA+cBVE\ndty3+stfEy3lLryI004ZAGI0A9uX7Pc0gnx7pr7XDXk3HVFVuLOkQja6wlBg/Ab8\ncyR9vQzpUxlYCpyJJL64gCAQ0r8UEG3+9dUVUbNxgdiXPX4HfERSmS2KdRisOo+N\nuLo4dVX8ma47FW31j+vonVMvbw2XM5SUOsoGVkFL8hUfVhuLxYXGL2VOpN1JJCyk\nEjsKQUwrAgMBAAECggEADqZHelITPPXCu0r6Ykb3VV0D1lhqyIZyKm2RgtKkclh9\nrilxTlp3r7XVPwrPbHuitVBFpumvt9gCxbdsd2W48dhx4aeI0kLem/Pb2397H54W\ncvXu15d0nL5B4mqdddzRFHXuaDjGQCZc2xNxsK485IupnpaIRoSIFRw4ja0BVpKm\nyn1U2h8eaJ/p6Ns+Brs50e2x3vy3V26smFhjtimHMZEOosSvz8VpVwRHowuHO3As\n/1Aq3EMf2QuIl28+RiFJWDcmkSqKUgdevLCIpihEwqfUYhfW8LvSX+kCSvQCVucx\nWqTJzt0/efMdDlTE43+003OEhYI+fyJPH/o1FxKAuQKBgQD8vZQk3GRcDHF5/9T/\nxZz5rT/Wz3LFT9X1PPR7L8O8wuYRudxktl+B/kCOHyXvktnpkBOYR+++VuMNvd74\nTw7yoE8MYtmyu30cfWjNOJLEiWuOnDhcmCGAWybouDzJRUH08nlSd9MdGYycKqyi\nL5mWz/hWxCP2dq766AjzD5lENwKBgQDarfU7Cvf6nDEfPIMoomZqoPmFWyEgGWE/\nHBAv6/sxOzFvtXoAEnvyursSLzRdWfyFuqHeIzc8iOWBZUQsaaSr0Ttnp+revZS0\noQURvrla4YB/4HobwGcLmp+QhP66R5vVhh2MTP93XqGhK1xSXzA7dYiD+dn1E7E4\nvb5/dR/lrQKBgQDwwyv/3U9hfJ0RCgv/R2HdWxQobuA3ZHE+uD1xqDO/eq6uji6M\nZksfS3R1ruh1i6A45f40n7qbyKttKMXiJ3Xm3Z3P/87Ae+iYHkOa09zEiuBCL0Fl\nu6qWWr77DJ8jYO2PCPlX/TvISdFv5xsjOVMHnsBE734OyEqyTB5SZTatCwKBgQCS\nqNJsK7oOIIytR1crfGc1ogpWjryTm5Hl0ntkuF46MVnBcrOEsuDf9K4bzv7OkNhU\nE8wVgAa+mY1aj8D+DEf9V5EAvtQ9WGYQEmGk+gWz1sLogHNEg3BYjvXu5dM0uWvg\n81aDzuwScavyvHLpZ5+gcP4CjSHJRNC5nj/RmYqv7QKBgBQpqAwkjHbBfTGiIPq7\nEFIEHFIemFAoSKXyIfaqY7N0bmHR2GpFoXpjSL3tDD7AXj1t0saMEQV2HeOGgzcs\nRj+i07gatI9iRUktfEcUUE5/wpdpbqohnOTMA2GODKp61DucuBvP3OSjYpPN4LH9\nwvVkP7tSrvQ+LnwUxcUQN1ym\n-----END PRIVATE KEY-----\n",
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

async function getSheets() {
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
}

async function getRows(sheet) {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheet}!A:Z`,
  });
  return res.data.values || [];
}

async function appendRow(sheet, values) {
  const sheets = await getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheet}!A:Z`,
    valueInputOption: "RAW",
    resource: { values: [values] },
  });
}

async function updateRow(sheet, rowIndex, values) {
  const sheets = await getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheet}!A${rowIndex}:Z${rowIndex}`,
    valueInputOption: "RAW",
    resource: { values: [values] },
  });
}

async function deleteRow(sheet, rowIndex) {
  const sheets = await getSheets();
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheetObj = meta.data.sheets.find(s => s.properties.title === sheet);
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    resource: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: sheetObj.properties.sheetId,
            dimension: "ROWS",
            startIndex: rowIndex - 1,
            endIndex: rowIndex,
          },
        },
      }],
    },
  });
}

function rowsToObjects(rows) {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map((row, i) => {
    const obj = { _rowIndex: i + 2 };
    headers.forEach((h, j) => { obj[h] = row[j] || ""; });
    return obj;
  });
}

module.exports = { getRows, appendRow, updateRow, deleteRow, rowsToObjects, SPREADSHEET_ID };
