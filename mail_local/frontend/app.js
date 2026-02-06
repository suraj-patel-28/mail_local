const API = 'http://localhost:3000/api';

async function loadEmails() {
  const res = await fetch(`${API}/emails`);
  const emails = await res.json();
  
  const container = document.getElementById('emails');
  
  if (emails.length === 0) {
    container.innerHTML = '<div class="empty">No pending emails</div>';
    return;
  }
  
  container.innerHTML = emails.map(email => `
    <div class="email-card" id="email-${email.id}">
      <div class="email-header">
        <div>
          <div class="email-subject">${email.subject}</div>
          <div class="email-from">${email.from}</div>
        </div>
        <button class="process-btn" onclick="processEmail('${email.id}')">▶ Process</button>
      </div>
      <div class="data-grid">
        <div class="data-item">
          <div class="data-label">Booking ID</div>
          <div class="data-value">${email.data.bookingId}</div>
        </div>
        <div class="data-item">
          <div class="data-label">Guest Name</div>
          <div class="data-value">${email.data.guestName}</div>
        </div>
        <div class="data-item">
          <div class="data-label">Contact</div>
          <div class="data-value">${email.data.contact}</div>
        </div>
        <div class="data-item">
          <div class="data-label">City</div>
          <div class="data-value">${email.data.city}</div>
        </div>
      </div>
      <div id="status-${email.id}"></div>
    </div>
  `).join('');
}

async function processEmail(id) {
  const statusDiv = document.getElementById(`status-${id}`);
  statusDiv.innerHTML = '<div class="status">Processing...</div>';
  
  const res = await fetch(`${API}/process/${id}`, { method: 'POST' });
  const result = await res.json();
  
  if (result.success) {
    statusDiv.innerHTML = '<div class="status status-success">✓ Form submitted successfully</div>';
    setTimeout(loadEmails, 2000);
  } else {
    statusDiv.innerHTML = `<div class="status status-error">✗ Error: ${result.error}</div>`;
  }
}

async function fetchEmails() {
  await fetch(`${API}/fetch`, { method: 'POST' });
  loadEmails();
}

loadEmails();
setInterval(loadEmails, 30000);
