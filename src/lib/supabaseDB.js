import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { supabase } from './supabaseClient';

// User methods
export async function createUser(userData) {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    throw new Error(`Email address "${userData.email}" is invalid`);
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  // First, create auth user
  const { data: authUser, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  });
  
  if (authError) {
    throw new Error(authError.message);
  }
  
  // Then store additional user data in the 'profiles' table
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: authUser.user.id,
        name: userData.name,
        email: userData.email,
        verified: false,
        created_at: new Date().toISOString(),
      }
    ]);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { 
    id: authUser.user.id, 
    name: userData.name, 
    email: userData.email 
  };
}

export async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data;
}

export async function verifyUser(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ verified: true })
    .eq('id', userId);
  
  if (error) {
    return false;
  }
  
  return true;
}

// For Supabase, password validation is handled by auth service
export async function validatePassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return !error;
}

// Verification token methods
export async function createVerificationToken(userId) {
  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  const { data, error } = await supabase
    .from('verification_tokens')
    .insert([
      {
        token,
        user_id: userId,
        expires_at: expiresAt.toISOString(),
      }
    ]);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return token;
}

export async function validateVerificationToken(token) {
  const { data, error } = await supabase
    .from('verification_tokens')
    .select('*')
    .eq('token', token)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  if (new Date() > new Date(data.expires_at)) {
    // Delete expired token
    await supabase
      .from('verification_tokens')
      .delete()
      .eq('token', token);
    
    return null;
  }
  
  return data.user_id;
}

// Ticket methods
export async function createTicket(userId, eventDetails) {
  const id = nanoid(16);
  
  const { data, error } = await supabase
    .from('tickets')
    .insert([
      {
        id,
        user_id: userId,
        venue_name: eventDetails.venueName,
        venue_location: eventDetails.venueLocation,
        date: eventDetails.date,
        time: eventDetails.time,
        username: eventDetails.username,
        created_at: new Date().toISOString(),
      }
    ]);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return {
    id,
    userId,
    venueName: eventDetails.venueName,
    venueLocation: eventDetails.venueLocation,
    date: eventDetails.date,
    time: eventDetails.time,
    username: eventDetails.username
  };
}

export async function getTicketsByUserId(userId) {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    return [];
  }
  
  return data.map(ticket => ({
    id: ticket.id,
    userId: ticket.user_id,
    venueName: ticket.venue_name,
    venueLocation: ticket.venue_location,
    date: ticket.date,
    time: ticket.time,
    username: ticket.username
  }));
}

export async function getTicketById(id) {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return {
    id: data.id,
    userId: data.user_id,
    venueName: data.venue_name,
    venueLocation: data.venue_location,
    date: data.date,
    time: data.time,
    username: data.username
  };
}

// Venue data
export const venues = [
  {
    id: 'venue1',
    name: 'Paradise Theater',
    location: '123 Main St, Anytown, USA',
    capacity: 500,
    image: 'https://placehold.co/600x400/png?text=Paradise+Theater'
  },
  {
    id: 'venue2', 
    name: 'Starlight Arena',
    location: '456 Park Ave, Metropolis, USA',
    capacity: 2000,
    image: 'https://placehold.co/600x400/png?text=Starlight+Arena'
  },
  {
    id: 'venue3',
    name: 'Ocean View Hall',
    location: '789 Beach Rd, Coastal City, USA',
    capacity: 800,
    image: 'https://placehold.co/600x400/png?text=Ocean+View+Hall'
  }
];

// Event times (for the next 7 days)
export function getEventTimes() {
  const times = [];
  const now = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    times.push({
      date: date.toISOString().split('T')[0],
      time: '19:00'
    });
  }
  
  return times;
}