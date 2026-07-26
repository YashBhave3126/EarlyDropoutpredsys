/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Student, Intervention } from "../types";
import { 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle, 
  HelpCircle, 
  TrendingUp, 
  FileText,
  Activity,
  ArrowRight,
  ShieldCheck,
  Bell
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from "recharts";

interface StudentDashboardProps {
  student: Student;
  interventions: Intervention[];
  onLogout: () => void;
}

export default function StudentDashboard({ student, interventions, onLogout }: StudentDashboardProps) {
  // Filter interventions associated with this student
  const studentInterventions = interventions.filter(i => i.rollNumber === student.rollNumber);

  // Quick stats calculations
  const totalInterventions = studentInterventions.length;
  const pendingInterventions = studentInterventions.filter(i => i.status === "Pending").length;
  const inProgressInterventions = studentInterventions.filter(i => i.status === "In Progress").length;
  const completedInterventions = studentInterventions.filter(i => i.status === "Completed").length;

  // Recharts Data preparation
  const performanceTrendData = [
    { name: "Sem 1", gpa: 6.8, average: 7.2 },
    { name: "Sem 2", gpa: 7.0, average: 7.3 },
    { name: "Sem 3", gpa: 7.4, average: 7.4 },
    { name: "Sem 4", gpa: (student.semesterMarks * 0.85).toFixed(1), average: 7.5 },
    { name: "Sem 5", gpa: (student.semesterMarks * 0.95).toFixed(1), average: 7.6 },
    { name: "Sem 6 (Current)", gpa: student.semesterMarks, average: 7.7 }
  ];

  const behaviorData = [
    { name: "Attendance", value: student.attendance, max: 100, color: student.attendance >= 75 ? "#4f46e5" : "#f43f5e" },
    { name: "Internal Marks", value: student.internalMarks, max: 100, color: student.internalMarks >= 60 ? "#8b5cf6" : "#f59e0b" },
    { name: "Assignment", value: Math.round((student.assignmentsSubmitted / student.assignmentsTotal) * 100), max: 100, color: "#10b981" },
    { name: "Practical Score", value: student.practicalMarks, max: 100, color: "#6366f1" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Top Banner Navigation */}
      <nav className="bg-slate-900 text-white px-6 py-4 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-sm sm:text-base">Student Retention Hub</span>
              <span className="block text-[10px] text-blue-300 font-mono">Role: Student Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <span className="block text-xs font-semibold">{student.name}</span>
              <span className="text-[10px] text-blue-300 font-mono">{student.rollNumber}</span>
            </div>
            <button 
              onClick={onLogout}
              className="px-3.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold rounded-lg transition"
              id="student_logout_btn"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Profile Card Header */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-4 items-center">
            <div className="h-16 w-16 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold border-4 border-blue-100">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
              <p className="text-xs text-slate-500 font-medium">
                {student.department} • Semester {student.semester} • Section A
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-0.5 text-[10px] bg-blue-50 text-blue-700 font-semibold rounded">
                  Study Load: Full-Time
                </span>
                {student.socioeconomic.scholarship && (
                  <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-semibold rounded">
                    Scholarship Recipient
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center self-stretch md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <div className="text-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
              <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Attendance</span>
              <span className={`text-lg font-black font-mono ${student.attendance >= 75 ? "text-blue-600" : "text-rose-500"}`}>
                {student.attendance}%
              </span>
            </div>
            <div className="text-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
              <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Current GPA</span>
              <span className="text-lg font-black text-slate-900 font-mono">
                {student.semesterMarks}/10
              </span>
            </div>
            <div className="text-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
              <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Backlogs</span>
              <span className={`text-lg font-black font-mono ${student.backlogs > 0 ? "text-rose-500" : "text-slate-500"}`}>
                {student.backlogs}
              </span>
            </div>
          </div>
        </div>

        {/* Predictive Risk Panel Powered by Gemini */}
        <div className={`p-6 rounded-2xl border ${
          student.riskStatus === "High" 
            ? "bg-rose-50/50 border-rose-200/80" 
            : student.riskStatus === "Medium"
            ? "bg-amber-50/50 border-amber-200/80"
            : "bg-emerald-50/50 border-emerald-200/80"
        }`}>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 mb-4 border-b border-slate-200/50">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                student.riskStatus === "High" ? "bg-rose-100 text-rose-600" : student.riskStatus === "Medium" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
              }`}>
                <AlertTriangle className="h-5.5 w-5.5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Predictive AI Dropout Risk Status</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className={`font-black text-lg ${
                    student.riskStatus === "High" ? "text-rose-700" : student.riskStatus === "Medium" ? "text-amber-700" : "text-emerald-700"
                  }`}>
                    {student.riskStatus} Risk Profile ({student.riskConfidence}% Confidence)
                  </h3>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[9px] font-bold">
                    <Sparkles className="h-2.5 w-2.5" />
                    Powered by Live Gemini AI
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Reasons block */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Predictive Trigger Indicators:</h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {student.riskReasons.map((reason, idx) => (
                  <li key={idx} className="flex gap-2 items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations Block */}
            <div className="p-4 bg-white/70 backdrop-blur border border-slate-200/60 rounded-xl shadow-inner">
              <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Tailored Success Action Plan:
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {student.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-2 items-center text-slate-800">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Dashboard Content Columns */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Charts block */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Attendance & Grades Recharts */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Historical Grade Point Average Progression</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="gpa" name="My CGPA" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGpa)" />
                    <Area type="monotone" dataKey="average" name="Batch Average" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Components Grid BarChart */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Academic & Self-Study Indicators</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={behaviorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {behaviorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color === "#4f46e5" ? "#2563eb" : entry.color === "#6366f1" ? "#3b82f6" : entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Side Info Cards */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Active Interventions Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Intervention Program Logs</h3>
                <span className="px-2 py-0.5 text-[9px] bg-slate-100 text-slate-600 font-bold font-mono rounded">
                  Count: {totalInterventions}
                </span>
              </div>

              {totalInterventions === 0 ? (
                <div className="text-center py-6">
                  <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No interventions active</p>
                  <p className="text-[10px] text-slate-400 mt-1">Excellent academic and study indicators maintained.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studentInterventions.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 text-[9px] bg-blue-50 text-blue-700 font-bold uppercase tracking-wider">
                          {item.type}
                        </span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full font-mono ${
                          item.status === "Completed" ? "bg-emerald-100 text-emerald-800" : item.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-serif">
                        "{item.remarks}"
                      </p>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-150">
                        <span>Mentor: {item.facultyName}</span>
                        {item.status !== "Completed" && (
                          <span className="text-rose-500">Next: {item.followUpDate}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Box */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-1.5">
                <Bell className="h-4.5 w-4.5 text-blue-600" />
                Personal Academic Noticeboard
              </h3>
              
              <div className="space-y-3.5 text-xs">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/30">
                  <span className="block text-[9px] font-bold text-blue-700 uppercase font-mono">Academic Deadline</span>
                  <p className="text-slate-700 mt-0.5">End-Semester practical portfolio submission is scheduled on July 25.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="block text-[9px] font-bold text-slate-500 uppercase font-mono">System Tip</span>
                  <p className="text-slate-600 mt-0.5">Self-study time is highly weighted by the AI dropout risk models. Aim for 12+ hours weekly.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
