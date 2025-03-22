// Mock database using localStorage (will be used on client)
// For SSR, we'll use in-memory storage that persists within the session

import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

// In-memory storage for server
const users = new Map();
const tickets = new Map();
const verificationTokens = new Map();

// User methods
export async function createUser(userData) {
  const id = nanoid();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  const user = {
    id,
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    verified: false,
    created: new Date().toISOString()
  };
  
  users.set(id, user);
  
  return { id, name: user.name, email: user.email };
}

export async function findUserByEmail(email) {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

export async function verifyUser(userId) {
  const user = users.get(userId);
  if (user) {
    user.verified = true;
    users.set(userId, user);
    return true;
  }
  return false;
}

export async function validatePassword(user, password) {
  return bcrypt.compare(password, user.password);
}

// Verification token methods
export function createVerificationToken(userId) {
  const token = nanoid(32);
  verificationTokens.set(token, {
    userId,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  });
  return token;
}

export function validateVerificationToken(token) {
  const tokenData = verificationTokens.get(token);
  
  if (!tokenData) {
    return null;
  }
  
  if (new Date() > new Date(tokenData.expires)) {
    verificationTokens.delete(token);
    return null;
  }
  
  return tokenData.userId;
}

// Ticket methods
export function createTicket(userId, eventDetails) {
  const id = nanoid(16);
  const ticket = {
    id,
    userId,
    ...eventDetails,
    created: new Date().toISOString()
  };
  
  tickets.set(id, ticket);
  return ticket;
}

export function getTicketsByUserId(userId) {
  const userTickets = [];
  
  for (const ticket of tickets.values()) {
    if (ticket.userId === userId) {
      userTickets.push(ticket);
    }
  }
  
  return userTickets;
}

export function getTicketById(id) {
  return tickets.get(id) || null;
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