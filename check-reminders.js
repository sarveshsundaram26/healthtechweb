import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkReminders() {
  console.log('=== Checking Reminder Setup ===\n');
  
  // 1. Check all reminders
  const { data: reminders, error: rError } = await supabase
    .from('reminders')
    .select('*')
    .order('time');
  
  if (rError) {
    console.error('Error fetching reminders:', rError.message);
  } else {
    console.log(`Found ${reminders.length} reminder(s):`);
    reminders.forEach(r => {
      console.log(`  - ${r.medicine_name} at ${r.time} (ID: ${r.id.substring(0, 8)}...)`);
      console.log(`    User: ${r.user_id.substring(0, 8)}...`);
      console.log(`    Last notified: ${r.last_notified_at || 'Never'}\n`);
    });
  }
  
  // 2. Check profiles with emails
  const { data: profiles, error: pError } = await supabase
    .from('profiles')
    .select('id, full_name, email');
  
  if (pError) {
    console.error('Error fetching profiles:', pError.message);
  } else {
    console.log(`\nFound ${profiles.length} profile(s):`);
    profiles.forEach(p => {
      console.log(`  - ${p.full_name || 'No name'} (${p.id.substring(0, 8)}...)`);
      console.log(`    Email: ${p.email || '❌ NO EMAIL SET'}\n`);
    });
  }
  
  // 3. Check current time
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const targetTime = new Date(now.getTime() + 20 * 60000);
  const targetTimeStr = `${targetTime.getHours().toString().padStart(2, '0')}:${targetTime.getMinutes().toString().padStart(2, '0')}`;
  
  console.log(`\n=== Timing Info ===`);
  console.log(`Current time: ${currentTime}`);
  console.log(`Service is looking for reminders at: ${targetTimeStr} (20min ahead)`);
  console.log(`\nFor an email to be sent NOW, you need a reminder scheduled at ${targetTimeStr}`);
}

checkReminders();
