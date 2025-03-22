import { findUserByEmail, validatePassword } from '../../lib/db';
import { createSession, createSessionCookie } from '../../lib/auth';

export async function POST({ request, redirect, cookies }) {
  // Parse form data
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  
  // Simple validation
  if (!email || !password) {
    return redirect('/login?error=invalid_input');
  }
  
  try {
    // Find user by email
    const user = await findUserByEmail(email);
    
    // If user doesn't exist or password is invalid
    if (!user || !(await validatePassword(user, password))) {
      return redirect('/login?error=invalid');
    }
    
    // Check if user is verified
    if (!user.verified) {
      return redirect('/login?error=not_verified');
    }
    
    // Create a session
    const session = await createSession(user);
    
    // Set cookie
    const cookie = createSessionCookie(session);
    cookies.set(cookie.name, cookie.value, cookie);
    
    // Redirect to dashboard
    return redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    return redirect('/login?error=server_error');
  }
}