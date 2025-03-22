import { createUser, findUserByEmail, createVerificationToken } from '../../lib/supabaseDB';

export async function POST({ request, redirect }) {
  // Parse form data
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  
  // Simple validation
  if (!name || !email || !password) {
    return redirect('/register?error=missing_fields');
  }
  
  if (password.length < 8) {
    return redirect('/register?error=password_too_short');
  }
  
  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return redirect('/register?error=exists');
    }
    
    // Create user
    const newUser = await createUser({
      name,
      email,
      password
    });
    
    // Generate verification token
    const verificationToken = await createVerificationToken(newUser.id);
    
    // In a real app, we would send an email here
    // For development, we'll just log the verification link
    console.log(`Verification link: ${import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321'}/verify?token=${verificationToken}`);
    
    // Redirect to success page
    return redirect('/register-success');
  } catch (error) {
    console.error('Registration error:', error);
    // Pass the specific error message in the URL
    if (error.message.includes('Email address') && error.message.includes('invalid')) {
      return redirect(`/register?error=invalid_email`);
    } else if (error.message.includes('already registered')) {
      return redirect('/register?error=exists');
    } else {
      return redirect(`/register?error=server_error&message=${encodeURIComponent(error.message)}`);
    }
  }
}