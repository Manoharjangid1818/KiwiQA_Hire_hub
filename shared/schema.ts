import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"),
  isVerified: boolean("is_verified").default(false),
  verificationExpiry: timestamp("verification_expiry"),
  lastPassword: text("last_password"), // Store previous password for reference
  createdAt: timestamp("created_at").defaultNow(),
});

export const otps = pgTable("otps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  otps: many(otps),
  passwordResetTokens: many(passwordResetTokens),
  examAttempts: many(examAttempts),
}));

export const otpsRelations = relations(otps, ({ one }) => ({
  user: one(users, { fields: [otps.userId], references: [users.id] }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, { fields: [passwordResetTokens.userId], references: [users.id] }),
}));

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull(),
  totalMarks: integer("total_marks").notNull(),
  passingMarks: integer("passing_marks"),
  requireCamera: boolean("require_camera").default(false),
  isEnabled: boolean("is_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull(),
  questionText: text("question_text").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  marks: integer("marks").notNull(),
});

export const examAttempts = pgTable("exam_attempts", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  examId: integer("exam_id").notNull(),
  score: integer("score"),
  status: text("status"), // Status: pending, shortlisted, rejected, selected
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const studentAnswers = pgTable("student_answers", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id").notNull(),
  questionId: integer("question_id").notNull(),
  selectedAnswer: text("selected_answer"),
  isCorrect: boolean("is_correct"),
  marksAwarded: integer("marks_awarded"),
});

export const examPhotos = pgTable("exam_photos", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id").notNull(),
  photoData: text("photo_data").notNull(), // Base64 encoded image
  capturedAt: timestamp("captured_at").defaultNow(),
});

export const reexamRequests = pgTable("reexam_requests", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id").notNull().references(() => examAttempts.id, { onDelete: "cascade" }),
  studentId: integer("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  requestedAt: timestamp("requested_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
  adminId: integer("admin_id").references(() => users.id, { onDelete: "set null" }),
  adminNote: text("admin_note"),
});

// New table for unique exam links
export const examLinks = pgTable("exam_links", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  uniqueCode: text("unique_code").notNull().unique(), // Shareable code for the link
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // Optional expiration
  isActive: boolean("is_active").default(true),
});

// New table to track exam sessions (students accessing exam via link)
export const examSessions = pgTable("exam_sessions", {
  id: serial("id").primaryKey(),
  examLinkId: integer("exam_link_id").notNull().references(() => examLinks.id, { onDelete: "cascade" }),
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  studentName: text("student_name").notNull(),
  studentEmail: text("student_email").notNull(),
  status: text("status").notNull().default("not_started"), // not_started, in_progress, completed
  attemptId: integer("attempt_id").references(() => examAttempts.id, { onDelete: "set null" }),
  joinedAt: timestamp("joined_at").defaultNow(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  lastHeartbeat: timestamp("last_heartbeat").defaultNow(),
  ipAddress: text("ip_address"),
});

// Table for storing camera frames during exam (for live monitoring)
export const cameraFrames = pgTable("camera_frames", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => examSessions.id, { onDelete: "cascade" }),
  attemptId: integer("attempt_id").references(() => examAttempts.id, { onDelete: "set null" }),
  frameData: text("frame_data").notNull(), // Base64 encoded frame
  capturedAt: timestamp("capted_at").defaultNow(),
});

