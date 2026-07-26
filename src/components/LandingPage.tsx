/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { gsap } from "gsap";
import { useScrollReveal } from "../hooks/useScrollReveal";
import SplitWords from "./SplitWords";
import graduatingStudentsImg from "../assets/images/graduating_students_illustration_1784823773737.jpg";
import HeroCanvas from "./HeroCanvas";
import { 
  GraduationCap, 
  TrendingUp, 
  AlertTriangle, 
  Brain, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Database, 
  Cpu, 
  Server, 
  Award, 
  BarChart3, 
  LayoutDashboard, 
  Activity, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  Workflow,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  Lightbulb,
  Search,
  LineChart,
  CheckCircle2,
  ChevronRight,
  UserCheck,
  Zap
} from "lucide-react";

const pipelineSteps = [
  {
    id: "pipeline-step-1",
    stepNumber: "01",
    title: "Multivariant Telemetry Data Aggregation",
    shortTitle: "Multivariant Telemetry",
    subtitle: "Data Ingestion & Feature Engineering",
    description: "The database aggregates and formats core student academic and demographic records into unified vector arrays ready for real-time predictive analysis.",
    details: [
      "GPA history & semester grade trajectories across all subjects",
      "Cumulative backlog counts and failed course histories",
      "Biometric attendance logs & lecture participation percentages",
      "Socioeconomic indicators & parental background factors",
      "Behavioral study hours & LMS digital activity tracking"
    ],
    icon: Database,
    badge: "Phase 01 — Data Input"
  },
  {
    id: "pipeline-step-2",
    stepNumber: "02",
    title: "Diagnostic Machine Learning Engine",
    shortTitle: "Diagnostic ML Engine",
    subtitle: "Classification & LLM Synthesis",
    description: "The algorithmic core processes multi-dimensional data vectors through Random Forest classifiers and Google Gemini AI to predict precision-weighted risk profiles.",
    details: [
      "Random Forest ensemble classifiers with hyper-parameter tuning",
      "Gradient Boosting models for non-linear correlation detection",
      "Google Gemini AI integration for qualitative risk reasoning",
      "Real-time confidence scoring & automated risk classification"
    ],
    icon: Brain,
    badge: "Phase 02 — Processing"
  },
  {
    id: "pipeline-step-3",
    stepNumber: "03",
    title: "Research Sandboxing & Analytics",
    shortTitle: "Research Sandboxing",
    subtitle: "Feature Weight & Matrix Analysis",
    description: "Researchers and academic reviewers access the dedicated ResearchUse workspace to inspect raw datasets, analyze weight matrices, and run test sandboxes.",
    details: [
      "Interactive heatmaps & multidimensional correlation matrices",
      "Random Forest feature importance visualizers",
      "Custom scenario sandbox testing & synthetic student simulation",
      "Cross-departmental retention metric comparisons"
    ],
    icon: BarChart3,
    badge: "Phase 03 — Research"
  },
  {
    id: "pipeline-step-4",
    stepNumber: "04",
    title: "Institutional Deployment & Interventions",
    shortTitle: "Institutional Clients",
    subtitle: "Multi-Platform Workspace & Counseling",
    description: "Advisors, mentors, and administrators deploy timely corrective actions through web, desktop, and mobile workspace portals.",
    details: [
      "Role-based dashboards for Admins, Faculty Mentors, and Students",
      "Automated early warning notifications & risk flag alerts",
      "Tailored intervention trackers (remedial classes, parent meets)",
      "Native workstation desktop apps and Android Play Store apps"
    ],
    icon: ShieldCheck,
    badge: "Phase 04 — Execution"
  }
];

