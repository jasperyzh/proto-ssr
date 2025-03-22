import { sealData, unsealData } from 'iron-session';

const cookieConfig = {
  ttl: 60 * 60 * 8, // 8 hours
  password: process.env.SESSION_SECRET || 'this_is_a_secret_that_is_at_least_32_characters_long',
};

export async function createSession(user) {
  const session = { 
    user: { 
      id: user.id,
      name: user.name,
      email: user.email 
    }
  };
  
  const sealed = await sealData(session, cookieConfig);
  return sealed;
}

export async function getSessionFromCookie(cookie) {
  if (!cookie) return null;
  
  try {
    const session = await unsealData(cookie, cookieConfig);
    return session;
  } catch (error) {
    return null;
  }
}

export function createSessionCookie(sessionData) {
  return {
    name: 'session',
    value: sessionData,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: cookieConfig.ttl,
  };
}

export async function requireAuth(Astro) {
  const sessionCookie = Astro.cookies.get('session')?.value;
  
  if (!sessionCookie) {
    return Astro.redirect('/login?error=unauthenticated');
  }
  
  const session = await getSessionFromCookie(sessionCookie);
  
  if (!session || !session.user) {
    Astro.cookies.delete('session');
    return Astro.redirect('/login?error=invalid_session');
  }
  
  return session.user;
}