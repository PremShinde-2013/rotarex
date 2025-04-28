"use client";

import { useState, useRef } from "react";
import { parse } from "papaparse";
import { UploadCloud } from "lucide-react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
// import { group } from "console";
// import { register } from "module";

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
  participant_1_name: "",
  participant_1_email: "",
  participant_1_contact: "",
  participant_2_name: "",
  participant_2_email: "",
  participant_2_contact: "",
  participant_3_name: "",
  participant_4_name: "",
  additional_facilities: "",
  payment_utr: "",
  payment_transaction_number: "",
  transaction_date: "",
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

  // Removed unused handleParticipantChange function to resolve the error.

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
      participant_1_name,
      participant_1_email,
      participant_1_contact,
      participant_2_name,
      participant_2_email,
      participant_2_contact,
      participant_3_name,
      participant_4_name,
      additional_facilities,
      payment_utr,
      payment_transaction_number,
      transaction_date,

      // participants,
    } = formData;

    // const firstParticipant = participants[0];

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
      participant_1_name.trim() &&
      participant_1_email.trim() &&
      participant_1_contact.trim() &&
      participant_2_name.trim() &&
      participant_2_email.trim() &&
      participant_2_contact.trim() &&
      participant_3_name.trim() &&
      participant_4_name.trim() &&
      additional_facilities.trim() &&
      payment_utr.trim() &&
      payment_transaction_number.trim() &&
      transaction_date
      // firstParticipant.name.trim() &&
      // firstParticipant.email.trim() &&
      // firstParticipant.contact.trim()
    );
  };

  const handleSubmit = async () => {
    if (!isFormComplete()) {
      alert("Please complete all required fields before submitting.");
      return;
    }
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
        // participants,
        participant_1_name,
        participant_1_email,
        participant_1_contact,
        participant_2_name,
        participant_2_email,
        participant_2_contact,
        participant_3_name,
        participant_4_name,
        additional_facilities,
        payment_utr,
        payment_transaction_number,
        transaction_date,
      } = formData;

      // Ensure at least one participant is filled
      // if (
      //   !participants[0].name ||
      //   !participants[0].email ||
      //   !participants[0].contact
      // ) {
      //   alert("Participant 1 is required.");
      //   setIsSubmitting(false);
      //   return;
      // }

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
          participant_1_name,
          participant_1_email,
          participant_1_contact,
          participant_2_name,
          participant_2_email,
          participant_2_contact,
          participant_3_name,
          participant_4_name,
          additional_facilities,
          payment_utr,
          payment_transaction_number,
          transaction_date,
          // participants: participants.filter(
          //   (p) => p.name && p.email && p.contact
          // ),
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
      // const projectId = projectData[0].id;

      // // 2. Insert participants with reference to the project
      // const validParticipants = participants.filter(
      //   (p) => p.name && p.email && p.contact
      // );

      // if (validParticipants.length > 0) {
      //   // Prepare participants data for insertion with project_id
      //   const participantsToInsert = validParticipants.map((p) => ({
      //     project_id: projectId,
      //     name: p.name,
      //     email: p.email,
      //     contact: p.contact,
      //   }));

      //   const { error: participantsError } = await supabase
      //     .from("participants")
      //     .insert(participantsToInsert);

      //   if (participantsError) {
      //     console.error("Participants Insert Error:", participantsError);
      //     alert("Project saved but there was an issue saving participants.");
      //     setIsSubmitting(false);
      //     return;
      //   }
      // }

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

  // import { parse } from "papaparse";
  // import * as XLSX from "xlsx";
  
  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      setIsSubmitting(true);
  
      const extension = file.name.split(".").pop()?.toLowerCase();
      let parsedData: { [key: string]: string }[] = [];
  
      if (extension === "csv") {
        // Parse CSV
        await new Promise<void>((resolve, reject) => {
          parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              if (!results.data || results.data.length === 0) {
                reject(new Error("CSV file is empty or couldn't be parsed"));
              } else {
                parsedData = results.data as { [key: string]: string }[];
                resolve();
              }
            },
            error: (error) => {
              reject(new Error(`CSV Parse Error: ${error.message}`));
            },
          });
        });
      } else if (extension === "xlsx" || extension === "xlsm") {
        // Parse Excel
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
  
        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const sheetData = XLSX.utils.sheet_to_json(worksheet, {
            defval: "",
            blankrows: false,
          }) as { [key: string]: string }[];
          parsedData.push(...sheetData);
        }
  
        if (parsedData.length === 0) {
          throw new Error("Excel file is empty or couldn't be parsed");
        }
      } else {
        alert("Unsupported file type. Please upload a CSV or XLSM/XLSX file.");
        return;
      }
  
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];
  
      for (const [index, row] of parsedData.entries()) {
        const rowNumber = index + 1;
  
        try {
          // Skip empty rows
          if (!row || Object.keys(row).length === 0) continue;
  
          // Basic required fields
          if (!row["Title of Project"]?.trim()) throw new Error("Missing project title");
          if (!row["Domain of the Project"]?.trim()) throw new Error("Missing domain");
          if (!row["Category-Major Project"]?.trim()) throw new Error("Missing category");
  
          if (
            !row["Participant 1: Name"]?.trim() ||
            !row["Participant 1: Email-id"]?.trim() ||
            !row["Participant 1: Contact No."]?.trim()
          ) {
            throw new Error("Missing data for Participant 1 (all fields required)");
          }
  
          const projectData = {
            group_number: row["Project Id"]?.trim() || "",
            register_email: row["Email Id"]?.trim() || "",
            domain: row["Domain of the Project"]?.trim() || "",
            category: row["Category-Major Project"]?.trim() || "",
            project_title: row["Title of Project"]?.trim() || "",
            degree_type: row["Degree/Diploma"]?.trim() || "",
            department: row["Name of Department"]?.trim() || "",
            institute_name: row["Name of the Institute"]?.trim() || "",
            institute_address: row["Address of the Institute"]?.trim() || "",
            university: row["Affiliated University"]?.trim() || "",
            participant_1_name: row["Participant 1: Name"]?.trim() || "",
            participant_1_email: row["Participant 1: Email-id"]?.trim() || "",
            participant_1_contact: row["Participant 1: Contact No."]?.trim() || "",
            participant_2_name: row["Participant 2:  Name"]?.trim() || "",
            participant_2_email: row["Participant 2: Email-id "]?.trim() || "", // Note the extra space after 'id '
            participant_2_contact: row["Participant 2: Contact No."]?.trim() || "",
            participant_3_name: row["Participant 3: Name"]?.trim() || "",
            participant_4_name: row["Participant 4:  Name"]?.trim() || "",
            additional_facilities: row["Additional Technical Facilities (If required any)"]?.trim() || "",
            payment_utr: row["Payment details: UTR."]?.trim() || "",
            payment_transaction_number: row["Payment details: Transaction No."]?.trim() || "",
            transaction_date: row["Payment details: Date of Transaction"]
              ? new Date(row["Payment details: Date of Transaction"]).toISOString().slice(0, 10)
              : null,
            registration_sign: row["Registration sign"]?.trim() || "",
            certificate_issued: row["Certificate Issued Sign"]?.trim() || "",
            status: "Pending",
          };
  
          // Insert Project
          const { data: project, error: projectError } = await supabase
            .from("projects")
            .insert(projectData)
            .select("id")
            .single();
  
          if (projectError) throw new Error(`Project insert failed: ${projectError.message}`);
          if (!project) throw new Error("Project insert returned no data");
  
         
  
          
  
          successCount++;
        } catch (error) {
          errorCount++;
          const errorMsg = error instanceof Error ? error.message : String(error);
          errors.push(`Row ${rowNumber}: ${errorMsg}`);
          console.error(`Row ${rowNumber} Error:`, errorMsg, "Row Data:", row);
        }
      }
  
      // Final Result
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
    } catch (error) {
      alert(
        `Import Failed: ${error instanceof Error ? error.message : "Unknown error"}`
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
          accept=".csv, .xlsm, .xlsx"
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
            type="text"
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
            <option>1. Manufacturing</option>
            <option>2. Health & Hygiene</option>
            <option>3. Agriculture</option>
            <option>4. Energy</option>
            <option>5. Infrastructure</option>
            <option>6. Sustainable Solutions</option>
            <option>7.Climate and Waste Management</option>
            <option>8. Other related with theme</option>
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

          <input
            type="text"
            placeholder="Additional Facilities *"
            value={formData.additional_facilities}
            onChange={(e) =>
              handleChange("additional_facilities", e.target.value)
            }
            className="w-full border px-3 py-2 rounded"
            required
            min="1"
          />

          <input
            type="text"
            placeholder="Payment UTR *"
            value={formData.payment_utr}
            onChange={(e) => handleChange("payment_utr", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Payment Transaction Number *"
            value={formData.payment_transaction_number}
            onChange={(e) =>
              handleChange("payment_transaction_number", e.target.value)
            }
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="date"
            placeholder="Transaction Date *"
            value={formData.transaction_date}
            onChange={(e) => handleChange("transaction_date", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
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
          {/* {[0, 1, 2, 3].map((i) => (
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
          ))} */}

          <input
            type="text"
            placeholder="Participant 1 Name *"
            value={formData.participant_1_name}
            onChange={(e) => handleChange("participant_1_name", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Participant 1 Email *"
            value={formData.participant_1_email}
            onChange={(e) =>
              handleChange("participant_1_email", e.target.value)
            }
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Participant 1 Contact *"
            value={formData.participant_1_contact}
            onChange={(e) =>
              handleChange("participant_1_contact", e.target.value)
            }
            className="w-full border px-3 py-2 rounded"
            required
          />
          {/* Line */}

          <input
            type="text"
            placeholder="Participant 2 Name *"
            value={formData.participant_2_name}
            onChange={(e) => handleChange("participant_2_name", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Participant 2 Email *"
            value={formData.participant_2_email}
            onChange={(e) =>
              handleChange("participant_2_email", e.target.value)
            }
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Participant 2 Contact *"
            value={formData.participant_2_contact}
            onChange={(e) =>
              handleChange("participant_2_contact", e.target.value)
            }
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Participant 3 Name *"
            value={formData.participant_3_name}
            onChange={(e) => handleChange("participant_3_name", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Participant 4 Name *"
            value={formData.participant_4_name}
            onChange={(e) => handleChange("participant_4_name", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
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
            <strong>Participants:</strong> {formData.participant_1_name},{" "}
            {formData.participant_2_name}, {formData.participant_3_name},{" "}
            {formData.participant_4_name}
          </div>
          <div>
            <strong>Payment UTR:</strong> {formData.payment_utr}
          </div>
          <div>
            <strong>Transaction Number:</strong>{" "}
            {formData.payment_transaction_number}
          </div>
          <div>
            <strong>Transaction Date:</strong> {formData.transaction_date}
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
            // disabled={isSubmitting || !isFormComplete()}
            className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-violet-700 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}
