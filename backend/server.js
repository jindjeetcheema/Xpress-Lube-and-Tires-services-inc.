/**
 * Xpress Lube and Tires Services Inc
 * Quote Request Email Backend
 * Stack: Node.js + Express + Nodemailer
 * 
 * Setup instructions at bottom of this file.
 */

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow requests from your HTML file (file:// and any domain)
app.use(cors({
  origin: '*',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// ─── Nodemailer Transporter ───────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,   // your Gmail address (sender)
    pass: process.env.GMAIL_PASS    // Gmail App Password (NOT your regular password)
  }
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email transporter error:', error.message);
  } else {
    console.log('✅ Email transporter ready — connected to Gmail');
  }
});

// ─── Quote Request Endpoint ───────────────────────────────────
app.post('/send-quote', async (req, res) => {
  const {
    name,
    phone,
    email,
    service,
    vehicle,
    notes
  } = req.body;

  // Basic validation
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and phone are required.' });
  }

  // ── Email to business (notification) ──
  const businessMailOptions = {
    from: `"Xpress Lube Website" <${process.env.GMAIL_USER}>`,
    to: 'xpresslubeyyz@gmail.com',
    replyTo: email || process.env.GMAIL_USER,
    subject: `🚗 New Quote Request — ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <style>
          body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
          .card { background: #ffffff; border-radius: 8px; max-width: 560px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: #0A1628; padding: 28px 32px; }
          .header h1 { color: #ffffff; font-size: 22px; margin: 0; }
          .header h1 span { color: #D4192A; }
          .badge { display: inline-block; background: #D4192A; color: white; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 3px; letter-spacing: 0.08em; margin-top: 8px; text-transform: uppercase; }
          .body { padding: 28px 32px; }
          .field { margin-bottom: 18px; border-bottom: 1px solid #f0f0f0; padding-bottom: 14px; }
          .field:last-child { border-bottom: none; margin-bottom: 0; }
          .label { font-size: 11px; font-weight: bold; color: #888; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
          .value { font-size: 15px; color: #1a1a1a; font-weight: 500; }
          .value.highlight { color: #D4192A; }
          .footer { background: #f9f9f9; padding: 16px 32px; font-size: 12px; color: #aaa; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1><span>X</span>press Lube &amp; Tires</h1>
            <div class="badge">New Quote Request</div>
          </div>
          <div class="body">
            <div class="field">
              <div class="label">Customer Name</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">Phone Number</div>
              <div class="value highlight">${phone}</div>
            </div>
            <div class="field">
              <div class="label">Email Address</div>
              <div class="value">${email || 'Not provided'}</div>
            </div>
            <div class="field">
              <div class="label">Service Requested</div>
              <div class="value">${service || 'Not specified'}</div>
            </div>
            <div class="field">
              <div class="label">Vehicle</div>
              <div class="value">${vehicle || 'Not specified'}</div>
            </div>
            <div class="field">
              <div class="label">Additional Notes</div>
              <div class="value">${notes || 'None'}</div>
            </div>
          </div>
          <div class="footer">
            Submitted via xpresslubeandtires.com &bull; ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })} EST
          </div>
        </div>
      </body>
      </html>
    `
  };

  // ── Auto-reply to customer (if they provided email) ──
  const customerMailOptions = email ? {
    from: `"Xpress Lube and Tires Services Inc" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `We received your quote request — Xpress Lube & Tires`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <style>
          body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
          .card { background: #ffffff; border-radius: 8px; max-width: 560px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: #0A1628; padding: 28px 32px; }
          .header h1 { color: #ffffff; font-size: 20px; margin: 0; }
          .header h1 span { color: #D4192A; }
          .header p { color: rgba(255,255,255,0.6); font-size: 13px; margin: 8px 0 0; }
          .body { padding: 28px 32px; color: #333; font-size: 15px; line-height: 1.7; }
          .summary { background: #f8f8f8; border-left: 3px solid #D4192A; border-radius: 4px; padding: 16px 20px; margin: 20px 0; }
          .summary-row { display: flex; gap: 12px; margin-bottom: 6px; font-size: 14px; }
          .summary-label { color: #888; min-width: 80px; }
          .summary-value { color: #1a1a1a; font-weight: 500; }
          .badge { display: inline-block; background: #D4192A; color: white; font-size: 11px; font-weight: bold; padding: 5px 12px; border-radius: 3px; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 4px; }
          .footer { background: #f9f9f9; padding: 16px 32px; font-size: 12px; color: #aaa; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1><span>X</span>press Lube &amp; Tires Services Inc</h1>
            <p>24/7 Mobile Auto Services — Brampton &amp; Surrounding Areas</p>
          </div>
          <div class="body">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thanks for reaching out! We've received your quote request and will be in touch shortly — usually within the hour.</p>
            <div class="summary">
              <div class="summary-row"><span class="summary-label">Service:</span><span class="summary-value">${service || 'Not specified'}</span></div>
              <div class="summary-row"><span class="summary-label">Vehicle:</span><span class="summary-value">${vehicle || 'Not specified'}</span></div>
              <div class="summary-row"><span class="summary-label">Phone:</span><span class="summary-value">${phone}</span></div>
            </div>
            <p>For <strong>emergency tire service</strong>, don't wait — reply to this email or contact us directly and we'll dispatch immediately.</p>
            <p style="margin-top:20px;">— The Xpress Lube &amp; Tires Team<br/>
            <span style="color:#888;font-size:13px;">info@xpresslubeandtires.com</span></p>
          </div>
          <div class="footer">
            Xpress Lube and Tires Services Inc &bull; Brampton, ON &bull; Open 24/7
          </div>
        </div>
      </body>
      </html>
    `
  } : null;

  // ── Send emails ──
  try {
    await transporter.sendMail(businessMailOptions);
    if (customerMailOptions) {
      await transporter.sendMail(customerMailOptions);
    }
    console.log(`📧 Quote request from ${name} (${phone}) sent successfully`);
    res.json({ success: true, message: 'Quote request sent successfully!' });
  } catch (err) {
    console.error('❌ Failed to send email:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
  }
});

