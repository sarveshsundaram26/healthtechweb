import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkEverything() {
  console.log('--- Database Verification Script ---');
  
  // 1. Check profiles
  console.log('1. Checking Profiles table column "email"...');
  const { error: pError } = await supabase.from('profiles').select('email').limit(1);
  if (pError && pError.message.includes('column')) {
    console.log('❌ MISSING: email in profiles');
  } else if (!pError) {
    console.log('✅ EXISTS: email in profiles');
  }

  // 2. Check reminders
  console.log('2. Checking Reminders table column "last_notified_at"...');
  const { error: rError } = await supabase.from('reminders').select('last_notified_at').limit(1);
  if (rError && rError.message.includes('column')) {
    console.log('❌ MISSING: last_notified_at in reminders');
  } else if (!rError) {
    console.log('✅ EXISTS: last_notified_at in reminders');
  }

  // 3. Check relationships (try a join)
  console.log('3. Checking Reminders -> Profiles relationship...');
  const { error: joinError } = await supabase
    .from('reminders')
    .select('*, profiles!inner(id)')
    .limit(1);
  
  if (joinError && joinError.message.includes('relationship')) {
    console.log('❌ MISSING: Relationship between reminders and profiles');
  } else if (!joinError) {
    console.log('✅ EXISTS: Relationship established!');
  }
}

checkEverything();
