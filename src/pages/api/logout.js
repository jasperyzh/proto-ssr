import { signOut } from '../../lib/supabaseAuth';

export async function GET({ cookies, redirect }) {
  try {
    // Sign out from Supabase
    await signOut();
    
    // Clear session cookie
    cookies.delete('session');
    
    return redirect('/');
  } catch (error) {
    console.error('Logout error:', error);
    return redirect('/dashboard?error=logout_failed');
  }
}