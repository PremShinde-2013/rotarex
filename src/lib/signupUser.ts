// lib/signupUser.ts
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function signupUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    throw new Error('User already exists');
  }

  const { data, error } = await supabase.from('users').insert({
    email,
    password: hashedPassword,
    role: 0, // Default to judge
  }).select().single();

  if (error) throw error;

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
