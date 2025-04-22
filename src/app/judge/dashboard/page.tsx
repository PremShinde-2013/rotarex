"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../utils/supabaseClient";
import Link from "next/link";

interface Project {
  id: number;
  display_code: string;
  project_title: string;
  category: string;
  domain: string;
  created_at: string;
  status?: string; // e.g., "Pending", "Reviewed"
}

export default function JudgeDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, display_code, project_title, category, domain, created_at, status"
        );

      if (error) console.error("Error fetching judge projects:", error);
      else setProjects(data || []);
      setLoading(false);
    };

    fetchAssignedProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-violet-700 mb-6 text-center">
        🎓 Judge Dashboard
      </h1>
      <div className="flex justify-end mb-4">
        <Link href="./evaluate">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow font-semibold">
            ✅ Evaluated Projects
          </button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border-l-4 border-violet-500">
          <h2 className="text-base md:text-lg font-semibold text-gray-700">
            Assigned Projects
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-violet-600 mt-2">
            {projects.length}
          </p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <h2 className="text-base md:text-lg font-semibold text-gray-700">
            Pending Reviews
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-yellow-600 mt-2">
            {projects.filter((p) => p.status === "Pending").length}
          </p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <h2 className="text-base md:text-lg font-semibold text-gray-700">
            Reviewed
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
            {projects.filter((p) => p.status === "Reviewed").length}
          </p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md overflow-x-auto">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
          Assigned Projects
        </h2>
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-violet-100 text-violet-700">
            <tr>
              <th className="px-4 py-2 whitespace-nowrap">Display Code</th>
              <th className="px-4 py-2 whitespace-nowrap">Title</th>
              <th className="px-4 py-2 whitespace-nowrap">Category</th>
              <th className="px-4 py-2 whitespace-nowrap">Domain</th>
              <th className="px-4 py-2 whitespace-nowrap">Date</th>
              <th className="px-4 py-2 whitespace-nowrap">Status</th>
              <th className="px-4 py-2 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b hover:bg-gray-50 transition-all"
              >
                <td className="px-4 py-2 font-medium text-violet-600 whitespace-nowrap">
                  {project.display_code}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {project.project_title}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {project.category}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {project.domain}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {new Date(project.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      project.status === "Reviewed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {project.status || "Pending"}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button className="text-blue-500 hover:text-blue-700">
                    Review
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-400">
                  No projects assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
