/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient';
import bcrypt from 'bcryptjs';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff, Mail, User, Lock, Briefcase } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('1');
  const [domain, setDomain] = useState('');
  const router = useRouter();

  const domains = [
    '1. Manufacturing',
    '2. Health & Hygiene',
    '3. Agriculture',
    '4. Energy',
    '5. Infrastructure',
    '6. Sustainable Solutions',
    '7. Climate and Waste Management',
    '8. Other related with theme'
  ];

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !name) {
      toast.error('Please fill all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (role === '0' && !domain) {
      toast.error('Please select a domain.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error: insertError } = await supabase.from('users').insert([
      {
        email,
        name,
        password: hashedPassword,
        role: Number(role),
        domain: role === '0' ? domain : null,
      },
    ]);

    if (insertError) {
      toast.error(insertError.message);
      return;
    }

    toast.success('Account created successfully!');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 to-pink-100 px-4 pb-6 pt-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-center text-violet-700 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Get started by filling in your details
        </p>

        <div className="space-y-5">
          {/* Name */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-violet-500">
              <User size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-violet-500">
              <Mail size={18} className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-violet-500">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none text-sm pr-8"
              />
              <button
                type="button"
                className="absolute right-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-violet-500">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full outline-none text-sm pr-8"
              />
              <button
                type="button"
                className="absolute right-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-white"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="1">Admin</option>
              <option value="0">Judge</option>
            </select>
          </div>

          {/* Domain (if Judge) */}
          {role === '0' && (
            <div>
              <label className="text-sm font-medium text-gray-700">Domain</label>
              <select
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              >
                <option value="">Select Domain</option>
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sign Up Button */}
          <button
            onClick={handleSignup}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold rounded-lg hover:scale-[1.02] transition duration-200 shadow-md"
          >
            Sign Up
          </button>

          <div className="text-center text-sm text-gray-500 mt-4">
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <a href="/login" className="text-violet-600 font-semibold">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
