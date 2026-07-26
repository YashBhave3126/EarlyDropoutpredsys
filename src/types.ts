/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  ADMIN = "Administrator",
  FACULTY = "Faculty",
  STUDENT = "Student"
}

export interface SocioeconomicDetails {
  familyIncome: string;      // e.g. "Low", "Medium", "High"
  parentsEducation: string;  // e.g. "High School", "Bachelor", "Postgraduate", "None"
  distanceFromCollege: number; // in km
  transportation: string;    // e.g. "Public", "College Bus", "Walk", "Own Vehicle"
  internetAvailability: boolean;
  scholarship: boolean;
}

export interface BehavioralDetails {
  studyHours: number;        // weekly
  extracurricular: boolean;
  healthIssues: boolean;
  counselingSessions: number;
}

export interface Student {
  rollNumber: string;
  name: string;
  department: string;        // e.g. "Information Technology", "Computer Science", "Electrical Engineering", "Mechanical Engineering"
  semester: number;          // e.g. 1 to 8
  attendance: number;        // percentage (0-100)
  internalMarks: number;     // average internal test percentage (0-100)
  semesterMarks: number;     // CGPA/GPA (0-10)
  assignmentsSubmitted: number;
  assignmentsTotal: number;
  backlogs: number;
  practicalMarks: number;    // average practical exam percentage (0-100)
  socioeconomic: SocioeconomicDetails;
  behavioral: BehavioralDetails;
  
  // Machine Learning Prediction State
  riskStatus: "Low" | "Medium" | "High";
  riskConfidence: number;    // percentage probability (0-100)
  riskReasons: string[];     // reasons like "Attendance Low (<75%)", "Multiple backlogs", etc.
  recommendations: string[]; // recommendations automatically generated
}

export interface Intervention {
  id: string;
  rollNumber: string;
  studentName: string;
  type: "Counseling" | "Parent Meeting" | "Academic Mentoring" | "Attendance Improvement Plan" | "Financial Assistance" | "Remedial Classes" | "Career Guidance";
  createdDate: string;
  remarks: string;
  status: "Pending" | "In Progress" | "Completed";
  followUpDate: string;
  improvementPercentage: number;
  facultyName: string;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  email: string;
}

export interface DepartmentStats {
  name: string;
  totalStudents: number;
  averageAttendance: number;
  averageCGPA: number;
  highRiskPercentage: number;
}

export interface AppState {
  students: Student[];
  interventions: Intervention[];
  faculties: Faculty[];
  currentUser: {
    name: string;
    email: string;
    role: UserRole;
    rollNumber?: string; // If student
    department?: string; // If faculty
  } | null;
}
