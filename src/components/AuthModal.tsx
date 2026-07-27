/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserRole } from "../types";
import { Shield, User, GraduationCap, ArrowLeft, Key, Lock, Mail, Users } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: any, token: string) => void;
  initialRole?: string;
}

export default function AuthModal({ onClose, onLoginSuccess, initialRole }: AuthModalProps) {
  const [role, setRole] = useState<UserRole>((initialRole as UserRole) || UserRole.FACULTY);
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerDept, setRegisterDept] = useState("Information Technology");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isRegistering ? "/api/register" : "/api/login";
      
      const payload: any = {
        role,
        password,
      };

      if (role === UserRole.STUDENT) {
        payload.rollNumber = rollNumber;
      } else {
        payload.email = email;
      }

      if (isRegistering) {
        payload.name = registerName;
        payload.department = registerDept;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success) {
        if (isRegistering) {
          alert("Registration successful! You can now log in.");
          setIsRegistering(false);
          setPassword(""); // Clear password for login
        } else {
          onLoginSuccess(data.user, data.token);
        }
      } else {
        alert(data.error || "Authentication failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 overflow-hidden">
        
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            id="auth_back_btn"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Landing
          </button>
          <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
            Portal Gateway
          </span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isRegistering ? "Create Portal Account" : "Access Smart Portal"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isRegistering 
              ? "Register a new account on the academic registry database." 
              : "Enter your secure institutional credentials to proceed."}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole(UserRole.STUDENT)}
            className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition ${
              role === UserRole.STUDENT ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
            id="auth_tab_student"
          >
            <GraduationCap className="h-4 w-4" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => setRole(UserRole.FACULTY)}
            className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition ${
              role === UserRole.FACULTY ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
            id="auth_tab_faculty"
          >
            <User className="h-4 w-4" />
            <span>Faculty</span>
          </button>

          <button
            type="button"
            onClick={() => setRole(UserRole.ADMIN)}
            className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition ${
              role === UserRole.ADMIN ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
            id="auth_tab_admin"
          >
            <Shield className="h-4 w-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Main form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Name</label>
              <div className="relative">
                <Users className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                <input
                  required
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition"
                  placeholder="Yash Bhave"
                />
              </div>
            </div>
          )}

          {role === UserRole.STUDENT ? (
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Student Roll Number</label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                <input
                  required
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition"
                  placeholder="CS-2026-001"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition"
                  placeholder={role === UserRole.ADMIN ? "admin@academy.edu" : "sandeep@academy.edu"}
                />
              </div>
            </div>
          )}

          {isRegistering && role !== UserRole.ADMIN && (
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Department</label>
              <select
                value={registerDept}
                onChange={(e) => setRegisterDept(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition"
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Secure Password</label>
              {!isRegistering && (
                <a href="#" className="text-[10px] font-semibold text-blue-600 hover:underline">Forgot?</a>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 mt-2 shadow-md disabled:bg-slate-300"
            id="auth_submit_btn"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                <Key className="h-4.5 w-4.5" />
                <span>{isRegistering ? "Register New Account" : "Secure Sign In"}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
          {isRegistering ? (
            <p>
              Already have an account?{" "}
              <button onClick={() => setIsRegistering(false)} className="font-semibold text-blue-600 hover:underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Need academic login credentials?{" "}
              <button onClick={() => setIsRegistering(true)} className="font-semibold text-blue-600 hover:underline">
                Request Account
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
