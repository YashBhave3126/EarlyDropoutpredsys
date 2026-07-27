/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

dotenv.config();

const prisma = new PrismaClient();

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
const isGeminiAvailable = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "";

const ai = isGeminiAvailable
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Initial Data for Seeding
const initialStudents = [
  {
    rollNumber: "CS-2026-001",
    name: "Yash Bhave",
    department: "Computer Science",
    semester: 6,
    attendance: 88,
    internalMarks: 82,
    semesterMarks: 8.4,
    assignmentsSubmitted: 9,
    assignmentsTotal: 10,
    backlogs: 0,
    practicalMarks: 85,
    socioeconomic: { familyIncome: "Medium", parentsEducation: "Bachelor", distanceFromCollege: 5, transportation: "Own Vehicle", internetAvailability: true, scholarship: false },
    behavioral: { studyHours: 18, extracurricular: true, healthIssues: false, counselingSessions: 0 },
    riskStatus: "Low",
    riskConfidence: 94,
    riskReasons: ["Excellent attendance rate (88%) matches institutional guidelines.", "High internal test average (82%) indicates strong concept retention.", "Zero active backlogs ensures normal progression."],
    recommendations: ["Continue existing study habits (18 hours/week).", "Apply for summer technical internship or research fellowship.", "Take leadership role in upcoming departmental hackathon."],
  },
  {
    rollNumber: "IT-2026-042",
    name: "Aarav Sharma",
    department: "Information Technology",
    semester: 6,
    attendance: 71,
    internalMarks: 52,
    semesterMarks: 6.2,
    assignmentsSubmitted: 6,
    assignmentsTotal: 10,
    backlogs: 1,
    practicalMarks: 65,
    socioeconomic: { familyIncome: "Low", parentsEducation: "High School", distanceFromCollege: 18, transportation: "Public", internetAvailability: true, scholarship: true },
    behavioral: { studyHours: 8, extracurricular: false, healthIssues: false, counselingSessions: 1 },
    riskStatus: "Medium",
    riskConfidence: 68,
    riskReasons: ["Attendance is 71%, which is below the mandatory 75% regulatory warning limit.", "Active backlog in 5th Semester Computer Networks course.", "Weekly self-study hours (8 hours) are lower than average for 6th semester workloads."],
    recommendations: ["Enroll in the upcoming CS-301 remedial bootcamps.", "Establish an Attendance Improvement Commitment with Academic Mentor.", "Utilize public transit commute hours for lightweight reading or lecture review."],
  },
  {
    rollNumber: "EE-2026-105",
    name: "Priya Patel",
    department: "Electrical Engineering",
    semester: 4,
    attendance: 54,
    internalMarks: 38,
    semesterMarks: 4.8,
    assignmentsSubmitted: 3,
    assignmentsTotal: 10,
    backlogs: 3,
    practicalMarks: 45,
    socioeconomic: { familyIncome: "Low", parentsEducation: "None", distanceFromCollege: 25, transportation: "Public", internetAvailability: false, scholarship: false },
    behavioral: { studyHours: 4, extracurricular: false, healthIssues: true, counselingSessions: 2 },
    riskStatus: "High",
    riskConfidence: 89,
    riskReasons: ["Critical attendance level of 54% due to long transit distance and documented health issues.", "Internal test average (38%) is below the passing mark of 40%.", "Accumulated 3 active academic backlogs, increasing friction for graduation.", "Lack of internet access at home prevents study material downloads."],
    recommendations: ["Immediate psychiatric/medical and academic counseling review.", "Schedule emergency parent-teacher meeting to address structural absenteeism.", "Apply for the institutional offline scholarship program and student loan assistance.", "Provide preloaded physical tablet and learning guides from college library."],
  },
  {
    rollNumber: "ME-2026-088",
    name: "Rohan Verma",
    department: "Mechanical Engineering",
    semester: 4,
    attendance: 78,
    internalMarks: 61,
    semesterMarks: 6.9,
    assignmentsSubmitted: 8,
    assignmentsTotal: 10,
    backlogs: 0,
    practicalMarks: 72,
    socioeconomic: { familyIncome: "Medium", parentsEducation: "High School", distanceFromCollege: 10, transportation: "College Bus", internetAvailability: true, scholarship: false },
    behavioral: { studyHours: 12, extracurricular: true, healthIssues: false, counselingSessions: 0 },
    riskStatus: "Low",
    riskConfidence: 82,
    riskReasons: ["Regular class attendance at 78%, above warnings.", "Balanced internal marks score of 61%.", "Clean slate with 0 active backlogs."],
    recommendations: ["Join the advanced CAD modeling and robotics design club.", "Focus on improving the final semester project grade to hit 7.5+ CGPA."],
  },
  {
    rollNumber: "IT-2026-015",
    name: "Neha Gupta",
    department: "Information Technology",
    semester: 6,
    attendance: 62,
    internalMarks: 45,
    semesterMarks: 5.4,
    assignmentsSubmitted: 5,
    assignmentsTotal: 10,
    backlogs: 2,
    practicalMarks: 58,
    socioeconomic: { familyIncome: "Low", parentsEducation: "High School", distanceFromCollege: 15, transportation: "Public", internetAvailability: true, scholarship: true },
    behavioral: { studyHours: 6, extracurricular: false, healthIssues: false, counselingSessions: 3 },
    riskStatus: "High",
    riskConfidence: 78,
    riskReasons: ["Attendance is 62%, failing to meet regulatory academic standards.", "Weak academic performance in internal assessments (45%).", "Two active backlogs in previous semesters."],
    recommendations: ["Mandatory mentor-guided counseling and target-setting session.", "Apply for remedial classes for database systems and algorithms.", "Submit pending assignments through personalized grace extensions."],
  },
];

