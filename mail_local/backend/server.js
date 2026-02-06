import express from 'express';
import cors from 'cors';
import { fetchUnreadEmails, markAsRead } from './emailReader.js';
import { parseEmail } from './parser.js';
import { fillForm } from './automation.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

let pendingEmails = [];

// Poll emails every 2 minutes
setInterval(async () => {
  const emails = await fetchUnreadEmails();
  for (const email of emails) {
    const parsed = parseEmail(email.body);
    pendingEmails.push({
      id: email.id,
      subject: email.subject,
      from: email.from,
      data: parsed,
      processed: false
    });
  }
}, 120000);

// Get pending emails
app.get('/api/emails', (req, res) => {
  res.json(pendingEmails.filter(e => !e.processed));
});

// Process email
app.post('/api/process/:id', async (req, res) => {
  const email = pendingEmails.find(e => e.id === req.params.id);
  if (!email) return res.status(404).json({ error: 'Email not found' });

  const result = await fillForm(email.data);
  
  if (result.success) {
    email.processed = true;
    await markAsRead(email.id);
  }

  res.json(result);
});

// Manual fetch
app.post('/api/fetch', async (req, res) => {
  const emails = await fetchUnreadEmails();
  for (const email of emails) {
    const parsed = parseEmail(email.body);
    pendingEmails.push({
      id: email.id,
      subject: email.subject,
      from: email.from,
      data: parsed,
      processed: false
    });
  }
  res.json({ count: emails.length });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
