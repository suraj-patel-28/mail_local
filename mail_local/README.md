# 🚀 Mail Automation Setup Guide

## 📋 Prerequisites
- Node.js installed
- Gmail account
- Access to https://apps.vsnapu.com

---

## ⚙️ Setup Steps

### 1️⃣ Install Dependencies
```bash
cd /Users/surajkpl/Documents/mail_local
npm install
```

### 2️⃣ Setup Gmail API

**A. Create Google Cloud Project**
1. Go to https://console.cloud.google.com
2. Create new project: "Mail Automation"
3. Enable Gmail API:
   - APIs & Services → Library → Search "Gmail API" → Enable

**B. Create OAuth Credentials**
1. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
2. Application type: Web application
3. Authorized redirect URIs: `http://localhost:3000/oauth2callback`
4. Copy Client ID and Client Secret

**C. Get Refresh Token**
1. Install helper tool:
   ```bash
   npm install -g gmail-oauth-token-generator
   ```
2. Run:
   ```bash
   gmail-oauth-token-generator --client-id YOUR_CLIENT_ID --client-secret YOUR_CLIENT_SECRET
   ```
3. Follow browser prompt, copy refresh token

### 3️⃣ Configure .env File

Edit `/Users/surajkpl/Documents/mail_local/.env`:

```env
GMAIL_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-actual-client-secret
GMAIL_REDIRECT_URI=http://localhost:3000/oauth2callback
GMAIL_REFRESH_TOKEN=your-actual-refresh-token

SENDER_EMAIL=holidays-partner@makemytrip.com

WEBSITE_URL=https://apps.vsnapu.com/panel/jobs/new
WEBSITE_USERNAME=your-vsnapu-username
WEBSITE_PASSWORD=your-vsnapu-password

PORT=3000
```

### 4️⃣ Install Playwright Browsers
```bash
npx playwright install chromium
```

---

## ▶️ Run the System

```bash
npm start
```

Open browser: **http://localhost:3000**

---

## 🎯 How It Works

1. **Auto-polling**: Checks Gmail every 2 minutes
2. **Manual fetch**: Click "🔄 Fetch Emails Now" button
3. **View emails**: See parsed data in cards
4. **Process**: Click "▶ Process" → browser opens → form fills → submits
5. **Status**: See success/error message

---

## 🔧 Troubleshooting

**No emails showing?**
- Check `.env` has correct Gmail credentials
- Verify sender email matches
- Click "Fetch Emails Now" manually

**Form not filling correctly?**
- Check website login credentials
- Inspect form field selectors in `backend/automation.js`
- Run with `headless: false` to watch browser

**Parser not extracting data?**
- Check email format matches expected structure
- Adjust regex in `backend/parser.js`

---

## 📝 Customization

**Change form fields**: Edit `backend/automation.js`
**Change parsing logic**: Edit `backend/parser.js`
**Change polling interval**: Edit `backend/server.js` (line 14)

---

## 🛡️ Security Notes

- `.env` contains sensitive data — never commit to git
- Credentials stored locally only
- Browser runs on your machine
- No cloud services involved
