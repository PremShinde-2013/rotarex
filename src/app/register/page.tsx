"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const steps = ["Project", "Institute", "Participants", "Review"];

const initialData = {
  project_title: "",
  domain: "",
  category: "",
  degree_type: "",
  department: "",
  institute_name: "",
  institute_address: "",
  university: "",
  participants: [
    { name: "", email: "", contact: "" },
    { name: "", email: "", contact: "" },
    { name: "", email: "", contact: "" },
    { name: "", email: "", contact: "" },
  ],
};

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    field: keyof typeof initialData,
    value: string | { name: string; email: string; contact: string }[]
  ) => {
    setFormData((prev: typeof initialData) => ({ ...prev, [field]: value }));
  };

  const handleParticipantChange = (
    index: number,
    field: keyof (typeof initialData.participants)[0],
    value: string
  ) => {
    const updated = [...formData.participants];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, participants: updated }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const isFormComplete = () => {
    const {
      project_title,
      domain,
      category,
      degree_type,
      department,
      institute_name,
      institute_address,
      university,
      participants,
    } = formData;

    const firstParticipant = participants[0];

    return (
      project_title.trim() &&
      domain &&
      category &&
      degree_type &&
      department.trim() &&
      institute_name.trim() &&
      institute_address.trim() &&
      university.trim() &&
      firstParticipant.name.trim() &&
      firstParticipant.email.trim() &&
      firstParticipant.contact.trim()
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const {
        project_title,
        domain,
        category,
        degree_type,
        department,
        institute_name,
        institute_address,
        university,
        participants,
      } = formData;

      // Ensure at least one participant is filled
      if (
        !participants[0].name ||
        !participants[0].email ||
        !participants[0].contact
      ) {
        alert("Participant 1 is required.");
        setIsSubmitting(false);
        return;
      }

      // 1. First, insert the project to get its ID
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .insert({
          project_title,
          domain,
          category,
          degree_type,
          department,
          institute_name,
          institute_address,
          university,
          participants: participants.filter(
            (p) => p.name && p.email && p.contact
          ),
        })
        .select("id");

      console.log("Project insert response:", { projectData, projectError });

      if (projectError) {
        console.error("Project Insert Error:", projectError);
        alert("Something went wrong while saving the project.");
        setIsSubmitting(false);
        return;
      }

      // Extract the new project ID
      const projectId = projectData[0].id;

      // 2. Insert participants with reference to the project
      const validParticipants = participants.filter(
        (p) => p.name && p.email && p.contact
      );

      if (validParticipants.length > 0) {
        // Prepare participants data for insertion with project_id
        const participantsToInsert = validParticipants.map((p) => ({
          project_id: projectId,
          name: p.name,
          email: p.email,
          contact: p.contact,
        }));

        const { error: participantsError } = await supabase
          .from("participants")
          .insert(participantsToInsert);

        if (participantsError) {
          console.error("Participants Insert Error:", participantsError);
          alert("Project saved but there was an issue saving participants.");
          setIsSubmitting(false);
          return;
        }
      }

      alert("Project registered successfully!");
      setFormData(initialData);
      setStep(0);
    } catch (error) {
      console.error("Submission Error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl space-y-6">
      <h2 className="text-2xl font-bold text-center text-violet-600">
        Project Registration
      </h2>

      {/* STEP INDICATOR */}
      <div className="flex justify-between text-sm font-medium mb-4">
        {steps.map((label, i) => (
          <div
            key={i}
            className={`flex-1 text-center py-2 rounded ${
              i === step ? "bg-pink-200 text-violet-800" : "bg-gray-100"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* STEP 1: Project Details */}
      {step === 0 && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Project Title *"
            value={formData.project_title}
            onChange={(e) => handleChange("project_title", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <select
            value={formData.domain}
            onChange={(e) => handleChange("domain", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Domain *</option>
            <option>Manufacturing</option>
            <option>Health & Hygiene</option>
            <option>Agriculture</option>
            <option>Energy</option>
            <option>Infrastructure</option>
            <option>Sustainable Solutions</option>
            <option>Climate and Waste Management</option>
            <option>Other</option>
          </select>
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Category *</option>
            <option>Major Project</option>
            <option>Mini Project</option>
          </select>
          <select
            value={formData.degree_type}
            onChange={(e) => handleChange("degree_type", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Degree/Diploma *</option>
            <option>Degree</option>
            <option>Diploma</option>
          </select>
        </div>
      )}

      {/* STEP 2: Institute Details */}
      {step === 1 && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Department *"
            value={formData.department}
            onChange={(e) => handleChange("department", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Institute Name *"
            value={formData.institute_name}
            onChange={(e) => handleChange("institute_name", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Institute Address *"
            value={formData.institute_address}
            onChange={(e) => handleChange("institute_address", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="University *"
            value={formData.university}
            onChange={(e) => handleChange("university", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
      )}

      {/* STEP 3: Participants */}
      {step === 2 && (
        <div className="space-y-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-b pb-4">
              <h4 className="font-semibold text-violet-700">
                Participant {i + 1} {i === 0 && "* Required"}
              </h4>
              <input
                type="text"
                placeholder="Name"
                value={formData.participants[i].name}
                onChange={(e) =>
                  handleParticipantChange(i, "name", e.target.value)
                }
                className="w-full border px-3 py-2 rounded mt-2"
                required={i === 0}
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.participants[i].email}
                onChange={(e) =>
                  handleParticipantChange(i, "email", e.target.value)
                }
                className="w-full border px-3 py-2 rounded mt-2"
                required={i === 0}
              />
              <input
                type="tel"
                placeholder="Contact Number"
                value={formData.participants[i].contact}
                onChange={(e) =>
                  handleParticipantChange(i, "contact", e.target.value)
                }
                className="w-full border px-3 py-2 rounded mt-2"
                required={i === 0}
              />
            </div>
          ))}
        </div>
      )}

      {/* STEP 4: Review & Submit */}
      {step === 3 && (
        <div className="space-y-4 text-sm">
          <div>
            <strong>Project Title:</strong> {formData.project_title}
          </div>
          <div>
            <strong>Domain:</strong> {formData.domain} |{" "}
            <strong>Category:</strong> {formData.category}
          </div>
          <div>
            <strong>Degree Type:</strong> {formData.degree_type}
          </div>
          <div>
            <strong>Institute:</strong> {formData.institute_name},{" "}
            {formData.department}, {formData.institute_address}
          </div>
          <div>
            <strong>University:</strong> {formData.university}
          </div>
          <div>
            <strong>Participants:</strong>
            <ul className="list-disc list-inside">
              {formData.participants.map(
                (p, i) =>
                  p.name && (
                    <li key={i}>
                      {p.name} ({p.email}, {p.contact})
                    </li>
                  )
              )}
            </ul>
          </div>
        </div>
      )}

      {/* NAVIGATION BUTTONS */}
      <div className="flex justify-between pt-6">
        <button
          onClick={handleBack}
          disabled={step === 0 || isSubmitting}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Back
        </button>
        {step < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="bg-violet-600 text-white px-6 py-2 rounded hover:bg-pink-600"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormComplete()}
            className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-violet-700 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}
