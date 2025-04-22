"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../utils/supabaseClient";

interface Project {
  id: number;
  display_code: string;
  project_title: string;
  category: string;
  domain: string;
  created_at: string;
  participants?: string;
  // description?: string;
  institute_name?: string;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, display_code, project_title, category, domain, created_at, participants, institute_name"
        )
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching data:", error);
      else setProjects(data || []);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-violet-700">
        📋 Registered Projects
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="min-h-screen bg-gray-100 py-10 px-6 md:px-12">
          <h1 className="text-3xl font-bold text-violet-700 mb-8 text-center">
            Admin Dashboard
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-violet-500">
              <h2 className="text-lg font-semibold text-gray-700">
                Total Projects
              </h2>
              <p className="text-3xl font-bold text-violet-600 mt-2">
                {projects.length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-pink-500">
              <h2 className="text-lg font-semibold text-gray-700">Judges</h2>
              <p className="text-3xl font-bold text-pink-600 mt-2">12</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
              <h2 className="text-lg font-semibold text-gray-700">
                Registered Teams
              </h2>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {projects.length}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Recent Registrations
            </h2>
            <input
              type="text"
              placeholder="Search projects..."
              className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Recent Activity or Table */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Recent Registrations
            </h2>
            <table className="min-w-full text-sm text-left text-gray-700 bg-white shadow rounded-xl overflow-hidden">
              <thead className="bg-violet-100 text-violet-700">
                <tr>
                  <th className="px-4 py-2">Display Code</th>
                  <th className="px-4 py-2">Project Title</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Domain</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects
                  .filter(
                    (project) =>
                      project.project_title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      project.display_code
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      project.category
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      project.domain
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((project) => (
                    <tr
                      key={project.id}
                      className="border-b hover:bg-gray-50 transition-all"
                    >
                      <td className="px-4 py-2 font-medium text-violet-600">
                        {project.display_code}
                      </td>
                      <td className="px-4 py-2">{project.project_title}</td>
                      <td className="px-4 py-2">{project.category}</td>
                      <td className="px-4 py-2">{project.domain}</td>
                      <td className="px-4 py-2">
                        {new Date(project.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}

                {projects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-400">
                      No projects registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={() => setSelectedProject(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-violet-700 mb-4">
              {selectedProject.project_title}
            </h2>
            <p>
              <strong>Display Code:</strong> {selectedProject.display_code}
            </p>
            <p>
              <strong>Category:</strong> {selectedProject.category}
            </p>
            <p>
              <strong>Domain:</strong> {selectedProject.domain}
            </p>
            <p>
              <strong>Institution:</strong>{" "}
              {selectedProject.institute_name || "N/A"}
            </p>
            <ul className="list-disc list-inside ml-2 mt-1 text-sm">
              {Array.isArray(selectedProject.participants) ? (
                selectedProject.participants.map(
                  (member: { name: string; email: string; contact: string }, index: number) => (
                    <li key={index}>
                      {member.name} ({member.email}, {member.contact})
                    </li>
                  )
                )
              ) : (
                <li>N/A</li>
              )}
            </ul>
            {/* <p><strong>Description:</strong> {selectedProject.description || "N/A"}</p> */}
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedProject.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
