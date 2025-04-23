'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../utils/supabaseClient';

export default function JudgeDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [domain, setDomain] = useState('');
  interface Project {
    group_number: number;
    project_title: string;
    category: string;
    domain: string;
    department: string;
    status: string;
    totalmarks: number | null;
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    const name = sessionStorage.getItem('userName');
    const email = sessionStorage.getItem('userEmail');

    if (role !== '0') {
      router.push('/');
    } else {
      setUserName(name || '');
      fetchJudgeDomain(email);
    }
  }, [router]);

  const fetchJudgeDomain = async (email: string | null) => {
    if (!email) return;

    const { data, error } = await supabase
      .from('users')
      .select('domain')
      .eq('email', email)
      .single();

    if (error || !data) {
      console.error('Failed to get judge domain:', error?.message);
      return;
    }

    setDomain(data.domain);
    fetchProjectsByDomain(data.domain);
  };

  const fetchProjectsByDomain = async (domain: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('group_number, project_title, category, domain, department, status, totalmarks')
      .eq('domain', domain);

    if (error) {
      console.error('Error fetching projects:', error.message);
    } else {
      setProjects(data);
    }

    setLoading(false);
  };

  const total = projects.length;
  const reviewed = projects.filter(p => p.status === 'Reviewed').length;
  const pending = total - reviewed;

  return (
    <div className="max-w-7xl mx-auto mt-20 px-6">
      <h1 className="text-4xl font-bold text-violet-700 mb-2">Judge Dashboard</h1>
      <p className="text-lg text-gray-700 mb-4">Welcome, {userName}!</p>
      <div className="flex justify-end mb-4">
        <Link href="./evaluate">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow font-semibold">
            ✅ Evaluated Projects
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-violet-600">
          <h2 className="text-gray-500 text-sm font-medium">Total Projects</h2>
          <p className="text-3xl font-bold text-violet-700 mt-1">{total}</p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-yellow-500">
          <h2 className="text-gray-500 text-sm font-medium">Pending Reviews</h2>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{pending}</p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-green-500">
          <h2 className="text-gray-500 text-sm font-medium">Reviewed</h2>
          <p className="text-3xl font-bold text-green-600 mt-1">{reviewed}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-2 text-gray-800">
        Assigned Domain: <span className="text-violet-600">{domain}</span>
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">No projects found for this domain.</p>
      ) : (
        <div className="overflow-x-auto mt-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-violet-100 text-violet-800 font-semibold text-sm">
              <tr>
                <th className="px-6 py-4">Group No.</th>
                <th className="px-6 py-4">Project Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {projects.map((project, index) => (
                <tr key={index} className="hover:bg-violet-50 transition">
                  <td className="px-6 py-4">{project.group_number}</td>
                  <td className="px-6 py-4">{project.project_title}</td>
                  <td className="px-6 py-4">{project.category}</td>
                  <td className="px-6 py-4">{project.department}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'Reviewed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{project.totalmarks ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
