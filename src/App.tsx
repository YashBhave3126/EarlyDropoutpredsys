/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Student, Intervention, Faculty, UserRole } from "./types";
import LandingPage from "./components/LandingPage";
import AuthModal from "./components/AuthModal";
import StudentDashboard from "./components/StudentDashboard";
import FacultyDashboard from "./components/FacultyDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ResearchPortal from "./components/ResearchPortal";
import Header from "./components/Header";
import AboutUs from "./components/AboutUs";
import InstituteUse from "./components/InstituteUse";
import { GraduationCap, ArrowLeft, RefreshCw } from "lucide-react";

export default function App() {
  const [view, setView] = useState<"landing" | "about" | "research" | "institute" | "auth" | "dashboard">("landing");
  const [lastPublicView, setLastPublicView] = useState<"landing" | "about" | "research" | "institute">("landing");
  const [scrollToSectionId, setScrollToSectionId] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isGeminiActive, setIsGeminiActive] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<string | undefined>(undefined);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // Sync state with server in-memory database
  const fetchState = async () => {
    try {
      const currentToken = localStorage.getItem("token");
      const res = await fetch("/api/state", {
        headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : {}
      });
      const data = await res.json();
      setStudents(data.students || []);
      setInterventions(data.interventions || []);
      setFaculties(data.faculties || []);
      setCurrentUser(data.currentUser);
      setIsGeminiActive(data.isGeminiActive);
      
      // If server has active user session, restore view
      if (data.currentUser) {
        setView("dashboard");
      }
    } catch (err) {
      console.error("Error synchronizing full-stack state:", err);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleNavigate = (targetView: "landing" | "about" | "research" | "institute" | "auth") => {
    if (targetView !== "auth") {
      setLastPublicView(targetView);
    }
    setView(targetView);
  };

  const handleScrollTrigger = (sectionId: string) => {
    setScrollToSectionId(sectionId);
    handleNavigate("landing");
  };

  const handleLoginSuccess = (user: any, newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setCurrentUser(user);
    setView("dashboard");
    fetchState();
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      localStorage.removeItem("token");
      setToken(null);
      setCurrentUser(null);
      handleNavigate("landing");
      fetchState();
    } catch (err) {
      console.error(err);
    }
  };

  // Student API Submit
  const handleStudentSubmit = async (studentData: any) => {
    try {
      const currentToken = localStorage.getItem("token");
      await fetch("/api/students", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {})
        },
        body: JSON.stringify(studentData),
      });
      await fetchState();
    } catch (err) {
      console.error("Error creating student record:", err);
    }
  };

  // Intervention API Submit
  const handleInterventionSubmit = async (interventionData: any) => {
    try {
      const currentToken = localStorage.getItem("token");
      await fetch("/api/interventions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {})
        },
        body: JSON.stringify(interventionData),
      });
      await fetchState();
    } catch (err) {
      console.error("Error registering intervention:", err);
    }
  };

  // Intervention Status Patch API
  const handleInterventionUpdate = async (id: string, updateData: any) => {
    try {
      const currentToken = localStorage.getItem("token");
      await fetch(`/api/interventions/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {})
        },
        body: JSON.stringify(updateData),
      });
      await fetchState();
    } catch (err) {
      console.error("Error patching intervention:", err);
    }
  };

  // Trigger prediction manual recalculation via API
  const handleTriggerPrediction = async (rollNumber: string) => {
    try {
      const currentToken = localStorage.getItem("token");
      await fetch("/api/students/predict", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {})
        },
        body: JSON.stringify({ rollNumber }),
      });
      await fetchState();
    } catch (err) {
      console.error("Error triggering live predictions:", err);
    }
  };

  // Reset database values
  const handleResetDatabase = async () => {
    try {
      const currentToken = localStorage.getItem("token");
      await fetch("/api/reset", { 
        method: "POST",
        headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : {}
      });
      await fetchState();
    } catch (err) {
      console.error(err);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-indigo-950 flex flex-col justify-center items-center text-white font-sans gap-4 p-6">
        <div className="h-12 w-12 rounded-xl bg-indigo-500 flex items-center justify-center animate-bounce shadow-lg shadow-indigo-500/30">
          <GraduationCap className="h-7 w-7 text-white" />
        </div>
        <div className="text-center">
          <h2 className="font-bold text-lg">AcademiaPredict Core Bootloader</h2>
          <p className="text-xs text-indigo-300 mt-1 flex items-center justify-center gap-1.5 font-mono">
            <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />
            Synchronizing database rows...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {view !== "dashboard" && (
        <Header 
          currentView={view}
          onNavigate={handleNavigate}
          onScrollTrigger={handleScrollTrigger}
          onLoginClick={(role) => {
            setAuthInitialRole(role);
            handleNavigate("auth");
          }}
        />
      )}

      <main className={view !== "dashboard" ? "pt-20" : ""}>
        {view === "landing" && (
          <LandingPage
            onLoginClick={(role) => {
              setAuthInitialRole(role);
              handleNavigate("auth");
            }}
            onExploreResearch={() => handleNavigate("research")}
            scrollToSectionId={scrollToSectionId}
            onScrollComplete={() => setScrollToSectionId(null)}
          />
        )}

        {view === "about" && (
          <AboutUs />
        )}

        {view === "institute" && (
          <InstituteUse
            onLoginClick={(role) => {
              setAuthInitialRole(role);
              handleNavigate("auth");
            }}
          />
        )}

        {view === "auth" && (
          <AuthModal
            onClose={() => setView(lastPublicView)}
            onLoginSuccess={handleLoginSuccess}
            initialRole={authInitialRole}
          />
        )}

        {view === "research" && (
          <ResearchPortal
            students={students}
            onBack={() => handleNavigate("landing")}
          />
        )}
      </main>

      {view === "dashboard" && currentUser && (
        <>
          {currentUser.role === UserRole.ADMIN && (
            <AdminDashboard
              students={students}
              interventions={interventions}
              faculties={faculties}
              isGeminiActive={isGeminiActive}
              onLogout={handleLogout}
              onResetDatabase={handleResetDatabase}
            />
          )}

          {currentUser.role === UserRole.FACULTY && (
            <FacultyDashboard
              students={students}
              interventions={interventions}
              activeFacultyName={currentUser.name}
              activeFacultyDept={currentUser.department || "Information Technology"}
              onLogout={handleLogout}
              onStudentSubmit={handleStudentSubmit}
              onInterventionSubmit={handleInterventionSubmit}
              onInterventionUpdate={handleInterventionUpdate}
              onTriggerPrediction={handleTriggerPrediction}
            />
          )}

          {currentUser.role === UserRole.STUDENT && (() => {
            const matchedStudent = students.find(s => s.rollNumber === currentUser.rollNumber);
            if (matchedStudent) {
              return (
                <StudentDashboard
                  student={matchedStudent}
                  interventions={interventions}
                  onLogout={handleLogout}
                />
              );
            } else {
              return (
                <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 p-6">
                  <div className="max-w-md bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-lg">
                    <GraduationCap className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">Student Profile Not Registered</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Your credentials did not match any student record registered in the administrative databases. Please contact your department head to add your roll number.
                    </p>
                    <button
                      onClick={handleLogout}
                      className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
                    >
                      Return to Landing Page
                    </button>
                  </div>
                </div>
              );
            }
          })()}
        </>
      )}
    </div>
  );
}
