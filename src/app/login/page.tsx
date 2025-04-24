'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient';
import bcrypt from 'bcryptjs';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      toast.error('Invalid credentials');
      setError('Invalid credentials');
      return;
    }

    const passwordMatch = await bcrypt.compare(password, data.password);

    if (!passwordMatch) {
      toast.error('Invalid credentials');
      setError('Invalid credentials');
      return;
    }

    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('role', data.role);
    sessionStorage.setItem('userName', data.name);

    toast.success('Login successful!');

    setTimeout(() => {
      router.refresh();
      router.push(data.role === 1 ? '/admin/dashboard' : '/judge/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 to-pink-100 px-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-center text-violet-700 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Please login to your account
        </p>

        <div className="space-y-5">
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-violet-500">
              <Mail className="text-gray-400 mr-2" size={18} />
              <input
                className="w-full outline-none text-sm"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-violet-500">
              <Lock className="text-gray-400 mr-2" size={18} />
              <input
                className="w-full outline-none text-sm pr-8"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 text-gray-400"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition duration-200 shadow-md"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
