import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  role: z.enum(["Student", "Faculty", "Administrator"]),
  rollNumber: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name is required"),
  department: z.string().optional(),
}).refine(data => {
  if (data.role === 'Student' && !data.rollNumber) return false;
  if (data.role === 'Faculty' && !data.email) return false;
  return true;
}, {
  message: "Roll number is required for students; Email is required for faculty",
  path: ["role"]
});

export const loginSchema = z.object({
  email: z.string().optional(),
  rollNumber: z.string().optional(),
  role: z.enum(["Student", "Faculty", "Administrator"]),
  password: z.string().min(1, "Password is required"),
});

export const studentSchema = z.object({
  rollNumber: z.string().min(1, "Roll number is required"),
  name: z.string().min(1, "Name is required"),
  department: z.string(),
  semester: z.number().int().min(1).max(8),
  attendance: z.number().min(0).max(100),
  internalMarks: z.number().min(0).max(100),
  semesterMarks: z.number().min(0).max(10),
  assignmentsSubmitted: z.number().min(0),
  assignmentsTotal: z.number().min(0),
  backlogs: z.number().int().min(0),
  practicalMarks: z.number().min(0).max(100),
  socioeconomic: z.object({
    familyIncome: z.string(),
    parentsEducation: z.string(),
    distanceFromCollege: z.number().min(0),
    transportation: z.string(),
    internetAvailability: z.boolean(),
    scholarship: z.boolean()
  }).optional(),
  behavioral: z.object({
    studyHours: z.number().min(0),
    extracurricular: z.boolean(),
    healthIssues: z.boolean(),
    counselingSessions: z.number().int().min(0)
  }).optional()
});

export const interventionSchema = z.object({
  rollNumber: z.string().min(1, "Roll number is required"),
  type: z.string().min(1, "Intervention type is required"),
  remarks: z.string().min(1, "Remarks are required"),
  followUpDate: z.string().min(1, "Follow-up date is required").refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Follow-up date must be a valid date string (e.g., 2026-08-15)" }
  ),
  facultyName: z.string().optional()
});

export const updateInterventionSchema = z.object({
  status: z.enum(["Pending", "In Progress", "Completed"]).optional(),
  remarks: z.string().optional(),
  improvementPercentage: z.number().min(0).max(100).optional(),
  followUpDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Follow-up date must be a valid date string" }
  ).optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});
