/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../../utils/supabaseClient';

interface Project {
    group_number: number;
    project_title: string;
    category: 'Mini' | 'Major';
    domain: string;
    department: string;
    totalmarks: number;
}

interface LeaderboardResponse {
    department: string;
    category: 'Mini' | 'Major';
    projects: Project[];
}

export default function Leaderboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [topProjects, setTopProjects] = useState<LeaderboardResponse[]>([]);

    useEffect(() => {
        fetchAllProjects();
    }, []);

    const fetchAllProjects = async () => {
        const { data, error } = await supabase
            .from('projects')
            .select('group_number, project_title, category, domain, department, totalmarks')
            .eq('status', 'Reviewed')
            .not('totalmarks', 'is', null);

        if (error) {
            console.error('❌ Error fetching leaderboard projects:', error.message);
            return;
        }

        console.log('✅ All fetched projects:', data);
        setProjects(data);
        organizeTopProjects(data);
        setLoading(false);
    };

    const organizeTopProjects = (projects: Project[]) => {
        const grouped: Record<string, Record<string, Project[]>> = {};

        projects.forEach((project) => {
            if (!grouped[project.department]) {
                grouped[project.department] = {};
            }

            if (!grouped[project.department][project.category]) {
                grouped[project.department][project.category] = [];
            }


            grouped[project.department][project.category].push(project);
        });

        console.log('📊 Grouped projects:', grouped);

        const leaderboard: LeaderboardResponse[] = Object.entries(grouped).map(([department, categories]) => {
            return Object.entries(categories).map(([category, categoryProjects]) => {
                const topThree = categoryProjects
                    .sort((a, b) => (b.totalmarks ?? 0) - (a.totalmarks ?? 0))
                    .slice(0, 3);

                console.log(`🏅 Top 3 in ${department} - ${category}:`, topThree);

                return {
                    department,
                    category: category as 'Mini' | 'Major',
                    projects: topThree,
                };
            });
        }).flat();

        console.log('🏁 Final Top Projects:', leaderboard);
        setTopProjects(leaderboard);
    };

    return (
        <div className="max-w-7xl mx-auto mt-20 px-6">
            <h1 className="text-4xl font-bold text-violet-700 mb-4">🏆 Leaderboard</h1>

            {loading ? (
                <p className="text-gray-600">Loading leaderboard...</p>
            ) : (
                Object.entries(
                    topProjects.reduce((acc, entry) => {
                        if (!acc[entry.department]) acc[entry.department] = [];
                        acc[entry.department].push(entry);
                        return acc;
                    }, {} as Record<string, LeaderboardResponse[]>)
                ).map(([department, entries]) => (
                    <div key={department} className="mb-12">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{department} Department</h2>
                        {entries.map(({ category, projects }) => (
                            <div key={`${department}-${category}`} className="mb-8">
                                <h3 className="text-xl font-medium text-violet-600 mb-2">{category} Projects</h3>
                                <div className="overflow-x-auto bg-white shadow rounded-xl border">
                                    <table className="min-w-full text-sm text-left">
                                        <thead className="bg-violet-100 text-violet-800 font-semibold">
                                            <tr>
                                                <th className="px-6 py-3">Rank</th>
                                                <th className="px-6 py-3">Group No.</th>
                                                <th className="px-6 py-3">Project Title</th>
                                                <th className="px-6 py-3">Domain</th>
                                                <th className="px-6 py-3">Marks</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 text-gray-700">
                                            {projects.map((project, index) => (
                                                <tr key={index} className="hover:bg-violet-50 transition">
                                                    <td className="px-6 py-4 font-bold text-violet-600">{index + 1}</td>
                                                    <td className="px-6 py-4">{project.group_number}</td>
                                                    <td className="px-6 py-4">{project.project_title}</td>
                                                    <td className="px-6 py-4">{project.domain}</td>
                                                    <td className="px-6 py-4">{project.totalmarks}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}
