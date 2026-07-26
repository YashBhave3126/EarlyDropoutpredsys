/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  ShieldAlert, 
  BookOpen, 
  FileText, 
  Download, 
  Smartphone, 
  Laptop, 
  Server, 
  ArrowRight, 
  Sparkles, 
  Users, 
  CheckCircle, 
  UserCheck 
} from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface InstituteUseProps {
  onLoginClick: (role?: string) => void;
}

export default function InstituteUse({ onLoginClick }: InstituteUseProps) {
  const pageRef = React.useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);

  const roles = [
    {
      title: "Central Administrator",
      description: "Oversees department-wide stats, regulates algorithmic systems, and maintains compliance backup files.",
      icon: <Server className="h-6 w-6 text-indigo-600" />,
      roleName: "Administrator",
      usages: [
        "Monitor aggregate student dropout ratios & trends by engineering department",
        "Toggle predictive routing models between Rule-Based or Live Google Gemini API",
        "Download full university student registry CSV sheets & audit logs",
        "Supervise faculty mentor allocations and review campaign metrics"
      ]
    },
    {
      title: "Faculty Advisor & Mentor",
      description: "Direct counselor responsible for registry records, triggering AI diagnostics, and monitoring active student support loops.",
      icon: <Users className="h-6 w-6 text-emerald-600" />,
      roleName: "Faculty",
      usages: [
        "Configure core student academic and socioeconomic parameters",
        "Compute live ML-predicted risk coefficients and custom recommendations",
        "Dispatch campaign interventions (Counseling, Remedials, Parent Meetings)",
        "Log monthly mentor feedback and record student progress scores"
      ]
    },
    {
      title: "Registered College Student",
      description: "Empowered partner accessing private reports, tracking targets, and collaborating on academic progress plans.",
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      roleName: "Student",
      usages: [
        "Access private student dashboards using roll number credentials",
        "Inspect real-time class attendance logs and assignment feedback",
        "Log self-study hours and flag internal health/financial bottlenecks",
        "View advisor recommendations and complete custom remedial schedules"
      ]
    }
  ];

  return (
    <div ref={pageRef} className="py-16 px-6 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-300">
      
      {/* Banner Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span data-reveal="fade" className="text-xs font-extrabold text-blue-600 uppercase tracking-widest font-mono flex items-center justify-center gap-1.5">
          <Smartphone className="h-3.5 w-3.5 text-blue-500 animate-bounce" />
          Enterprise College Suite
        </span>
        <h1 data-reveal className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          How to Deploy & <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Manage the System</span>
        </h1>
        <p data-reveal className="text-slate-600 text-base leading-relaxed">
          Learn how RetainIQ works for different roles in your college hierarchy, and download the native desktop or mobile clients to deploy on campus workstations.
        </p>
      </div>

      {/* Role-Wise Instructions */}
      <div className="space-y-8">
        <div data-reveal className="border-b border-slate-200 pb-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            System Workflows & Role-Based Instructions
          </h2>
          <p className="text-xs text-slate-500 mt-1">Select any role below to pre-configure and launch the active web terminal workspace.</p>
        </div>

        <div data-reveal-cards className="grid lg:grid-cols-3 gap-8">
          {roles.map((r, index) => (
            <div 
              key={index} 
              data-reveal-card
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
              id={`role_card_${index}`}
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                  {r.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{r.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">{r.description}</p>

                <div className="space-y-3 mb-6">
                  <h4 className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                    Core Dashboard Capabilities
                  </h4>
                  <ul className="space-y-2.5">
                    {r.usages.map((usage, uIdx) => (
                      <li key={uIdx} className="flex gap-2 items-start text-xs text-slate-600">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{usage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => onLoginClick(r.roleName)}
                className="w-full mt-4 py-2.5 px-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs rounded-xl border border-slate-200 hover:border-blue-200 transition flex items-center justify-center gap-1.5"
                id={`launch_${r.roleName.toLowerCase()}_btn`}
              >
                <UserCheck className="h-3.5 w-3.5" />
                Launch {r.roleName} Terminal
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Platform Client Downloads */}
      <div data-reveal className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 border border-slate-800">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-semibold">
              <Laptop className="h-3.5 w-3.5" />
              Desktop & Mobile App Center
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
              Get the RetainIQ App on Any Device
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              We provide secure, high-performance offline desktop clients for administrative users and an intuitive mobile app on Google Play Store for faculty on-the-go progress tracking.
            </p>
            <div className="space-y-2.5 text-xs text-blue-200">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Supports secure enterprise offline backup storage
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Real-time Android notifications for early risk triggers
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Fast keyboard hotkeys for registry data entry
              </div>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Desktop Downloads */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-4">
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-white">
                <Laptop className="h-4.5 w-4.5 text-blue-400" />
                Desktop Clients (All Workstations)
              </h3>
              <p className="text-xs text-slate-300">Dedicated installer files compatible with corporate networks:</p>
              
              <div className="grid sm:grid-cols-3 gap-3">
                <button 
                  onClick={() => alert("Downloading RetainIQ for Windows (.msi installer)...")}
                  className="py-2 px-3 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-bold border border-slate-700 hover:border-slate-600 transition flex items-center justify-center gap-1.5"
                >
                  <Download className="h-3 w-3 text-slate-400" />
                  Windows
                </button>
                <button 
                  onClick={() => alert("Downloading RetainIQ for macOS (.dmg)...")}
                  className="py-2 px-3 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-bold border border-slate-700 hover:border-slate-600 transition flex items-center justify-center gap-1.5"
                >
                  <Download className="h-3 w-3 text-slate-400" />
                  macOS
                </button>
                <button 
                  onClick={() => alert("Downloading RetainIQ for Linux (.AppImage)...")}
                  className="py-2 px-3 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-bold border border-slate-700 hover:border-slate-600 transition flex items-center justify-center gap-1.5"
                >
                  <Download className="h-3 w-3 text-slate-400" />
                  Linux
                </button>
              </div>
            </div>

            {/* Mobile Downloads */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-4">
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-white">
                <Smartphone className="h-4.5 w-4.5 text-blue-400" />
                Android Application
              </h3>
              <p className="text-xs text-slate-300">Install the counselor notebook and notifications application:</p>
              
              <button 
                onClick={() => alert("Redirecting to Google Play Store to install RetainIQ...")}
                className="w-full sm:w-auto py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/10"
              >
                <Smartphone className="h-4.5 w-4.5" />
                Get it on Google Play Store
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Gateway container */}
      <div data-reveal className="bg-white border border-slate-200 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Ready to Access Your Portal?</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Log in securely with your academic roll number or mentor credentials to manage students, review predictive charts, and compile reports.
        </p>
        <button
          onClick={() => onLoginClick()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-100 transition"
          id="institute_portal_btn"
        >
          Open Web-Based Workspace
        </button>
      </div>

    </div>
  );
}