// Table for proctoring logs (gaze monitoring - NO images stored)
export const proctoringLogs = pgTable("proctoring_logs", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id").notNull().references(() => examAttempts.id, { onDelete: "cascade" }),
  studentId: integer("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  activityType: text("activity_type").notNull(), // Looking Away, Face Not Visible, etc.
  warningCount: integer("warning_count").default(0),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const examsRelations = relations(exams, ({ many }) => ({
  questions: many(questions),
  attempts: many(examAttempts),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  exam: one(exams, { fields: [questions.examId], references: [exams.id] }),
}));

export const examAttemptsRelations = relations(examAttempts, ({ one, many }) => ({
  student: one(users, { fields: [examAttempts.studentId], references: [users.id] }),
  exam: one(exams, { fields: [examAttempts.examId], references: [exams.id] }),
  answers: many(studentAnswers),
  photos: many(examPhotos),
}));

export const studentAnswersRelations = relations(studentAnswers, ({ one }) => ({
  attempt: one(examAttempts, { fields: [studentAnswers.attemptId], references: [examAttempts.id] }),
  question: one(questions, { fields: [studentAnswers.questionId], references: [questions.id] }),
}));

export const examPhotosRelations = relations(examPhotos, ({ one }) => ({
  attempt: one(examAttempts, { fields: [examPhotos.attemptId], references: [examAttempts.id] }),
}));

export const reexamRequestsRelations = relations(reexamRequests, ({ one }) => ({
  attempt: one(examAttempts, { fields: [reexamRequests.attemptId], references: [examAttempts.id] }),
  student: one(users, { fields: [reexamRequests.studentId], references: [users.id] }),
  exam: one(exams, { fields: [reexamRequests.examId], references: [exams.id] }),
  admin: one(users, { fields: [reexamRequests.adminId], references: [users.id] }),
}));

// Relations for examLinks
export const examLinksRelations = relations(examLinks, ({ one, many }) => ({
  exam: one(exams, { fields: [examLinks.examId], references: [exams.id] }),
  sessions: many(examSessions),
}));

// Relations for examSessions
export const examSessionsRelations = relations(examSessions, ({ one }) => ({
  examLink: one(examLinks, { fields: [examSessions.examLinkId], references: [examLinks.id] }),
  exam: one(exams, { fields: [examSessions.examId], references: [exams.id] }),
  attempt: one(examAttempts, { fields: [examSessions.attemptId], references: [examAttempts.id] }),
}));

// Relations for cameraFrames
export const cameraFramesRelations = relations(cameraFrames, ({ one }) => ({
  session: one(examSessions, { fields: [cameraFrames.sessionId], references: [examSessions.id] }),
  attempt: one(examAttempts, { fields: [cameraFrames.attemptId], references: [examAttempts.id] }),
}));

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true }).extend({
  verificationExpiry: z.date().optional(),
  lastPassword: z.string().optional(),
});
export const insertOtpSchema = createInsertSchema(otps).omit({ id: true, createdAt: true });
export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({ id: true, createdAt: true, usedAt: true });
export const insertExamSchema = createInsertSchema(exams).omit({ id: true, createdAt: true });
export const insertQuestionSchema = createInsertSchema(questions).omit({ id: true });
export const insertExamAttemptSchema = createInsertSchema(examAttempts).omit({ id: true, startedAt: true });
export const insertStudentAnswerSchema = createInsertSchema(studentAnswers).omit({ id: true });
export const insertExamPhotoSchema = createInsertSchema(examPhotos).omit({ id: true, capturedAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;
export type Exam = typeof exams.$inferSelect;
export type InsertExam = typeof exams.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;
export type ExamAttempt = typeof examAttempts.$inferSelect;
export type InsertExamAttempt = typeof examAttempts.$inferInsert;
export type StudentAnswer = typeof studentAnswers.$inferSelect;
export type InsertStudentAnswer = typeof studentAnswers.$inferInsert;
export type ExamPhoto = typeof examPhotos.$inferSelect;
export type InsertExamPhoto = typeof examPhotos.$inferInsert;

export type AuthResponse = { token: string; user: Omit<User, "password"> };
export type ExamWithQuestions = Exam & { questions?: Question[] };
export type AttemptWithDetails = ExamAttempt & { 
  exam?: Exam; 
  student?: Omit<User, "password">;
  answers?: (StudentAnswer & { question?: Question })[];
  photos?: ExamPhoto[];
};

export type ReexamRequest = typeof reexamRequests.$inferSelect;
export type InsertReexamRequest = typeof reexamRequests.$inferInsert;

export type ReexamRequestWithDetails = ReexamRequest & {
  student?: Omit<User, "password">;
  exam?: Exam;
  attempt?: ExamAttempt;
};

// New types for exam links and sessions
export type ExamLink = typeof examLinks.$inferSelect;
export type InsertExamLink = typeof examLinks.$inferInsert;

export type ExamSession = typeof examSessions.$inferSelect;
export type InsertExamSession = typeof examSessions.$inferInsert;

export type CameraFrame = typeof cameraFrames.$inferSelect;
export type InsertCameraFrame = typeof cameraFrames.$inferInsert;

// Proctoring log types
export type ProctoringLog = typeof proctoringLogs.$inferSelect;
export type InsertProctoringLog = typeof proctoringLogs.$inferInsert;

export type ExamSessionWithDetails = ExamSession & {
  exam?: Exam;
  examLink?: ExamLink;
  attempt?: ExamAttempt;
};

export type ExamLinkWithDetails = ExamLink & {
  exam?: Exam;
  _count?: { sessions: number };
};

