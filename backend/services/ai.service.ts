import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
export const isGeminiAvailable = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "";

export const ai = isGeminiAvailable
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Local Rules-based Fallback Risk Predictor
export function predictStudentRiskLocal(student: any) {
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
export async function predictStudentRiskGemini(student: any) {
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
