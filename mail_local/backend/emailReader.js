import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export async function fetchUnreadEmails() {
  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: `from:${process.env.SENDER_EMAIL} is:unread`
    });

    if (!res.data.messages) return [];

    const emails = [];
    for (const msg of res.data.messages) {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'full'
      });

      const headers = email.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const from = headers.find(h => h.name === 'From')?.value || '';
      
      let body = '';
      if (email.data.payload.body.data) {
        body = Buffer.from(email.data.payload.body.data, 'base64').toString();
      } else if (email.data.payload.parts) {
        const textPart = email.data.payload.parts.find(p => p.mimeType === 'text/plain');
        if (textPart?.body.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString();
        }
      }

      emails.push({ id: msg.id, subject, from, body });
    }

    return emails;
  } catch (error) {
    console.error('Gmail API error:', error.message);
    return [];
  }
}

export async function markAsRead(messageId) {
  await gmail.users.messages.modify({
    userId: 'me',
    id: messageId,
    requestBody: { removeLabelIds: ['UNREAD'] }
  });
}
