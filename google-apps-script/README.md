# Google Sheets Contact Setup

## 1. Create the sheet
- Create a new Google Sheet for portfolio messages.
- Open `Extensions > Apps Script`.

## 2. Add the script
- Replace the default script with the contents of `Code.gs`.
- Make sure the Apps Script project is bound to the sheet you want to use.

## 3. Deploy it
- Click `Deploy > New deployment`.
- Choose `Web app`.
- Execute as: `Me`.
- Who has access: `Anyone`.
- Deploy and copy the web app URL.

## 4. Connect the portfolio
- Open `index.html`.
- Find the form `data-endpoint` value.
- Replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with your deployed web app URL.

## 5. Expected sheet columns
- `Submitted At`
- `Name`
- `Email`
- `Message`
- `Source`

## Important note for static sites
- The portfolio uses a simple `no-cors` form-style `POST` because Google Apps Script web apps often block browser CORS preflight requests from local/static sites.
- After updating `Code.gs`, redeploy the Apps Script web app so the new server code is live.
