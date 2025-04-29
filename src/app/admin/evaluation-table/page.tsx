'use client';
import { useEffect, useState } from "react";
import { supabase } from "../../../../utils/supabaseClient";
import { useRouter } from "next/navigation";
import React from "react";

interface Project {
  group_number: string;
  project_title: string;
  status: string;
  domain?: string;
  department?: string;
}

interface Judge {
  name: string;
}

interface Evaluation {
  id: number;
  project?: Project;
  judge?: Judge;
  status: string;
  [key: string]: number | string | Project | Judge | undefined;
}

export default function EvaluationTable() {
  const router = useRouter();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedEvaluation, setSelectedEvaluation] =
    useState<Evaluation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role !== "1") {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      const { data, error } = await supabase.from("evaluations").select(`
        *,
        project:project_id (
          group_number,
          project_title,
          status,
          domain,
          department
        ),
        judge:judge_id ( name )
      `);

      if (!error && data) {
        setEvaluations(data as Evaluation[]);
      }
    };

    fetchEvaluations();
  }, []);

  const handleViewDetails = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
  };

  const handleCloseDetails = () => {
    setSelectedEvaluation(null);
  };

  const calculateTotalMarks = (evaluation: Evaluation) => {
    const fields = [
      "problem_identification_relevance",
      "technical_knowledge",
      "literature_review",
      "aesthetics_ergonomics",
      "results_outcome",
      "cost_effectiveness",
      "innovation_product_design",
      "sustainability_impact",
      "market_scalability",
      "ipr_publications",
      "scope_of_work",
      "application",
      "achieved_results",
      "knowledge_of_work",
      "presentation_skills",
      "mini_literature_review",
      "teamwork",
      "design_methodology",
      "mini_aesthetics_ergonomics",
      "initiative_creativity",
    ];
    return fields.reduce((sum, field) => {
      const value = evaluation[field];
      return sum + (typeof value === "number" ? value : 0);
    }, 0);
  };

  const filteredEvaluations = evaluations.filter((evaluation) => {
    const groupNumber = evaluation.project?.group_number?.toString() || "";
    const projectTitle = evaluation.project?.project_title?.toLowerCase() || "";
    const domain = evaluation.project?.domain?.toLowerCase() || "";
    const department = evaluation.project?.department?.toLowerCase() || "";

    const term = searchTerm.toLowerCase();
    return (
      groupNumber.includes(term) ||
      projectTitle.includes(term) ||
      domain.includes(term) ||
      department.includes(term)
    );
  });

  // Group evaluations by project title
  const groupedEvaluations = filteredEvaluations.reduce((groups, evaluation) => {
    const title = evaluation.project?.project_title || "Untitled";
    if (!groups[title]) {
      groups[title] = [];
    }
    groups[title].push(evaluation);
    return groups;
  }, {} as Record<string, Evaluation[]>);

  return (
    <div className="max-w-7xl mx-auto mt-20 px-6">
      <h1 className="text-4xl font-bold text-violet-700 mb-6">
        Evaluation Table
      </h1>

      <input
        type="text"
        placeholder="Search by Group No., Title, Domain, Department"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 px-4 py-2 border border-gray-300 rounded-lg w-full max-w-md"
      />

      <div className="overflow-x-auto shadow border rounded-2xl">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-violet-100 text-violet-800">
            <tr>
              <th className="px-6 py-4 text-left">Project Title</th>
              <th className="px-6 py-4 text-left">Group No.</th>
              <th className="px-6 py-4 text-left">Judge Name</th>
              <th className="px-6 py-4 text-left">Total Marks</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(groupedEvaluations).map(([projectTitle, evaluations]) => (
              <React.Fragment key={projectTitle}>
                <tr>
                  <td colSpan={6} className="bg-violet-100 text-violet-700 px-6 py-4 font-semibold">
                    {projectTitle}
                  </td>
                </tr>
                {evaluations.map((evalItem) => (
                  <tr key={evalItem.id}>
                    <td className="px-6 py-4">
                      {evalItem.project?.project_title || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {evalItem.project?.group_number || "-"}
                    </td>
                    <td className="px-6 py-4">{evalItem.judge?.name || "-"}</td>
                    <td className="px-6 py-4">{calculateTotalMarks(evalItem)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${evalItem.project?.status === "Reviewed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {evalItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-violet-600 hover:underline font-semibold"
                        onClick={() => handleViewDetails(evalItem)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {filteredEvaluations.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            No evaluations found.
          </p>
        )}
      </div>

      {/* Details Modal */}
      {selectedEvaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-violet-700 mb-4">
              Evaluation Details
            </h2>
            <p className="mb-4 p-2 rounded-lg bg-violet-400 text-white">
              Total Marks: {calculateTotalMarks(selectedEvaluation)}
            </p>

            <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              {Object.entries(selectedEvaluation).map(([key, value]) => {
                if (
                  [
                    "id",
                    "project_id",
                    "judge_id",
                    "created_at",
                    "project",
                    "judge",
                    "status",
                  ].includes(key)
                )
                  return null;

                return (
                  <div key={key} className="flex justify-between">
                    <span className="font-semibold text-gray-700 capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-gray-900">
                      {value !== null && value !== undefined
                        ? String(value)
                        : "-"}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleCloseDetails}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
