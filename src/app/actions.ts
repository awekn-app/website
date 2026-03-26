'use server'

import dbConnect from '@/lib/mongodb';
import WaitlistUser from '@/models/WaitlistUser';

export async function joinWaitlist(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const country = formData.get('country') as string;
  
  if (!name || !email || !country) {
    return { error: 'Please fill out all fields.', success: false };
  }

  try {
    await dbConnect();
    
    // Check if email already exists
    const existingUser = await WaitlistUser.findOne({ email });
    if (existingUser) {
      return { error: 'This email is already on the waitlist.', success: false };
    }

    await WaitlistUser.create({ name, email, country });
    return { success: true, message: 'Welcome to the Awekn society. We will be in touch soon.' };
  } catch (error: any) {
    console.error('Waitlist submission error:', error);
    return { error: 'An error occurred while saving your info. Please try again later.', success: false };
  }
}
