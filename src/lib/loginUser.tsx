import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function signinUser(email: string, password: string) {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();

  if (error || !data) throw new Error('Invalid email or password');

  const isValid = await bcrypt.compare(password, data.password);
  if (!isValid) throw new Error('Invalid email or password');

  // Redirect based on role
  if (typeof window !== 'undefined') {
    if (data.role === 1) {
      window.location.href = '/admin/dashboard';
    } else {
      window.location.href = '/judge/dashboard';
    }
  }

  return data;
}
