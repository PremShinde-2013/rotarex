/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient';
import bcrypt from 'bcryptjs';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); // State for name
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('1'); // Default to admin
  const [domain, setDomain] = useState('');
  const router = useRouter();

  const domains = [
    'Manufacturing',
    'Health & Hygiene',
    'Agriculture',
    'Energy',
    'Infrastructure',
    'Sustainable Solutions',
    'Climate and Waste Management',
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
        name, // Insert the name into the database
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
    <div className="max-w-md mx-auto mt-20 bg-white px-8 py-10 rounded-2xl shadow-xl border border-gray-100 relative">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-3xl font-bold text-center text-violet-700 mb-6">
        Create Your Account ✨
      </h2>

      <div className="space-y-4">
        {/* Name Input Field */}
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm pr-10"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm pr-10"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>

        <select
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-white"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="1">Admin</option>
          <option value="0">Judge</option>
        </select>

        {role === '0' && (
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
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
