'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient';
 // Adjust the import path as necessary
import bcrypt from 'bcryptjs';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('1'); // Default to admin
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    setError('');
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error: insertError } = await supabase.from('users').insert([
      {
        email,
        password: hashedPassword,
        role: Number(role),
      },
    ]);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push('/login');
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white px-8 py-10 rounded-2xl shadow-xl border border-gray-100">
    <h2 className="text-3xl font-bold text-center text-violet-700 mb-6">
      Create Your Account ✨
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
  
      <select
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-white"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="1">Admin</option>
        <option value="0">Judge</option>
      </select>
  
      {error && (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      )}
  
      <button
        onClick={handleSignup}
        className="w-full py-3 bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold rounded-lg hover:scale-[1.02] transition duration-200 shadow-md"
      >
        Sign Up
      </button>
    </div>
  </div>
  
  );
}
