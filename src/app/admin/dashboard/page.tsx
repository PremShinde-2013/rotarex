//

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../utils/supabaseClient";
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
} from "../../../../utils/exportHelpers";

export default function AdminDashboard() {
  const router = useRouter();
  // Removed unused userName state
  const [projects, setProjects] = useState<
    {
      id: number;
      group_number: number;
      project_title: string;
      domain: string;
      category: string;
      university: string;
      institute_name: string;
      poster_url?: string;
      participants?: { name: string }[];
      status: string;
      department: string;
      register_email: string;
      totalmarks?: number;
    }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    // Removed unused name assignment

    if (role !== "1") {
      router.push("/");
    } else {
      // Removed unused setUserName call
    }
  }, [router]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projects").select("*");
      if (!error && data) setProjects(data);
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.group_number.toString().includes(searchTerm) ||
      project.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleExport = (format: string) => {
    const simplifiedData = filteredProjects.map((project) => ({
      group_number: project.group_number,
      project_title: project.project_title,
      domain: project.domain,
      category: project.category,
      university: project.university,
      institute_name: project.institute_name,
      participants: project.participants?.map((p) => p.name).join(", ") || "-",
      status: project.status,
      project_email: project.register_email,
      totalmarks: project.totalmarks ?? "-",
    }));

    switch (format) {
      case "csv":
        exportToCSV(simplifiedData, "evaluation_data");
        break;
      case "excel":
        exportToExcel(simplifiedData, "evaluation_data");
        break;
      case "pdf":
        exportToPDF(filteredProjects, "evaluation_data");
        break;
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 px-6">
      {/* <h1 className="text-4xl font-bold text-violet-700 mb-2">
        Admin Dashboard
      </h1>
      <p className="text-lg text-gray-700 mb-6">Welcome, {userName}!</p> */}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-violet-100 p-4 rounded-2xl shadow text-center">
          <h2 className="text-lg font-bold text-violet-700">Total Projects</h2>
          <p className="text-2xl font-semibold">{projects.length}</p>
        </div>
        <div className="bg-pink-100 p-4 rounded-2xl shadow text-center">
          <h2 className="text-lg font-bold text-pink-700">Reviewed Projects</h2>
          <p className="text-2xl font-semibold">
            {projects.filter((p) => p.status === "Reviewed").length}
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded-2xl shadow text-center">
          <h2 className="text-lg font-bold text-green-700">Pending Projects</h2>
          <p className="text-2xl font-semibold">
            {projects.filter((p) => p.status !== "Reviewed").length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          className="bg-white border border-gray-200 p-6 rounded-2xl shadow hover:shadow-lg hover:bg-violet-50 cursor-pointer transition"
          onClick={() => router.push("/admin/leaderboard")}
        >
          <h2 className="text-xl font-bold text-violet-700 mb-2">Leadership</h2>
          <p className="text-gray-600">
            View and manage overall project leadership data.
          </p>
        </div>

        <div
          className="bg-white border border-gray-200 p-6 rounded-2xl shadow hover:shadow-lg hover:bg-pink-50 cursor-pointer transition"
          onClick={() => router.push("/admin/domain-leaderboard")}
        >
          <h2 className="text-xl font-bold text-pink-700 mb-2">
            Leadership by Domain
          </h2>
          <p className="text-gray-600">
            Analyze leadership scores categorized by domain.
          </p>
        </div>

        <div
          className="bg-white border border-gray-200 p-6 rounded-2xl shadow hover:shadow-lg hover:bg-green-50 cursor-pointer transition"
          onClick={() => router.push("/admin/evaluation-table")}
        >
          <h2 className="text-xl font-bold text-green-700 mb-2">
            Evaluation Table
          </h2>
          <p className="text-gray-600">
            View detailed evaluations given by judges to each project.
          </p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by group number, title, or domain..."
        className="w-full p-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-violet-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex justify-end mb-4 gap-4">
        <select
          className="p-2 border border-gray-300 rounded-xl focus:ring-violet-500"
          onChange={(e) => handleExport(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select export format
          </option>
          <option value="csv">Export as CSV</option>
          <option value="excel">Export as Excel</option>
          <option value="pdf">Export as PDF</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 shadow-sm rounded-xl">
          <thead className="bg-violet-100 text-violet-800">
            <tr>
              <th className="px-4 py-3 text-left">Group No.</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Domain</th>
              <th className="px-4 py-3 text-left">Category</th>
              {/* <th className="px-4 py-3 text-left">University</th> */}
              <th className="px-4 py-3 text-left">Institute</th>
              {/* <th className="px-4 py-3 text-left">Poster</th> */}
              <th className="px-4 py-3 text-left">Department</th>
              {/* <th className="px-4 py-3 text-left">Status</th> */}
              <th className="px-4 py-3 text-left">Total Marks</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProjects.map((project) => (
              <tr key={project.id}>
                <td className="px-4 py-3">{project.group_number}</td>

                <td className="px-4 py-3">{project.register_email}</td>

                <td className="px-4 py-3">{project.project_title}</td>
                <td className="px-4 py-3">{project.domain}</td>
                <td className="px-4 py-3">{project.category}</td>
                {/* <td className="px-4 py-3">{project.university}</td> */}
                <td className="px-4 py-3">{project.institute_name}</td>
                {/* <td className="px-4 py-3">
                  {project.poster_url ? (
                    <img src={project.poster_url} alt="Poster" className="h-12 rounded shadow" />
                  ) : (
                    '-' 
                  )}
                </td> */}
                <td className="px-4 py-3">{project.department}</td>
                {/* <td className="px-4 py-3">{project.status}</td> */}
                <td className="px-4 py-3">{project.totalmarks ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
