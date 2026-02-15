import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Requires Service Role Key
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_APP_PASS;

if (!supabaseUrl || !supabaseServiceKey || !emailUser || !emailPass) {
  console.error('Missing environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

async function sendReminderEmail(userEmail, userName, medicineName, dosage, time) {
  const mailOptions = {
    from: `"Health Monitor" <${emailUser}>`,
    to: userEmail,
    subject: `💊 Medicine Reminder: ${medicineName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4f46e5;">Medicine Reminder</h2>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>This is a reminder to take your medication.</p>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Medicine:</strong> ${medicineName}</p>
          <p style="margin: 5px 0;"><strong>Dosage:</strong> ${dosage}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
        </div>
        <p>Please stay consistent with your schedule for the best results.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #6b7280;">HealthMonitor AI Assistant • Automated Notification</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Sent to ${userEmail} for ${medicineName}`);
    return true;
  } catch (error) {
    console.error(`[Email] Error sending to ${userEmail}:`, error);
    return false;
  }
}

async function checkAndSendReminders() {
  const now = new Date();
  
  // Calculate Target time (Now + 20 minutes)
  const targetDate = new Date(now.getTime() + 20 * 60000);
  const targetHour = targetDate.getHours().toString().padStart(2, '0');
  const targetMinute = targetDate.getMinutes().toString().padStart(2, '0');
  const targetTime = `${targetHour}:${targetMinute}`;
  
  const currentHour = now.getHours().toString().padStart(2, '0');
  const currentMinute = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${currentHour}:${currentMinute}`;
  
  const today = new Date().toISOString().split('T')[0];

  console.log(`[Service] Polling at ${currentTime}. Looking for reminders at ${targetTime} (20m lead)...`);

  try {
    // 1. Fetch reminders scheduled for the target time
    const { data: reminders, error: reminderError } = await supabase
      .from('reminders')
      .select('id, medicine_name, dosage, time, last_notified_at, user_id')
      .eq('time', targetTime);

    if (reminderError) throw reminderError;

    for (const reminder of reminders) {
      // 2. Avoid double sending (if already sent today)
      const lastSent = reminder.last_notified_at ? new Date(reminder.last_notified_at).toISOString().split('T')[0] : null;
      
      if (lastSent === today) {
        console.log(`[Service] Already notified today for reminder ${reminder.id}`);
        continue;
      }

      // 3. Fetch user profile manually to get email (Avoids join relationship issues)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', reminder.user_id)
        .single();

      if (profileError || !profile) {
        console.warn(`[Service] Could not find profile for user ${reminder.user_id}`);
        continue;
      }

      const userEmail = profile.email;
      const userName = profile.full_name || 'User';

      if (!userEmail) {
        console.warn(`[Service] No email found for user in reminder ${reminder.id}`);
        continue;
      }

      // 4. Send the email
      const success = await sendReminderEmail(
        userEmail,
        userName,
        reminder.medicine_name,
        reminder.dosage,
        reminder.time
      );

      // 5. Update the reminder so we don't send it again today
      if (success) {
        const { error: updateError } = await supabase
          .from('reminders')
          .update({ last_notified_at: new Date().toISOString() })
          .eq('id', reminder.id);
        
        if (updateError) console.error(`[Service] Failed to update reminder state:`, updateError);
      }
    }
  } catch (err) {
    console.error('[Service] Error in reminder loop:', err);
  }
}

// Start the service
console.log('--- HealthMonitor Reminder Service Started ---');
console.log(`Configured Sender: ${emailUser}`);

// Run every minute
setInterval(checkAndSendReminders, 60000);

// Run once on startup
checkAndSendReminders();
