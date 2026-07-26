/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Student, Intervention } from "../types";
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  Clock, 
  Workflow, 
  UserPlus, 
  ArrowRight, 
  X, 
  TrendingUp, 
  Sliders, 
  FileSpreadsheet, 
  Edit3, 
  ChevronRight 
} from "lucide-react";

interface FacultyDashboardProps {
  students: Student[];
  interventions: Intervention[];
  activeFacultyName: string;
  activeFacultyDept: string;
  onLogout: () => void;
  onStudentSubmit: (student: any) => Promise<void>;
  onInterventionSubmit: (data: any) => Promise<void>;
  onInterventionUpdate: (id: string, updateData: any) => Promise<void>;
  onTriggerPrediction: (rollNumber: string) => Promise<void>;
}

export default function FacultyDashboard({
  students,
  interventions,
  activeFacultyName,
  activeFacultyDept,
  onLogout,
  onStudentSubmit,
  onInterventionSubmit,
  onInterventionUpdate,
  onTriggerPrediction
}: FacultyDashboardProps) {
  
  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");
  
  // Drawer & Form States
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [isUpdateInterventionModalOpen, setIsUpdateInterventionModalOpen] = useState(false);
  
  // Student Form Fields
  const [rollNumber, setRollNumber] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentDept, setStudentDept] = useState(activeFacultyDept || "Information Technology");
  const [semester, setSemester] = useState(6);
  const [attendance, setAttendance] = useState(75);
  const [internalMarks, setInternalMarks] = useState(65);
  const [semesterMarks, setSemesterMarks] = useState(7.0);
  const [assignmentsSubmitted, setAssignmentsSubmitted] = useState(8);
  const [assignmentsTotal, setAssignmentsTotal] = useState(10);
  const [backlogs, setBacklogs] = useState(0);
  const [practicalMarks, setPracticalMarks] = useState(75);
  
  // Socioeconomic Sub-Form
  const [familyIncome, setFamilyIncome] = useState("Medium");
  const [parentsEducation, setParentsEducation] = useState("Bachelor");
  const [distanceFromCollege, setDistanceFromCollege] = useState(10);
  const [transportation, setTransportation] = useState("Public");
  const [internetAvailability, setInternetAvailability] = useState(true);
  const [scholarship, setScholarship] = useState(false);
  
  // Behavioral Sub-Form
  const [studyHours, setStudyHours] = useState(12);
  const [extracurricular, setExtracurricular] = useState(true);
  const [healthIssues, setHealthIssues] = useState(false);
  const [counselingSessions, setCounselingSessions] = useState(0);

  // Intervention Form Fields
  const [selectedStudentRoll, setSelectedStudentRoll] = useState("");
  const [interventionType, setInterventionType] = useState<"Counseling" | "Parent Meeting" | "Academic Mentoring" | "Attendance Improvement Plan" | "Financial Assistance" | "Remedial Classes" | "Career Guidance">("Counseling");
  const [interventionRemarks, setInterventionRemarks] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  // Update Intervention Fields
  const [updatingIntId, setUpdatingIntId] = useState("");
  const [updatingRemarks, setUpdatingRemarks] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState<"Pending" | "In Progress" | "Completed">("In Progress");
  const [improvementPercentage, setImprovementPercentage] = useState(20);

  // Loading state
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Filter student dataset
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === "All" || student.riskStatus === riskFilter;
    const matchesSem = semesterFilter === "All" || student.semester.toString() === semesterFilter;
    return matchesSearch && matchesRisk && matchesSem;
  });

  // Handle student create/edit submission
  const handleStudentFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    try {
      await onStudentSubmit({
        rollNumber,
        name: studentName,
        department: studentDept,
        semester: Number(semester),
        attendance: Number(attendance),
        internalMarks: Number(internalMarks),
        semesterMarks: Number(semesterMarks),
        assignmentsSubmitted: Number(assignmentsSubmitted),
        assignmentsTotal: Number(assignmentsTotal),
        backlogs: Number(backlogs),
        practicalMarks: Number(practicalMarks),
        socioeconomic: {
          familyIncome,
          parentsEducation,
          distanceFromCollege: Number(distanceFromCollege),
          transportation,
          internetAvailability,
          scholarship
        },
        behavioral: {
          studyHours: Number(studyHours),
          extracurricular,
          healthIssues,
          counselingSessions: Number(counselingSessions)
        }
      });
      setIsStudentModalOpen(false);
      resetStudentForm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Helper to pre-populate details for editing
  const handleEditStudent = (student: Student) => {
    setRollNumber(student.rollNumber);
    setStudentName(student.name);
    setStudentDept(student.department);
    setSemester(student.semester);
    setAttendance(student.attendance);
    setInternalMarks(student.internalMarks);
    setSemesterMarks(student.semesterMarks);
    setAssignmentsSubmitted(student.assignmentsSubmitted);
    setAssignmentsTotal(student.assignmentsTotal);
    setBacklogs(student.backlogs);
    setPracticalMarks(student.practicalMarks);
    
    // Socioeconomic
    setFamilyIncome(student.socioeconomic.familyIncome);
    setParentsEducation(student.socioeconomic.parentsEducation);
    setDistanceFromCollege(student.socioeconomic.distanceFromCollege);
    setTransportation(student.socioeconomic.transportation);
    setInternetAvailability(student.socioeconomic.internetAvailability);
    setScholarship(student.socioeconomic.scholarship);

    // Behavioral
    setStudyHours(student.behavioral.studyHours);
    setExtracurricular(student.behavioral.extracurricular);
    setHealthIssues(student.behavioral.healthIssues);
    setCounselingSessions(student.behavioral.counselingSessions);

    setIsStudentModalOpen(true);
  };

  const resetStudentForm = () => {
    setRollNumber("");
    setStudentName("");
    setAttendance(75);
    setInternalMarks(65);
    setSemesterMarks(7.0);
    setAssignmentsSubmitted(8);
    setAssignmentsTotal(10);
    setBacklogs(0);
    setPracticalMarks(75);
    setFamilyIncome("Medium");
    setParentsEducation("Bachelor");
    setDistanceFromCollege(10);
    setTransportation("Public");
    setInternetAvailability(true);
    setScholarship(false);
    setStudyHours(12);
    setExtracurricular(true);
    setHealthIssues(false);
    setCounselingSessions(0);
  };

  const handleCreateIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentRoll) return alert("Please select a student.");
    setIsActionLoading(true);
    try {
      await onInterventionSubmit({
        rollNumber: selectedStudentRoll,
        type: interventionType,
        remarks: interventionRemarks,
        followUpDate,
        facultyName: activeFacultyName
      });
      setIsInterventionModalOpen(false);
      setSelectedStudentRoll("");
      setInterventionRemarks("");
      setFollowUpDate("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenUpdateIntervention = (item: Intervention) => {
    setUpdatingIntId(item.id);
    setUpdatingRemarks(item.remarks);
    setUpdatingStatus(item.status);
    setImprovementPercentage(item.improvementPercentage);
    setFollowUpDate(item.followUpDate);
    setIsUpdateInterventionModalOpen(true);
  };

  const handleUpdateInterventionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    try {
      await onInterventionUpdate(updatingIntId, {
        status: updatingStatus,
        remarks: updatingRemarks,
        improvementPercentage,
        followUpDate
      });
      setIsUpdateInterventionModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const triggerLiveAIRevaluation = async (rollNo: string) => {
    alert("Querying server-side Google Gemini 3.5 AI module. Please wait...");
    try {
      await onTriggerPrediction(rollNo);
      alert("AI Dropout risk predictions recalculated successfully using live dataset parameters.");
    } catch (err) {
      alert("Error triggering Gemini API calculation.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Navigation banner */}
      <nav className="bg-slate-900 text-white px-6 py-4 shadow-md sticky top-0 z-45">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-sm sm:text-base">Institutional Faculty Hub</span>
              <span className="block text-[10px] text-blue-300 font-mono">Dept: {activeFacultyDept}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-semibold">{activeFacultyName}</span>
              <span className="text-[10px] text-blue-300 font-mono">Academic Advisor</span>
            </div>
            <button 
              onClick={onLogout}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold rounded-lg transition"
              id="faculty_logout_btn"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Welcome and actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Department Student Registry</h1>
            <p className="text-xs text-slate-500 font-medium">
              Review and record student grades, trigger predictive risk diagnostics, and coordinate intervention campaigns.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { resetStudentForm(); setIsStudentModalOpen(true); }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm"
              id="add_student_btn"
            >
              <UserPlus className="h-4 w-4" />
              Add Student
            </button>
            <button
              onClick={() => { setIsInterventionModalOpen(true); }}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
              id="new_intervention_btn"
            >
              <Plus className="h-4 w-4" />
              Issue Intervention
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name or roll number..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none transition"
              id="student_search_input"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto self-stretch md:self-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl">
              <Filter className="h-4 w-4" />
              <span>Filters:</span>
            </div>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500"
              id="risk_filter_select"
            >
              <option value="All">Risk: All Profiles</option>
              <option value="High">High Risk Only</option>
              <option value="Medium">Medium Risk Only</option>
              <option value="Low">Low Risk Only</option>
            </select>

            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500"
              id="sem_filter_select"
            >
              <option value="All">Semester: All</option>
              <option value="4">Semester 4</option>
              <option value="6">Semester 6</option>
            </select>
          </div>
        </div>

        {/* Student Registry Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Student Details</th>
                  <th className="px-6 py-4 text-center">Attendance</th>
                  <th className="px-6 py-4 text-center">Internal Score</th>
                  <th className="px-6 py-4 text-center">CGPA</th>
                  <th className="px-6 py-4 text-center">Backlogs</th>
                  <th className="px-6 py-4 text-center">Dropout Risk Profile</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400 font-medium">
                      No student records found matching search filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-750 font-bold font-mono">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <span className="block font-bold text-slate-900">{item.name}</span>
                            <span className="text-[11px] font-mono text-slate-400">{item.rollNumber} • Sem {item.semester}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-mono font-bold ${item.attendance < 75 ? "text-rose-600 bg-rose-50 px-2 py-0.5 rounded" : "text-slate-800"}`}>
                          {item.attendance}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-slate-800">
                        {item.internalMarks}%
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-slate-800">
                        {item.semesterMarks}/10
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-mono font-bold ${item.backlogs > 0 ? "text-rose-600 bg-rose-50 px-2 py-0.5 rounded" : "text-slate-500"}`}>
                          {item.backlogs}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full font-mono ${
                            item.riskStatus === "High" ? "bg-rose-100 text-rose-700" : item.riskStatus === "Medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {item.riskStatus.toUpperCase()} ({item.riskConfidence}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => triggerLiveAIRevaluation(item.rollNumber)}
                            className="p-1.5 hover:bg-slate-100 text-blue-600 rounded-lg transition"
                            title="Recalculate with Live AI"
                          >
                            <Sparkles className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditStudent(item)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                            title="Edit Student Metrics"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Interventions Pipeline Tracker */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Active Remedial & Mentorship Intervention Campaign</h3>
              <p className="text-xs text-slate-400">Track counseling progression, mentor remarks, and student improvement scores.</p>
            </div>
            <span className="px-2.5 py-1 text-xs bg-slate-100 text-slate-600 font-bold rounded-lg font-mono">
              Campaigns: {interventions.length}
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interventions.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.studentName}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{item.rollNumber}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full font-mono ${
                      item.status === "Completed" ? "bg-emerald-100 text-emerald-800" : item.status === "In Progress" ? "bg-blue-100 text-blue-850" : "bg-amber-100 text-amber-800"
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1 border-t border-dashed border-slate-200">
                    <span className="px-2 py-0.5 text-[9px] bg-blue-50 text-blue-700 font-extrabold uppercase rounded">
                      {item.type}
                    </span>
                    <span className="font-bold text-slate-800 font-mono">
                      Imp: +{item.improvementPercentage}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-serif bg-white p-2.5 border border-slate-100 rounded-lg">
                    "{item.remarks}"
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-3 border-t border-slate-150">
                  <span>Mentor: {item.facultyName}</span>
                  <button
                    onClick={() => handleOpenUpdateIntervention(item)}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                  >
                    Update
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* DRAWER / POPUP: Add/Edit Student Details */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsStudentModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Configure Student Performance Data
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Enter academic metrics, behavioral index parameters, and socioeconomic background variables. AI risk predictions are automatically calculated on save.
            </p>

            <form onSubmit={handleStudentFormSubmit} className="space-y-6 text-xs text-slate-700">
              {/* Part 1: Core Academic Details */}
              <div>
                <span className="block font-bold text-blue-700 uppercase tracking-wider mb-3 pb-1 border-b border-blue-100">
                  1. Academic performance parameters
                </span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Roll Number</label>
                    <input required type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" placeholder="IT-2026-055" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Student Name</label>
                    <input required type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Johnathan Doe" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Department</label>
                    <input readOnly type="text" value={studentDept} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Semester</label>
                    <input required type="number" min={1} max={8} value={semester} onChange={(e) => setSemester(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Attendance (%)</label>
                    <input required type="number" min={0} max={100} value={attendance} onChange={(e) => setAttendance(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Internal test Marks (%)</label>
                    <input required type="number" min={0} max={100} value={internalMarks} onChange={(e) => setInternalMarks(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Semester Marks (GPA 0-10)</label>
                    <input required type="number" step="0.1" min={0} max={10} value={semesterMarks} onChange={(e) => setSemesterMarks(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Assignments Submitted</label>
                    <input required type="number" value={assignmentsSubmitted} onChange={(e) => setAssignmentsSubmitted(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Assignments Total</label>
                    <input required type="number" value={assignmentsTotal} onChange={(e) => setAssignmentsTotal(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Active Course Backlogs</label>
                    <input required type="number" min={0} value={backlogs} onChange={(e) => setBacklogs(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Practical test Marks (%)</label>
                    <input required type="number" min={0} max={100} value={practicalMarks} onChange={(e) => setPracticalMarks(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                </div>
              </div>

              {/* Part 2: Socioeconomic Backing */}
              <div>
                <span className="block font-bold text-blue-700 uppercase tracking-wider mb-3 pb-1 border-b border-blue-100">
                  2. Socioeconomic background variables
                </span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Family Income Range</label>
                    <select value={familyIncome} onChange={(e) => setFamilyIncome(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                      <option value="Low">Low Income (&lt;$20k)</option>
                      <option value="Medium">Medium Income ($20k-$75k)</option>
                      <option value="High">High Income (&gt;$75k)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Parents Highest Education</label>
                    <select value={parentsEducation} onChange={(e) => setParentsEducation(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                      <option value="None">No Formal Education</option>
                      <option value="High School">High School</option>
                      <option value="Bachelor">Bachelor Degree</option>
                      <option value="Postgraduate">Postgraduate Degree</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Distance to Campus (km)</label>
                    <input required type="number" value={distanceFromCollege} onChange={(e) => setDistanceFromCollege(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Transit Commute Method</label>
                    <select value={transportation} onChange={(e) => setTransportation(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                      <option value="Public">Public Transit</option>
                      <option value="College Bus">College Bus</option>
                      <option value="Walk">Walking</option>
                      <option value="Own Vehicle">Own Vehicle</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <input type="checkbox" checked={internetAvailability} onChange={(e) => setInternetAvailability(e.target.checked)} className="h-4 w-4" id="internet" />
                    <label htmlFor="internet" className="font-semibold cursor-pointer">Internet Access at Home</label>
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <input type="checkbox" checked={scholarship} onChange={(e) => setScholarship(e.target.checked)} className="h-4 w-4" id="scholarship" />
                    <label htmlFor="scholarship" className="font-semibold cursor-pointer">Scholarship Recipient</label>
                  </div>
                </div>
              </div>

              {/* Part 3: Behavioral Indicators */}
              <div>
                <span className="block font-bold text-blue-700 uppercase tracking-wider mb-3 pb-1 border-b border-blue-100">
                  3. Behavioral study indicators
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Weekly Study Time (hours)</label>
                    <input required type="number" value={studyHours} onChange={(e) => setStudyHours(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Counseling Session count</label>
                    <input required type="number" value={counselingSessions} onChange={(e) => setCounselingSessions(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <input type="checkbox" checked={extracurricular} onChange={(e) => setExtracurricular(e.target.checked)} className="h-4 w-4" id="extra" />
                    <label htmlFor="extra" className="font-semibold cursor-pointer">Extracurricular Activities</label>
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <input type="checkbox" checked={healthIssues} onChange={(e) => setHealthIssues(e.target.checked)} className="h-4 w-4" id="health" />
                    <label htmlFor="health" className="font-semibold cursor-pointer">Chronic Health Issues</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsStudentModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={isActionLoading} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-1">
                  {isActionLoading ? "Saving & Recalculating AI..." : "Save details & Predict"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Issue New Corrective Intervention */}
      {isInterventionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsInterventionModalOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Register New Intervention
            </h3>
            <p className="text-xs text-slate-500 mb-6">Create a mentorship, counseling, parent-meeting, or remedial schedule for at-risk profiles.</p>

            <form onSubmit={handleCreateIntervention} className="space-y-4 text-xs text-slate-700">
              <div>
                <label className="block font-semibold mb-1">Select Student</label>
                <select 
                  value={selectedStudentRoll} 
                  onChange={(e) => setSelectedStudentRoll(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
                >
                  <option value="">-- Choose student --</option>
                  {students.map((item, idx) => (
                    <option key={idx} value={item.rollNumber}>
                      {item.name} ({item.rollNumber}) - {item.riskStatus} Risk
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Intervention Category Type</label>
                <select
                  value={interventionType}
                  onChange={(e: any) => setInterventionType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Counseling">Academic Counseling</option>
                  <option value="Parent Meeting">Parent-Teacher Consultation</option>
                  <option value="Academic Mentoring">Individual Core Mentoring</option>
                  <option value="Attendance Improvement Plan">Attendance Commitment Compact</option>
                  <option value="Financial Assistance">Scholarship & Financial Assistance</option>
                  <option value="Remedial Classes">Backlog Remedial Classes</option>
                  <option value="Career Guidance">Career Path Mentorship</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Case Notes & Remarks</label>
                <textarea
                  required
                  rows={3}
                  value={interventionRemarks}
                  onChange={(e) => setInterventionRemarks(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                  placeholder="Record discussions, actions, schedules, study agreements..."
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Next Follow-Up Review Date</label>
                <input
                  required
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsInterventionModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={isActionLoading} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold">
                  {isActionLoading ? "Saving..." : "Dispatch Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Update Existing Active Intervention Status & Progress */}
      {isUpdateInterventionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsUpdateInterventionModalOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Workflow className="h-5 w-5 text-blue-600" />
              Update Intervention Progress
            </h3>
            <p className="text-xs text-slate-500 mb-6">Modify tracking state and record improvement scores which reactive-updates student performance metrics on completion.</p>

            <form onSubmit={handleUpdateInterventionSubmit} className="space-y-4 text-xs text-slate-700">
              <div>
                <label className="block font-semibold mb-1">Status State</label>
                <select
                  value={updatingStatus}
                  onChange={(e: any) => setUpdatingStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Pending">Pending Assignment</option>
                  <option value="In Progress">Active (In Progress)</option>
                  <option value="Completed">Completed & Evaluated</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Cumulative Intervention Remarks</label>
                <textarea
                  required
                  rows={3}
                  value={updatingRemarks}
                  onChange={(e) => setUpdatingRemarks(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                  placeholder="Record final outcomes, marks improvement, progress notes..."
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Student Improvement Level (%)</label>
                <input
                  required
                  type="number"
                  min={0}
                  max={100}
                  value={improvementPercentage}
                  onChange={(e) => setImprovementPercentage(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Extended Follow-Up Date</label>
                <input
                  required
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsUpdateInterventionModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={isActionLoading} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold">
                  {isActionLoading ? "Updating..." : "Commit changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