// ─── Contact Form Endpoint ────────────────────────────────────
app.post('/send-contact', async (req, res) => {
  const { name, phone, email, service, vehicle, location, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and phone are required.' });
  }

  const mailOptions = {
    from: `"Xpress Lube Website" <${process.env.GMAIL_USER}>`,
    to: 'xpresslubeyyz@gmail.com',
    replyTo: email || process.env.GMAIL_USER,
    subject: `📩 Contact Form — ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"/>
        <style>
          body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px;}
          .card{background:#fff;border-radius:8px;max-width:560px;margin:0 auto;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.1);}
          .header{background:#0A1628;padding:28px 32px;}
          .header h1{color:#fff;font-size:20px;margin:0;} .header h1 span{color:#D4192A;}
          .badge{display:inline-block;background:#142240;color:#D4192A;font-size:11px;font-weight:bold;padding:4px 10px;border-radius:3px;letter-spacing:.08em;margin-top:8px;text-transform:uppercase;border:1px solid rgba(212,25,42,.3);}
          .body{padding:28px 32px;}
          .field{margin-bottom:16px;border-bottom:1px solid #f0f0f0;padding-bottom:12px;}
          .field:last-child{border-bottom:none;margin-bottom:0;}
          .label{font-size:11px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;}
          .value{font-size:15px;color:#1a1a1a;font-weight:500;}
          .footer{background:#f9f9f9;padding:16px 32px;font-size:12px;color:#aaa;border-top:1px solid #eee;}
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1><span>X</span>press Lube &amp; Tires</h1>
            <div class="badge">Contact Form Submission</div>
          </div>
          <div class="body">
            <div class="field"><div class="label">Name</div><div class="value">${name}</div></div>
            <div class="field"><div class="label">Phone</div><div class="value">${phone}</div></div>
            <div class="field"><div class="label">Email</div><div class="value">${email || 'Not provided'}</div></div>
            <div class="field"><div class="label">Service</div><div class="value">${service || 'Not specified'}</div></div>
            <div class="field"><div class="label">Vehicle</div><div class="value">${vehicle || 'Not specified'}</div></div>
            <div class="field"><div class="label">Location</div><div class="value">${location || 'Not provided'}</div></div>
            <div class="field"><div class="label">Message</div><div class="value">${message || 'None'}</div></div>
          </div>
          <div class="footer">Submitted via xpresslubeandtires.com &bull; ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })} EST</div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('❌ Contact form email error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
});

// ─── Health check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Xpress Lube & Tires Email Backend', uptime: process.uptime() });
});

// ─── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚗 Xpress Lube & Tires backend running on http://localhost:${PORT}`);
  console.log(`📧 Sending emails to: xpresslubeyyz@gmail.com\n`);
});
