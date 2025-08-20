import Subscription from '../models/subscription.model.js'
import { workflowClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'

export const createSubscription = async (req, res, next) => {
  try {
    // Remove status from request body to ensure new subscriptions are always active
    const subscriptionData = { ...req.body };
    delete subscriptionData.status;
    
    const subscription = await Subscription.create({
      ...subscriptionData,
      user: req.user._id,
    });

    let workflowRunId = null;

    // Trigger workflow for subscription reminders
    try {
      const workflowResponse = await workflowClient.trigger({
        url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
        body: {
          subscriptionId: subscription.id,
        },
        headers: {
          'content-type': 'application/json',
        },
        retries: 0,
      });
      workflowRunId = workflowResponse.workflowRunId;
      console.log('Workflow triggered successfully:', workflowRunId);
    } catch (workflowError) {
      console.warn('Workflow trigger failed:', workflowError.message);
      // Generate a fallback ID for development
      workflowRunId = `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    res.status(201).json({ 
      success: true, 
      data: { 
        subscription, 
        workflowRunId
      } 
    });
  } catch (e) {
    next(e);
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if(req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
}

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id }).populate('user', 'name email');
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate('user', 'name email');
    
    if (!subscription) {
      const error = new Error('Subscription not found');
      error.status = 404;
      throw error;
    }

    // Check if user owns this subscription
    if (subscription.user._id.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to access this subscription');
      error.status = 403;
      throw error;
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      const error = new Error('Subscription not found');
      error.status = 404;
      throw error;
    }

    // Check if user owns this subscription
    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to update this subscription');
      error.status = 403;
      throw error;
    }

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.status(200).json({ success: true, data: updatedSubscription });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      const error = new Error('Subscription not found');
      error.status = 404;
      throw error;
    }

    // Check if user owns this subscription
    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to delete this subscription');
      error.status = 403;
      throw error;
    }

    await Subscription.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      const error = new Error('Subscription not found');
      error.status = 404;
      throw error;
    }

    // Check if user owns this subscription
    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to cancel this subscription');
      error.status = 403;
      throw error;
    }

    const cancelledSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.status(200).json({ 
      success: true, 
      message: 'Subscription cancelled successfully',
      data: cancelledSubscription 
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingRenewals = await Subscription.find({
      user: req.user._id,
      status: 'active',
      renewalDate: { 
        $gte: new Date(), 
        $lte: thirtyDaysFromNow 
      }
    }).populate('user', 'name email').sort({ renewalDate: 1 });

    res.status(200).json({ 
      success: true, 
      count: upcomingRenewals.length,
      data: upcomingRenewals 
    });
  } catch (error) {
    next(error);
  }
};