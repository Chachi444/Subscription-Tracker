import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

import { sendReminderEmail } from './utils/send-email.js';

// Test email function
async function testEmail() {
  try {
    console.log('Testing email...');
    
    const result = await sendReminderEmail({
      to: 'godwincharity443@gmail.com',
      type: 'subscription created',
      subscription: {
        name: 'Test Subscription',
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        price: 9.99,
        currency: 'USD',
        billingCycle: 'monthly',
        paymentMethod: 'credit_card',
        user: {
          name: 'Test User',
          email: 'godwincharity443@gmail.com'
        }
      },
    });

    console.log('✅ Email sent successfully!', result.response);
  } catch (error) {
    console.error('❌ Email failed:', error.message);
  }
}

testEmail();
