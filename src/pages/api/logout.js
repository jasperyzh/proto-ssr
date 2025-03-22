export function GET({ redirect, cookies }) {
  // Delete the session cookie
  cookies.delete('session');
  
  // Redirect to home page
  return redirect('/');
}