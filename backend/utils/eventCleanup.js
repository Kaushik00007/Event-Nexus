const cron = require('node-cron');
const Event = require('../models/supabase/Event');

/**
 * Cleanup expired events
 * Deletes events that have passed their end_date or date
 */
const cleanupExpiredEvents = async () => {
  try {
    console.log('[Event Cleanup] Starting cleanup of expired events...');
    const result = await Event.deleteExpired();
    
    if (result.deletedCount > 0) {
      console.log(`[Event Cleanup] Successfully deleted ${result.deletedCount} expired event(s)`);
      
      // Log deleted event details for audit purposes
      result.deletedEvents.forEach(event => {
        console.log(`  - Deleted: ${event.title} (ID: ${event.id}, Date: ${event.date})`);
      });
    } else {
      console.log('[Event Cleanup] No expired events found');
    }
    
    return result;
  } catch (error) {
    console.error('[Event Cleanup] Error during cleanup:', error.message);
    console.error(error.stack);
    throw error;
  }
};

/**
 * Initialize the scheduled cleanup job
 * Runs daily at 2:00 AM
 */
const initializeEventCleanup = () => {
  // Schedule cleanup to run daily at 2:00 AM
  // Cron format: second minute hour day month weekday
  // '0 2 * * *' = At 2:00 AM every day
  const cleanupSchedule = '0 2 * * *';
  
  cron.schedule(cleanupSchedule, async () => {
    console.log('\n=== Scheduled Event Cleanup Started ===');
    try {
      await cleanupExpiredEvents();
    } catch (error) {
      console.error('Scheduled cleanup failed:', error.message);
    }
    console.log('=== Scheduled Event Cleanup Completed ===\n');
  });

  console.log('[Event Cleanup] Scheduled task initialized - will run daily at 2:00 AM');
  
  // Optional: Run cleanup immediately on startup (comment out if not needed)
  // Uncomment the lines below to run cleanup when server starts
  /*
  setTimeout(async () => {
    console.log('[Event Cleanup] Running initial cleanup on startup...');
    try {
      await cleanupExpiredEvents();
    } catch (error) {
      console.error('Initial cleanup failed:', error.message);
    }
  }, 5000); // Wait 5 seconds after server starts
  */
};

module.exports = {
  initializeEventCleanup,
  cleanupExpiredEvents
};
