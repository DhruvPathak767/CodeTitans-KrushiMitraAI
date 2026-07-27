import cron from 'node-cron';
import mandiSyncService from '../services/mandiSync.service.js';

/**
 * Mandi Price Auto-Sync Cron Job
 *
 * Runs every 6 hours to fetch fresh APMC mandi prices from data.gov.in
 * and upsert them into the MarketPrice MongoDB collection.
 *
 * Schedule: 0 0,6,12,18 * * * (every 6 hours at minute 0)
 */

let cronTask = null;

/**
 * Start the mandi price sync cron scheduler.
 */
export function startMandiCron() {
  if (!process.env.MANDI_API_KEY) {
    console.log('⚠️ [MandiCron] MANDI_API_KEY not set. Skipping cron scheduler.');
    return;
  }

  // Schedule: every 6 hours at minute 0
  cronTask = cron.schedule('0 */6 * * *', async () => {
    console.log(`\n⏰ [MandiCron] Scheduled sync triggered at ${new Date().toISOString()}`);
    try {
      const result = await mandiSyncService.syncLatestPrices({ maxRecords: 500 });
      console.log(`⏰ [MandiCron] Sync result: ${result.synced} records synced.`);
    } catch (error) {
      console.error('❌ [MandiCron] Scheduled sync failed:', error.message);
    }
  }, {
    timezone: 'Asia/Kolkata',
  });

  console.log('🕐 [MandiCron] Mandi price auto-sync scheduled every 6 hours (IST).');
}

/**
 * Run an initial sync on server startup (non-blocking).
 */
export async function runInitialSync() {
  if (!process.env.MANDI_API_KEY) {
    console.log('⚠️ [MandiCron] MANDI_API_KEY not set. Skipping initial sync.');
    return;
  }

  // Run initial sync in background so it doesn't block server boot
  setTimeout(async () => {
    try {
      console.log('\n🚀 [MandiCron] Running initial mandi price sync on startup...');
      const result = await mandiSyncService.syncLatestPrices({ maxRecords: 500 });
      console.log(`🚀 [MandiCron] Initial sync done: ${result.synced} records synced.`);
    } catch (error) {
      console.error('❌ [MandiCron] Initial sync failed:', error.message);
      // Non-fatal — the server continues running with existing DB data
    }
  }, 5000); // Delay 5s to let DB connect first
}

/**
 * Stop the cron job (for graceful shutdown).
 */
export function stopMandiCron() {
  if (cronTask) {
    cronTask.stop();
    console.log('🛑 [MandiCron] Cron scheduler stopped.');
  }
}
