/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GraduationCap, Menu, X, Brain, Building2, LayoutDashboard, Sparkles, PhoneCall } from "lucide-react";

interface HeaderProps {
  currentView: string;
  onNavigate: (view: "landing" | "about" | "research" | "institute" | "auth") => void;
  onScrollTrigger: (sectionId: string) => void;
  onLoginClick: (role?: string) => void;
}

export default function Header({ currentView, onNavigate, onScrollTrigger, onLoginClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMiddleLink = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    onScrollTrigger(sectionId);
  };

  const handleViewNav = (view: "landing" | "about" | "research" | "institute" | "auth") => {
    setIsMobileMenuOpen(false);
    onNavigate(view);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Side: Brand Logo and Name */}
        <div 
          onClick={() => handleViewNav("landing")} 
          className="flex items-center gap-3 cursor-pointer select-none group"
          id="header_brand_logo"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-100 group-hover:scale-105 transition duration-200">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-blue-600">
              RetainIQ
            </span>
          </div>
        </div>

        {/* Middle Navigation: Home, AboutUs, Howitworks, ContactUs */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <button
            onClick={() => handleViewNav("landing")}
            className={`hover:text-blue-600 transition outline-none cursor-pointer ${
              currentView === "landing" ? "text-blue-600 font-bold border-b-2 border-blue-600/50 pb-0.5" : ""
            }`}
            id="nav_home_btn"
          >
            Home
          </button>
          <button
            onClick={() => handleViewNav("about")}
            className={`hover:text-blue-600 transition outline-none cursor-pointer ${
              currentView === "about" ? "text-blue-600 font-bold border-b-2 border-blue-600/50 pb-0.5" : ""
            }`}
            id="nav_about_btn"
          >
            About Us
          </button>
          <button
            onClick={() => handleMiddleLink("how-it-works")}
            className="hover:text-blue-600 transition outline-none cursor-pointer"
            id="nav_howitworks_btn"
          >
            How It Works
          </button>
          <button
            onClick={() => handleMiddleLink("contact")}
            className="hover:text-blue-600 transition outline-none cursor-pointer"
            id="nav_contact_btn"
          >
            Contact Us
          </button>
        </nav>

        {/* Right Side: ResearchUse and InstituteUse */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleViewNav("research")}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              currentView === "research"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
            }`}
            id="nav_research_use_btn"
          >
            <Brain className="h-3.5 w-3.5" />
            ResearchUse
          </button>
          <button
            onClick={() => handleViewNav("institute")}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm ${
              currentView === "institute"
                ? "bg-blue-600 text-white shadow-blue-100"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
            id="nav_institute_use_btn"
          >
            <Building2 className="h-3.5 w-3.5" />
            InstituteUse
          </button>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
            id="mobile_menu_toggle"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-3 font-semibold text-sm text-slate-600 px-2">
            <button
              onClick={() => handleViewNav("landing")}
              className={`text-left py-2 hover:text-blue-600 ${currentView === "landing" ? "text-blue-600 font-bold" : ""}`}
            >
              Home
            </button>
            <button
              onClick={() => handleViewNav("about")}
              className={`text-left py-2 hover:text-blue-600 ${currentView === "about" ? "text-blue-600 font-bold" : ""}`}
            >
              About Us
            </button>
            <button
              onClick={() => handleMiddleLink("how-it-works")}
              className="text-left py-2 hover:text-blue-600"
            >
              How It Works
            </button>
            <button
              onClick={() => handleMiddleLink("contact")}
              className="text-left py-2 hover:text-blue-600"
            >
              Contact Us
            </button>
          </div>
          <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
            <button
              onClick={() => handleViewNav("research")}
              className="w-full py-3 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center gap-2"
            >
              <Brain className="h-4 w-4" />
              ResearchUse (Sandbox Analysis)
            </button>
            <button
              onClick={() => handleViewNav("institute")}
              className="w-full py-3 text-xs font-bold rounded-xl bg-slate-900 text-white flex items-center justify-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              InstituteUse (Core System)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
