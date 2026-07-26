/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Code, Cpu, Database, Mail, Linkedin, Github, Award, Sparkles, Heart } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function AboutUs() {
  const pageRef = React.useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);

  const team = [
    {
      name: "Yash Bhave",
      role: "Lead Frontend Engineer & UX Designer",
      avatarLetter: "Y",
      colorClass: "bg-blue-600 shadow-blue-100 text-white",
      cardBg: "bg-gradient-to-br from-blue-50/80 via-white to-blue-50/30 border-blue-200/90 hover:border-blue-400 hover:shadow-blue-500/10",
      roleColor: "text-blue-600",
      blurGlow: "bg-blue-400/25",
      bulletColor: "bg-blue-500",
      hoverMail: "hover:text-blue-600 hover:bg-blue-50",
      icon: <Code className="h-4 w-4" />,
      bio: "Dedicated to crafting intuitive, responsive user interfaces and seamless web applications. Designed the overall frontend architecture, interactive design systems, and responsive dashboards across all stakeholder portals.",
      contributions: [
        "Designed responsive UI layouts and component design system",
        "Engineered interactive dashboard views & data visualizers",
        "Implemented smooth animations and UX micro-interactions",
        "Optimized client-side state management & layout accessibility"
      ],
      socials: {
        github: "https://github.com/yashbhave",
        linkedin: "https://linkedin.com/in/yashbhave",
        email: "yashbhave2006@gmail.com"
      }
    },
    {
      name: "Abhay Verma",
      role: "Lead AI Engineer & Machine Learning Architect",
      avatarLetter: "A",
      colorClass: "bg-indigo-600 shadow-indigo-100 text-white",
      cardBg: "bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/30 border-indigo-200/90 hover:border-indigo-400 hover:shadow-indigo-500/10",
      roleColor: "text-indigo-600",
      blurGlow: "bg-indigo-400/25",
      bulletColor: "bg-indigo-500",
      hoverMail: "hover:text-indigo-600 hover:bg-indigo-50",
      icon: <Cpu className="h-4 w-4" />,
      bio: "Specialist in artificial intelligence, machine learning model architectures, and LLM orchestration. Designed the predictive dropout risk classification models and integrated Google Gemini API for automated diagnostic recommendations.",
      contributions: [
        "Architected machine learning dropout risk evaluation models",
        "Integrated Google Gemini API for automated student counseling insights",
        "Designed prompt engineering pipelines and cognitive analysis logic",
        "Engineered real-time confidence rating & risk score algorithms"
      ],
      socials: {
        github: "https://github.com/abhayverma",
        linkedin: "https://linkedin.com/in/abhayverma",
        email: "abhay@university.edu"
      }
    },
    {
      name: "Prince Singh",
      role: "Full-Stack Backend & Database Architect",
      avatarLetter: "P",
      colorClass: "bg-violet-600 shadow-violet-100 text-white",
      cardBg: "bg-gradient-to-br from-violet-50/80 via-white to-violet-50/30 border-violet-200/90 hover:border-violet-400 hover:shadow-violet-500/10",
      roleColor: "text-violet-600",
      blurGlow: "bg-violet-400/25",
      bulletColor: "bg-violet-500",
      hoverMail: "hover:text-violet-600 hover:bg-violet-50",
      icon: <Database className="h-4 w-4" />,
      bio: "Specialized in server-side infrastructure, database architecture, and secure API design. Engineered structured database schemas, role-based authentication flows, and high-performance server route controllers.",
      contributions: [
        "Engineered database schemas and entity relationship models",
        "Built full-stack Express API routes and middleware services",
        "Implemented secure role-based authentication (Admin, Faculty, Student)",
        "Optimized backend data fetching, storage & transaction controllers"
      ],
      socials: {
        github: "https://github.com/princesingh",
        linkedin: "https://linkedin.com/in/princesingh",
        email: "prince@university.edu"
      }
    }
  ];

  return (
    <div ref={pageRef} className="py-16 px-6 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-300">
      
      {/* Editorial Title Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span data-reveal="fade" className="text-xs font-extrabold text-blue-600 uppercase tracking-widest font-mono flex items-center justify-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          The Engineering Team
        </span>
        <h1 data-reveal className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Who Built <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">RetainIQ</span>?
        </h1>
        <p data-reveal className="text-slate-600 text-base leading-relaxed">
          Developed as a final-year graduation capstone project in B.Sc. IT, RetainIQ bridges data science, machine learning models, and administrative educational workflows to tackle the student dropout crisis.
        </p>
      </div>

      {/* Grid of Team Cards */}
      <div data-reveal-cards className="grid md:grid-cols-3 gap-8">
        {team.map((member, index) => (
          <div 
            key={index} 
            data-reveal-card
            className={`border rounded-3xl p-6 shadow-sm backdrop-blur-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${member.cardBg}`}
            id={`team_member_${index}`}
          >
            {/* Ambient Background Blur Glow */}
            <div className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-opacity duration-300 ${member.blurGlow}`} />

            <div className="relative z-10">
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${member.colorClass}`}>
                  {member.avatarLetter}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                    {member.name}
                  </h3>
                  <div className={`flex items-center gap-1.5 text-xs font-bold mt-1 ${member.roleColor}`}>
                    {member.icon}
                    <span>{member.role}</span>
                  </div>
                </div>
              </div>

              {/* Bio description */}
              <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
                {member.bio}
              </p>

              {/* Contributions list */}
              <div className="space-y-2 mb-6">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Key Project Contributions
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {member.contributions.map((contrib, cIdx) => (
                    <li key={cIdx} className="flex gap-2 items-start">
                      <div className={`h-1.5 w-1.5 rounded-full mt-2 shrink-0 ${member.bulletColor}`} />
                      <span>{contrib}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Social icons */}
            <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                Get in touch
              </span>
              <div className="flex gap-2">
                <div 
                  className="p-1.5 text-slate-300 rounded-lg cursor-not-allowed select-none"
                  title="GitHub Profile (Coming Soon)"
                >
                  <Github className="h-4 w-4" />
                </div>
                <div 
                  className="p-1.5 text-slate-300 rounded-lg cursor-not-allowed select-none"
                  title="LinkedIn Profile (Coming Soon)"
                >
                  <Linkedin className="h-4 w-4" />
                </div>
                <a 
                  href={`mailto:${member.socials.email}`}
                  className={`p-1.5 text-slate-500 rounded-lg transition ${member.hoverMail}`}
                  title="Send Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Project Vision section */}
      <div data-reveal className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[250px] bg-gradient-to-bl from-blue-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl -z-10" />
        
        <div className="max-w-3xl space-y-6 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-semibold">
            <Award className="h-3.5 w-3.5 text-blue-400" />
            Our Mission & Capstone Objectives
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Advancing Student Retention Through Data Science
          </h2>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            By analyzing multivariant dependencies—ranging from core grades and classroom attendance rates to individual home environments, self-study cycles, and family background parameters—we hope to equip academic mentors with the ultimate predictive armor against graduation dropouts.
          </p>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 pt-2">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
            <span>by Yash, Abhay & Prince. Mumbai, Maharashtra, India.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
