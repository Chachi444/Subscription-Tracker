import { Router } from "express";
import { sendReminders } from '../controllers/workflow.controller.js';
import { sendReminderEmail } from '../utils/send-email.js';
import Subscription from '../models/subscription.model.js';

const workflowRouter = Router();

// Workflow endpoint for subscription reminders
workflowRouter.post('/subscription/reminder', sendReminders);

// Test email endpoint
workflowRouter.post('/test-email/:subscriptionId', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.subscriptionId).populate('user', 'name email');
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    await sendReminderEmail({
      to: subscription.user.email,
      type: 'subscription created',
      subscription,
    });

    res.json({ 
      success: true, 
      message: 'Test email sent successfully',
      sentTo: subscription.user.email 
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Simple email test endpoint
workflowRouter.post('/test-simple-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    await sendReminderEmail({
      to: email || 'your-email@example.com',
      type: 'subscription created',
      subscription: {
        name: 'Test Subscription',
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        price: 9.99,
        currency: 'USD',
        billingCycle: 'monthly',
        paymentMethod: 'credit_card',
        user: {
          name: 'Test User',
          email: email || 'your-email@example.com'
        }
      },
    });

    res.json({ 
      success: true, 
      message: 'Simple test email sent successfully',
      sentTo: email || 'your-email@example.com'
    });
  } catch (error) {
    console.error('Simple test email error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default workflowRouter;
