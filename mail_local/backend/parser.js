export function parseEmail(body) {
  const data = {};

  // Booking ID
  const bookingMatch = body.match(/MakeMyTrip Booking ID:\s*([A-Z0-9]+)/);
  data.bookingId = bookingMatch?.[1] || '';

  // Guest Name
  const guestMatch = body.match(/Name of Primary Guest:\s*([^\n]+)/);
  data.guestName = guestMatch?.[1]?.trim() || '';

  // Contact
  const contactMatch = body.match(/Lead Pax Contact Number\s+Total Passenger\s+([^\s]+)\s+(\d+)/);
  data.contact = contactMatch?.[2] || '';

  // Email (try to extract from text)
  const emailMatch = body.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  data.email = emailMatch?.[1] || '';

  // Check-in Date (first hotel check-in)
  const dateMatch = body.match(/Check-\s*In Date\s+Check-\s*Out\s+Date[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*([A-Za-z]+,\s*\d+\s+[A-Za-z]+\s+\d{4})/);
  data.jobDate = dateMatch?.[1] || '';

  // City (first hotel city)
  const cityMatch = body.match(/Hotel Details[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*\n([^\n]+?)\s+\w+\s+Tree/);
  data.city = cityMatch?.[1]?.trim() || 'Port Blair';

  // Hotel Address
  const addressMatch = body.match(/Hotel Address\s+[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*([^\n]+Contact:)/);
  data.address = addressMatch?.[1]?.trim() || '';

  // Activity/Service Description
  const activityMatch = body.match(/Service Description\s+([^\n]+(?:\n(?!Inclusions)[^\n]+)*)/);
  data.specification = activityMatch?.[1]?.trim() || 'Photoshoot service';

  return data;
}