const initialInterventions = [
  { id: "int-1", rollNumber: "IT-2026-042", studentName: "Aarav Sharma", type: "Counseling", createdDate: "2026-07-10", remarks: "Student attended the first counseling session. Discussed distance challenges (18km) causing morning attendance issues. Recommended adjusting batch timings where possible.", status: "In Progress", followUpDate: "2026-07-24", improvementPercentage: 15, facultyName: "Dr. Sandeep Kumar" },
  { id: "int-2", rollNumber: "EE-2026-105", studentName: "Priya Patel", type: "Parent Meeting", createdDate: "2026-07-15", remarks: "Scheduled a joint session with Priya and her parents to discuss severe health-related absenteeism (54%) and lack of home internet study resources.", status: "Pending", followUpDate: "2026-07-21", improvementPercentage: 0, facultyName: "Prof. Anjali Mehta" },
  { id: "int-3", rollNumber: "IT-2026-015", studentName: "Neha Gupta", type: "Academic Mentoring", createdDate: "2026-06-12", remarks: "Conducted intensive academic mentoring over 4 weeks. Student cleared 1 of her 3 previous backlogs and completed pending practical files. Attendance improved from 50% to 62%.", status: "Completed", followUpDate: "2026-07-10", improvementPercentage: 40, facultyName: "Dr. Sandeep Kumar" },
];

const initialFaculties = [
  { id: "fac-1", name: "Dr. Sandeep Kumar", department: "Information Technology", email: "sandeep@academy.edu" },
  { id: "fac-2", name: "Prof. Anjali Mehta", department: "Electrical Engineering", email: "anjali@academy.edu" },
  { id: "fac-3", name: "Prof. Rakesh Sharma", department: "Computer Science", email: "rakesh@academy.edu" },
  { id: "fac-4", name: "Dr. Vikram Joshi", department: "Mechanical Engineering", email: "vikram@academy.edu" },
];

