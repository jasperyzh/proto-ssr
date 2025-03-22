import { signOut } from '../../lib/supabaseAuth';

export async function GET({ cookies, redirect }) {
  try {
    // Attempt to sign out from Supabase
    await signOut().catch(err => {
      console.warn('Supabase signout error:', err);
      // Continue with local logout even if Supabase fails
    });
    
    // Clear session cookie (this is the most important part)
    cookies.delete('session', { path: '/' });
    
    return redirect('/');
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, try to delete the cookie
    try {
      cookies.delete('session', { path: '/' });
    } catch (e) {
      console.error('Failed to delete cookie:', e);
    }
    
    return redirect('/?error=logout_issue');
  }
}