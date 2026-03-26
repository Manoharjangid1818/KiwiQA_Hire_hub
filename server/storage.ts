import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import {
  users, otps, exams, questions, examAttempts, studentAnswers, passwordResetTokens, examPhotos, reexamRequests,
  examLinks, examSessions, cameraFrames, proctoringLogs, auditLogs, codingQuestions, codingSubmissions,
  type User, type InsertUser,
  type Exam, type InsertExam,
  type Question, type InsertQuestion,
  type ExamAttempt, type InsertExamAttempt,
  type StudentAnswer, type InsertStudentAnswer,
  type AttemptWithDetails, type ExamWithQuestions,
  type PasswordResetToken, type InsertPasswordResetToken,
  type ExamPhoto, type InsertExamPhoto,
  type ReexamRequest, type InsertReexamRequest, type ReexamRequestWithDetails,
  type ExamLink, type InsertExamLink, type ExamLinkWithDetails,
  type ExamSession, type InsertExamSession, type ExamSessionWithDetails,
  type CameraFrame, type InsertCameraFrame,
  type ProctoringLog, type InsertProctoringLog,
  type AuditLog, type InsertAuditLog,
  type CodingQuestion, type InsertCodingQuestion,
  type CodingSubmission, type InsertCodingSubmission,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserVerification(id: number, isVerified: boolean): Promise<void>;
  updateUserEmail(id: number, email: string): Promise<void>;
  updateUserPassword(id: number, password: string, storeLastPassword: boolean): Promise<void>;
  deleteUser(id: number): Promise<void>;
  deleteUserByEmail(email: string): Promise<void>;
  cleanupUnverifiedUsers(): Promise<number>;
  
  createOtp(userId: number, otp: string, expiresAt: Date): Promise<void>;
  getLatestOtp(userId: number): Promise<{otp: string, expiresAt: Date} | undefined>;
  deleteOtps(userId: number): Promise<void>;
  
  // Password reset methods
  createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markPasswordResetTokenUsed(token: string): Promise<void>;
  deletePasswordResetTokens(userId: number): Promise<void>;
  
  getExams(): Promise<Exam[]>;
  getExam(id: number): Promise<ExamWithQuestions | undefined>;
  createExam(exam: InsertExam): Promise<Exam>;
  updateExam(id: number, exam: Partial<InsertExam>): Promise<Exam>;
  
  createQuestion(question: InsertQuestion): Promise<Question>;
  deleteQuestion(id: number): Promise<void>;
  deleteQuestionsByExamId(examId: number): Promise<void>;
  
  startAttempt(attempt: InsertExamAttempt): Promise<ExamAttempt>;
  submitAttempt(attemptId: number, score: number): Promise<ExamAttempt>;
  getAttempt(id: number): Promise<AttemptWithDetails | undefined>;
  getStudentAttempts(studentId: number): Promise<AttemptWithDetails[]>;
  getAllAttempts(): Promise<AttemptWithDetails[]>;
  getExamAttemptsWithDetails(examId: number): Promise<AttemptWithDetails[]>;
  updateAttemptStatus(attemptId: number, status: string | null): Promise<ExamAttempt>;
  
  saveStudentAnswers(answers: InsertStudentAnswer[]): Promise<void>;
  
  // Exam photos methods
  saveExamPhoto(photo: InsertExamPhoto): Promise<ExamPhoto>;
  getExamPhotosForAttempt(attemptId: number): Promise<ExamPhoto[]>;
  
  // Re-exam request methods
  createReexamRequest(request: InsertReexamRequest): Promise<ReexamRequest>;
  getReexamRequestById(id: number): Promise<ReexamRequestWithDetails | undefined>;
  getReexamRequestsByStudent(studentId: number): Promise<ReexamRequestWithDetails[]>;
  getAllReexamRequests(): Promise<ReexamRequestWithDetails[]>;
  updateReexamRequest(id: number, data: { status: string; adminId: number; adminNote?: string }): Promise<ReexamRequest>;
  
  // Exam links methods
  createExamLink(link: InsertExamLink): Promise<ExamLink>;
  getExamLinkById(id: number): Promise<ExamLinkWithDetails | undefined>;
  getExamLinkByCode(code: string): Promise<ExamLinkWithDetails | undefined>;
  getExamLinksByExamId(examId: number): Promise<ExamLinkWithDetails[]>;
  updateExamLink(id: number, data: { isActive?: boolean; expiresAt?: Date }): Promise<ExamLink>;
  deleteExamLink(id: number): Promise<void>;
  deleteExam(id: number): Promise<void>;
  
  // Exam sessions methods
  createExamSession(session: InsertExamSession): Promise<ExamSession>;
  getExamSessionById(id: number): Promise<ExamSessionWithDetails | undefined>;
  getExamSessionByEmailAndExam(examId: number, email: string): Promise<ExamSessionWithDetails | undefined>;
  getExamSessionsByExamId(examId: number): Promise<ExamSessionWithDetails[]>;
  getActiveExamSessions(examId: number): Promise<ExamSessionWithDetails[]>;
  getAllExamSessions(): Promise<ExamSession[]>;
  updateExamSession(id: number, data: { status?: string; attemptId?: number; startedAt?: Date; completedAt?: Date; lastHeartbeat?: Date }): Promise<ExamSession>;
  
  // Camera frames methods
  saveCameraFrame(frame: InsertCameraFrame): Promise<CameraFrame>;
  getLatestCameraFrame(sessionId: number): Promise<CameraFrame | undefined>;
  getCameraFramesForSession(sessionId: number): Promise<CameraFrame[]>;
  
  // Proctoring logs methods
  createProctoringLog(log: InsertProctoringLog): Promise<ProctoringLog>;
  getProctoringLogsByExamId(examId: number): Promise<ProctoringLog[]>;
  getProctoringLogsByAttemptId(attemptId: number): Promise<ProctoringLog[]>;
  getAllProctoringLogs(): Promise<ProctoringLog[]>;
  
  getAllStudents(): Promise<User[]>;
  deleteStudent(id: number): Promise<void>;
  
  // Copy exam - creates a duplicate of an exam with its questions
  copyExam(originalExamId: number, newTitle: string): Promise<Exam>;
  
  // Check if an exam title already exists (case-insensitive)
  checkExamTitleExists(title: string): Promise<boolean>;

  // Audit log methods
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(limit?: number): Promise<AuditLog[]>;

  // Coding question methods
  createCodingQuestion(question: InsertCodingQuestion): Promise<CodingQuestion>;
  getCodingQuestionsByExamId(examId: number): Promise<CodingQuestion[]>;
  getCodingQuestion(id: number): Promise<CodingQuestion | undefined>;
  updateCodingQuestion(id: number, data: Partial<InsertCodingQuestion>): Promise<CodingQuestion>;
  deleteCodingQuestion(id: number): Promise<void>;

  // Coding submission methods
  createCodingSubmission(submission: InsertCodingSubmission): Promise<CodingSubmission>;
  getCodingSubmissionsByAttempt(attemptId: number): Promise<CodingSubmission[]>;
  
  // Analytics methods
  getScoreDistribution(): Promise<{ range: string; count: number }[]>;
  getPassFailRatio(): Promise<{ passed: number; failed: number; pending: number }>;
  getAvgTimeTaken(): Promise<{ examTitle: string; avgMinutes: number }[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async updateUserVerification(id: number, isVerified: boolean): Promise<void> {
    await db.update(users).set({ isVerified }).where(eq(users.id, id));
  }
  
  async updateUserEmail(id: number, email: string): Promise<void> {
    await db.update(users).set({ email }).where(eq(users.id, id));
  }
  
  async updateUserPassword(id: number, password: string, storeLastPassword: boolean): Promise<void> {
    // Get current user to store last password
    if (storeLastPassword) {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      if (user && user.password) {
        await db.update(users).set({ password, lastPassword: user.password }).where(eq(users.id, id));
        return;
      }
    }
    await db.update(users).set({ password }).where(eq(users.id, id));
  }
  
  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
  
  async deleteUserByEmail(email: string): Promise<void> {
    await db.delete(users).where(eq(users.email, email));
  }
  
  async cleanupUnverifiedUsers(): Promise<number> {
    // Delete ALL unverified users (registered without OTP verification)
    const unverifiedUsers = await db.select().from(users)
      .where(eq(users.isVerified, false));
    
    let deletedCount = 0;
    for (const user of unverifiedUsers) {
      // Delete OTPs first
      await db.delete(otps).where(eq(otps.userId, user.id));
      // Delete user
      await db.delete(users).where(eq(users.id, user.id));
      deletedCount++;
    }
    return deletedCount;
  }
  
  async createOtp(userId: number, otp: string, expiresAt: Date): Promise<void> {
    await db.insert(otps).values({ userId, otp, expiresAt });
  }
  
  async getLatestOtp(userId: number): Promise<{otp: string, expiresAt: Date} | undefined> {
    const [latest] = await db.select().from(otps)
      .where(eq(otps.userId, userId))
      .orderBy(desc(otps.createdAt))
      .limit(1);
    return latest;
  }
  
  async deleteOtps(userId: number): Promise<void> {
    await db.delete(otps).where(eq(otps.userId, userId));
  }
  
  // Password reset methods
  async createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [createdToken] = await db.insert(passwordResetTokens).values(token).returning();
    return createdToken;
  }
  
  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [tokenRecord] = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token));
    return tokenRecord;
  }
  
  async markPasswordResetTokenUsed(token: string): Promise<void> {
    await db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.token, token));
  }
  
  async deletePasswordResetTokens(userId: number): Promise<void> {
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));
  }
  
  async getExams(): Promise<Exam[]> {
    return await db.select().from(exams).orderBy(desc(exams.createdAt));
  }
  
  async getExam(id: number): Promise<ExamWithQuestions | undefined> {
    console.log("[STORAGE] getExam called with id:", id);
    const [exam] = await db.select().from(exams).where(eq(exams.id, id));
    if (!exam) {
      console.log("[STORAGE] Exam not found:", id);
      return undefined;
    }
    
    console.log("[STORAGE] Exam found:", exam.id, exam.title);
    const examQuestions = await db.select().from(questions).where(eq(questions.examId, id));
    console.log("[STORAGE] Questions found for exam", id, ":", examQuestions.length);
    
    return { ...exam, questions: examQuestions };
  }
  
  async createExam(insertExam: InsertExam): Promise<Exam> {
    try {
      // Ensure proper types for database insertion
      const examData = {
        title: String(insertExam.title),
        description: insertExam.description ? String(insertExam.description) : "",
        durationMinutes: Number(insertExam.durationMinutes),
        totalMarks: Number(insertExam.totalMarks),
        passingMarks: insertExam.passingMarks !== undefined ? Number(insertExam.passingMarks) : null,
        requireCamera: insertExam.requireCamera ? Boolean(insertExam.requireCamera) : false,
        isEnabled: insertExam.isEnabled !== undefined ? Boolean(insertExam.isEnabled) : true
      };
      console.log("Storage: Inserting exam with data:", examData);
      const [exam] = await db.insert(exams).values(examData).returning();
      console.log("Storage: Exam created with id:", exam.id);
      return exam;
    } catch (err) {
      console.error("Storage: Error creating exam:", err);
      throw err;
    }
  }
  
  async updateExam(id: number, examData: Partial<InsertExam>): Promise<Exam> {
    try {
      console.log("Storage: Updating exam", id, "with data:", examData);
      const [exam] = await db.update(exams)
        .set(examData)
        .where(eq(exams.id, id))
        .returning();
      console.log("Storage: Exam updated:", exam.id);
      return exam;
    } catch (err) {
      console.error("Storage: Error updating exam:", err);
      throw err;
    }
  }
  
  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    try {
      console.log("Storage: Inserting question with data:", insertQuestion);
      const [question] = await db.insert(questions).values(insertQuestion).returning();
      console.log("Storage: Question created with id:", question.id);
      return question;
    } catch (err) {
      console.error("Storage: Error creating question:", err);
      throw err;
    }
  }
  
  async deleteQuestion(id: number): Promise<void> {
    await db.delete(questions).where(eq(questions.id, id));
  }
  
  async deleteQuestionsByExamId(examId: number): Promise<void> {
    console.log("[STORAGE] Deleting all questions for exam:", examId);
    await db.delete(questions).where(eq(questions.examId, examId)).catch((e) => { /* ignore error */ });
    console.log("[STORAGE] Questions deleted for exam:", examId);
  }
  
  async startAttempt(insertAttempt: InsertExamAttempt): Promise<ExamAttempt> {
    try {
      console.log("Storage: Starting attempt with data:", insertAttempt);
      const [attempt] = await db.insert(examAttempts).values(insertAttempt).returning();
      console.log("Storage: Attempt started with id:", attempt.id);
      return attempt;
    } catch (err) {
      console.error("Storage: Error starting attempt:", err);
      throw err;
    }
  }
  
  async submitAttempt(attemptId: number, score: number): Promise<ExamAttempt> {
    try {
      console.log("Storage: Submitting attempt:", attemptId, "with score:", score);
      const [attempt] = await db.update(examAttempts)
        .set({ score, completedAt: new Date() })
        .where(eq(examAttempts.id, attemptId))
        .returning();
      console.log("Storage: Attempt submitted successfully");
      return attempt;
    } catch (err) {
      console.error("Storage: Error submitting attempt:", err);
      throw err;
    }
  }
  
  async getAttempt(id: number): Promise<AttemptWithDetails | undefined> {
    const [attempt] = await db.select().from(examAttempts).where(eq(examAttempts.id, id));
    if (!attempt) return undefined;
    
    const [exam] = await db.select().from(exams).where(eq(exams.id, attempt.examId));
    const [student] = await db.select().from(users).where(eq(users.id, attempt.studentId));
    
    const rawAnswers = await db.select().from(studentAnswers).where(eq(studentAnswers.attemptId, id));
    
    // Fetch all questions for this exam to attach them
    const examQuestions = await db.select().from(questions).where(eq(questions.examId, attempt.examId));
    const answersWithQuestions = rawAnswers.map(ans => {
      const q = examQuestions.find(q => q.id === ans.questionId);
      return { ...ans, question: q };
    });
    
    // Fetch exam photos
    const photos = await db.select().from(examPhotos).where(eq(examPhotos.attemptId, id));
    
    const studentSafe = student ? { 
      id: student.id, 
      fullName: student.fullName, 
      email: student.email, 
      role: student.role, 
      isVerified: student.isVerified, 
      createdAt: student.createdAt 
    } : undefined;
    
    return {
      ...attempt,
      exam: { ...exam, questions: examQuestions },
      student: studentSafe as any,
      answers: answersWithQuestions,
      photos: photos
    };
  }
  
  async getStudentAttempts(studentId: number): Promise<AttemptWithDetails[]> {
    const attempts = await db.select().from(examAttempts)
      .where(eq(examAttempts.studentId, studentId))
      .orderBy(desc(examAttempts.startedAt));
      
    // Fetch exam info for each attempt
    const detailedAttempts = await Promise.all(attempts.map(async (attempt) => {
      const [exam] = await db.select().from(exams).where(eq(exams.id, attempt.examId));
      return { ...attempt, exam };
    }));
    
    return detailedAttempts;
  }
  
  async getAllAttempts(): Promise<AttemptWithDetails[]> {
    const attempts = await db.select().from(examAttempts).orderBy(desc(examAttempts.startedAt));
    
    const detailedAttempts = await Promise.all(attempts.map(async (attempt) => {
      const [exam] = await db.select().from(exams).where(eq(exams.id, attempt.examId));
      const [student] = await db.select().from(users).where(eq(users.id, attempt.studentId));
      return { 
        ...attempt, 
        exam, 
        student: student ? {
          id: student.id, fullName: student.fullName, email: student.email, role: student.role,
          isVerified: student.isVerified, createdAt: student.createdAt
        } as any : undefined 
      };
    }));
    
    return detailedAttempts;
  }
  
  async getExamAttemptsWithDetails(examId: number): Promise<AttemptWithDetails[]> {
    const attempts = await db.select().from(examAttempts)
      .where(eq(examAttempts.examId, examId))
      .orderBy(desc(examAttempts.startedAt));
    
    const detailedAttempts = await Promise.all(attempts.map(async (attempt) => {
      const [exam] = await db.select().from(exams).where(eq(exams.id, attempt.examId));
      const [student] = await db.select().from(users).where(eq(users.id, attempt.studentId));
      return { 
        ...attempt, 
        exam, 
        student: student ? {
          id: student.id, fullName: student.fullName, email: student.email, role: student.role,
          isVerified: student.isVerified, createdAt: student.createdAt
        } as any : undefined 
      };
    }));
    
    return detailedAttempts;
  }
  
  async updateAttemptStatus(attemptId: number, status: string | null): Promise<ExamAttempt> {
    const [attempt] = await db.update(examAttempts)
      .set({ status })
      .where(eq(examAttempts.id, attemptId))
      .returning();
    return attempt;
  }
  
  async saveStudentAnswers(answers: InsertStudentAnswer[]): Promise<void> {
    try {
      if (answers.length > 0) {
        console.log("Storage: Saving", answers.length, "student answers");
        await db.insert(studentAnswers).values(answers);
        console.log("Storage: Student answers saved successfully");
      }
    } catch (err) {
      console.error("Storage: Error saving student answers:", err);
      throw err;
    }
  }
  
  // Exam photos methods
  async saveExamPhoto(photo: InsertExamPhoto): Promise<ExamPhoto> {
    const [savedPhoto] = await db.insert(examPhotos).values(photo).returning();
    return savedPhoto;
  }
  
  async getExamPhotosForAttempt(attemptId: number): Promise<ExamPhoto[]> {
    return await db.select().from(examPhotos)
      .where(eq(examPhotos.attemptId, attemptId))
      .orderBy(desc(examPhotos.capturedAt));
  }
  
  // Re-exam request methods
  async createReexamRequest(request: InsertReexamRequest): Promise<ReexamRequest> {
    const [created] = await db.insert(reexamRequests).values(request).returning();
    return created;
  }
  
  async getReexamRequestById(id: number): Promise<ReexamRequestWithDetails | undefined> {
    const [request] = await db.select().from(reexamRequests).where(eq(reexamRequests.id, id));
    if (!request) return undefined;
    
    const [student] = await db.select().from(users).where(eq(users.id, request.studentId));
    const [exam] = await db.select().from(exams).where(eq(exams.id, request.examId));
    const [attempt] = await db.select().from(examAttempts).where(eq(examAttempts.id, request.attemptId));
    
    const studentSafe = student ? {
      id: student.id,
      fullName: student.fullName,
      email: student.email,
      role: student.role,
      isVerified: student.isVerified,
      createdAt: student.createdAt
    } : undefined;
    
    return {
      ...request,
      student: studentSafe as any,
      exam,
      attempt
    };
  }
  
  async getReexamRequestsByStudent(studentId: number): Promise<ReexamRequestWithDetails[]> {
    const requests = await db.select().from(reexamRequests)
      .where(eq(reexamRequests.studentId, studentId))
      .orderBy(desc(reexamRequests.requestedAt));
    
    const detailedRequests = await Promise.all(requests.map(async (request) => {
      const [exam] = await db.select().from(exams).where(eq(exams.id, request.examId));
      const [attempt] = await db.select().from(examAttempts).where(eq(examAttempts.id, request.attemptId));
      return { ...request, exam, attempt };
    }));
    
    return detailedRequests;
  }
  
  async getAllReexamRequests(): Promise<ReexamRequestWithDetails[]> {
    const requests = await db.select().from(reexamRequests)
      .orderBy(desc(reexamRequests.requestedAt));
    
    const detailedRequests = await Promise.all(requests.map(async (request) => {
      const [student] = await db.select().from(users).where(eq(users.id, request.studentId));
      const [exam] = await db.select().from(exams).where(eq(exams.id, request.examId));
      const [attempt] = await db.select().from(examAttempts).where(eq(examAttempts.id, request.attemptId));
      
      const studentSafe = student ? {
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        role: student.role,
        isVerified: student.isVerified,
        createdAt: student.createdAt
      } : undefined;
      
      return {
        ...request,
        student: studentSafe as any,
        exam,
        attempt
      };
    }));
    
    return detailedRequests;
  }
  
  async updateReexamRequest(id: number, data: { status: string; adminId: number; adminNote?: string }): Promise<ReexamRequest> {
    const [updated] = await db.update(reexamRequests)
      .set({
        status: data.status,
        adminId: data.adminId,
        adminNote: data.adminNote,
        respondedAt: new Date()
      })
      .where(eq(reexamRequests.id, id))
      .returning();
    return updated;
  }
  
  // Exam links methods
  async createExamLink(link: InsertExamLink): Promise<ExamLink> {
    const [created] = await db.insert(examLinks).values(link).returning();
    return created;
  }
  
  async getExamLinkById(id: number): Promise<ExamLinkWithDetails | undefined> {
    const [link] = await db.select().from(examLinks).where(eq(examLinks.id, id));
    if (!link) return undefined;
    
    const [exam] = await db.select().from(exams).where(eq(exams.id, link.examId));
    
    // Fetch questions for the exam
    let examWithQuestions: ExamWithQuestions | undefined;
    if (exam) {
      const examQuestions = await db.select().from(questions).where(eq(questions.examId, exam.id));
      examWithQuestions = { ...exam, questions: examQuestions };
    }
    
    // Get session count
    const sessions = await db.select().from(examSessions).where(eq(examSessions.examLinkId, id));
    
    return {
      ...link,
      exam: examWithQuestions,
      _count: { sessions: sessions.length }
    } as ExamLinkWithDetails;
  }
  
  async getExamLinkByCode(code: string): Promise<ExamLinkWithDetails | undefined> {
    console.log("[STORAGE] getExamLinkByCode called with code:", code);
    const [link] = await db.select().from(examLinks).where(eq(examLinks.uniqueCode, code));
    if (!link) {
      console.log("[STORAGE] No exam link found for code:", code);
      return undefined;
    }
    
    console.log("[STORAGE] Exam link found:", link.id, "examId:", link.examId);
    const [exam] = await db.select().from(exams).where(eq(exams.id, link.examId));
    
    // Fetch questions for the exam
    let examWithQuestions: ExamWithQuestions | undefined;
    if (exam) {
      console.log("[STORAGE] Fetching questions for examId:", exam.id);
      const examQuestions = await db.select().from(questions).where(eq(questions.examId, exam.id));
      console.log("[STORAGE] Questions found:", examQuestions.length);
      examWithQuestions = { ...exam, questions: examQuestions };
    } else {
      console.log("[STORAGE] No exam found for examId:", link.examId);
    }
    
    // Get session count
    const sessions = await db.select().from(examSessions).where(eq(examSessions.examLinkId, link.id));
    
    return {
      ...link,
      exam: examWithQuestions,
      _count: { sessions: sessions.length }
    } as ExamLinkWithDetails;
  }
  
  async getExamLinksByExamId(examId: number): Promise<ExamLinkWithDetails[]> {
    const links = await db.select().from(examLinks).where(eq(examLinks.examId, examId));
    
    const detailedLinks = await Promise.all(links.map(async (link) => {
      const [exam] = await db.select().from(exams).where(eq(exams.id, link.examId));
      const sessions = await db.select().from(examSessions).where(eq(examSessions.examLinkId, link.id));
      
      return {
        ...link,
        exam,
        _count: { sessions: sessions.length }
      } as ExamLinkWithDetails;
    }));
    
    return detailedLinks;
  }
  
  async updateExamLink(id: number, data: { isActive?: boolean; expiresAt?: Date }): Promise<ExamLink> {
    const [updated] = await db.update(examLinks)
      .set(data)
      .where(eq(examLinks.id, id))
      .returning();
    return updated;
  }
  
  async deleteExamLink(id: number): Promise<void> {
    await db.delete(examLinks).where(eq(examLinks.id, id));
  }
  
  async deleteExam(id: number): Promise<void> {
    console.log("[STORAGE] Starting deleteExam for examId:", id);
    
    try {
      // Note: Database has CASCADE constraints that will automatically handle some deletions.
      // The examSessions table has ON DELETE CASCADE to both examLinks and exams.
      // We need to be careful about the order of operations.
      
      // 1. Get all attempts for this exam first (before we delete anything)
      const examAttemptsList = await db.select().from(examAttempts).where(eq(examAttempts.examId, id));
      console.log("[STORAGE] Found", examAttemptsList.length, "attempts for exam", id);
      
      // 2. Delete camera frames for all attempts
      for (const attempt of examAttemptsList) {
        await db.delete(cameraFrames).where(eq(cameraFrames.attemptId, attempt.id)).catch((e) => { /* ignore error */ });
        console.log("[STORAGE] Deleted camera frames for attempt:", attempt.id);
      }
      
      // 3. Delete all related data for each attempt
      for (const attempt of examAttemptsList) {
        console.log("[STORAGE] Deleting data for attempt:", attempt.id);
        // Delete student answers
        await db.delete(studentAnswers).where(eq(studentAnswers.attemptId, attempt.id)).catch((e) => { /* ignore error */ });
        // Delete exam photos
        await db.delete(examPhotos).where(eq(examPhotos.attemptId, attempt.id)).catch((e) => { /* ignore error */ });
      }
      
      // 4. Delete all attempts
      console.log("[STORAGE] Deleting attempts for exam:", id);
      await db.delete(examAttempts).where(eq(examAttempts.examId, id));
      
      // 5. Delete exam links FIRST (this will cascade delete examSessions due to foreign key)
      //    We need to do this BEFORE manually deleting examSessions
      console.log("[STORAGE] Deleting exam links for exam:", id);
      await db.delete(examLinks).where(eq(examLinks.examId, id)).catch((e) => { /* ignore error */ });
      
      // 6. Now delete exam sessions - these should already be deleted by cascade from examLinks
      //    but we keep this for safety (will be no-op if already deleted)
      console.log("[STORAGE] Deleting exam sessions for exam:", id);
      await db.delete(examSessions).where(eq(examSessions.examId, id)).catch((e) => { /* ignore error */ });
      
      // 7. Delete all re-exam requests for this exam
      console.log("[STORAGE] Deleting reexam requests for exam:", id);
      await db.delete(reexamRequests).where(eq(reexamRequests.examId, id)).catch((e) => { /* ignore error */ });
      
      // 8. Delete all questions
      console.log("[STORAGE] Deleting questions for exam:", id);
      await db.delete(questions).where(eq(questions.examId, id)).catch((e) => { /* ignore error */ });
      
      // 9. Finally delete the exam
      console.log("[STORAGE] Deleting exam itself:", id);
      await db.delete(exams).where(eq(exams.id, id));
      
      console.log("[STORAGE] Successfully deleted exam:", id);
    } catch (error) {
      console.error("[STORAGE] Error deleting exam:", error);
      throw error;
    }
  }
  
  // Exam sessions methods
  async createExamSession(session: InsertExamSession): Promise<ExamSession> {
    const [created] = await db.insert(examSessions).values(session).returning();
    return created;
  }
  
  async getExamSessionById(id: number): Promise<ExamSessionWithDetails | undefined> {
    const [session] = await db.select().from(examSessions).where(eq(examSessions.id, id));
    if (!session) return undefined;
    
    const [exam] = await db.select().from(exams).where(eq(exams.id, session.examId));
    const [examLink] = await db.select().from(examLinks).where(eq(examLinks.id, session.examLinkId));
    
    let attempt: ExamAttempt | undefined;
    if (session.attemptId) {
      const [att] = await db.select().from(examAttempts).where(eq(examAttempts.id, session.attemptId));
      attempt = att;
    }
    
    return {
      ...session,
      exam,
      examLink,
      attempt
    } as ExamSessionWithDetails;
  }
  
  async getExamSessionByEmailAndExam(examId: number, email: string): Promise<ExamSessionWithDetails | undefined> {
    const sessions = await db.select().from(examSessions)
      .where(and(
        eq(examSessions.examId, examId),
        eq(examSessions.studentEmail, email.toLowerCase())
      ));
    
    if (sessions.length === 0) return undefined;
    
    // Return the most recent session
    const session = sessions[0];
    const [exam] = await db.select().from(exams).where(eq(exams.id, session.examId));
    const [examLink] = await db.select().from(examLinks).where(eq(examLinks.id, session.examLinkId));
    
    let attempt: ExamAttempt | undefined;
    if (session.attemptId) {
      const [att] = await db.select().from(examAttempts).where(eq(examAttempts.id, session.attemptId));
      attempt = att;
    }
    
    return {
      ...session,
      exam,
      examLink,
      attempt
    } as ExamSessionWithDetails;
  }
  
  async getExamSessionsByExamId(examId: number): Promise<ExamSessionWithDetails[]> {
    const sessions = await db.select().from(examSessions)
      .where(eq(examSessions.examId, examId))
      .orderBy(desc(examSessions.joinedAt));
    
    const detailedSessions = await Promise.all(sessions.map(async (session) => {
      const [exam] = await db.select().from(exams).where(eq(exams.id, session.examId));
      const [examLink] = await db.select().from(examLinks).where(eq(examLinks.id, session.examLinkId));
      
      let attempt: ExamAttempt | undefined;
      if (session.attemptId) {
        const [att] = await db.select().from(examAttempts).where(eq(examAttempts.id, session.attemptId));
        attempt = att;
      }
      
      return {
        ...session,
        exam,
        examLink,
        attempt
      } as ExamSessionWithDetails;
    }));
    
    return detailedSessions;
  }
  
  async getActiveExamSessions(examId: number): Promise<ExamSessionWithDetails[]> {
    const sessions = await db.select().from(examSessions)
      .where(and(
        eq(examSessions.examId, examId),
        eq(examSessions.status, "in_progress")
      ))
      .orderBy(desc(examSessions.lastHeartbeat));
    
    const detailedSessions = await Promise.all(sessions.map(async (session) => {
      const [exam] = await db.select().from(exams).where(eq(exams.id, session.examId));
      const [examLink] = await db.select().from(examLinks).where(eq(examLinks.id, session.examLinkId));
      
      let attempt: ExamAttempt | undefined;
      if (session.attemptId) {
        const [att] = await db.select().from(examAttempts).where(eq(examAttempts.id, session.attemptId));
        attempt = att;
      }
      
      return {
        ...session,
        exam,
        examLink,
        attempt
      } as ExamSessionWithDetails;
    }));
    
    return detailedSessions;
  }
  
  async getAllExamSessions(): Promise<ExamSession[]> {
    return await db.select().from(examSessions).orderBy(desc(examSessions.joinedAt));
  }

  async updateExamSession(id: number, data: { status?: string; attemptId?: number; startedAt?: Date; completedAt?: Date; lastHeartbeat?: Date }): Promise<ExamSession> {
    const [updated] = await db.update(examSessions)
      .set(data)
      .where(eq(examSessions.id, id))
      .returning();
    return updated;
  }
  
  // Camera frames methods
  async saveCameraFrame(frame: InsertCameraFrame): Promise<CameraFrame> {
    const [saved] = await db.insert(cameraFrames).values(frame).returning();
    return saved;
  }
  
  async getLatestCameraFrame(sessionId: number): Promise<CameraFrame | undefined> {
    const [frame] = await db.select().from(cameraFrames)
      .where(eq(cameraFrames.sessionId, sessionId))
      .orderBy(desc(cameraFrames.capturedAt))
      .limit(1);
    return frame;
  }
  
  async getCameraFramesForSession(sessionId: number): Promise<CameraFrame[]> {
    return await db.select().from(cameraFrames)
      .where(eq(cameraFrames.sessionId, sessionId))
      .orderBy(desc(cameraFrames.capturedAt));
  }
  
