"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../utils/supabaseClient";

export default function EvaluatePage() {
  const [groupCode, setGroupCode] = useState("");
  const [project, setProject] = useState<any>(null);
  const [marks, setMarks] = useState<number[]>(Array(16).fill(0));
  const [submitted, setSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const handleGroupSearch = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("display_code", groupCode)
      .single();

    if (error) {
      alert("Project not found");
      setProject(null);
    } else {
      setProject(data);
    }
  };

  const handleMarkChange = (index: number, value: number) => {
    const updatedMarks = [...marks];
    updatedMarks[index] = value;
    setMarks(updatedMarks);
  };

  const handleSubmit = async () => {
    if (!project) {
      console.warn("Missing project or session info");
      return;
    }

    const total = marks.reduce((a, b) => a + b, 0);
    console.log("Submitting evaluation with total:", total);

    // Get judge id from users table based on current session user
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .single();

    if (userError) {
      console.error("Failed to fetch user id:", userError.message);
      return;
    }

    const judgeId = userData?.id;

    if (!judgeId) {
      console.error("Judge ID is missing.");
      return;
    }

    // Insert evaluation into the database
    const { error } = await supabase.from("evaluations").insert({
      project_id: project.id,
      judge_id: judgeId,
      criteria_1a: marks[0],
      criteria_1b: marks[1],
      criteria_2a: marks[2],
      criteria_2b: marks[3],
      criteria_3a: marks[4],
      criteria_3b: marks[5],
      criteria_4a: marks[6],
      criteria_4b: marks[7],
      criteria_5a: marks[8],
      criteria_5b: marks[9],
      criteria_6a: marks[10],
      criteria_6b: marks[11],
      criteria_7a: marks[12],
      criteria_7b: marks[13],
      criteria_8a: marks[14],
      criteria_8b: marks[15],
      total,
    });

    if (error) {
      console.error("Insert error:", error);
      alert("Submission failed");
    } else {
      // Optionally update project marks and status
      const { error: updateError } = await supabase
        .from("projects")
        .update({
          marks: total,
          status: "Reviewed"
        })
        .eq("id", project.id);

      if (updateError) {
        console.error("Failed to update project:", updateError.message);
      }

      alert("Evaluation submitted!");
      setSubmitted(true);
    }
  };

  useEffect(() => {
    const name = sessionStorage.getItem('userName'); // Get the name from sessionStorage
    const userRole = sessionStorage.getItem('role');
    if (name && userRole) {
      setIsLoggedIn(true);
      setRole(userRole);
      setUserName(name); // Set the user's name here
    }
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center text-violet-700 mb-6">
        📝 Project Evaluation
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={groupCode}
          onChange={(e) => setGroupCode(e.target.value)}
          placeholder="Enter Group Display Code"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleGroupSearch}
          className="bg-violet-600 text-white px-4 py-2 rounded shadow hover:bg-violet-700"
        >
          Search
        </button>
      </div>

      {project && (
        <>
          <div className="mb-6 bg-gray-100 p-4 rounded shadow">
            <p><strong>Display Code:</strong> {project.display_code}</p>
            <p><strong>Title:</strong> {project.project_title}</p>
            <p><strong>Category:</strong> {project.category}</p>
            <p><strong>Domain:</strong> {project.domain}</p>
          </div>

          <div className="space-y-4">
            {[
              "1a. Clarity of Problem (5)",
              "1b. Social/Environmental Relevance (5)",
              "2a. Novelty (7)",
              "2b. Creativity in Approach (8)",
              "3a. Engineering Soundness (10)",
              "3b. Functionality (10)",
              "4a. Design for Use (5)",
              "4b. Completeness (5)",
              "5a. Environmental Impact (7)",
              "5b. SDG Alignment (8)",
              "6a. Commercial Potential (5)",
              "6b. Scalability (5)",
              "7a. Clarity & Structure (5)",
              "7b. Visuals/Demo (5)",
              "8a. Team Collaboration (5)",
              "8b. Research & References (5)",
            ].map((label, index) => (
              <div key={index} className="flex items-center gap-4">
                <label className="w-2/3">{label}</label>
                <input
                  type="number"
                  min={0}
                  max={parseInt(label.match(/\((\d+)\)/)?.[1] || "10")}
                  value={marks[index]}
                  onChange={(e) => handleMarkChange(index, parseInt(e.target.value))}
                  className="border p-2 rounded w-20"
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700"
            >
              Submit Evaluation
            </button>
          </div>
        </>
      )}
    </div>
  );
}
