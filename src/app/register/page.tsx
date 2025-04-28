"use client";

import { useState, useRef } from "react";
import { parse } from "papaparse";
import { UploadCloud } from "lucide-react";
import { supabase } from "@/lib/supabase";

const steps = ["Project", "Institute", "Participants", "Review"];

const initialData = {
  group_number: "",
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      group_number,
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
      group_number &&
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
        group_number,
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
          group_number,
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
  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSubmitting(true);

      parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          if (!results.data || results.data.length === 0) {
            alert("CSV file is empty or couldn't be parsed");
            return;
          }

          let successCount = 0;
          let errorCount = 0;
          const errors: string[] = [];

          for (const [index, row] of (
            results.data as { [key: string]: string }[]
          ).entries()) {
            const rowNumber = index + 1;
            try {
              // Validate required fields with better error messages
              if (!row.project_title) {
                throw new Error("Missing project title");
              }
              if (!row.domain) {
                throw new Error("Missing domain");
              }
              if (!row.category) {
                throw new Error("Missing category");
              }

              // Validate at least one participant
              if (
                !row.participant1_name ||
                !row.participant1_email ||
                !row.participant1_contact
              ) {
                throw new Error(
                  "Missing data for Participant 1 (all fields required)"
                );
              }

              // Prepare project data with type safety
              const projectData = {
                group_number: row.group_number ? String(row.group_number) : "",
                domain: row.domain ? String(row.domain) : "",
                category: row.category ? String(row.category) : "",
                project_title: row.project_title
                  ? String(row.project_title)
                  : "",
                degree_type: row.degree_type ? String(row.degree_type) : "",
                department: row.department ? String(row.department) : "",
                institute_name: row.institute_name
                  ? String(row.institute_name)
                  : "",
                institute_address: row.institute_address
                  ? String(row.institute_address)
                  : "",
                university: row.university ? String(row.university) : "",
                participant_1_name: row.participant1_name
                  ? String(row.participant1_name)
                  : "",
                participant_1_email: row.participant1_email
                  ? String(row.participant1_email)
                  : "",
                participant_1_contact: row.participant1_contact
                  ? String(row.participant1_contact)
                  : "",
                participant_2_name: row.participant2_name
                  ? String(row.participant2_name)
                  : "",
                participant_2_email: row.participant2_email
                  ? String(row.participant2_email)
                  : "",
                participant_2_contact: row.participant2_contact
                  ? String(row.participant2_contact)
                  : "",
                participant_3_name: row.participant3_name
                  ? String(row.participant3_name)
                  : "",
                participant_4_name: row.participant4_name
                  ? String(row.participant4_name)
                  : "",

                additional_faculty: row.additional_faculty
                  ? String(row.additional_faculty)
                  : "",
                payment_utr: row.payment_utr ? String(row.payment_utr) : "",
                payment_transaction_number: row.payment_transaction_number
                  ? String(row.payment_transaction_number)
                  : "",
                transaction_date: row.payment_date
                  ? new Date(row.payment_date).toISOString().slice(0, 10)
                  : null,

                registration_sign: row.registration_sign
                  ? String(row.registration_sign)
                  : "",
                certificate_issued: row.certificate_issued
                  ? String(row.certificate_issued)
                  : "",
                status: "Pending",
              };

              // Insert project
              const { data: project, error: projectError } = await supabase
                .from("projects")
                .insert(projectData)
                .select("id")
                .single();

              if (projectError)
                throw new Error(
                  `Project insert failed: ${projectError.message}`
                );
              if (!project) throw new Error("Project insert returned no data");

              // Process participants
              const participants = [];
              for (let i = 1; i <= 4; i++) {
                const name = row[`participant${i}_name`]?.toString();
                const email = row[`participant${i}_email`]?.toString();
                const contact = row[`participant${i}_contact`]?.toString();

                if (name && email && contact) {
                  participants.push({
                    project_id: project.id,
                    name,
                    email,
                    contact,
                  });
                }
              }

              if (participants.length > 0) {
                const { error: participantsError } = await supabase
                  .from("participants")
                  .insert(participants);
                if (participantsError)
                  throw new Error(
                    `Participants insert failed: ${participantsError.message}`
                  );
              }

              successCount++;
            } catch (error) {
              errorCount++;
              const errorMsg =
                error instanceof Error ? error.message : String(error);
              errors.push(`Row ${rowNumber}: ${errorMsg}`);
              console.error(
                `Row ${rowNumber} Error:`,
                errorMsg,
                "Row Data:",
                row
              );
            }
          }

          // Show results
          if (errorCount === 0) {
            alert(`Successfully imported ${successCount} projects!`);
          } else {
            alert(
              `Import Results:\n\n` +
                `✅ Success: ${successCount}\n` +
                `❌ Failed: ${errorCount}\n\n` +
                `First 5 errors:\n${errors.slice(0, 5).join("\n")}`
            );
          }
        },
        error: (error) => {
          alert(`CSV Parse Error: ${error.message}`);
          console.error("CSV Parse Error:", error);
        },
      });
    } catch (error) {
      alert(
        `Import Failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.error("Import Error:", error);
    } finally {
      setIsSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Add this to your return statement, near the top of the form
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl space-y-6 mt-6">
      <h2 className="text-2xl font-bold text-center text-violet-600">
        Project Registration
      </h2>

      {/* Add this CSV import section */}
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition duration-300 ease-in-out text-center">
        <UploadCloud className="h-12 w-12 text-blue-500 mb-4" />
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          onChange={handleCSVImport}
          className="hidden"
          disabled={isSubmitting}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Importing..." : "Import from CSV"}
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Need a format?{" "}
          <a
            href="/sample-import.csv"
            download
            className="text-blue-600 hover:underline font-medium"
          >
            Download CSV Template
          </a>
        </p>
      </div>

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
            type="number"
            placeholder="Group Number *"
            value={formData.group_number}
            onChange={(e) => handleChange("group_number", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
            min="1"
          />
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
