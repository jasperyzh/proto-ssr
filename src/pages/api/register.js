import { createUser, findUserByEmail, createVerificationToken } from '../../lib/db';

export async function POST({ request, redirect }) {
  // Parse form data
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  
  // Simple validation
  if (!name || !email || !password || password.length < 8) {
    return redirect('/register?error=invalid_input');
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
    const verificationToken = createVerificationToken(newUser.id);
    
    // In a real app, we would send an email here
    // For development, we'll just log the verification link
    console.log(`Verification link: http://localhost:4322/verify?token=${verificationToken}`);
    
    // Redirect to success page
    return redirect('/register-success');
  } catch (error) {
    console.error('Registration error:', error);
    return redirect('/register?error=server_error');
  }
}