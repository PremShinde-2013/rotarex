'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient';
import bcrypt from 'bcryptjs';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      setError('Invalid credentials');
      return;
    }

    const passwordMatch = await bcrypt.compare(password, data.password);

    if (!passwordMatch) {
      setError('Invalid credentials');
      return;
    }

    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('role', data.role);

    if (data.role === 1) {
      router.push('/admin/dashboard');
    } else {
      router.push('/judge/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white px-8 py-10 rounded-2xl shadow-xl border border-gray-100">
  <h2 className="text-3xl font-bold text-center text-violet-700 mb-6">
    Welcome Back 👋
  </h2>

  <div className="space-y-4">
    <input
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    {error && (
      <p className="text-red-500 text-sm mt-1 font-medium">{error}</p>
    )}

    <button
      onClick={handleLogin}
      className="w-full py-3 bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold rounded-lg hover:scale-[1.02] transition duration-200 shadow-md"
    >
      Login
    </button>
  </div>
</div>

  );
}
