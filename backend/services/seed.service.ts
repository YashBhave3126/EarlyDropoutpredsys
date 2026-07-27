import prisma from "../db";
import bcrypt from "bcryptjs";

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
  { id: "int-1", rollNumber: "IT-2026-042", studentName: "Aarav Sharma", type: "Counseling", createdDate: new Date("2026-07-10"), remarks: "Student attended the first counseling session. Discussed distance challenges (18km) causing morning attendance issues. Recommended adjusting batch timings where possible.", status: "In Progress", followUpDate: new Date("2026-07-24"), improvementPercentage: 15, facultyName: "Dr. Sandeep Kumar" },
  { id: "int-2", rollNumber: "EE-2026-105", studentName: "Priya Patel", type: "Parent Meeting", createdDate: new Date("2026-07-15"), remarks: "Scheduled a joint session with Priya and her parents to discuss severe health-related absenteeism (54%) and lack of home internet study resources.", status: "Pending", followUpDate: new Date("2026-07-21"), improvementPercentage: 0, facultyName: "Prof. Anjali Mehta" },
  { id: "int-3", rollNumber: "IT-2026-015", studentName: "Neha Gupta", type: "Academic Mentoring", createdDate: new Date("2026-06-12"), remarks: "Conducted intensive academic mentoring over 4 weeks. Student cleared 1 of her 3 previous backlogs and completed pending practical files. Attendance improved from 50% to 62%.", status: "Completed", followUpDate: new Date("2026-07-10"), improvementPercentage: 40, facultyName: "Dr. Sandeep Kumar" },
];

const initialFaculties = [
  { id: "fac-1", name: "Dr. Sandeep Kumar", department: "Information Technology", email: "sandeep@academy.edu" },
  { id: "fac-2", name: "Prof. Anjali Mehta", department: "Electrical Engineering", email: "anjali@academy.edu" },
  { id: "fac-3", name: "Prof. Rakesh Sharma", department: "Computer Science", email: "rakesh@academy.edu" },
  { id: "fac-4", name: "Dr. Vikram Joshi", department: "Mechanical Engineering", email: "vikram@academy.edu" },
];

export async function seedDatabase() {
  const count = await prisma.faculty.count();
  if (count === 0) {
    console.log("Seeding initial mock data to MySQL database with hashed passwords...");
    
    const defaultPasswordHash = await bcrypt.hash("password", 10);
    const princeAdminHash = await bcrypt.hash("prince2006", 10);
    const abhayAdminHash = await bcrypt.hash("abhay2564", 10);
    const yashAdminHash = await bcrypt.hash("yash001", 10);

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