const targetBeneficiaries = [
  {
    id: "faculty",
    role: "Academic Mentors",
    badge: "Counseling & Guidance",
    icon: Users,
    subtitle: "Faculty & Peer Mentors",
    description: "Counsel individual mentees using automated AI recommendations, review socioeconomic trends, track intervention progress, and document monthly student feedback remarks.",
    highlights: [
      "Automated AI counseling recommendations",
      "Socioeconomic risk factor breakdowns",
      "Student progress & feedback logs"
    ],
    metric: "1:1 Mentorship",
    loginRole: "faculty"
  },
  {
    id: "student",
    role: "College Students",
    badge: "Self-Awareness & Growth",
    icon: GraduationCap,
    subtitle: "Undergraduate & Graduate Students",
    description: "Access private reports on attendance, view pending assignments, evaluate self-study indicators, track risk scores, and coordinate directly with peer tutors.",
    highlights: [
      "Private attendance & gradebook view",
      "Personal study pace recommendations",
      "Direct peer-tutor scheduling"
    ],
    metric: "Student Centric",
    loginRole: "student"
  },
  {
    id: "dept_heads",
    role: "Department Heads",
    badge: "Academic Oversight",
    icon: Award,
    subtitle: "Chairs & Deans",
    description: "Review department-wide attendance distributions, map retention indicators across semesters, and coordinate targeted funding allocation for high-risk classes.",
    highlights: [
      "Department-wide attendance distribution",
      "Semester-to-semester retention trends",
      "Targeted remedial budget allocation"
    ],
    metric: "Macro Analytics",
    loginRole: "admin"
  },
  {
    id: "administrators",
    role: "Administrators",
    badge: "System Control",
    icon: Workflow,
    subtitle: "Registrars & Directors",
    description: "Analyze student registration pipelines, manage faculty assignments, export compliance sheets, adjust threshold parameters, and regulate AI predictive models.",
    highlights: [
      "Role-based access & security rules",
      "Compliance & audit reporting",
      "Custom model probability tuning"
    ],
    metric: "Full Control",
    loginRole: "admin"
  }
];

interface LandingPageProps {
  onLoginClick: (role?: string) => void;
  onExploreResearch: () => void;
  scrollToSectionId?: string | null;
  onScrollComplete?: () => void;
}

