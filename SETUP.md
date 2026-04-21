# Xpress Lube & Tires — Email Backend Setup Guide

Quotes submitted on your website will be emailed to xpresslubeyyz@gmail.com.

---

## STEP 1 — Get a Gmail App Password

> You CANNOT use your regular Gmail password. Google requires an App Password.

1. Go to: https://myaccount.google.com
2. Click **Security** in the left sidebar
3. Under "How you sign in to Google", make sure **2-Step Verification is ON**
   - If not, turn it on first (takes 2 minutes)
4. Go back to Security → scroll down → click **App Passwords**
5. Under "App name", type: `Xpress Lube Website`
6. Click **Create**
7. Google gives you a **16-character password** (like: `abcd efgh ijkl mnop`)
8. Copy it — you'll need it in the next step

---

## STEP 2 — Configure Your .env File

1. Find the file called `.env.template` in the `backend/` folder
2. **Rename it** to `.env` (remove the word "template")
3. Open it and fill in:

```
GMAIL_USER=xpresslubeyyz@gmail.com
GMAIL_PASS=abcdefghijklmnop   ← paste your 16-char app password here (no spaces)
PORT=3000
```

Save the file.

---

## STEP 3 — Install Node.js (if you don't have it)

Download from: https://nodejs.org  
Choose the **LTS** version. Install it like any normal program.

To verify it installed, open a terminal and type:
```
node --version
```
You should see something like `v20.x.x`

---

## STEP 4 — Install Dependencies

Open a terminal/command prompt in the `backend/` folder and run:

```bash
npm install
```

This installs Express, Nodemailer, and other packages (takes ~30 seconds).

---

## STEP 5 — Start the Server

In the same terminal, run:

```bash
npm start
```

You should see:
```
🚗 Xpress Lube & Tires backend running on http://localhost:3000
✅ Email transporter ready — connected to Gmail
📧 Sending emails to: xpresslubeyyz@gmail.com
```

**Leave this terminal window open** — the server must be running for forms to work.

---

## STEP 6 — Test It

1. Open `xpress-lube-tires.html` in your browser (double-click the file)
2. Fill out the "Get a Quote" form
3. Click Submit
4. Check xpresslubeyyz@gmail.com — the email should arrive within seconds

---

## FILE STRUCTURE

```
backend/
  server.js          ← the main server file
  package.json       ← dependencies list
  .env               ← your secret credentials (KEEP THIS PRIVATE)
  .env.template      ← example template

xpress-lube-tires.html  ← your website
```

---

## WHAT EMAILS LOOK LIKE

**When a quote is submitted, you get:**
- A nicely formatted email with all customer details (name, phone, vehicle, service)
- The customer's email set as Reply-To, so you can reply directly
- If the customer entered their email, they also get an auto-reply confirmation

**Subject line looks like:**
```
🚗 New Quote Request — John Smith
```

---

## RUNNING 24/7 (Optional — for when you have a hosting server)

If you want the backend always running on a server (not just your laptop), use **PM2**:

```bash
npm install -g pm2
pm2 start server.js --name xpress-lube
pm2 save
pm2 startup
```

Or deploy free to **Railway** or **Render**:
- https://railway.app
- https://render.com

Then change the `BACKEND_URL` in `xpress-lube-tires.html` from:
```javascript
const BACKEND_URL = 'http://localhost:3000';
```
to your live server URL, e.g.:
```javascript
const BACKEND_URL = 'https://xpress-lube-backend.railway.app';
```

---

## TROUBLESHOOTING

| Problem | Fix |
|---|---|
| "Invalid login" error | Make sure you used an App Password, not your regular Gmail password |
| "Less secure app" error | App Passwords bypass this — make sure 2-Step Verification is ON |
| Form says "Network error" | Make sure `npm start` is running in your terminal |
| No email received | Check your spam folder; also check the terminal for error messages |
