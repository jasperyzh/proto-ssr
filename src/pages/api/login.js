import { findUserByEmail, validatePassword } from '../../lib/supabaseDB';
import { createSession, createSessionCookie } from '../../lib/supabaseAuth';
import { supabase } from '../../lib/supabaseClient';

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
    // Sign in with Supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return redirect('/login?error=invalid');
    }
    
    // Find user profile
    const user = await findUserByEmail(email);
    
    // Check if user exists and is verified
    if (!user) {
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