// Proctoring logs methods
  async createProctoringLog(log: InsertProctoringLog): Promise<ProctoringLog> {
    const [created] = await db.insert(proctoringLogs).values(log).returning();
    return created;
  }
  
  async getProctoringLogsByExamId(examId: number): Promise<ProctoringLog[]> {
    return await db.select().from(proctoringLogs)
      .where(eq(proctoringLogs.examId, examId))
      .orderBy(desc(proctoringLogs.timestamp));
  }
  
  async getProctoringLogsByAttemptId(attemptId: number): Promise<ProctoringLog[]> {
    return await db.select().from(proctoringLogs)
      .where(eq(proctoringLogs.attemptId, attemptId))
      .orderBy(desc(proctoringLogs.timestamp));
  }
  
  async getAllProctoringLogs(): Promise<ProctoringLog[]> {
    return await db.select().from(proctoringLogs)
      .orderBy(desc(proctoringLogs.timestamp));
  }
  
  async getAllStudents(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, 'student')).orderBy(desc(users.createdAt));
  }
  
  async deleteStudent(id: number): Promise<void> {
    // Delete related data first (OTPs, attempts, answers, photos)
    await db.delete(otps).where(eq(otps.userId, id));
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, id));
    
    // Get all attempts by this student
    const studentAttempts = await db.select().from(examAttempts).where(eq(examAttempts.studentId, id));
    
    // Delete all answers and photos for each attempt
    for (const attempt of studentAttempts) {
      await db.delete(studentAnswers).where(eq(studentAnswers.attemptId, attempt.id));
      await db.delete(examPhotos).where(eq(examPhotos.attemptId, attempt.id));
    }
    
    // Delete all attempts
    await db.delete(examAttempts).where(eq(examAttempts.studentId, id));
    
    // Finally delete the user
    await db.delete(users).where(eq(users.id, id));
  }

  // Copy exam - creates a duplicate of an exam with its questions
  async copyExam(originalExamId: number, newTitle: string): Promise<Exam> {
    console.log("[STORAGE] Copying exam", originalExamId, "with new title:", newTitle);
    
    // Get the original exam with questions
    const originalExam = await this.getExam(originalExamId);
    if (!originalExam) {
      throw new Error("Original exam not found");
    }
    
    console.log("[STORAGE] Original exam found:", originalExam.id, originalExam.title);
    console.log("[STORAGE] Original exam has", originalExam.questions?.length || 0, "questions");
    
    // Create the new exam - copy all properties including isEnabled
    const [newExam] = await db.insert(exams).values({
      title: newTitle,
      description: originalExam.description || "",
      durationMinutes: originalExam.durationMinutes,
      totalMarks: originalExam.totalMarks,
      passingMarks: originalExam.passingMarks || null,
      requireCamera: originalExam.requireCamera || false,
      isEnabled: originalExam.isEnabled !== undefined ? originalExam.isEnabled : true
    }).returning();
    
    console.log("[STORAGE] New exam created with id:", newExam.id, "isEnabled:", newExam.isEnabled);
    
    // Copy all questions from the original exam
    if (originalExam.questions && originalExam.questions.length > 0) {
      let copiedCount = 0;
      for (const question of originalExam.questions) {
        try {
          await db.insert(questions).values({
            examId: newExam.id,
            questionText: question.questionText,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            correctAnswer: question.correctAnswer,
            marks: question.marks
          });
          copiedCount++;
        } catch (questionError) {
          console.error("[STORAGE] Error copying question:", questionError);
          // Continue copying other questions even if one fails
        }
      }
      console.log("[STORAGE] Copied", copiedCount, "questions out of", originalExam.questions.length);
    } else {
      console.log("[STORAGE] No questions to copy - original exam has 0 questions");
    }
    
    // Fetch the newly created exam with questions to return
    const createdExam = await this.getExam(newExam.id);
    console.log("[STORAGE] Copy complete - new exam has", createdExam?.questions?.length || 0, "questions");

    // Return a clean exam object without the questions to avoid JSON serialization issues
    return {
      id: newExam.id,
      title: newExam.title,
      description: newExam.description,
      durationMinutes: newExam.durationMinutes,
      totalMarks: newExam.totalMarks,
      passingMarks: newExam.passingMarks,
      requireCamera: newExam.requireCamera,
      createdAt: newExam.createdAt
    };
  }

  // Check if an exam title already exists (case-insensitive)
  async checkExamTitleExists(title: string): Promise<boolean> {
    const normalizedTitle = title.toLowerCase().trim();
    const allExams = await db.select().from(exams);
    return allExams.some(exam => exam.title.toLowerCase().trim() === normalizedTitle);
  }

  // Audit log methods
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [result] = await db.insert(auditLogs).values(log).returning();
    return result;
  }

  async getAuditLogs(limit = 500): Promise<AuditLog[]> {
    return db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(limit);
  }

  // Coding question methods
  async createCodingQuestion(question: InsertCodingQuestion): Promise<CodingQuestion> {
    const [result] = await db.insert(codingQuestions).values(question).returning();
    return result;
  }

  async getCodingQuestionsByExamId(examId: number): Promise<CodingQuestion[]> {
    return db.select().from(codingQuestions).where(eq(codingQuestions.examId, examId));
  }

  async getCodingQuestion(id: number): Promise<CodingQuestion | undefined> {
    const [result] = await db.select().from(codingQuestions).where(eq(codingQuestions.id, id));
    return result;
  }

  async updateCodingQuestion(id: number, data: Partial<InsertCodingQuestion>): Promise<CodingQuestion> {
    const [result] = await db.update(codingQuestions).set(data).where(eq(codingQuestions.id, id)).returning();
    return result;
  }

  async deleteCodingQuestion(id: number): Promise<void> {
    await db.delete(codingQuestions).where(eq(codingQuestions.id, id));
  }

  // Coding submission methods
  async createCodingSubmission(submission: InsertCodingSubmission): Promise<CodingSubmission> {
    const [result] = await db.insert(codingSubmissions).values(submission).returning();
    return result;
  }

  async getCodingSubmissionsByAttempt(attemptId: number): Promise<CodingSubmission[]> {
    return db.select().from(codingSubmissions).where(eq(codingSubmissions.attemptId, attemptId));
  }

  // Analytics methods
  async getScoreDistribution(): Promise<{ range: string; count: number }[]> {
    const allAttempts = await db.select().from(examAttempts);
    const completed = allAttempts.filter(a => a.score !== null && a.score !== undefined);
    const ranges = [
      { range: "0-20", min: 0, max: 20 },
      { range: "21-40", min: 21, max: 40 },
      { range: "41-60", min: 41, max: 60 },
      { range: "61-80", min: 61, max: 80 },
      { range: "81-100", min: 81, max: 100 },
    ];
    return ranges.map(r => ({
      range: r.range,
      count: completed.filter(a => {
        const score = a.score ?? 0;
        return score >= r.min && score <= r.max;
      }).length,
    }));
  }

  async getPassFailRatio(): Promise<{ passed: number; failed: number; pending: number }> {
    const all = await db.select().from(examAttempts);
    let passed = 0, failed = 0, pending = 0;
    for (const attempt of all) {
      if (attempt.status === "shortlisted" || attempt.status === "selected") passed++;
      else if (attempt.status === "rejected") failed++;
      else pending++;
    }
    return { passed, failed, pending };
  }

  async getAvgTimeTaken(): Promise<{ examTitle: string; avgMinutes: number }[]> {
    const allExams = await db.select().from(exams);
    const result: { examTitle: string; avgMinutes: number }[] = [];
    for (const exam of allExams) {
      const attempts = await db.select().from(examAttempts)
        .where(and(eq(examAttempts.examId, exam.id)));
      const withTime = attempts.filter(a => a.startedAt && a.completedAt);
      if (withTime.length === 0) {
        result.push({ examTitle: exam.title, avgMinutes: 0 });
        continue;
      }
      const totalMs = withTime.reduce((sum, a) => {
        return sum + (new Date(a.completedAt!).getTime() - new Date(a.startedAt!).getTime());
      }, 0);
      const avgMs = totalMs / withTime.length;
      result.push({ examTitle: exam.title, avgMinutes: Math.round(avgMs / 60000) });
    }
    return result;
  }
}

export const storage = new DatabaseStorage();

