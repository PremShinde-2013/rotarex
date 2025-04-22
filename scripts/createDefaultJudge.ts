import 'dotenv/config'; // Load env variables if needed
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for insert access
);

async function createJudge() {
  const plainPassword = 'diet6797';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const { data, error } = await supabase.from('judges').insert({
    code: 'JUDGE123',
    name: 'Default Judge',
    password: hashedPassword,
  });

  if (error) {
    console.error('Error inserting judge:', error.message);
  } else {
    console.log('Default judge created:', data);
  }
}

createJudge();