export default function LandingPage({ 
  onLoginClick, 
  onExploreResearch, 
  scrollToSectionId, 
  onScrollComplete 
}: LandingPageProps) {
  const [activePipelineStep, setActivePipelineStep] = React.useState(0);
  const heroImageRef = React.useRef<HTMLDivElement>(null);
  const pageRef = React.useRef<HTMLDivElement>(null);

  // Scroll-triggered reveal animations for text & cards throughout the page
  useScrollReveal(pageRef);

  // Hero Image floating animation with GSAP
  React.useEffect(() => {
    if (heroImageRef.current) {
      gsap.to(heroImageRef.current, {
        y: -14,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      pipelineSteps.forEach((step, index) => {
        const el = document.getElementById(step.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 350 && rect.bottom >= 100) {
            setActivePipelineStep(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToPipelineStep = (id: string, index: number) => {
    setActivePipelineStep(index);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  React.useEffect(() => {
    if (scrollToSectionId) {
      const element = document.getElementById(scrollToSectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      onScrollComplete?.();
    }
  }, [scrollToSectionId, onScrollComplete]);

  return (
    <div ref={pageRef} className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-28 sm:pb-36 lg:pb-40 px-6 lg:pt-20 bg-[#223de4] text-white">
        {/* Interactive Neural Canvas Background */}
        <HeroCanvas />

        <div data-parallax="0.25" className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-400/20 to-indigo-300/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero Content (Left Column) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill with floating lightbulb icon */}
            <div data-reveal="fade" className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 text-[#223de4] text-xs sm:text-sm font-bold mb-8 border border-white/40 shadow-lg backdrop-blur-md">
              <span>Improve your performance with RetainIQ</span>
              <div className="absolute -top-3.5 -right-3.5 bg-white p-1 rounded-full shadow-md border border-amber-200 text-amber-500 animate-bounce">
                <Lightbulb className="h-5 w-5 fill-amber-400 stroke-amber-500" />
              </div>
            </div>
            
            <h1 data-reveal className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none mb-6 text-left">
              Early Dropout <span className="text-amber-300">Prediction</span> <br className="hidden sm:inline" />System
            </h1>
            
            <p data-reveal className="text-left text-base sm:text-lg text-blue-100 mb-8 leading-relaxed font-sans max-w-2xl">
              Empowering educational institutions with intelligent analytics to monitor student performance, identify at-risk students early, and implement timely interventions that improve student success and retention.
            </p>
            
            {/* 5 Dark Blue/Indigo Rounded Icon Buttons */}
            <div data-reveal-cards className="flex items-center justify-start gap-3 sm:gap-4 mb-8">
              <div data-reveal-card className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#131175] text-white border border-blue-400/30 flex items-center justify-center shadow-lg hover:scale-110 hover:bg-blue-900 transition-all duration-200 select-none cursor-pointer" id="hero_icon_book">
                <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.8]" />
              </div>

              <div data-reveal-card className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#131175] text-white border border-blue-400/30 flex items-center justify-center shadow-lg hover:scale-110 hover:bg-blue-900 transition-all duration-200 select-none cursor-pointer" id="hero_icon_student">
                <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.8]" />
              </div>

              <div data-reveal-card className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#131175] text-white border border-blue-400/30 flex items-center justify-center shadow-lg hover:scale-110 hover:bg-blue-900 transition-all duration-200 select-none cursor-pointer" id="hero_icon_database">
                <Database className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.8]" />
              </div>

              <div data-reveal-card className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#131175] text-white border border-blue-400/30 flex items-center justify-center shadow-lg hover:scale-110 hover:bg-blue-900 transition-all duration-200 select-none cursor-pointer" id="hero_icon_search">
                <Search className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.8]" />
              </div>

              <div data-reveal-card className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#131175] text-white border border-blue-400/30 flex items-center justify-center shadow-lg hover:scale-110 hover:bg-blue-900 transition-all duration-200 select-none cursor-pointer" id="hero_icon_success">
                <Award className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.8]" />
              </div>
            </div>
          </div>

          {/* Hero Image & Metrics (Right Column) */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center gap-6">
            <div 
              ref={heroImageRef}
              className="relative w-full flex items-center justify-center p-4 bg-white/95 rounded-3xl shadow-2xl backdrop-blur-md border border-white/20"
            >
              <img 
                src={graduatingStudentsImg} 
                alt="Graduating Students Celebrating" 
                className="w-full max-w-md h-auto object-contain select-none rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Quick Metrics (Below Image) */}
            <div data-reveal-cards className="grid grid-cols-3 gap-3 sm:gap-4 w-full">
              <div data-reveal-card className="p-3.5 bg-white text-slate-900 border border-white/40 rounded-2xl text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-default shadow-md">
                <span data-counter="92" data-counter-suffix="%" className="block text-2xl sm:text-3xl font-extrabold text-[#223de4] font-mono">0%</span>
                <span className="text-[11px] sm:text-xs text-slate-600 font-semibold leading-tight">Prediction Accuracy</span>
              </div>
              <div data-reveal-card className="p-3.5 bg-white text-slate-900 border border-white/40 rounded-2xl text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-default shadow-md">
                <span data-counter="45" data-counter-suffix="%" className="block text-2xl sm:text-3xl font-extrabold text-[#223de4] font-mono">0%</span>
                <span className="text-[11px] sm:text-xs text-slate-600 font-semibold leading-tight">Risk Reduction</span>
              </div>
              <div data-reveal-card className="p-3.5 bg-white text-slate-900 border border-white/40 rounded-2xl text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-default shadow-md">
                <span data-counter="15" data-counter-suffix="m+" className="block text-2xl sm:text-3xl font-extrabold text-[#223de4] font-mono">0m+</span>
                <span className="text-[11px] sm:text-xs text-slate-600 font-semibold leading-tight">Students Monitored</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Curved Shape */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg 
            className="relative block w-full h-12 sm:h-20 lg:h-24 text-slate-50 fill-current" 
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none"
          >
            <path d="M0,0 Q720,110 1440,0 L1440,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* About Project Section */}
      <section id="about" className="py-20 px-6 border-t border-slate-200/50 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span data-reveal="fade" className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">The Challenge & The Solution</span>
            <SplitWords
              as="h2"
              text="Why Academic Analytics Matters"
              className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2 block"
            />
            <p data-reveal className="text-slate-600 mt-4 leading-relaxed font-normal text-base">
              Student dropouts represent lost opportunities, wasted resources, and altered futures. This project addresses structural systemic dropouts through early diagnostic machine learning algorithms.
            </p>
          </div>

          <div className="relative">
            {/* Black connecting line running behind the boxes */}
            <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-black -translate-y-1/2 z-0 hidden md:block rounded-full shadow-sm" />

            <div data-reveal-cards className="grid md:grid-cols-3 gap-8 relative z-10">
              <div data-reveal-card className="p-6 rounded-2xl bg-[#223de4] text-white border border-blue-500/30 shadow-xl hover:-translate-y-1 transition-all duration-300 relative z-10">
                <div data-reveal-icon className="h-12 w-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-md">
                  <AlertTriangle className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Understanding Student Risk</h3>
                <p className="text-sm text-blue-100 leading-relaxed font-normal">
                  Dropout rates stem from a complex interaction of academic friction, financial bottlenecks, healthcare issues, distance, and lack of individual mentoring. Identifying these symptoms manually in large classes is near impossible.
                </p>
              </div>

              <div data-reveal-card className="p-6 rounded-2xl bg-[#223de4] text-white border border-blue-500/30 shadow-xl hover:-translate-y-1 transition-all duration-300 relative z-10">
                <div data-reveal-icon className="h-12 w-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-md">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Machine Learning Diagnostics</h3>
                <p className="text-sm text-blue-100 leading-relaxed font-normal">
                  Our Random Forest and gradient-boosted diagnostic model evaluates attendance trends, grade progressions, home internet conditions, family socioeconomic scores, and behavioral study hours to compute precise risk probabilities.
                </p>
              </div>

              <div data-reveal-card className="p-6 rounded-2xl bg-[#223de4] text-white border border-blue-500/30 shadow-xl hover:-translate-y-1 transition-all duration-300 relative z-10">
                <div data-reveal-icon className="h-12 w-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-md">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Early Actionable Interventions</h3>
                <p className="text-sm text-blue-100 leading-relaxed font-normal">
                  Analytics are useless without action. The platform bridges predictive analysis to corrective action, allowing faculty counselors to design, dispatch, and monitor tailored intervention plans (remedials, parent meetings, counseling).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section — Side Scroll Navigation */}
      <section id="how-it-works" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#223de4] text-white relative">
        <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span data-reveal="fade" className="text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-widest font-mono bg-white/10 px-4 py-1.5 rounded-full border border-white/20 inline-block mb-3">
              Operations Blueprint
            </span>
            <SplitWords
              as="h2"
              text="System Processing Pipeline & How It Works"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-2 block"
            />
            <p data-reveal className="text-blue-100/90 mt-4 leading-relaxed text-base sm:text-lg">
              RetainIQ connects multivariant academic data arrays, machine learning diagnostics, research environments, and enterprise-level college management software. Learn how the system functions across each distinct pipeline phase.
            </p>
          </div>

          {/* Sticky Mobile Horizontal Tab Bar (Visible on screens smaller than lg) */}
          <div className="lg:hidden sticky top-16 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#1930c2]/95 backdrop-blur-md border-y border-white/20 shadow-lg overflow-x-auto flex items-center gap-2">
            {pipelineSteps.map((step, idx) => {
              const isActive = activePipelineStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => scrollToPipelineStep(step.id, idx)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                    isActive
                      ? "bg-white text-[#223de4] font-bold shadow-md scale-105"
                      : "bg-white/10 text-blue-100 hover:bg-white/20"
                  }`}
                >
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center font-mono text-[10px] ${
                    isActive ? "bg-[#223de4] text-white" : "bg-white/20 text-white"
                  }`}>
                    {step.stepNumber}
                  </span>
                  <span>{step.shortTitle}</span>
                </button>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start relative">
            {/* Left Column: Sticky Side Scroll Navigation Bar (Desktop lg+) */}
            <div className="lg:col-span-4 sticky top-28 hidden lg:block space-y-4 bg-[#172dbd]/70 p-6 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-md">
              <div className="text-xs font-bold uppercase text-blue-200 tracking-wider font-mono pb-3 border-b border-white/15 flex items-center justify-between">
                <span>Pipeline Navigation</span>
                <span className="text-white/80 text-xs font-normal">Step {activePipelineStep + 1} of 4</span>
              </div>

              <div className="relative pl-3 border-l-2 border-white/20 space-y-1.5">
                {pipelineSteps.map((step, idx) => {
                  const isActive = activePipelineStep === idx;
                  return (
                    <button
                      key={step.id}
                      onClick={() => scrollToPipelineStep(step.id, idx)}
                      className={`w-full text-left py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-between group relative ${
                        isActive
                          ? "bg-white/20 text-white font-bold shadow-sm backdrop-blur-sm"
                          : "text-blue-200/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {/* Active indicator bar on vertical line */}
                      <div 
                        className={`absolute -left-[15px] top-2 bottom-2 w-1.5 rounded-r-full transition-all duration-300 ${
                          isActive ? "bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" : "bg-transparent"
                        }`} 
                      />

                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                          isActive ? "bg-white text-[#223de4]" : "bg-white/10 text-blue-200"
                        }`}>
                          {step.stepNumber}
                        </span>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold truncate block">
                            {step.shortTitle}
                          </span>
                          <span className={`text-[11px] truncate block ${isActive ? "text-blue-100" : "text-blue-200/60"}`}>
                            {step.badge}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${
                        isActive ? "text-white translate-x-1" : "text-blue-300/40 group-hover:text-white group-hover:translate-x-0.5"
                      }`} />
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-white/10 text-center">
                <span className="text-[11px] text-blue-200/80 font-mono">Scroll down to explore phases</span>
              </div>
            </div>

            {/* Right Column: Clean Content Typography (No white background boxes!) */}
            <div className="lg:col-span-8 space-y-16 lg:space-y-20">
              {pipelineSteps.map((step, idx) => {
                const IconComp = step.icon;
                return (
                  <div
                    key={step.id}
                    id={step.id}
                    data-reveal
                    className={`scroll-mt-32 pb-12 transition-all duration-300 ${
                      idx < pipelineSteps.length - 1 ? "border-b border-white/20" : ""
                    }`}
                  >
                    {/* Badge & Step indicator */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-xs sm:text-sm font-mono uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-white/15 text-blue-100 border border-white/20">
                        {step.badge}
                      </span>
                      <span className="text-xs font-mono font-bold text-blue-200/80">
                        PHASE {step.stepNumber}
                      </span>
                    </div>

                    {/* Section Title with Icon */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 mt-1 shadow-md">
                        <IconComp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                          {step.title}
                        </h3>
                        <p className="text-sm sm:text-base font-semibold text-blue-200 mt-1">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Main Description */}
                    <p className="text-base sm:text-lg lg:text-xl text-blue-50/90 leading-relaxed font-normal mb-8">
                      {step.description}
                    </p>

                    {/* Key Specifications / Components List */}
                    <div className="space-y-4 bg-white/10 border border-white/20 p-6 sm:p-8 rounded-2xl backdrop-blur-sm">
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider font-mono text-blue-200">
                        Key Components & Architecture
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4 pt-1">
                        {step.details.map((detail, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-200 mt-0.5" />
                            <span className="text-sm sm:text-base text-blue-50 leading-snug">
                              {detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Two Purposes / Dual Approach Section */}
      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span data-reveal="fade" className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Dual Architectural Purpose</span>
            <SplitWords
              as="h2"
              text="Serving Researchers & Educators Alike"
              className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2 block"
            />
          </div>

          <div data-reveal-cards className="grid lg:grid-cols-2 gap-12">
            {/* Purpose 1: Research Portal */}
            <div data-reveal-card className="bg-slate-950 text-white rounded-2xl p-8 border border-slate-900 shadow-sm flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/80 text-violet-300 text-xs font-semibold mb-6 border border-violet-800/60">
                  <Activity className="h-3 w-3" />
                  Academic Research & Data Analysis
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Empowering Educational Research</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Perfect for students, researchers, project reviewers, and department heads. Explore raw student databases, evaluate model performance metrics, plot correlation matrices, view feature importances (how study hours vs attendance weight dropout risk), and compare historical semester trends.
                </p>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-violet-400" />
                    Interactive Heatmaps & Correlation Matrices
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-violet-400" />
                    Random Forest Feature Importance Visualizers
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-violet-400" />
                    Dataset distributions, department-wise cross comparisons
                  </li>
                </ul>
              </div>
              <button 
                onClick={onExploreResearch}
                className="w-full py-3 bg-white text-slate-950 hover:bg-slate-100 font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2"
                id="purpose_research_btn"
              >
                Access Research Sandbox
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Purpose 2: Management Portal */}
            <div data-reveal-card className="bg-slate-950 text-white rounded-2xl p-8 border border-slate-900 shadow-sm flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 text-blue-300 text-xs font-semibold mb-6 border border-blue-800">
                  <LayoutDashboard className="h-3 w-3" />
                  Institutional Management Portal
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Operational Administration Portal</h3>
                <p className="text-blue-200 text-sm leading-relaxed mb-6">
                  Designed for college directors, academic mentors, registrars, and faculty counselors. This is the operational core of the platform. Track students, submit grades & attendance, register active risk profiles, initialize personalized intervention logs, and monitor structural student retention rates.
                </p>
                <ul className="space-y-3 text-sm text-blue-200 mb-8">
                  <li className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                    Role-based Dashboard (Admin, Faculty, Student)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                    Secure Student Registry, Attendance & Gradebooks
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                    Corrective Intervention Tracker & Progress Logs
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => onLoginClick()}
                className="w-full py-3 bg-white text-slate-950 hover:bg-slate-50 font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2"
                id="purpose_portal_btn"
              >
                Launch Management Portal
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users Section */}
      <section className="py-20 px-6 bg-[#223de4] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span data-reveal="fade" className="text-xs font-bold text-blue-200 uppercase tracking-widest font-mono">System Beneficiaries</span>
            <SplitWords
              as="h2"
              text="Who is the Platform Designed For?"
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 block"
            />
            <p data-reveal className="text-blue-100/90 mt-3 text-base sm:text-lg">
              Tailored experience and actionable diagnostic intelligence for every stakeholder in the educational ecosystem.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line running behind the boxes */}
            <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-black -translate-y-1/2 z-0 hidden lg:block rounded-full shadow-sm" />

            <div data-reveal-cards className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              <div data-reveal-card className="p-6 bg-white text-slate-900 rounded-2xl border border-white/20 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative z-10">
                <div>
                  <Users data-reveal-icon className="h-8 w-8 text-[#223de4] mb-4" />
                  <h4 className="font-bold text-slate-900 mb-2 text-lg">Academic Mentors</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Counsel individual mentees using automated AI recommendations, review socioeconomic trends, and document monthly student feedback remarks.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onLoginClick("faculty")}
                    className="w-full text-left text-xs font-bold text-[#223de4] hover:text-blue-800 flex items-center justify-between group"
                  >
                    <span>Explore Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              <div data-reveal-card className="p-6 bg-white text-slate-900 rounded-2xl border border-white/20 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative z-10">
                <div>
                  <GraduationCap data-reveal-icon className="h-8 w-8 text-[#223de4] mb-4" />
                  <h4 className="font-bold text-slate-900 mb-2 text-lg">College Students</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Access private reports on attendance, view pending assignments, evaluate self-study indicators, and coordinate with peer tutors.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onLoginClick("student")}
                    className="w-full text-left text-xs font-bold text-[#223de4] hover:text-blue-800 flex items-center justify-between group"
                  >
                    <span>Explore Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              <div data-reveal-card className="p-6 bg-white text-slate-900 rounded-2xl border border-white/20 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative z-10">
                <div>
                  <Award data-reveal-icon className="h-8 w-8 text-[#223de4] mb-4" />
                  <h4 className="font-bold text-slate-900 mb-2 text-lg">Department Heads</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Review department-wide attendance distributions, map retention indicators, and coordinate funding allocation for high-risk classes.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onLoginClick("admin")}
                    className="w-full text-left text-xs font-bold text-[#223de4] hover:text-blue-800 flex items-center justify-between group"
                  >
                    <span>Explore Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              <div data-reveal-card className="p-6 bg-white text-slate-900 rounded-2xl border border-white/20 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative z-10">
                <div>
                  <Workflow data-reveal-icon className="h-8 w-8 text-[#223de4] mb-4" />
                  <h4 className="font-bold text-slate-900 mb-2 text-lg">Administrators</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Analyze student registration pipelines, manage faculty assignments, export compliance sheets, and regulate AI predictive models.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onLoginClick("admin")}
                    className="w-full text-left text-xs font-bold text-[#223de4] hover:text-blue-800 flex items-center justify-between group"
                  >
                    <span>Explore Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-slate-50 border-t border-slate-200/50">
        <div data-reveal className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Contact & Inquiries</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-4">Get in Touch</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Are you an educational researcher or institution representative interested in running RetainIQ? Reach out to our B.Sc. IT project coordination desk.
              </p>

              <div className="space-y-3.5 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <Mail className="h-4.5 w-4.5 text-blue-600" />
                  <span>support@retainiq.edu</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4.5 w-4.5 text-blue-600" />
                  <span>+1 (555) 019-2834</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4.5 w-4.5 text-blue-600" />
                  <span>Mumbai University, Maharashtra, India</span>
                </div>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your message has been sent successfully."); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Your Name</label>
                <input required type="text" className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Institution/Email</label>
                <input required type="email" className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition" placeholder="john@academy.edu" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Message</label>
                <textarea required rows={3} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition resize-none" placeholder="How can we help your institution?" />
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition shadow-sm" id="contact_submit_btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-blue-200 text-center px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              RIQ
            </div>
            <span className="font-bold text-white">RetainIQ © 2026</span>
          </div>
          <p>
            Empowering educational institutions with AI-driven academic analysis and student retention management solutions.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
