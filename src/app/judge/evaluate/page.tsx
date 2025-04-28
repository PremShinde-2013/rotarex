"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../utils/supabaseClient";
import toast from "react-hot-toast";

type Project = {
  id: string;
  group_number: number;
  project_title: string;
  category: "Mini Project" | "Major Project"; // assuming category is this
  department: string;
  domain: string;
  status: string;
  totalmarks?: number;
};

export default function EvaluateProject() {
  const router = useRouter();
  const [groupNumber, setGroupNumber] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [domain, setDomain] = useState("");
  const [judgeId, setJudgeId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [marks, setMarks] = useState<{ [key: string]: string; }>({});
  const [totalScore, setTotalScore] = useState(0);
  const [showScoreCard, setShowScoreCard] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    const email = sessionStorage.getItem("userEmail");

    if (role !== "0") {
      router.push("/");
    } else {
      fetchJudge(email);
    }
  }, [router]);

  const fetchJudge = async (email: string | null) => {
    if (!email) return;
    const { data, error } = await supabase
      .from("users")
      .select("id, domain")
      .eq("email", email)
      .single();

    if (!error && data) {
      setDomain(data.domain);
      setJudgeId(data.id);
    }
  };

  const handleSearch = async () => {
    setError("");
    setProject(null);

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("group_number", Number(groupNumber))
      .eq("domain", domain)
      .single();

    if (error || !data) {
      setError("No project found with this group number in your domain.");
      return;
    }

    if (data.status === "Reviewed") {
      setError("This project has already been reviewed!");
      return;
    }

    setProject(data as Project);
    resetMarks(data.category);
  };

  const resetMarks = (category: "Mini Project" | "Major Project") => {
    const fields = category === "Major Project" ? majorFields : miniFields;
    const initialMarks: { [key: string]: string; } = {};
    fields.forEach((field) => {
      initialMarks[field.name] = "";
    });
    setMarks(initialMarks);
  };

  const isFormComplete = Object.values(marks).every(
    (val) =>
      val !== "" && !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 10
  );

  const handleSubmit = async () => {
    if (!project) return;
    if (!isFormComplete) {
      toast.error("Please fill all marks between 0-10.");
      return;
    }

    setLoading(true);
    const total = Object.values(marks).reduce(
      (sum, val) => sum + Number(val),
      0
    );
    setTotalScore(total);
    setShowScoreCard(true);

    setTimeout(() => {
      setShowScoreCard(false);
    }, 5000);

    const { error } = await supabase.from("evaluations").insert([
      {
        project_id: project.id,
        judge_id: judgeId,
        ...Object.fromEntries(
          Object.entries(marks).map(([k, v]) => [k, Number(v)])
        ),
      },
    ]);

    if (error) {
      toast.error("Failed to submit evaluation");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        totalmarks: total,
        status: "Reviewed",
      })
      .eq("id", project.id);

    if (updateError) {
      toast.error("Evaluation saved but failed to update project status");
    } else {
      toast.success("Evaluation submitted successfully!");
      setProject(null);
      setGroupNumber("");
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMarks((prev) => ({ ...prev, [name]: value }));
  };

  // 🔥 Mini Project Evaluation Fields
  const miniFields = [
    { name: "scope_of_the_work", label: "Scope of the Work (/5)" },
    { name: "application", label: "Application (/5)" },
    { name: "achieved_results", label: "Achieved Results (/5)" },
    { name: "knowledge_of_the_work", label: "Knowledge of the Work (/5)" },
    { name: "presentation_skills", label: "Presentation Skills (/5)" },
    { name: "literature_review", label: "Literature Review (/5)" },
    { name: "teamwork", label: "Teamwork (/5)" },
    { name: "design_methodology", label: "Design Methodology (/5)" },
    { name: "aesthetic_and_ergonomics", label: "Aesthetic and Ergonomics (/5)" },
    { name: "initiative_and_creativity", label: "Initiative and Creativity (/5)" },
  ];

  // 🔥 Major Project Evaluation Fields
  const majorFields = [
    { name: "problem_identification_relevance", label: "Problem Identification & Relevance (/5)" },
    { name: "technical_knowledge", label: "Technical Knowledge (/5)" },
    { name: "literature_review", label: "Literature Review (/5)" },
    { name: "aesthetics_ergonomics", label: "Aesthetics / Ergonomics (/5)" },
    { name: "results_outcome", label: "Results & Outcome (/5)" },
    { name: "cost_effectiveness", label: "Cost Effectiveness (/5)" },
    { name: "innovation_product_design", label: "Innovation and Product Design (/5)" },
    { name: "sustainability_impact", label: "Sustainability Impact (/5)" },
    { name: "market_scalability", label: "Market Scalability (/5)" },
    { name: "ipr_publications", label: "IPR / Publications (/5)" },
  ];


  const renderFields = () => {
    if (!project) return null;
    const fields = project.category === "Major Project" ? majorFields : miniFields;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              type="number"
              name={field.name}
              value={marks[field.name] || ""}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
              min="0"
              max="10"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto mt-20 px-6 h-full">
      <h1 className="text-3xl font-bold text-violet-700 mb-6">
        Evaluate Project
      </h1>

      <div className="flex gap-4 items-center mb-6">
        <input
          type="number"
          placeholder="Enter Group Number"
          className="px-4 py-3 border rounded-lg w-full focus:ring-2 focus:ring-violet-500"
          value={groupNumber}
          onChange={(e) => setGroupNumber(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-violet-600 text-white px-5 py-3 rounded-lg hover:bg-violet-700 font-semibold"
        >
          Search
        </button>
      </div>

      {error && (
        <p className="text-red-600 bg-red-100 p-2 rounded-lg font-medium mb-4">
          {error}
        </p>
      )}

      {project && (
        <>
          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mb-6">
            <h2 className="text-2xl font-semibold text-violet-700">
              {project.project_title}
            </h2>
            <p><strong>Group No:</strong> {project.group_number}</p>
            <p><strong>Category:</strong> {project.category}</p>
            <p><strong>Department:</strong> {project.department}</p>
            <p><strong>Status:</strong> {project.status}</p>
          </div>

          <div className="bg-white shadow p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              {project.category} Evaluation Form
            </h3>

            {renderFields()}

            <button
              onClick={handleSubmit}
              disabled={!isFormComplete || loading}
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold w-full"
            >
              {loading ? "Submitting..." : "Submit Evaluation"}
            </button>

            {showScoreCard && (
              <p className="mt-4 text-lg text-center font-bold text-violet-700">
                Total Score: {totalScore}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
