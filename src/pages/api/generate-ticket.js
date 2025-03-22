import { requireAuth } from '../../lib/supabaseAuth';
import { createTicket, venues } from '../../lib/supabaseDB';
import { generateQRCode } from '../../lib/qrcode';

export async function POST({ request, redirect, cookies }) {
  try {
    // Get the authenticated user
    const user = await requireAuth({ cookies, redirect });
    
    // Parse form data
    const formData = await request.formData();
    const venueId = formData.get('venueId');
    const eventDate = formData.get('eventDate');
    
    // Simple validation
    if (!venueId || !eventDate) {
      return redirect('/dashboard?error=invalid_input');
    }
    
    // Find venue by ID
    const venue = venues.find(v => v.id === venueId);
    if (!venue) {
      return redirect('/dashboard?error=invalid_venue');
    }
    
    // Parse event date and time
    const dateObj = new Date(eventDate);
    const date = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const time = dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Create ticket
    const ticket = await createTicket(user.id, {
      venueName: venue.name,
      venueLocation: venue.location,
      date,
      time,
      username: user.name
    });
    
    // Redirect to dashboard
    return redirect(`/dashboard?ticket=${ticket.id}`);
  } catch (error) {
    console.error('Ticket generation error:', error);
    return redirect('/dashboard?error=server_error');
  }
}