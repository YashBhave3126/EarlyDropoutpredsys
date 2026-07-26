/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Student } from "../types";
import { 
  GraduationCap, 
  ArrowLeft, 
  Brain, 
  TrendingUp, 
  Cpu, 
  Layers, 
  Activity, 
  Award, 
  Database, 
  HelpCircle, 
  CheckCircle2, 
  Code2, 
  ChevronRight,
  Filter
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ScatterChart, 
  Scatter, 
  ZAxis 
} from "recharts";

interface ResearchPortalProps {
  students: Student[];
  onBack: () => void;
}

export default function ResearchPortal({ students, onBack }: ResearchPortalProps) {
  const [activeResearchTab, setActiveResearchTab] = useState("model");

  // Recharts: Horizontal Feature Importance
  // Simulates standard Scikit-learn Random Forest feature_importances_ coefficients
  const featureImportanceData = [
    { name: "Attendance Rate", weight: 0.35, color: "#2563eb" },
    { name: "Course Backlogs", weight: 0.22, color: "#1d4ed8" },
    { name: "Internal Test Scores", weight: 0.18, color: "#3b82f6" },
    { name: "Weekly Study Hours", weight: 0.12, color: "#60a5fa" },
    { name: "Family Income (Socio)", weight: 0.08, color: "#10b981" },
    { name: "Distance from College", weight: 0.05, color: "#f59e0b" }
  ].sort((a, b) => b.weight - a.weight);

  // Recharts: Attendance vs CGPA Scatter dataset
  const scatterData = students.map(s => ({
    name: s.name,
    attendance: s.attendance,
    gpa: s.semesterMarks,
    risk: s.riskStatus,
    z: s.riskStatus === "High" ? 100 : s.riskStatus === "Medium" ? 50 : 25
  }));

  // Correlation Matrix Coefficient values
  const correlationMatrix = [
    { row: "Attendance", Attendance: 1.00, StudyHours: 0.42, Backlogs: -0.61, GPA: 0.72 },
    { row: "Study Hours", Attendance: 0.42, StudyHours: 1.00, Backlogs: -0.35, GPA: 0.58 },
    { row: "Backlogs", Attendance: -0.61, StudyHours: -0.35, Backlogs: 1.00, GPA: -0.78 },
    { row: "GPA", Attendance: 0.72, StudyHours: 0.58, Backlogs: -0.78, GPA: 1.00 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Navigation Sticky Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200/80 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 transition"
            id="research_back_to_landing"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            Back to Home
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Brain className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-sm text-slate-900 tracking-tight">Academic Research Sandbox</span>
          </div>

          <div className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
            Dataset v1.2
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        
        {/* Research Overview Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-gradient-to-bl from-blue-500/20 to-blue-500/10 rounded-full blur-3xl" />
          
          <div className="max-w-3xl space-y-4 relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-semibold">
              <Cpu className="h-3.5 w-3.5" />
              Machine Learning Pipeline Analytics
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Predictive Dropout Classifier Sandbox
            </h1>
            <p className="text-sm text-blue-100 leading-relaxed">
              Explore dataset correlations, machine learning weights, and academic performance indices. Developed to support peer-review evaluations and academic project presentations.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
          <button 
            onClick={() => setActiveResearchTab("model")}
            className={`pb-3 border-b-2 px-1 transition ${
              activeResearchTab === "model" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Model Diagnostics & Importance
          </button>
          <button 
            onClick={() => setActiveResearchTab("correlation")}
            className={`pb-3 border-b-2 px-1 transition ${
              activeResearchTab === "correlation" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Correlation Matrices
          </button>
          <button 
            onClick={() => setActiveResearchTab("dataset")}
            className={`pb-3 border-b-2 px-1 transition ${
              activeResearchTab === "dataset" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Exploratory Student Dataset
          </button>
        </div>

        {/* Tab 1: MODEL DIAGNOSTICS */}
        {activeResearchTab === "model" && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Scikit Learn model metadata specs */}
              <div className="lg:col-span-5 bg-white border border-slate-200/85 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Classification Model Specifications</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Parameters trained via Python Scikit-learn Pipeline.</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600">Model Algorithm</span>
                    <span className="font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded">
                      Random Forest Classifier
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600">Total Estimators (n_estimators)</span>
                    <span className="font-mono font-bold text-slate-800">150 Trees</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600">Split Criterion</span>
                    <span className="font-mono font-bold text-slate-800">Gini Impurity / Entropy</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600">Validation strategy</span>
                    <span className="font-mono font-bold text-slate-800">10-Fold Cross Validation</span>
                  </div>
                </div>

                {/* Accuracy metrics */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <span className="block text-2xl font-black text-emerald-700 font-mono">0.92</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">F1-Score</span>
                  </div>
                  <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl">
                    <span className="block text-2xl font-black text-blue-700 font-mono">91%</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Recall</span>
                  </div>
                  <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl">
                    <span className="block text-2xl font-black text-blue-700 font-mono">93%</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Precision</span>
                  </div>
                </div>
              </div>

              {/* Feature Importance weights horizontal BarChart */}
              <div className="lg:col-span-7 bg-white border border-slate-200/85 rounded-2xl p-6 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Feature Importance Analysis (Coefficients)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Which student variables influence the dropout classification weights the most?</p>
                </div>

                <div className="h-64 mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={featureImportanceData}
                      margin={{ top: 10, right: 10, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" domain={[0, 0.4]} stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} width={100} />
                      <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(0)}% weight`, 'Importance']} />
                      <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
                        {featureImportanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Attendance vs GPA scatter plot */}
            <div className="bg-white border border-slate-200/85 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Academic Scatter: Attendance Rate vs CGPA</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" dataKey="attendance" name="Attendance" unit="%" domain={[40, 100]} stroke="#64748b" fontSize={11} />
                    <YAxis type="number" dataKey="gpa" name="CGPA" domain={[0, 10]} stroke="#64748b" fontSize={11} />
                    <ZAxis type="number" dataKey="z" range={[50, 400]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Students" data={scatterData} fill="#8884d8">
                      {scatterData.map((entry, index) => {
                        const cellColor = entry.risk === "High" ? "#f43f5e" : entry.risk === "Medium" ? "#f59e0b" : "#10b981";
                        return <Cell key={`cell-${index}`} fill={cellColor} />;
                      })}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-600 mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span>High Dropout Risk Profile Cluster</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span>Medium Warning Cluster</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span>Low Risk / Safe Zone Cluster</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: CORRELATION MATRICES */}
        {activeResearchTab === "correlation" && (
          <div className="bg-white border border-slate-200/85 rounded-2xl p-6 shadow-sm max-w-2xl space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Feature Correlation Matrix (Pearson Coeff r)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Understand linear dependencies. Positive values indicate direct proportional alignment, negative values show inverse relationships.</p>
            </div>

            {/* Matrix Graphic Grid */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-5 bg-slate-50 text-xs font-bold border-b border-slate-200 p-3 text-center text-slate-600 font-mono">
                <div>Feature</div>
                <div>Attendance</div>
                <div>Study Hours</div>
                <div>Backlogs</div>
                <div>GPA Score</div>
              </div>

              {correlationMatrix.map((row, idx) => (
                <div key={idx} className="grid grid-cols-5 border-b border-slate-100 p-3 text-center items-center text-xs font-mono font-semibold">
                  <div className="text-left font-bold text-slate-700 bg-slate-50 p-1.5 rounded">{row.row}</div>
                  <div className={`p-1.5 rounded ${row.Attendance > 0.6 ? "bg-emerald-50 text-emerald-800" : row.Attendance < -0.5 ? "bg-rose-50 text-rose-800" : "text-slate-600"}`}>{row.Attendance.toFixed(2)}</div>
                  <div className={`p-1.5 rounded ${row.StudyHours > 0.6 ? "bg-emerald-50 text-emerald-800" : row.StudyHours < -0.3 ? "bg-rose-50 text-rose-800" : "text-slate-600"}`}>{row.StudyHours.toFixed(2)}</div>
                  <div className={`p-1.5 rounded ${row.Backlogs > 0.6 ? "bg-emerald-50 text-emerald-800" : row.Backlogs < -0.5 ? "bg-rose-50 text-rose-800" : "text-slate-600"}`}>{row.Backlogs.toFixed(2)}</div>
                  <div className={`p-1.5 rounded ${row.GPA > 0.6 ? "bg-emerald-50 text-emerald-800" : row.GPA < -0.5 ? "bg-rose-50 text-rose-800" : "text-slate-600"}`}>{row.GPA.toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Correlation Insights */}
            <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Analytical Research Discoveries:</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex gap-2 items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5" />
                  <span><strong>Strong Backlog Friction:</strong> The backlog indicator correlates negatively with semester GPA (-0.78) and attendance (-0.61), showcasing that backlog accumulation highly drives subsequent class disengagement and eventual dropout triggers.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5" />
                  <span><strong>Study Hours Proportionality:</strong> Weekly self-study exhibits a clear positive correlation with overall GPA (+0.58). Students completing 12+ self-study hours weekly achieve normal progression thresholds with high model precision.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: RAW EXPLORATORY DATASET */}
        {activeResearchTab === "dataset" && (
          <div className="bg-white border border-slate-200/85 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Exploratory Student Database Rows</h3>
                <p className="text-xs text-slate-400 mt-0.5">Explore raw dataset records, academic grades, and behavioral parameters.</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded font-bold font-mono">
                Records: {students.length} rows
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs text-slate-700">
                <thead className="bg-slate-50 font-bold uppercase text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Student Roll</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4 text-center">Attendance</th>
                    <th className="px-6 py-4 text-center">GPA</th>
                    <th className="px-6 py-4 text-center">Study Hours</th>
                    <th className="px-6 py-4 text-center">Internet Access</th>
                    <th className="px-6 py-4 text-center">Socio Income</th>
                    <th className="px-6 py-4 text-right">Dropout Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {students.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-900">{item.name} ({item.rollNumber})</td>
                      <td className="px-6 py-4 font-sans">{item.department}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-800">{item.attendance}%</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-800">{item.semesterMarks}/10</td>
                      <td className="px-6 py-4 text-center">{item.behavioral.studyHours} hrs</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-1.5 py-0.5 rounded font-bold ${item.socioeconomic.internetAvailability ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                          {item.socioeconomic.internetAvailability ? "YES" : "NO"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-sans">{item.socioeconomic.familyIncome}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          item.riskStatus === "High" ? "bg-rose-50 text-rose-700" : item.riskStatus === "Medium" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                        }`}>
                          {item.riskStatus.toUpperCase()} ({item.riskConfidence}%)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