async function seedDatabase() {
  const count = await prisma.faculty.count();
  if (count === 0) {
    console.log("Seeding initial mock data to MySQL database with hashed passwords...");
    
    // Hash passwords for default users
    const defaultPasswordHash = await bcrypt.hash("password", 10);
    
    // Hash passwords for the 3 distinct admins
    const princeAdminHash = await bcrypt.hash("prince2006", 10);
    const abhayAdminHash = await bcrypt.hash("abhay2564", 10);
    const yashAdminHash = await bcrypt.hash("yash001", 10);

    // Create 3 Admins
    await prisma.admin.createMany({
      data: [
        { email: "admin@prince", password: princeAdminHash, name: "Admin Prince" },
        { email: "admin@abhay", password: abhayAdminHash, name: "Admin Abhay" },
        { email: "admin@yash", password: yashAdminHash, name: "Admin Yash" },
      ]
    });

    const facultiesWithPwd = initialFaculties.map(f => ({ ...f, password: defaultPasswordHash }));
    await prisma.faculty.createMany({ data: facultiesWithPwd });
    
    for (const student of initialStudents) {
      await prisma.student.create({ data: { ...student, password: defaultPasswordHash } });
    }
    
    for (const int of initialInterventions) {
      await prisma.intervention.create({ data: int });
    }
    console.log("Database seeded successfully.");
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Middleware to authenticate JWT
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return next();

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return next();
    req.user = user;
    next();
  });
}

// Local Rules-based Fallback Risk Predictor
function predictStudentRiskLocal(student: any) {
  let riskStatus: "Low" | "Medium" | "High" = "Low";
  let riskConfidence = 50;
  const riskReasons: string[] = [];
  const recommendations: string[] = [];

  if (student.attendance < 60) {
    riskReasons.push(`Critical attendance level (${student.attendance}%) is significantly below the 75% bar.`);
    riskConfidence += 25;
  } else if (student.attendance < 75) {
    riskReasons.push(`Attendance is ${student.attendance}%, placing the student under warning status.`);
    riskConfidence += 10;
  } else {
    riskReasons.push(`Healthy class attendance (${student.attendance}%).`);
    riskConfidence -= 15;
  }

  if (student.backlogs >= 3) {
    riskReasons.push(`Student has high backlog friction (${student.backlogs} courses active).`);
    riskConfidence += 20;
  } else if (student.backlogs > 0) {
    riskReasons.push(`Has ${student.backlogs} academic backlog(s) needing resolution.`);
    riskConfidence += 10;
  } else {
    riskReasons.push("Clear of any active backlog courses.");
    riskConfidence -= 10;
  }

  if (student.internalMarks < 40) {
    riskReasons.push(`Internal test average (${student.internalMarks}%) is failing.`);
    riskConfidence += 20;
  } else if (student.internalMarks < 60) {
    riskReasons.push(`Internal marks average (${student.internalMarks}%) is suboptimal.`);
    riskConfidence += 10;
  } else {
    riskReasons.push(`Strong internal evaluation metrics (${student.internalMarks}%).`);
    riskConfidence -= 15;
  }

  if (student.behavioral?.studyHours < 6) {
    riskReasons.push(`Sub-optimal study behavior (${student.behavioral.studyHours} hours of weekly self-study).`);
    riskConfidence += 10;
  }

  if (student.socioeconomic?.familyIncome === "Low") {
    riskReasons.push("Belongs to a low-income bracket, potentially requiring part-time work or scholarships.");
    riskConfidence += 8;
  }

  if (student.socioeconomic?.internetAvailability === false) {
    riskReasons.push("No persistent internet access at home for remote academic materials.");
    riskConfidence += 12;
  }

  if (riskConfidence >= 75 || student.attendance < 60 || student.backlogs >= 3) {
    riskStatus = "High";
    riskConfidence = Math.min(Math.max(riskConfidence, 76), 98);
  } else if (riskConfidence >= 55 || student.attendance < 75 || student.backlogs > 0 || student.internalMarks < 50) {
    riskStatus = "Medium";
    riskConfidence = Math.min(Math.max(riskConfidence, 56), 74);
  } else {
    riskStatus = "Low";
    riskConfidence = Math.min(Math.max(riskConfidence, 15), 54);
  }

  if (riskStatus === "High") {
    recommendations.push("Arrange immediate counselor consultation.");
    recommendations.push("Schedule a formal parent-mentor meeting to align resources.");
    recommendations.push("Enroll in mandatory remedial modules for backlog courses.");
    if (student.socioeconomic?.familyIncome === "Low") {
      recommendations.push("Analyze eligibility for college emergency scholarships and free meals.");
    }
  } else if (riskStatus === "Medium") {
    recommendations.push("Encourage academic mentoring with course leads.");
    recommendations.push("Create a progressive 30-day attendance improvement compact.");
    recommendations.push("Increase personal study targets to at least 12 hours weekly.");
  } else {
    recommendations.push("Encourage peer-mentoring roles or advanced project track.");
    recommendations.push("Maintain attendance and study standards.");
  }

  return { riskStatus, riskConfidence, riskReasons, recommendations };
}

