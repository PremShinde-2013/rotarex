'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../utils/supabaseClient';
import toast from 'react-hot-toast';

export default function EvaluateProject() {
  const router = useRouter();
  const [groupNumber, setGroupNumber] = useState('');
  const [project, setProject] = useState<any>(null);
  const [domain, setDomain] = useState('');
  const [judgeId, setJudgeId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState({
    clarity_of_problem: '',
    social_relevance: '',
    novelty: '',
    creativity: '',
    technical_feasibility: '',
    functionality: '',
    design_for_use: '',
    completeness: '',
    environmental_impact: '',
    sdg_alignment: '',
    commercial_potential: '',
    scalability: '',
    clarity_and_structure: '',
    visuals_demo: '',
    teamwork: '',
    research: '',
  });

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    const email = sessionStorage.getItem('userEmail');

    if (role !== '0') {
      router.push('/');
    } else {
      fetchJudge(email);
    }
  }, [router]);

  const fetchJudge = async (email: string | null) => {
    if (!email) return;
    const { data, error } = await supabase
      .from('users')
      .select('id, domain')
      .eq('email', email)
      .single();

    if (!error && data) {
      setDomain(data.domain);
      setJudgeId(data.id);
    }
  };

  const handleSearch = async () => {
    setError('');
    setProject(null);

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('group_number', Number(groupNumber))
      .eq('domain', domain)
      .single();

    if (error || !data) {
      setError('No project found with this group number in your domain.');
      return;
    }

    setProject(data);
  };

  const isFormComplete = Object.values(marks).every(val => val !== '' && !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 10);

  const handleSubmit = async () => {
    setLoading(true);
    const total = Object.values(marks).reduce((sum, val) => sum + Number(val), 0);

    const { error } = await supabase.from('evaluations').insert([
      {
        project_id: project.id,
        judge_id: judgeId,
        ...Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, Number(v)])),
      },
    ]);

    if (error) {
      toast.error('Failed to submit evaluation');
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('projects')
      .update({
        totalmarks: total,
        status: 'Reviewed',
      })
      .eq('id', project.id);

    if (updateError) {
      toast.error('Evaluation saved but failed to update project status');
    } else {
      toast.success('Evaluation submitted successfully!');
      setProject(null);
      setGroupNumber('');
      resetMarks();
    }

    setLoading(false);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setMarks({ ...marks, [name]: value });
  };

  const resetMarks = () => {
    setMarks({
      clarity_of_problem: '',
      social_relevance: '',
      novelty: '',
      creativity: '',
      technical_feasibility: '',
      functionality: '',
      design_for_use: '',
      completeness: '',
      environmental_impact: '',
      sdg_alignment: '',
      commercial_potential: '',
      scalability: '',
      clarity_and_structure: '',
      visuals_demo: '',
      teamwork: '',
      research: '',
    });
  };

  const evaluationCriteria = [
    {
      section: "1. Problem Identification & Relevance (10 marks)",
      fields: [
        { name: "clarity_of_problem", label: "Clarity of Problem: Is the problem clearly defined and aligned with sustainability and domain relevance? (/5)" },
        { name: "social_relevance", label: "Social/Environmental Relevance: Does it address a real, pressing issue in society or the environment? (/5)" },
      ],
    },
    {
      section: "2. Innovation & Uniqueness (15 marks)",
      fields: [
        { name: "novelty", label: "Novelty: Is the idea original or a significant improvement on existing solutions? (/7)" },
        { name: "creativity", label: "Creativity in Approach: Does it use creative engineering or cross-domain thinking? (/8)" },
      ],
    },
    {
      section: "3. Technical Feasibility & Functionality (20 marks)",
      fields: [
        { name: "technical_feasibility", label: "Engineering Soundness: Is the design technically feasible and robust? (/10)" },
        { name: "functionality", label: "Functionality: Does the prototype or model perform the intended functions reliably? (/10)" },
      ],
    },
    {
      section: "4. Product Design & Usability (10 marks)",
      fields: [
        { name: "design_for_use", label: "Design for Use: Is the product user-friendly, ergonomic, and safe to use? (/5)" },
        { name: "completeness", label: "Completeness: Quality and completeness of the prototype or model (/5)" },
      ],
    },
    {
      section: "5. Sustainability Impact (15 marks)",
      fields: [
        { name: "environmental_impact", label: "Environmental Impact: Does the project reduce carbon footprint, waste, energy, or water usage? (/7)" },
        { name: "sdg_alignment", label: "Alignment with SDGs: Is the project aligned with one or more UN Sustainable Development Goals? (/8)" },
      ],
    },
    {
      section: "6. Market Viability & Scalability (10 marks)",
      fields: [
        { name: "commercial_potential", label: "Commercial Potential: Can the product be realistically produced and marketed? (/5)" },
        { name: "scalability", label: "Scalability: Can the solution be adapted or scaled for wider use? (/5)" },
      ],
    },
    {
      section: "7. Presentation & Communication (10 marks)",
      fields: [
        { name: "clarity_and_structure", label: "Clarity & Structure: Clear explanation of problem, solution, methodology, and outcomes (/5)" },
        { name: "visuals_demo", label: "Visuals/Demo: Effective use of models, diagrams, or live demonstrations (/5)" },
      ],
    },
    {
      section: "8. Teamwork, Research & Documentation (10 marks)",
      fields: [
        { name: "teamwork", label: "Collaboration: Evidence of coordinated effort and interdisciplinary thinking (/5)" },
        { name: "research", label: "Research & References: Use of scientific, technical literature, or benchmarking (/5)" },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-20 px-6">
      <h1 className="text-3xl font-bold text-violet-700 mb-4">Evaluate Project</h1>

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

      {error && <p className="text-red-500 font-medium mb-4">{error}</p>}

      {project && (
        <>
          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 space-y-2 mb-6">
            <h2 className="text-2xl font-semibold text-violet-700">{project.project_title}</h2>
            <p><strong>Group No:</strong> {project.group_number}</p>
            <p><strong>Category:</strong> {project.category}</p>
            <p><strong>Department:</strong> {project.department}</p>
            <p><strong>Status:</strong> {project.status}</p>
          </div>

          <div className="bg-white shadow p-6 rounded-xl border border-gray-200 space-y-4">
            <h3 className="text-xl font-bold text-gray-700 mb-2">Evaluation Sheet</h3>

            {evaluationCriteria.map((section, idx) => (
              <div key={idx} className="mb-6">
                <h4 className="text-lg font-semibold text-violet-600 mb-2">{section.section}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.fields.map((field) => (
                    <div key={field.name} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                      <input
                        type="number"
                        name={field.name}
                        value={marks[field.name as keyof typeof marks]}
                        onChange={handleChange}
                        className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-violet-500"
                        min={0}
                        max={10}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={!isFormComplete || loading}
              className={`mt-6 px-6 py-3 rounded-xl font-semibold text-white ${
                !isFormComplete || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Evaluation'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
