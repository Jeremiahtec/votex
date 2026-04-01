const cron = require('node-cron');
const pool = require('../config/db');

// Run this job every minute to verify rapid test feedback
// Wait, for production-grade (usually hourly), but for demonstration I'll run it every 5 minutes.
cron.schedule('*/5 * * * *', async () => {
  try {
    // Delete polls that expired more than 24 hours ago
    const result = await pool.query(`
      DELETE FROM polls 
      WHERE expires_at < NOW() - INTERVAL '24 hours'
    `);
    
    if (result.rowCount > 0) {
      console.log(`[CRON] Cleaned up ${result.rowCount} long-expired polls.`);
    }
  } catch (error) {
    console.error('[CRON] Error cleaning up expired polls:', error);
  }
});

console.log('[CRON] Auto-cleanup service initialized. Sweeping polls expired >24h every 5 minutes.');