// Live AI Dropout Predictor & Explainer using Gemini
async function predictStudentRiskGemini(student: any) {
  if (!ai) {
    return predictStudentRiskLocal(student);
  }

  try {
    const promptText = `
      You are an expert Educational Data Analyst and Machine Learning Dropout Predictor.
      Analyze the following student profile meticulously to predict their likelihood of dropout:
      
      STUDENT RECORD:
      Name: ${student.name}
      Roll Number: ${student.rollNumber}
      Department: ${student.department}
      Semester: ${student.semester}
      Attendance Rate: ${student.attendance}%
      Average Internal Marks: ${student.internalMarks}%
      Semester CGPA: ${student.semesterMarks}/10
      Assignments Completed: ${student.assignmentsSubmitted}/${student.assignmentsTotal}
      Active Course Backlogs: ${student.backlogs}
      Practical Grade Average: ${student.practicalMarks}%
      
      SOCIOECONOMIC BACKGROUND:
      Family Income: ${student.socioeconomic?.familyIncome}
      Parents Education Level: ${student.socioeconomic?.parentsEducation}
      Distance to College: ${student.socioeconomic?.distanceFromCollege} km
      Mode of Transportation: ${student.socioeconomic?.transportation}
      Internet Access at Home: ${student.socioeconomic?.internetAvailability ? "Yes" : "No"}
      Scholarship Recipient: ${student.socioeconomic?.scholarship ? "Yes" : "No"}
      
      BEHAVIORAL INDEX:
      Weekly Self-Study Time: ${student.behavioral?.studyHours} hours
      Extracurricular Activies participation: ${student.behavioral?.extracurricular ? "Yes" : "No"}
      Chronic Health Issues: ${student.behavioral?.healthIssues ? "Yes" : "No"}
      Counseling Sessions attended: ${student.behavioral?.counselingSessions}
      
      Please predict:
      1. riskStatus: "Low" or "Medium" or "High" risk of dropping out.
      2. riskConfidence: A solid confidence score as an integer percentage from 10 to 98.
      3. riskReasons: List 3-4 professional, bulletproof analytical justifications (e.g., 'Attendance of X% fails regulatory requirements of 75%', 'Home internet isolation limit academic download readiness', 'Financial strain coupled with distance creates commute exhaustion').
      4. recommendations: List 3-4 precise, highly actionable preventive institutional action plans for the faculty (e.g., 'Draft custom remedial schedule', 'Conduct wellness check', 'Assign Student Peer Buddy').
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskStatus: {
              type: Type.STRING,
              description: "Classification of student dropout likelihood: 'Low', 'Medium', or 'High'",
            },
            riskConfidence: {
              type: Type.INTEGER,
              description: "Model probability/confidence as an integer percentage (e.g. 85)",
            },
            riskReasons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of highly specific factual reasons from the student's metrics justifying the risk level",
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable corrective feedback and administrative recommendations",
            },
          },
          required: ["riskStatus", "riskConfidence", "riskReasons", "recommendations"],
        },
      },
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      if (["Low", "Medium", "High"].includes(parsed.riskStatus)) {
        return parsed;
      }
    }
    return predictStudentRiskLocal(student);
  } catch (error) {
    console.error("Gemini prediction API failed. Using local engine fallback:", error);
    return predictStudentRiskLocal(student);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(authenticateToken);
  
  // Seed database on startup if empty
  await seedDatabase();

  // API Endpoints: State retrieval
  app.get("/api/state", async (req: any, res) => {
    try {
      const students = await prisma.student.findMany();
      const interventions = await prisma.intervention.findMany({ orderBy: { createdDate: 'desc' } });
      const faculties = await prisma.faculty.findMany();
      
      res.json({
        students: students.map((s: any) => { delete s.password; return s; }),
        interventions,
        faculties: faculties.map((f: any) => { delete f.password; return f; }),
        currentUser: req.user || null,
        isGeminiActive: isGeminiAvailable,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch state from DB" });
    }
  });

  // API Endpoints: Register
  app.post("/api/register", async (req, res) => {
    const { email, role, rollNumber, password, name, department } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      if (role === "Faculty") {
        const existing = await prisma.faculty.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ success: false, error: "Email already registered" });
        
        await prisma.faculty.create({
          data: { email, password: hashedPassword, name, department }
        });
        res.json({ success: true, message: "Faculty registered successfully" });
        
      } else if (role === "Student") {
        const existing = await prisma.student.findUnique({ where: { rollNumber } });
        if (existing) return res.status(400).json({ success: false, error: "Roll number already registered" });
        
        await prisma.student.create({
          data: {
            rollNumber, password: hashedPassword, name, department,
            semester: 1, attendance: 100, internalMarks: 100, semesterMarks: 10, assignmentsSubmitted: 0, assignmentsTotal: 10, backlogs: 0, practicalMarks: 100,
            socioeconomic: { familyIncome: "Medium", parentsEducation: "High School", distanceFromCollege: 10, transportation: "Public", internetAvailability: true, scholarship: false },
            behavioral: { studyHours: 10, extracurricular: false, healthIssues: false, counselingSessions: 0 },
            riskStatus: "Low", riskConfidence: 10, riskReasons: ["Newly registered student"], recommendations: []
          }
        });
        res.json({ success: true, message: "Student registered successfully" });
      } else {
        res.status(400).json({ success: false, error: "Cannot register as Administrator" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Registration failed" });
    }
  });

  // API Endpoints: Secure Login
  app.post("/api/login", async (req, res) => {
    const { email, role, rollNumber, password } = req.body;
    let user: any = null;
    let dbPassword = "";

    try {
      if (role === "Administrator") {
        const admin = await prisma.admin.findUnique({ where: { email: email?.toLowerCase() || "" } });
        if (admin) {
          user = { name: admin.name, email: admin.email, role: "Administrator" };
          dbPassword = admin.password;
        }
      } else if (role === "Faculty") {
        const faculty = await prisma.faculty.findUnique({ where: { email: email?.toLowerCase() || "" } });
        if (faculty) {
          user = { name: faculty.name, email: faculty.email, role: "Faculty", department: faculty.department };
          dbPassword = faculty.password;
        }
      } else if (role === "Student") {
        const student = await prisma.student.findUnique({ where: { rollNumber: rollNumber || "" } });
        if (student) {
          user = { name: student.name, email: student.name, role: "Student", rollNumber: student.rollNumber };
          dbPassword = student.password;
        }
      }

      if (user && dbPassword) {
        const isMatch = await bcrypt.compare(password, dbPassword);
        if (isMatch) {
          const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
          res.json({ success: true, user, token });
        } else {
          res.status(401).json({ success: false, error: "Invalid password" });
        }
      } else {
        res.status(401).json({ success: false, error: "User not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Login failed" });
    }
  });

  app.post("/api/logout", (req, res) => {
    res.json({ success: true });
  });

  // API Endpoints: Student data CRUD
  app.post("/api/students", async (req, res) => {
    const studentData = req.body;

    try {
      // Predict risk
      const prediction = await predictStudentRiskGemini(studentData);
      const enrichedStudent = {
        ...studentData,
        riskStatus: prediction.riskStatus,
        riskConfidence: prediction.riskConfidence,
        riskReasons: prediction.riskReasons,
        recommendations: prediction.recommendations,
      };

      const result = await prisma.student.upsert({
        where: { rollNumber: studentData.rollNumber },
        update: enrichedStudent,
        create: {
          ...enrichedStudent,
          password: await bcrypt.hash("password", 10), // Default pass if faculty creates student
        },
      });

      res.json({ success: true, student: result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save student" });
    }
  });

  // API Endpoints: Force recalculate/predict a student's risk using live AI
  app.post("/api/students/predict", async (req, res) => {
    const { rollNumber } = req.body;
    try {
      const student = await prisma.student.findUnique({ where: { rollNumber } });
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      const prediction = await predictStudentRiskGemini(student);
      
      const updated = await prisma.student.update({
        where: { rollNumber },
        data: {
          riskStatus: prediction.riskStatus,
          riskConfidence: prediction.riskConfidence,
          riskReasons: prediction.riskReasons,
          recommendations: prediction.recommendations,
        }
      });

      res.json({ success: true, student: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to predict student risk" });
    }
  });

  // API Endpoints: Add new interventions
  app.post("/api/interventions", async (req: any, res) => {
    const { rollNumber, type, remarks, followUpDate, facultyName } = req.body;
    
    try {
      const student = await prisma.student.findUnique({ where: { rollNumber } });
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      const newIntervention = await prisma.intervention.create({
        data: {
          rollNumber,
          studentName: student.name,
          type,
          createdDate: new Date().toISOString().split("T")[0],
          remarks,
          status: "Pending",
          followUpDate,
          improvementPercentage: 0,
          facultyName: facultyName || req.user?.name || "Dr. Sandeep Kumar",
        }
      });

      res.json({ success: true, intervention: newIntervention });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create intervention" });
    }
  });

  // API Endpoints: Update existing interventions
  app.patch("/api/interventions/:id", async (req, res) => {
    const { id } = req.params;
    const { status, remarks, improvementPercentage, followUpDate } = req.body;

    try {
      const item = await prisma.intervention.findUnique({ where: { id } });
      if (!item) {
        return res.status(404).json({ error: "Intervention not found" });
      }

      const updateData: any = {};
      if (status) updateData.status = status;
      if (remarks) updateData.remarks = remarks;
      if (followUpDate) updateData.followUpDate = followUpDate;
      if (improvementPercentage !== undefined) {
        updateData.improvementPercentage = Number(improvementPercentage);
      }

      const updatedIntervention = await prisma.intervention.update({
        where: { id },
        data: updateData
      });

      // Simulate attendance and performance improvement if completed
      if (status === "Completed" && improvementPercentage !== undefined) {
        const student = await prisma.student.findUnique({ where: { rollNumber: item.rollNumber } });
        if (student) {
          const multiplier = 1 + (Number(improvementPercentage) / 100) * 0.15;
          const newAttendance = Math.min(Math.round(student.attendance * multiplier), 98);
          const newInternalMarks = Math.min(Math.round(student.internalMarks * multiplier), 95);
          const newSemesterMarks = Math.min(Number((student.semesterMarks * (1 + (Number(improvementPercentage) / 100) * 0.08)).toFixed(2)), 9.8);
          let newBacklogs = student.backlogs;
          if (student.backlogs > 0 && Math.random() > 0.4) {
            newBacklogs -= 1;
          }

          const localRecalc = predictStudentRiskLocal({ ...student, attendance: newAttendance, internalMarks: newInternalMarks, semesterMarks: newSemesterMarks, backlogs: newBacklogs });
          
          await prisma.student.update({
            where: { rollNumber: item.rollNumber },
            data: {
              attendance: newAttendance,
              internalMarks: newInternalMarks,
              semesterMarks: newSemesterMarks,
              backlogs: newBacklogs,
              riskStatus: localRecalc.riskStatus,
              riskConfidence: localRecalc.riskConfidence,
              riskReasons: localRecalc.riskReasons,
              recommendations: localRecalc.recommendations,
            }
          });
        }
      }

      res.json({ success: true, intervention: updatedIntervention });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update intervention" });
    }
  });

  // API Endpoints: System Reset (returns to default)
  app.post("/api/reset", async (req, res) => {
    try {
      await prisma.intervention.deleteMany({});
      await prisma.student.deleteMany({});
      await prisma.faculty.deleteMany({});
      await prisma.admin.deleteMany({});
      await seedDatabase();
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to reset database" });
    }
  });

  // Vite middleware setup for Development & Production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
