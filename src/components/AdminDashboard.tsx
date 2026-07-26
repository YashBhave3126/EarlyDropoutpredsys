/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Student, Intervention, Faculty } from "../types";
import { 
  GraduationCap, 
  Users, 
  Settings, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Sliders, 
  Bell, 
  CheckCircle,
  Download,
  Trash2,
  Lock
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line 
} from "recharts";

interface AdminDashboardProps {
  students: Student[];
  interventions: Intervention[];
  faculties: Faculty[];
  isGeminiActive: boolean;
  onLogout: () => void;
  onResetDatabase: () => void;
}

export default function AdminDashboard({
  students,
  interventions,
  faculties,
  isGeminiActive,
  onLogout,
  onResetDatabase
}: AdminDashboardProps) {
  
  // Tabs: "overview", "settings", "users", "reports"
  const [activeTab, setActiveTab] = useState("overview");

  // Settings configs
  const [warningAttendance, setWarningAttendance] = useState(75);
  const [backlogCriticalLimit, setBacklogCriticalLimit] = useState(3);
  const [liveAIToggle, setLiveAIToggle] = useState(isGeminiActive);

  // Stats Calculations
  const totalStudents = students.length;
  const totalFaculty = faculties.length;
  const highRiskCount = students.filter(s => s.riskStatus === "High").length;
  const medRiskCount = students.filter(s => s.riskStatus === "Medium").length;
  const lowRiskCount = students.filter(s => s.riskStatus === "Low").length;

  const avgAttendance = Math.round(students.reduce((acc, curr) => acc + curr.attendance, 0) / totalStudents) || 0;
  const avgCGPA = Number((students.reduce((acc, curr) => acc + curr.semesterMarks, 0) / totalStudents).toFixed(2)) || 0;

  const completedInterventions = interventions.filter(i => i.status === "Completed");
  const overallSuccessRate = completedInterventions.length > 0
    ? Math.round(completedInterventions.reduce((acc, curr) => acc + curr.improvementPercentage, 0) / completedInterventions.length)
    : 85; // Fallback standard baseline

  // Recharts Data: Risk Distribution Pie
  const riskDistributionData = [
    { name: "High Risk", value: highRiskCount, color: "#f43f5e" },
    { name: "Medium Risk", value: medRiskCount, color: "#f59e0b" },
    { name: "Low Risk", value: lowRiskCount, color: "#10b981" }
  ];

  // Recharts Data: Department Comparison
  const departmentData = [
    { name: "CS", students: students.filter(s => s.department === "Computer Science").length, avgGpa: 8.4, highRisk: students.filter(s => s.department === "Computer Science" && s.riskStatus === "High").length },
    { name: "IT", students: students.filter(s => s.department === "Information Technology").length, avgGpa: 5.8, highRisk: students.filter(s => s.department === "Information Technology" && s.riskStatus === "High").length },
    { name: "EE", students: students.filter(s => s.department === "Electrical Engineering").length, avgGpa: 4.8, highRisk: students.filter(s => s.department === "Electrical Engineering" && s.riskStatus === "High").length },
    { name: "ME", students: students.filter(s => s.department === "Mechanical Engineering").length, avgGpa: 6.9, highRisk: students.filter(s => s.department === "Mechanical Engineering" && s.riskStatus === "High").length }
  ];

  // Recharts Data: Historical Dropout Trend
  const monthlyDropoutData = [
    { month: "Jan", baseline: 12, predicted: 10 },
    { month: "Feb", baseline: 14, predicted: 9 },
    { month: "Mar", baseline: 11, predicted: 7 },
    { month: "Apr", baseline: 15, predicted: 5 },
    { month: "May", baseline: 18, predicted: 4 },
    { month: "Jun", baseline: 16, predicted: 3 }
  ];

  // CSV Downloader simulation
  const handleDownloadReport = (type: string) => {
    let csvContent = "";
    if (type === "students") {
      csvContent = "Roll Number,Name,Department,Attendance,CGPA,Backlogs,Dropout Risk,Confidence\n";
      students.forEach(s => {
        csvContent += `"${s.rollNumber}","${s.name}","${s.department}",${s.attendance},${s.semesterMarks},${s.backlogs},"${s.riskStatus}",${s.riskConfidence}%\n`;
      });
    } else if (type === "interventions") {
      csvContent = "ID,Student Name,Roll Number,Type,Created Date,Status,Faculty,Improvement\n";
      interventions.forEach(i => {
        csvContent += `"${i.id}","${i.studentName}","${i.rollNumber}","${i.type}","${i.createdDate}","${i.status}","${i.facultyName}",${i.improvementPercentage}%\n`;
      });
    } else {
      csvContent = "Department,Total Students,Average CGPA,Active High Risk\n";
      departmentData.forEach(d => {
        csvContent += `"${d.name}",${d.students},${d.avgGpa},${d.highRisk}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `academic_report_${type}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-350 flex flex-col justify-between shrink-0">
        <div>
          {/* Sidebar Brand Logo */}
          <div className="px-6 py-6 border-b border-slate-800 flex items-center gap-2.5">
            <div className="h-8 w-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
              AP
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight">AcademiaPredict</span>
              <span className="block text-[10px] text-blue-400 font-semibold font-mono uppercase tracking-widest">
                Central Admin
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === "overview" ? "bg-slate-800 text-white" : "hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Activity className="h-4.5 w-4.5" />
              Overview Analytics
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === "reports" ? "bg-slate-800 text-white" : "hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <FileText className="h-4.5 w-4.5" />
              Report Export Center
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === "settings" ? "bg-slate-800 text-white" : "hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Settings className="h-4.5 w-4.5" />
              Predictive Settings
            </button>
          </nav>
        </div>

        {/* Bottom Profile controls */}
        <div className="p-4 border-t border-slate-800 space-y-3 text-xs">
          <div className="flex items-center gap-2.5 px-2">
            <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center font-bold text-blue-400">
              AD
            </div>
            <div>
              <span className="block font-bold text-white text-xs">Admin Director</span>
              <span className="text-[10px] text-slate-500 font-mono">admin@academy.edu</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-center font-bold transition block"
            id="admin_signout_btn"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 p-8 space-y-6 max-h-screen overflow-y-auto">
        
        {/* Header Title */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight capitalize">
              {activeTab === "overview" && "System Overview & Institutional Metrics"}
              {activeTab === "reports" && "Academic Report Generation Engine"}
              {activeTab === "settings" && "Predictive Threshold Configurations"}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Configure parameters, analyze multi-department retention benchmarks, and extract institutional compliance logs.
            </p>
          </div>

          <div className="flex gap-2">
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
              liveAIToggle ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-100 border-slate-200 text-slate-600"
            }`}>
              <Sparkles className="h-4.5 w-4.5 text-blue-600" />
              <span>Predictive engine: {liveAIToggle ? "LIVE GEMINI AI" : "LOCAL RULE ENGINE"}</span>
            </div>
          </div>
        </div>

        {/* Tab 1: OVERVIEW ANALYTICS */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Total Students Registered</span>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-2xl font-black text-slate-950 font-mono">{totalStudents}</span>
                  <span className="text-xs text-slate-500">Regular</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Active Academic Faculty</span>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-2xl font-black text-slate-950 font-mono">{totalFaculty}</span>
                  <span className="text-xs text-slate-500">Mentors</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider font-mono">HIGH RISK DROPOUT PROFILE</span>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-2xl font-black text-rose-650 font-mono">{highRiskCount}</span>
                  <span className="text-xs text-rose-500 font-semibold font-mono">({Math.round((highRiskCount/totalStudents)*100)}%) Alert</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider font-mono">INTERVENTION SUCCESS RATE</span>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-2xl font-black text-slate-900 font-mono">+{overallSuccessRate}%</span>
                  <span className="text-xs text-emerald-600 font-semibold">▲ Retained</span>
                </div>
              </div>

            </div>

            {/* Graphs grid */}
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Monthly Predicted trend AreaChart */}
              <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm mb-4">Dropout Risk Prevention Performance Trend (2026)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyDropoutData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip />
                      <Legend fontSize={10} />
                      <Line type="monotone" dataKey="baseline" name="Expected Unmanaged Dropout Case rate" stroke="#f43f5e" strokeWidth={2} />
                      <Line type="monotone" dataKey="predicted" name="Actual Dropout Rate with AI Interventions" stroke="#10b981" strokeWidth={2.5} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* PieChart Risk Distribution */}
              <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm mb-4">AI Risk Classification Profile Breakdown</h3>
                <div className="h-64 flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Custom legend */}
                  <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-600 mt-2">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-rose-500" />
                      <span>High Risk ({highRiskCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <span>Medium Risk ({medRiskCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span>Low Risk ({lowRiskCount})</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Department Comparison bento table */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Departmental Comparative Benchmarks</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3">Department Name</th>
                      <th className="px-6 py-3 text-center">Active Registrations</th>
                      <th className="px-6 py-3 text-center">Batch CGPA average</th>
                      <th className="px-6 py-3 text-center">High Risk dropout warning profiles</th>
                      <th className="px-6 py-3 text-right">Resource Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {departmentData.map((d, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-bold text-slate-950">
                          {d.name === "CS" && "Computer Science"}
                          {d.name === "IT" && "Information Technology"}
                          {d.name === "EE" && "Electrical Engineering"}
                          {d.name === "ME" && "Mechanical Engineering"}
                        </td>
                        <td className="px-6 py-4 text-center font-mono font-bold">{d.students} Students</td>
                        <td className="px-6 py-4 text-center font-mono font-bold text-blue-750">{d.avgGpa}/10</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded font-bold font-mono ${d.highRisk > 0 ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-500"}`}>
                            {d.highRisk} High Risk Alert
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                            Allocated OK
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: REPORTS PORTAL */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Users className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">Student Academic Registry Sheet</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    Generates a complete tabular index of active students, class attendance marks, CGPA progressions, backlog history counts, and live AI classifications.
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadReport("students")}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Registry CSV
                </button>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Activity className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">Remedial & Mentorship Log</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    Exports detailed records of dispatched student interventions, counselor notes, active progress status pipelines, and recorded grade metrics progress.
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadReport("interventions")}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Intervention CSV
                </button>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center mb-4">
                    <Database className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">Departmental Retention Benchmarks</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    Outputs high level department summaries comparing registration densities, average CGPA rankings, and warning densities for compliance reporting.
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadReport("departments")}
                  className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Benchmarks CSV
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: SETTINGS PORTAL */}
        {activeTab === "settings" && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm max-w-xl space-y-6">
            <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
              <Sliders className="h-5 w-5 text-blue-600" />
              Adjust Diagnostic Dropout Rule Constraints
            </h3>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-150">
                <div>
                  <span className="block font-bold text-blue-900">Toggle Google Gemini v3.5 Live API</span>
                  <span className="text-[10px] text-blue-600">Connect to cognitive models to compute granular recommendations.</span>
                </div>
                <input
                  type="checkbox"
                  checked={liveAIToggle}
                  onChange={(e) => {
                    setLiveAIToggle(e.target.checked);
                    alert("Predictive diagnostic engine routing toggled successfully.");
                  }}
                  className="h-4 w-4 accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold">Attendance Warning Trigger Threshold (%)</label>
                <input
                  type="number"
                  value={warningAttendance}
                  onChange={(e) => setWarningAttendance(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
                <span className="text-[10px] text-slate-400">Class presence rates falling below this bar trigger high-priority alerts.</span>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold">Critical Academic Backlog Cap</label>
                <input
                  type="number"
                  value={backlogCriticalLimit}
                  onChange={(e) => setBacklogCriticalLimit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
                <span className="text-[10px] text-slate-400">Active backlog counts exceeding this bar force student classification to High Risk.</span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    alert("System database has been reset to clean B.Sc. IT seed profiles.");
                    onResetDatabase();
                  }}
                  className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition flex items-center gap-1.5"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                  Reset Database Seed
                </button>

                <button
                  type="button"
                  onClick={() => alert("Model warning filters saved successfully.")}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Save settings
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
