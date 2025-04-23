// lib/signupUser.ts
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function signupUser(email: string, password: string, role = 0, domain = '') {
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    throw new Error('User already exists');
  }

  const { data, error } = await supabase
    .from('users')
    .insert({
      email,
      password: hashedPassword,
      role,
      domain: role === 0 ? domain : null,
    })
    .select()
    .single();

  if (error) throw error;

  if (typeof window !== 'undefined') {
    if (role === 1) {
      window.location.href = '/admin/dashboard';
    } else {
      window.location.href = '/judge/dashboard';
    }
  }

  return data;
}

