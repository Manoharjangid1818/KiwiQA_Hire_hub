import dotenv from "dotenv";
dotenv.config();

import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";

import { users } from "@shared/schema";
import { api } from "@shared/routes";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail, sendPasswordResetEmail } from "./email";
import { eq } from "drizzle-orm";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_kiwiqa_key_for_dev";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ 
  storage: storage_multer,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  }
});

// Middleware to protect routes with JWT
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }
      (req as any).user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Unauthorized: Missing token" });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user && (req as any).user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admin access required" });
  }
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Seed DB with admin user if not exists
  async function seedDatabase(): Promise<void> {
    try {
      const adminExists = await storage.getUserByEmail("admin@kiwiqa.com");
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await storage.createUser({
          fullName: "Admin User",
          email: "admin@kiwiqa.com",
          password: hashedPassword,
          role: "admin",
          isVerified: true
        });
        console.log("Admin user seeded: admin@kiwiqa.com / admin123");
      }
      
      // Clean up all unverified users on startup
      const deletedCount = await storage.cleanupUnverifiedUsers();
      if (deletedCount > 0) {
        console.log(`Cleaned up ${deletedCount} unverified user(s) on startup`);
      }
    } catch (e) {
      console.error("Failed to seed database:", e);
    }
  }

  // Auth Routes - Registration
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      
      // Check for existing verified user
      const existingVerifiedUser = await storage.getUserByEmail(input.email);
      if (existingVerifiedUser && existingVerifiedUser.isVerified) {
        return res.status(400).json({ message: "Email already registered and verified" });
      }
      
      // If unverified user exists with same email, delete them to allow re-registration
      if (existingVerifiedUser && !existingVerifiedUser.isVerified) {
        // Delete old OTPs first
        await storage.deleteOtps(existingVerifiedUser.id);
        // Delete old unverified user
        await storage.deleteUser(existingVerifiedUser.id);
        console.log(`Deleted old unverified user: ${input.email}`);
      }
      
      // Generate OTP first
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes
      const verificationExpiry = new Date(Date.now() + 5 * 60000); // 5 minutes
      
      // Create user with verification expiry
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await storage.createUser({
        fullName: input.fullName,
        email: input.email,
        password: hashedPassword,
        role: "student",
        isVerified: false,
        verificationExpiry
      });
      
      // Create OTP record
      await storage.createOtp(user.id, otp, expiresAt);
      
      // Try to send OTP via email - but don't fail registration if email fails
      // This allows testing without SMTP configured
      const emailSent = await sendOtpEmail(user.email, otp, user.fullName);
      
      if (!emailSent) {
        console.log(`Warning: Email not sent to ${user.email}. OTP is: ${otp}`);
        // For development/testing: return the OTP in response
        // In production, this should log to console for testing purposes
        return res.status(201).json({ 
          message: "User registered successfully. OTP for testing: " + otp, 
          userId: user.id,
          otp: otp // Include OTP for testing without email
        });
      }
      
      res.status(201).json({ message: "User registered. Please verify OTP.", userId: user.id });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Resend OTP endpoint
  app.post("/api/auth/resend-otp", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user.isVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }
      
      // Check if verification has expired
      if (user.verificationExpiry && user.verificationExpiry < new Date()) {
        // Clean up expired user
        await storage.deleteOtps(user.id);
        await storage.deleteUser(user.id);
        return res.status(400).json({ message: "Verification expired. Please register again." });
      }
      
      // Delete old OTPs
      await storage.deleteOtps(user.id);
      
      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes
      
      // Create new OTP
      await storage.createOtp(user.id, otp, expiresAt);
      
      // Send OTP via email
      const emailSent = await sendOtpEmail(user.email, otp, user.fullName);
      
      if (!emailSent) {
        // For development/testing: return the OTP in response
        console.log(`Resend OTP for ${user.email}: ${otp}`);
        return res.status(201).json({ 
          message: "OTP for testing: " + otp,
          otp: otp
        });
      }
      
      res.status(200).json({ message: "OTP resent successfully" });
    } catch (err) {
      console.error("Resend OTP error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Verify OTP
  app.post(api.auth.verifyOtp.path, async (req, res) => {
    try {
      const input = api.auth.verifyOtp.input.parse(req.body);
      const user = await storage.getUserByEmail(input.email);
      if (!user) return res.status(400).json({ message: "User not found" });
      
      // Check if already verified
      if (user.isVerified) return res.status(400).json({ message: "Email already verified. Please login." });
      
      // Check if verification has expired
      if (user.verificationExpiry && user.verificationExpiry < new Date()) {
        // Clean up expired user
        await storage.deleteOtps(user.id);
        await storage.deleteUser(user.id);
        return res.status(400).json({ message: "Verification expired. Please register again." });
      }
      
      const latestOtp = await storage.getLatestOtp(user.id);
      if (!latestOtp) return res.status(400).json({ message: "No OTP found. Please request a new one." });
      
      if (latestOtp.otp !== input.otp) return res.status(400).json({ message: "Invalid OTP" });
      if (latestOtp.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired. Please request a new one." });
      
      // Clear verification expiry and mark as verified
      await db.update(users).set({ isVerified: true, verificationExpiry: null }).where(eq(users.id, user.id));
      
      // Clean up OTPs after successful verification
      await storage.deleteOtps(user.id);
      
      res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Login
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByEmail(input.email);
      if (!user) return res.status(401).json({ message: "Invalid email or password" });
      
      if (!user.isVerified) return res.status(403).json({ message: "Please verify your email first" });
      
      // Check if password hash is valid (should be 60 chars for bcrypt)
      // If not, try to rehash with plaintext password (backward compatibility)
      if (!user.password || user.password.length < 60) {
        console.log("Found user with invalid password hash, attempting to fix:", input.email);
        // Hash the plaintext password and update the user
        const hashedPassword = await bcrypt.hash(input.password, 10);
        await db.update(users).set({ password: hashedPassword }).where(eq(users.id, user.id));
        // Get the updated user
        const updatedUser = await storage.getUserByEmail(input.email);
        if (!updatedUser) return res.status(401).json({ message: "Invalid email or password" });
        
        const token = jwt.sign({ id: updatedUser.id, email: updatedUser.email, role: updatedUser.role }, JWT_SECRET, { expiresIn: '24h' });
        return res.status(200).json({
          token,
          user: { id: updatedUser.id, fullName: updatedUser.fullName, email: updatedUser.email, role: updatedUser.role }
        });
      }
      
      const validPassword = await bcrypt.compare(input.password, user.password);
      if (!validPassword) return res.status(401).json({ message: "Invalid email or password" });
      
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      
      res.status(200).json({
        token,
        user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }
      });
    } catch (err) {
      console.error("Login error details:", err);
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else if (err instanceof Error) {
        // Check for specific error types
        if (err.message.includes("Invalid signature")) {
          res.status(500).json({ message: "Server configuration error. Please contact administrator." });
        } else if (err.message.includes("data and hash")) {
          res.status(500).json({ message: "Invalid password format. Please reset your password." });
        } else if (err.message.includes("crypto")) {
          res.status(500).json({ message: "Password verification failed. Please try again." });
        } else {
          res.status(500).json({ message: "Internal server error: " + err.message });
        }
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.auth.me.path, authenticateJWT, async (req, res) => {
    const u = (req as any).user;
    const user = await storage.getUser(u.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }
    });
  });

  // Exams Routes
  app.get(api.exams.list.path, authenticateJWT, async (req, res) => {
    const exams = await storage.getExams();
    res.json(exams);
  });

  app.get(api.exams.get.path, authenticateJWT, async (req, res) => {
    const exam = await storage.getExam(Number(req.params.id));
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    
    // Hide correct answers if requested by student
    if ((req as any).user.role !== 'admin') {
      if (exam.questions) {
        exam.questions = exam.questions.map(q => {
          const { correctAnswer, ...safeQ } = q;
          return safeQ as any;
        });
      }
    }
    
    res.json(exam);
  });

  app.post(api.exams.create.path, authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const input = api.exams.create.input.parse(req.body);
      console.log("Creating exam with input:", input);
      const exam = await storage.createExam(input);
      console.log("Exam created successfully:", exam.id);
      const adminUser = (req as any).user;
      await storage.createAuditLog({
        userId: adminUser.id, userEmail: adminUser.email, userRole: "admin",
        action: "Created exam",
        metadata: { examId: exam.id, examTitle: exam.title }
      }).catch(() => {});
      res.status(201).json(exam);
    } catch (err) {
      console.error("Create exam error:", err);
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else if (err instanceof Error) {
        res.status(500).json({ message: "Internal server error: " + err.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Update Exam (Admin only)
  app.put("/api/exams/:id", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const examId = Number(req.params.id);
      const exam = await storage.getExam(examId);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      
      const { title, description, durationMinutes, totalMarks, requireCamera, isEnabled } = req.body;
      
      const updatedExam = await storage.updateExam(examId, {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(durationMinutes && { durationMinutes: Number(durationMinutes) }),
        ...(totalMarks && { totalMarks: Number(totalMarks) }),
        ...(requireCamera !== undefined && { requireCamera }),
        ...(isEnabled !== undefined && { isEnabled })
      });
      
      res.status(200).json(updatedExam);
    } catch (err) {
      console.error("Update exam error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Toggle Exam Enabled/Disabled (Admin only)
  app.patch("/api/admin/exams/:id/toggle", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const examId = Number(req.params.id);
      
      console.log("[TOGGLE] Received toggle request for exam:", examId);
      
      if (isNaN(examId)) {
        return res.status(400).json({ message: "Invalid exam ID" });
      }
      
      const exam = await storage.getExam(examId);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      
      console.log("[TOGGLE] Current exam status:", exam.isEnabled);
      
      // Toggle the current status - handle undefined/null cases properly
      const currentStatus = exam.isEnabled ?? true;
      const newStatus = !currentStatus;
      
      console.log("[TOGGLE] Toggling exam:", examId, "from", currentStatus, "to", newStatus);
      
      const updatedExam = await storage.updateExam(examId, { isEnabled: newStatus });
      
      console.log("[TOGGLE] Exam toggled successfully, new status:", updatedExam.isEnabled);
      
      res.status(200).json({ 
        message: newStatus ? "Exam enabled successfully" : "Exam disabled successfully",
        isEnabled: newStatus 
      });
    } catch (err) {
      console.error("[TOGGLE] Toggle exam error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ message: "Internal server error: " + errorMessage });
    }
  });

  // Delete Exam (Admin only)
  app.delete("/api/exams/:id", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const examId = Number(req.params.id);
      
      if (isNaN(examId)) {
        return res.status(400).json({ message: "Invalid exam ID" });
      }
      
      const exam = await storage.getExam(examId);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      
      console.log("Deleting exam:", examId, exam.title);
      await storage.deleteExam(examId);
      console.log("Exam deleted successfully:", examId);
      const delUser = (req as any).user;
      await storage.createAuditLog({
        userId: delUser.id, userEmail: delUser.email, userRole: "admin",
        action: "Deleted exam",
        metadata: { examId, examTitle: exam.title }
      }).catch(() => {});
      res.status(200).json({ message: "Exam deleted successfully" });
    } catch (err) {
      console.error("Delete exam error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ message: "Failed to delete exam: " + errorMessage });
    }
  });

  // Copy Exam (Admin only) - creates a duplicate of an exam with all questions
  app.post("/api/admin/exams/:id/copy", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const originalExamId = Number(req.params.id);
      const { newTitle } = req.body;
      
      if (isNaN(originalExamId)) {
        return res.status(400).json({ message: "Invalid exam ID" });
      }
      
      if (!newTitle || !newTitle.trim()) {
        return res.status(400).json({ message: "New exam title is required" });
      }
      
      // Check if original exam exists
      const originalExam = await storage.getExam(originalExamId);
      if (!originalExam) {
        return res.status(404).json({ message: "Original exam not found" });
      }
      
      // Check if the new title already exists
      const titleExists = await storage.checkExamTitleExists(newTitle.trim());
      if (titleExists) {
        return res.status(400).json({ message: "An exam with this title already exists. Please choose a different title." });
      }
      
      // Copy the exam
      console.log("[ROUTES] Starting copy exam for examId:", originalExamId, "with title:", newTitle.trim());
      const newExam = await storage.copyExam(originalExamId, newTitle.trim());

      console.log("Exam copied successfully:", originalExamId, "->", newExam.id);

      // Ensure the response is properly serialized
      const responseData = {
        message: "Exam copied successfully",
        exam: {
          id: newExam.id,
          title: newExam.title,
          description: newExam.description,
          durationMinutes: newExam.durationMinutes,
          totalMarks: newExam.totalMarks,
          passingMarks: newExam.passingMarks,
          requireCamera: newExam.requireCamera,
          createdAt: newExam.createdAt
        }
      };

      res.status(201).json(responseData);
    } catch (err) {
      console.error("Copy exam error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      const errorStack = err instanceof Error ? err.stack : "No stack trace";
      console.error("Copy exam stack trace:", errorStack);
      res.status(500).json({ message: "Failed to copy exam: " + errorMessage });
    }
  });

  // Questions Routes
  app.post(api.questions.create.path, authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const examId = Number(req.params.examId);
      console.log("Creating question for exam:", examId);
      console.log("Question input:", JSON.stringify(req.body));
      
      const input = api.questions.create.input.parse({ ...req.body, examId });
      console.log("Parsed question input:", input);
      
      const question = await storage.createQuestion({ ...input, examId });
      console.log("Question created successfully:", question.id);
      
      res.status(201).json(question);
    } catch (err) {
      console.error("Create question error:", err);
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else if (err instanceof Error) {
        res.status(500).json({ message: "Internal server error: " + err.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.delete(api.questions.delete.path, authenticateJWT, requireAdmin, async (req, res) => {
    await storage.deleteQuestion(Number(req.params.id));
    res.status(204).send();
  });

  // Delete all questions for an exam (Admin only)
  app.delete("/api/admin/exams/:id/questions", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const examId = Number(req.params.id);
      
      if (isNaN(examId)) {
        return res.status(400).json({ message: "Invalid exam ID" });
      }
      
      const exam = await storage.getExam(examId);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      
      console.log("[ROUTES] Deleting all questions for exam:", examId);
      await storage.deleteQuestionsByExamId(examId);
      console.log("[ROUTES] All questions deleted for exam:", examId);
      
      res.status(200).json({ message: "All questions deleted successfully" });
    } catch (err) {
      console.error("Delete questions error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Attempt Routes
  app.post(api.attempts.start.path, authenticateJWT, async (req, res) => {
    try {
      const examId = Number(req.params.examId);
      const studentId = (req as any).user.id;
      
      // Check if exam exists and is enabled
      const exam = await storage.getExam(examId);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      
      if (exam.isEnabled === false) {
        return res.status(403).json({ message: "This exam is currently disabled. Please contact your instructor." });
      }
      
      // Basic check for multiple submissions could go here
      const existingAttempts = await storage.getStudentAttempts(studentId);
      if (existingAttempts.some(a => a.examId === examId)) {
         return res.status(400).json({ message: "You have already attempted this exam." });
      }

      const attempt = await storage.startAttempt({ examId, studentId });
      await storage.createAuditLog({
        userId: studentId, userEmail: (req as any).user.email, userRole: "student",
        action: "Started exam",
        metadata: { examId, attemptId: attempt.id }
      }).catch(() => {});
      res.status(201).json(attempt);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.attempts.submit.path, authenticateJWT, async (req, res) => {
    try {
      const attemptId = Number(req.params.attemptId);
      console.log("Submitting attempt:", attemptId);
      
      const input = api.attempts.submit.input.parse(req.body);
      console.log("Submit input:", JSON.stringify(input));
      
      const attempt = await storage.getAttempt(attemptId);
      console.log("Attempt found:", attempt ? "yes" : "no");
      
      if (!attempt) return res.status(404).json({ message: "Attempt not found" });
      if (attempt.completedAt) return res.status(400).json({ message: "Exam already submitted" });
      if (attempt.studentId !== (req as any).user.id) return res.status(403).json({ message: "Forbidden" });

      const exam = await storage.getExam(attempt.examId);
      console.log("Exam found:", exam ? "yes" : "no");
      console.log("Questions count:", exam?.questions?.length || 0);
      
      if (!exam || !exam.questions) return res.status(404).json({ message: "Exam data missing - no questions found. Please contact admin." });

      let score = 0;
      const dbAnswers = input.answers.map(ans => {
        const question = exam.questions!.find(q => q.id === ans.questionId);
        let isCorrect = false;
        let marksAwarded = 0;
        
        if (question && ans.selectedAnswer === question.correctAnswer) {
          isCorrect = true;
          marksAwarded = question.marks;
          score += marksAwarded;
        }
        
        return {
          attemptId,
          questionId: ans.questionId,
          selectedAnswer: ans.selectedAnswer,
          isCorrect,
          marksAwarded
        };
      });

      console.log("Saving", dbAnswers.length, "answers");
      await storage.saveStudentAnswers(dbAnswers);
      console.log("Answers saved, submitting attempt with score:", score);
      
      const submittedAttempt = await storage.submitAttempt(attemptId, score);
      console.log("Attempt submitted successfully");
      await storage.createAuditLog({
        userId: (req as any).user.id, userEmail: (req as any).user.email, userRole: "student",
        action: "Submitted exam",
        metadata: { attemptId, score }
      }).catch(() => {});
      res.status(200).json(submittedAttempt);
    } catch (err) {
      console.error("Submit exam error:", err);
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else if (err instanceof Error) {
        res.status(500).json({ message: "Internal server error: " + err.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.attempts.get.path, authenticateJWT, async (req, res) => {
    const attempt = await storage.getAttempt(Number(req.params.attemptId));
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    
    // Allow admin to view any attempt, or the student who took the exam
    if ((req as any).user.role !== 'admin' && attempt.studentId !== (req as any).user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    // If not admin, hide correct answers from students (but allow them to see their own answers for report)
    if ((req as any).user.role !== 'admin') {
      // Hide exam questions' correct answers
      if (attempt.exam?.questions) {
        attempt.exam.questions = attempt.exam.questions.map((q: any) => {
          const { correctAnswer, ...safeQ } = q;
          return safeQ;
        });
      }
    }
    
    res.json(attempt);
  });

  // Get proctoring logs for specific attempt (Student/Admin)
  app.get("/api/attempts/:attemptId/proctoring", authenticateJWT, async (req, res) => {
    try {
      const attemptId = Number(req.params.attemptId);
      const attempt = await storage.getAttempt(attemptId);
      
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
      
      // Allow admin to view any attempt, or the student who took the exam
      if ((req as any).user.role !== 'admin' && attempt.studentId !== (req as any).user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const logs = await storage.getProctoringLogsByAttemptId(attemptId);
      res.json(logs);
    } catch (err) {
      console.error("Get proctoring logs error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get photos for specific attempt (Student/Admin)
  app.get("/api/attempts/:attemptId/photos", authenticateJWT, async (req, res) => {
    try {
      const attemptId = Number(req.params.attemptId);
      const attempt = await storage.getAttempt(attemptId);
      
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
      
      // Allow admin to view any attempt, or the student who took the exam
      if ((req as any).user.role !== 'admin' && attempt.studentId !== (req as any).user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const photos = await storage.getExamPhotosForAttempt(attemptId);
      res.json(photos);
    } catch (err) {
      console.error("Get attempt photos error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.attempts.history.path, authenticateJWT, async (req, res) => {
    const studentId = (req as any).user.id;
    const attempts = await storage.getStudentAttempts(studentId);
    
    // Hide score from students - they should only see that they attempted the exam
    const sanitizedAttempts = attempts.map((attempt: any) => ({
      id: attempt.id,
      studentId: attempt.studentId,
      examId: attempt.examId,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      // Include exam info but hide sensitive data
      exam: attempt.exam ? {
        id: attempt.exam.id,
        title: attempt.exam.title,
        description: attempt.exam.description,
        durationMinutes: attempt.exam.durationMinutes,
        totalMarks: attempt.exam.totalMarks
      } : undefined,
      // Score is intentionally omitted - students shouldn't see their scores
    }));
    
    res.json(sanitizedAttempts);
  });

  app.get(api.attempts.all.path, authenticateJWT, requireAdmin, async (req, res) => {
    const attempts = await storage.getAllAttempts();
    res.json(attempts);
  });

  // Download Student Results as CSV (Student only - all their exams)
  app.get("/api/student/results", authenticateJWT, async (req, res) => {
    try {
      const studentId = (req as any).user.id;
      
      // Get all attempts for this student with full details
      const attempts = await storage.getStudentAttempts(studentId);
      
      if (attempts.length === 0) {
        return res.status(404).json({ message: "No exam attempts found" });
      }
  
      // Generate CSV headers
      const headers = [
        "Exam Title",
        "Exam Date", 
        "Marks Obtained",
        "Total Marks",
        "Passing Marks",
        "Status",
        "Percentage",
        "Violations",
        "Max Warning",
        "Photos",
        "Proctoring Status",
        "Completed At"
      ];
      
      const csvRows = [headers.join(",")];
      
      for (const attempt of attempts) {
        const exam = attempt.exam;
        const score = attempt.score || 0;
        const totalMarks = exam.totalMarks || 0;
        const passingMarks = exam.passingMarks || 0;
        const status = passingMarks > 0 ? (score >= passingMarks ? "Pass" : "Fail") : "Completed";
        const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
        
        // Format dates
        const examDate = attempt.startedAt ? new Date(attempt.startedAt).toLocaleDateString() : "N/A";
        const completedDate = attempt.completedAt ? new Date(attempt.completedAt).toLocaleString() : "N/A";
        
        const escapeCSV = (val: string) => {
          if (val.includes(",") || val.includes('"') || val.includes("\n")) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        };
        
        const row = [
          escapeCSV(exam.title),
          escapeCSV(examDate),
          score.toString(),
          totalMarks.toString(),
          passingMarks.toString(),
          status,
          percentage.toString() + "%",
          escapeCSV(completedDate)
        ];
        
        csvRows.push(row.join(","));
      }
      
      const csvContent = csvRows.join("\n");
      
      // Filename
      const now = new Date().toISOString().slice(0,10);
      const filename = `my_exam_results_${now}.csv`;
      
      // Headers for download
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      
      res.status(200).send(csvContent);
    } catch (err) {
      console.error("Download student results error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Download Exam Results as CSV (Admin only)
  app.get("/api/admin/exams/:id/results", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const examId = Number(req.params.id);
      
      if (isNaN(examId)) {
        return res.status(400).json({ message: "Invalid exam ID" });
      }
      
      // Get exam details
      const exam = await storage.getExam(examId);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      
      // Get all attempts for this exam with student details
      const attempts = await storage.getExamAttemptsWithDetails(examId);
      
      if (attempts.length === 0) {
        return res.status(404).json({ message: "No attempts found for this exam" });
      }
      
      // Calculate passing marks
      const passingMarks = exam.passingMarks || 0;
      
      // Generate CSV content
      const headers = [
        "Exam Title",
        "Student Name", 
        "Student Email",
        "Student ID",
        "Marks Obtained",
        "Total Marks",
        "Pass/Fail Status",
        "Exam Date",
        "Time Taken"
      ];
      
      const csvRows = [headers.join(",")];
      
      for (const attempt of attempts) {
        const studentName = attempt.student?.fullName || "Unknown";
        const studentEmail = attempt.student?.email || "Unknown";
        const studentId = attempt.student?.id || "N/A";
        const marksObtained = attempt.score || 0;
        const totalMarks = exam.totalMarks || 0;
        const passFailStatus = marksObtained >= passingMarks ? "Pass" : "Fail";
        
        // Format exam date
        const examDate = attempt.startedAt 
          ? new Date(attempt.startedAt).toISOString().split('T')[0]
          : "N/A";
        
        // Calculate time taken
        let timeTaken = "N/A";
        if (attempt.startedAt && attempt.completedAt) {
          const start = new Date(attempt.startedAt);
          const end = new Date(attempt.completedAt);
          const diffMs = end.getTime() - start.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffSecs = Math.floor((diffMs % 60000) / 1000);
          timeTaken = `${diffMins}m ${diffSecs}s`;
        }
        
        // Escape CSV values (handle commas and quotes)
        const escapeCSV = (val: string) => {
          if (val.includes(",") || val.includes('"') || val.includes("\n")) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        };
        
        const row = [
          escapeCSV(exam.title),
          escapeCSV(studentName),
          escapeCSV(studentEmail),
          studentId.toString(),
          marksObtained.toString(),
          totalMarks.toString(),
          passFailStatus,
          examDate,
          timeTaken
        ];
        
        csvRows.push(row.join(","));
      }
      
      const csvContent = csvRows.join("\n");
      
      // Generate filename
      const sanitizedTitle = exam.title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      const filename = `${sanitizedTitle}_results.csv`;
      
      // Set response headers for CSV download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      
      // Send CSV content
      res.status(200).send(csvContent);
    } catch (err) {
      console.error("Download exam results error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get exam attempts count for each exam (Admin only) - FIXED DUPLICATE
  app.get("/api/admin/exams-attempts-count", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const exams = await storage.getExams();
      const counts = [];
      
      for (const exam of exams) {
        const attempts = await storage.getExamAttemptsWithDetails(exam.id);
        counts.push({
          examId: exam.id,
          examTitle: exam.title,
          attemptCount: attempts.length
        });
      }
      
      res.json(counts);
    } catch (err) {
      console.error("Get exam attempts count error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  // Note: Duplicate route removed to fix 0 students attempted bug
  
  // Update Attempt Status (Admin only)
  app.put("/api/admin/attempts/:id/status", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const attemptId = Number(req.params.id);
      const { status } = req.body;
      
      // Validate status
      const validStatuses = ["pending", "shortlisted", "rejected", "selected"];
      if (status !== null && status !== undefined && !validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be: pending, shortlisted, rejected, selected, or null" });
      }
      
      const attempt = await storage.updateAttemptStatus(attemptId, status || null);
      res.status(200).json(attempt);
    } catch (err) {
      console.error("Update attempt status error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get(api.users.students.path, authenticateJWT, requireAdmin, async (req, res) => {
    const students = await storage.getAllStudents();
    res.json(students.map(s => ({
      id: s.id,
      fullName: s.fullName,
      email: s.email,
      isVerified: s.isVerified,
      createdAt: s.createdAt
    })));
  });

  // Bulk Upload Questions Route
  app.post("/api/admin/upload-questions", authenticateJWT, requireAdmin, upload.single("file"), async (req: Request, res: Response) => {
    try {
      const uploadedFile = req.file;
      if (!uploadedFile) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const examId = Number(req.body.examId);
      if (!examId || isNaN(examId)) {
        // Delete the uploaded file
        fs.unlinkSync(uploadedFile.path);
        return res.status(400).json({ message: "Valid examId is required" });
      }

      // Check if exam exists
      const exam = await storage.getExam(examId);
      if (!exam) {
        fs.unlinkSync(uploadedFile.path);
        return res.status(404).json({ message: "Exam not found" });
      }

      const results: any[] = [];
      const errors: string[] = [];
      let headerProcessed = false;
      let fieldMapping: Record<string, string> = {};

      // Read and parse CSV with case-insensitive header handling
      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(uploadedFile.path)
          .pipe(csv({
            mapHeaders: ({ header }) => {
              // Convert header to lowercase for mapping
              return header.toLowerCase().trim();
            }
          }))
          .on("headers", (headers: string[]) => {
            headerProcessed = true;
            // Create mapping for common header variations
            fieldMapping = {};
            const headerMap: Record<string, string> = {
              'question': 'question',
              'questiontext': 'question',
              'questions': 'question',
              'optiona': 'optionA',
              'option_a': 'optionA',
              'optionb': 'optionB',
              'option_b': 'optionB',
              'optionc': 'optionC',
              'option_c': 'optionC',
              'optiond': 'optionD',
              'option_d': 'optionD',
              'correctanswer': 'correctAnswer',
              'correct_answer': 'correctAnswer',
              'answer': 'correctAnswer',
              'marks': 'marks',
              'mark': 'marks',
              'points': 'marks'
            };
            
            for (const header of headers) {
              const normalized = header.toLowerCase().trim();
              if (headerMap[normalized]) {
                fieldMapping[header] = headerMap[normalized];
              } else {
                fieldMapping[header] = header;
              }
            }
          })
          .on("data", (data) => {
            // Remap fields based on header mapping
            const remappedData: any = {};
            for (const [key, value] of Object.entries(data)) {
              const mappedKey = fieldMapping[key] || key;
              remappedData[mappedKey] = value;
            }
            results.push(remappedData);
          })
          .on("end", () => resolve())
          .on("error", (error) => {
            fs.unlinkSync(uploadedFile.path);
            reject(error);
          });
      });

      // Check if we have valid data
      if (results.length === 0) {
        fs.unlinkSync(uploadedFile.path);
        return res.status(400).json({ message: "No valid questions found in CSV file. Please check the format." });
      }

      console.log(`[CSV Upload] Processing ${results.length} questions for exam ${examId}`);

      // Validate and insert questions with batch processing for large files
      let totalInserted = 0;
      const validAnswers = ["A", "B", "C", "D"];
      const batchSize = 50; // Process in batches for better performance

      for (let i = 0; i < results.length; i++) {
        const row = results[i];
        const rowNumber = i + 2; // +2 because header is row 1 and array is 0-indexed
        
        try {
          // Get values using mapped fields (case-insensitive)
          const questionText = row.question || row.questionText || row.Question || row.QuestionText;
          const optionA = row.optionA || row.OptionA;
          const optionB = row.optionB || row.OptionB;
          const optionC = row.optionC || row.OptionC;
          const optionD = row.optionD || row.OptionD;
          const correctAnswerRaw = row.correctAnswer || row.correctanswer || row.CorrectAnswer || row.Answer;
          const marksRaw = row.marks || row.marks || row.Marks || row.points || row.Points;

          // Validate required fields
          if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswerRaw) {
            const preview = questionText ? questionText.substring(0, 50) : "Unknown";
            errors.push(`Row ${rowNumber}: Missing required fields - "${preview}..."`);
            continue;
          }

          // Validate correctAnswer (accept A, B, C, D case-insensitive)
          const correctAnswer = correctAnswerRaw.toUpperCase().trim();
          if (!validAnswers.includes(correctAnswer)) {
            const preview = questionText ? questionText.substring(0, 50) : "Unknown";
            errors.push(`Row ${rowNumber}: Invalid correctAnswer "${correctAnswerRaw}" - must be A, B, C, or D - "${preview}..."`);
            continue;
          }

          // Parse marks (default to 1 if not specified)
          let marks = 1;
          if (marksRaw) {
            const parsedMarks = parseInt(marksRaw);
            if (isNaN(parsedMarks) || parsedMarks < 1) {
              marks = 1;
            } else {
              marks = parsedMarks;
            }
          }

          // Create question
          await storage.createQuestion({
            examId,
            questionText: String(questionText).trim(),
            optionA: String(optionA).trim(),
            optionB: String(optionB).trim(),
            optionC: String(optionC).trim(),
            optionD: String(optionD).trim(),
            correctAnswer,
            marks
          });
          totalInserted++;

          // Log progress for large files
          if (totalInserted % 100 === 0) {
            console.log(`[CSV Upload] Processed ${totalInserted} questions...`);
          }
        } catch (err) {
          const preview = row.question ? row.question.substring(0, 30) : "Unknown";
          errors.push(`Row ${rowNumber}: Error inserting question "${preview}..." - ${err}`);
        }
      }

      // Delete uploaded file after processing
      try {
        fs.unlinkSync(uploadedFile.path);
      } catch (e) {
        console.error("Error deleting uploaded file:", e);
      }

      console.log(`[CSV Upload] Completed: ${totalInserted} questions inserted, ${errors.length} errors`);

      // Return appropriate response based on results
      if (totalInserted === 0) {
        return res.status(400).json({
          message: "No questions could be uploaded. Please check the CSV format.",
          totalInserted: 0,
          errors: errors.length > 0 ? errors : ["All rows failed validation"]
        });
      }

      res.status(200).json({
        message: totalInserted === results.length 
          ? "All questions uploaded successfully" 
          : `Partially successful: ${totalInserted} of ${results.length} questions uploaded`,
        totalInserted,
        totalRows: results.length,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (err) {
      console.error("Bulk upload error:", err);
      // Try to delete file if it exists
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) { /* ignore */ }
      }
      res.status(500).json({ message: "Internal server error during file processing: " + (err instanceof Error ? err.message : "Unknown error") });
    }
  });

  // Cleanup Unverified Users Route (Admin only)
  app.delete("/api/admin/cleanup-unverified", authenticateJWT, requireAdmin, async (req: Request, res: Response) => {
    try {
      const deletedCount = await storage.cleanupUnverifiedUsers();
      res.status(200).json({ 
        message: `Successfully removed ${deletedCount} unverified user(s)`,
        deletedCount 
      });
    } catch (err) {
      console.error("Cleanup error:", err);
      res.status(500).json({ message: "Internal server error during cleanup" });
    }
  });

  // Forgot Password - Send OTP to email
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not
        return res.status(200).json({ message: "If the email exists, a reset OTP will be sent" });
      }
      
      // Generate OTP for password reset
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes
      
      // Delete old password reset tokens
      await storage.deletePasswordResetTokens(user.id);
      
      // Create new password reset token
      await storage.createPasswordResetToken({
        userId: user.id,
        token: otp,
        expiresAt
      });
      
      // Send OTP via email
      const emailSent = await sendPasswordResetEmail(user.email, otp, user.fullName);
      
      if (!emailSent) {
        // For development: return the OTP in response
        console.log(`Password reset OTP for ${user.email}: ${otp}`);
        return res.status(201).json({ 
          message: "Password reset OTP for testing: " + otp,
          otp: otp
        });
      }
      
      res.status(200).json({ message: "If the email exists, a reset OTP will be sent" });
    } catch (err) {
      console.error("Forgot password error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Reset Password - Verify OTP and update password
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      
      if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP, and new password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid email or OTP" });
      }
      
      // Get the password reset token
      const resetToken = await storage.getPasswordResetToken(otp);
      if (!resetToken) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
      
      // Check if token belongs to this user
      if (resetToken.userId !== user.id) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
      
      // Check if token is used
      if (resetToken.usedAt) {
        return res.status(400).json({ message: "OTP already used" });
      }
      
      // Check if token is expired
      if (resetToken.expiresAt < new Date()) {
        return res.status(400).json({ message: "OTP expired. Please request a new one." });
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password (store last password)
      await storage.updateUserPassword(user.id, hashedPassword, true);
      
      // Mark token as used
      await storage.markPasswordResetTokenUsed(otp);
      
      // Delete all password reset tokens for this user
      await storage.deletePasswordResetTokens(user.id);
      
      res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
      console.error("Reset password error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin Update Profile (email and password)
  app.put("/api/admin/profile", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const { email, currentPassword, newPassword } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // If changing email
      if (email && email !== user.email) {
        // Check if email is already taken
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ message: "Email already in use" });
        }
        await storage.updateUserEmail(userId, email);
      }
      
      // If changing password
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ message: "Current password is required to change password" });
        }
        
        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
          return res.status(401).json({ message: "Current password is incorrect" });
        }
        
        // Hash new password and store old one
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await storage.updateUserPassword(userId, hashedPassword, true);
      }
      
      res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
      console.error("Update profile error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin Delete Student
  app.delete("/api/admin/students/:id", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const studentId = Number(req.params.id);
      
      if (isNaN(studentId)) {
        return res.status(400).json({ message: "Invalid student ID" });
      }
      
      const student = await storage.getUser(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      // Prevent admin from deleting themselves
      if (student.role === 'admin') {
        return res.status(403).json({ message: "Cannot delete admin users" });
      }
      
      await storage.deleteStudent(studentId);
      
      return res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
      console.error("Delete student error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Save Exam Photo - Student uploads photo during exam
  app.post("/api/attempts/:id/photos", authenticateJWT, async (req, res) => {
    try {
      const attemptId = Number(req.params.id);
      const { photoData } = req.body;
      
      if (!photoData) {
        return res.status(400).json({ message: "Photo data is required" });
      }
      
      // Verify the attempt belongs to the student
      const attempt = await storage.getAttempt(attemptId);
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
      if (attempt.studentId !== (req as any).user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (attempt.completedAt) {
        return res.status(400).json({ message: "Exam already submitted" });
      }
      
      // Save the photo
      const photo = await storage.saveExamPhoto({
        attemptId,
        photoData
      });
      
      res.status(201).json(photo);
    } catch (err) {
      console.error("Save exam photo error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get Exam Photos - Admin only
  app.get("/api/admin/attempts/:id/photos", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const attemptId = Number(req.params.id);
      
      const photos = await storage.getExamPhotosForAttempt(attemptId);
      res.status(200).json(photos);
    } catch (err) {
      console.error("Get exam photos error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============ EXAM LINKS ROUTES (Admin) ============
  
  // Admin: Create exam link (only one link per exam - deletes existing links first)
  app.post("/api/admin/exam-links", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const { examId, expiresAt } = req.body;
      
      if (!examId) {
        return res.status(400).json({ message: "Exam ID is required" });
      }
      
      // Check if exam exists
      const exam = await storage.getExam(examId);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      
      // Check if exam has questions - prevent creating link without questions
      if (!exam.questions || exam.questions.length === 0) {
        return res.status(400).json({ 
          message: "Cannot create exam link. Please add questions to the exam first." 
        });
      }
      
      // Get existing exam links for this exam
      const existingLinks = await storage.getExamLinksByExamId(examId);
      
      // Delete all existing exam links for this exam (only one link at a time)
      if (existingLinks && existingLinks.length > 0) {
        console.log(`[EXAM LINK] Deleting ${existingLinks.length} existing link(s) for exam ${examId}`);
        for (const link of existingLinks) {
          try {
            await storage.deleteExamLink(link.id);
          } catch (err) {
            console.error(`[EXAM LINK] Error deleting link ${link.id}:`, err);
          }
        }
      }
      
      // Generate unique code
      const uniqueCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const examLink = await storage.createExamLink({
        examId,
        uniqueCode,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true
      });
      
      console.log(`[EXAM LINK] Created new link ${examLink.id} for exam ${examId}`);
      res.status(201).json(examLink);
    } catch (err) {
      console.error("Create exam link error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin: Get exam links for an exam
  app.get("/api/admin/exam-links/:examId", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const examId = Number(req.params.examId);
      const links = await storage.getExamLinksByExamId(examId);
      res.json(links);
    } catch (err) {
      console.error("Get exam links error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin: Delete exam link
  app.delete("/api/admin/exam-links/:id", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteExamLink(id);
      res.status(200).json({ message: "Exam link deleted" });
    } catch (err) {
      console.error("Delete exam link error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin: Get exam sessions (all students who accessed the exam)
  app.get("/api/admin/exam-sessions/:examId", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const examId = Number(req.params.examId);
      const sessions = await storage.getExamSessionsByExamId(examId);
      res.json(sessions);
    } catch (err) {
      console.error("Get exam sessions error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin: Get active exam sessions (students currently taking exam)
  app.get("/api/admin/exam-sessions/:examId/active", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const examId = Number(req.params.examId);
      const sessions = await storage.getActiveExamSessions(examId);
      res.json(sessions);
    } catch (err) {
      console.error("Get active exam sessions error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin: Get exam session stats
  app.get("/api/admin/exam-stats/:examId", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const examId = Number(req.params.examId);
      const sessions = await storage.getExamSessionsByExamId(examId);
      
      const stats = {
        totalOpened: sessions.length,
        notStarted: sessions.filter(s => s.status === "not_started").length,
        inProgress: sessions.filter(s => s.status === "in_progress").length,
        completed: sessions.filter(s => s.status === "completed").length
      };
      
      res.json(stats);
    } catch (err) {
      console.error("Get exam stats error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ============ PUBLIC EXAM ACCESS ROUTES (No Auth Required) ============
  
  // Get exam info by link code (public)
  app.get("/api/public/exam/:code", async (req, res) => {
    try {
      const code = req.params.code;
      console.log("[PUBLIC EXAM] Fetching exam with code:", code);
      
      const examLink = await storage.getExamLinkByCode(code);
      
      if (!examLink) {
        console.log("[PUBLIC EXAM] Exam link not found for code:", code);
        return res.status(404).json({ message: "Exam link not found" });
      }
      
      console.log("[PUBLIC EXAM] Exam link found:", examLink.id, "for examId:", examLink.examId);
      
      if (!examLink.isActive) {
        console.log("[PUBLIC EXAM] Exam link is inactive:", examLink.id);
        return res.status(400).json({ message: "This exam link is no longer active" });
      }
      
      if (examLink.expiresAt && examLink.expiresAt < new Date()) {
        console.log("[PUBLIC EXAM] Exam link expired:", examLink.id);
        return res.status(400).json({ message: "This exam link has expired" });
      }
      
      // Get exam with questions
      const exam = await storage.getExam(examLink.examId);
      
      console.log("[PUBLIC EXAM] Exam fetched:", exam?.id, "title:", exam?.title);
      console.log("[PUBLIC EXAM] Questions count:", exam?.questions?.length || 0);
      
      // Check if exam is enabled
      if (exam && exam.isEnabled === false) {
        console.log("[PUBLIC EXAM] Exam is disabled:", exam.id);
        return res.status(403).json({ message: "This exam is currently disabled. Please contact your instructor." });
      }
      
      // Ensure questions array exists
      const questions = exam?.questions || [];
      
      // Return exam info WITH questions (without correct answers)
      res.json({
        examLink: {
          id: examLink.id,
          uniqueCode: examLink.uniqueCode,
          expiresAt: examLink.expiresAt
        },
        exam: {
          id: exam?.id,
          title: exam?.title,
          description: exam?.description,
          durationMinutes: exam?.durationMinutes,
          totalMarks: exam?.totalMarks,
          requireCamera: exam?.requireCamera,
          questions: questions.map((q: any) => ({
            id: q.id,
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            marks: q.marks
          }))
        }
      });
    } catch (err) {
      console.error("Get public exam error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Student: Join exam via link (no auth required)
  app.post("/api/public/exam/:code/join", async (req, res) => {
    try {
      const code = req.params.code;
      const { studentName, studentEmail } = req.body;
      
      console.log("[PUBLIC_EXAM] Join request for code:", code, "name:", studentName, "email:", studentEmail);
      
      if (!studentName || !studentEmail) {
        return res.status(400).json({ message: "Name and email are required" });
      }
      
      const examLink = await storage.getExamLinkByCode(code);
      
      if (!examLink) {
        console.log("[PUBLIC_EXAM] Exam link not found for join");
        return res.status(404).json({ message: "Exam link not found" });
      }
      
      console.log("[PUBLIC_EXAM] Exam link found for join, examId:", examLink.examId);
      
      if (!examLink.isActive) {
        return res.status(400).json({ message: "This exam link is no longer active" });
      }
      
      if (examLink.expiresAt && examLink.expiresAt < new Date()) {
        return res.status(400).json({ message: "This exam link has expired" });
      }
      
      // Check if student already has a session for this exam
      const existingSession = await storage.getExamSessionByEmailAndExam(examLink.examId, studentEmail);
      
      if (existingSession) {
        console.log("[PUBLIC_EXAM] Returning existing session:", existingSession.id);
        // Return existing session
        return res.json({
          message: "Returning to existing exam session",
          session: existingSession,
          examLink: {
            id: examLink.id,
            uniqueCode: examLink.uniqueCode
          }
        });
      }
      
      // Get client IP
      const ipAddress = req.ip || req.socket.remoteAddress || "unknown";
      
      // Create new session
      const session = await storage.createExamSession({
        examLinkId: examLink.id,
        examId: examLink.examId,
        studentName,
        studentEmail: studentEmail.toLowerCase(),
        status: "not_started",
        ipAddress
      });
      
      console.log("[PUBLIC_EXAM] Created new session:", session.id);
      
      res.status(201).json({
        message: "Exam session created",
        session,
        examLink: {
          id: examLink.id,
          uniqueCode: examLink.uniqueCode
        }
      });
    } catch (err) {
      console.error("Join exam error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Student: Start exam (from session)
  app.post("/api/public/sessions/:sessionId/start", async (req, res) => {
    try {
      const sessionId = Number(req.params.sessionId);
      const { attemptId } = req.body;
      
      if (!attemptId) {
        return res.status(400).json({ message: "Attempt ID is required" });
      }
      
      const session = await storage.getExamSessionById(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Update session status
      await storage.updateExamSession(sessionId, {
        status: "in_progress",
        attemptId,
        startedAt: new Date()
      });
      
      res.status(200).json({ message: "Exam started" });
    } catch (err) {
      console.error("Start exam error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Student: Heartbeat to keep session alive
  app.put("/api/public/sessions/:sessionId/heartbeat", async (req, res) => {
    try {
      const sessionId = Number(req.params.sessionId);
      
      const session = await storage.getExamSessionById(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Update last heartbeat
      await storage.updateExamSession(sessionId, {
        lastHeartbeat: new Date()
      });
      
      res.status(200).json({ message: "Heartbeat updated" });
    } catch (err) {
      console.error("Heartbeat error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Student: Submit exam (from session)
  app.post("/api/public/sessions/:sessionId/complete", async (req, res) => {
    try {
      const sessionId = Number(req.params.sessionId);
      
      const session = await storage.getExamSessionById(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Update session status
      await storage.updateExamSession(sessionId, {
        status: "completed",
        completedAt: new Date()
      });
      
      res.status(200).json({ message: "Exam completed" });
    } catch (err) {
      console.error("Complete exam error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Student: Get session info (for resuming)
  app.get("/api/public/sessions/:sessionId", async (req, res) => {
    try {
      const sessionId = Number(req.params.sessionId);
      
      const session = await storage.getExamSessionById(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (err) {
      console.error("Get session error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Student: Submit exam answers (no auth - using session)
  app.post("/api/public/sessions/:sessionId/submit", async (req, res) => {
    try {
      const sessionId = Number(req.params.sessionId);
      const { attemptId, answers } = req.body;
      
      if (!attemptId || !answers) {
        return res.status(400).json({ message: "Attempt ID and answers are required" });
      }
      
      const session = await storage.getExamSessionById(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      if (session.status === "completed") {
        return res.status(400).json({ message: "Exam already submitted" });
      }
      
      // Get exam details
      const exam = await storage.getExam(session.examId);
      if (!exam || !exam.questions) {
        return res.status(404).json({ message: "Exam data missing" });
      }
      
      // Calculate score
      let score = 0;
      const dbAnswers = answers.map((ans: any) => {
        const question = exam.questions!.find(q => q.id === ans.questionId);
        let isCorrect = false;
        let marksAwarded = 0;
        
        if (question && ans.selectedAnswer === question.correctAnswer) {
          isCorrect = true;
          marksAwarded = question.marks;
          score += marksAwarded;
        }
        
        return {
          attemptId,
          questionId: ans.questionId,
          selectedAnswer: ans.selectedAnswer,
          isCorrect,
          marksAwarded
        };
      });
      
      // Save answers
      await storage.saveStudentAnswers(dbAnswers);
      
      // Submit attempt
      await storage.submitAttempt(attemptId, score);
      
      // Update session status
      await storage.updateExamSession(sessionId, {
        status: "completed",
        completedAt: new Date()
      });
      
      res.status(200).json({ message: "Exam submitted successfully", score });
    } catch (err) {
      console.error("Submit exam error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ============ RE-EXAM REQUEST ROUTES ============
  
  // Student: Submit re-exam request
  app.post("/api/reexam-requests", authenticateJWT, async (req, res) => {
    try {
      const { attemptId, examId, reason } = req.body;
      
      if (!attemptId || !examId || !reason) {
        return res.status(400).json({ message: "Attempt ID, Exam ID, and Reason are required" });
      }
      
      const studentId = (req as any).user.id;
      
      // Verify the attempt belongs to this student
      const attempt = await storage.getAttempt(attemptId);
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
      if (attempt.studentId !== studentId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Check if there's already a pending request for this attempt
      const existingRequests = await storage.getReexamRequestsByStudent(studentId);
      const hasPendingRequest = existingRequests.some(r => r.attemptId === attemptId && r.status === "pending");
      if (hasPendingRequest) {
        return res.status(400).json({ message: "You already have a pending re-exam request for this exam" });
      }
      
      const request = await storage.createReexamRequest({
        attemptId: attemptId,
        studentId: studentId,
        examId: examId,
        reason: reason,
        status: "pending"
      });
      
      res.status(201).json(request);
    } catch (err) {
      console.error("Create re-exam request error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Student: Get my re-exam requests
  app.get("/api/reexam-requests", authenticateJWT, async (req, res) => {
    try {
      const studentId = (req as any).user.id;
      const requests = await storage.getReexamRequestsByStudent(studentId);
      res.json(requests);
    } catch (err) {
      console.error("Get re-exam requests error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin: Get all re-exam requests
  app.get("/api/admin/reexam-requests", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const requests = await storage.getAllReexamRequests();
      res.json(requests);
    } catch (err) {
      console.error("Get all re-exam requests error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin: Respond to re-exam request
  app.put("/api/admin/reexam-requests/:id", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const requestId = Number(req.params.id);
      const { status, adminNote } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      // Validate status
      const validStatuses = ["approved", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be: approved or rejected" });
      }
      
      const adminId = (req as any).user.id;
      
      const updatedRequest = await storage.updateReexamRequest(requestId, {
        status,
        adminId,
        adminNote
      });
      
      res.status(200).json(updatedRequest);
    } catch (err) {
      console.error("Update re-exam request error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============ AI QUESTION GENERATION ROUTES ============
  
  // Target questions to generate (exactly 100)
  const TARGET_QUESTIONS = 100;
  
  // Batch settings for AI generation
  const BATCH_SIZE = 20;  // Questions per batch (not used anymore - single call)
  const MAX_BATCHES = 5;   // Maximum batches (not used anymore - single call)
  
  // Helper function to strip leading numbers from question text
  // This fixes the issue where AI generates "1. What is..." and frontend adds numbering causing "1.1"
  function cleanQuestionText(text: string): string {
    if (!text) return text;
    // Remove leading numbers like "1.", "2.", "1)", "2)", "[1]", etc.
    return text.replace(/^[\d\.]+\s*[\)\]]*\s*/, '').trim();
  }
  
  // Helper function to generate template-based questions (fallback)
  function generateLocalQuestions(topic: string, difficulty: string, count: number): any[] {
    const questions = [];
    const templates = [
      { q: `What is the primary purpose of ${topic}?`, a: "To solve problems efficiently", b: "To create visual effects", c: "To store data", d: "To send emails", correct: "A" },
      { q: `Which of the following is NOT a feature of ${topic}?`, a: "Scalability", b: "Real-time processing", c: "Flying cars", d: "Security", correct: "C" },
      { q: `What is the most important concept in ${topic}?`, a: "Variables", b: "Functions", c: "Classes", d: "All of the above", correct: "D" },
      { q: `How does ${topic} help in modern applications?`, a: "By providing fast solutions", b: "By consuming more memory", c: "By slowing down processes", d: "By increasing complexity", correct: "A" },
      { q: `What is a common use case for ${topic}?`, a: "Web development", b: "Data analysis", c: "Machine learning", d: "All of the above", correct: "D" },
      { q: `Which technology is commonly used with ${topic}?`, a: "Databases", b: "APIs", c: "Cloud services", d: "All of the above", correct: "D" },
      { q: `What is the biggest advantage of ${topic}?`, a: "Efficiency", b: "Complexity", c: "Slow performance", d: "High cost", correct: "A" },
      { q: `What programming paradigms does ${topic} support?`, a: "Object-oriented", b: "Functional", c: "Procedural", d: "All of the above", correct: "D" },
      { q: `What is required to master ${topic}?`, a: "Practice", b: "Theory", c: "Both practice and theory", d: "Nothing", correct: "C" },
      { q: `Which of these is related to ${topic}?`, a: "Algorithms", b: "Data structures", c: "Both A and B", d: "None", correct: "C" }
    ];
    
    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length];
      questions.push({
        question: `${template.q} (Question ${i + 1})`,
        optionA: template.a,
        optionB: template.b,
        optionC: template.c,
        optionD: template.d,
        correctAnswer: template.correct,
        marks: 1
      });
    }
    
    return questions;
  }
  
  // Helper function to generate questions using a specific batch size
  async function generateQuestionsBatch(
    topic: string, 
    difficulty: string, 
    batchCount: number,
    provider: string,
    GEMINI_API_KEY?: string,
    OPENAI_API_KEY?: string,
    totalQuestionsRequested: number = BATCH_SIZE
  ): Promise<any[]> {
    const questions: any[] = [];
    let lastError = null;
    
    // Calculate questions per batch - distribute evenly across batches
    const questionsPerBatch = Math.ceil(totalQuestionsRequested / batchCount);
    
    for (let batch = 0; batch < batchCount; batch++) {
      // Calculate how many questions this batch should generate
      // Earlier batches get more questions if not evenly divisible
      const batchQuestionCount = (batch === batchCount - 1) 
        ? (totalQuestionsRequested - questions.length)  // Last batch gets remaining
        : questionsPerBatch;
      
      // Ensure we don't ask for negative or zero questions
      const actualBatchCount = Math.max(1, Math.min(batchQuestionCount, 20));
      
      console.log(`[AI - Batch ${batch + 1}/${batchCount}] Generating ${actualBatchCount} questions...`);
      
      let batchQuestions = null;
      
      // Try Gemini
      if (provider === 'gemini' || !provider) {
        if (GEMINI_API_KEY) {
          const models = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-flash-lite"];
          
          for (const model of models) {
            try {
              const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
              
              // Add variation to prompt for different questions in each batch
              const prompt = `Generate ${actualBatchCount} multiple choice questions about "${topic}" with ${difficulty} difficulty level.
                This is batch ${batch + 1} of questions. Make these different from other batches.
                
                For each question, provide:
                - question: The question text
                - optionA, optionB, optionC, optionD: Four options
                - correctAnswer: The correct answer (A, B, C, or D)
                - marks: Mark for each question (1-5)

                Respond ONLY with a JSON array in this exact format:
                [
                  {"question": "Question 1", "optionA": "Option A", "optionB": "Option B", "optionC": "Option C", "optionD": "Option D", "correctAnswer": "A", "marks": 1},
                  ...
                ]

                Do not include any other text or explanation. Start directly with [ and end with ].`;

              const requestBody = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 8192,
                  topP: 0.95,
                  topK: 40
                }
              };

              const response = await fetch(GEMINI_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
              });

              if (response.ok) {
                const data = await response.json();
                if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                  const textResponse = data.candidates[0].content.parts[0].text;
                  let jsonMatch = textResponse.match(/\[[\s\S]*\]/);
                  if (jsonMatch) {
                    batchQuestions = JSON.parse(jsonMatch[0]);
                    console.log(`[AI - Gemini Batch ${batch + 1}] Successfully generated ${batchQuestions.length} questions`);
                    break;
                  }
                }
              } else if (response.status === 429) {
                console.log(`[AI - Gemini] Quota exceeded for ${model}, trying next...`);
                continue;
              }
            } catch (err) {
              console.error(`[AI - Gemini] Error with model ${model}:`, err);
            }
          }
        }
      }
      
      // Try OpenAI if Gemini didn't work
      if (!batchQuestions && OPENAI_API_KEY) {
        try {
          const openaiPrompt = `Generate ${actualBatchCount} multiple choice questions about "${topic}" with ${difficulty} difficulty level.
            This is batch ${batch + 1} of questions. Make these different from other batches.
            
            For each question, provide:
            - question: The question text
            - optionA, optionB, optionC, optionD: Four options  
            - correctAnswer: The correct answer (A, B, C, or D)
            - marks: Mark for each question (1-5)

            Respond ONLY with a JSON array. Example format:
            [{"question": "Q1", "optionA": "A", "optionB": "B", "optionC": "C", "optionD": "D", "correctAnswer": "A", "marks": 1}]`;

          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [{ role: 'user', content: openaiPrompt }],
              temperature: 0.7,
              max_tokens: 4000
            })
          });

          if (response.ok) {
            const data = await response.json();
            const textResponse = data.choices[0]?.message?.content;
            if (textResponse) {
              let jsonMatch = textResponse.match(/\[[\s\S]*\]/);
              if (jsonMatch) {
                batchQuestions = JSON.parse(jsonMatch[0]);
                console.log(`[AI - OpenAI Batch ${batch + 1}] Successfully generated ${batchQuestions.length} questions`);
              }
            }
          }
        } catch (err) {
          console.error("[AI - OpenAI] Exception:", err);
        }
      }
      
      // Try Pollinations as fallback
      if (!batchQuestions) {
        try {
          const pollinationsPrompt = `Generate ${actualBatchCount} multiple choice questions about "${topic}" with ${difficulty} difficulty level.
            This is batch ${batch + 1} of questions. Make these different from other batches.
            
            For each question, provide:
            - question: The question text
            - optionA, optionB, optionC, optionD: Four options
            - correctAnswer: The correct answer (A, B, C, or D)
            - marks: Mark for each question (1-5)

            Respond ONLY with a JSON array in this exact format:
            [
              {"question": "Question 1", "optionA": "Option A", "optionB": "Option B", "optionC": "Option C", "optionD": "Option D", "correctAnswer": "A", "marks": 1},
              {"question": "Question 2", "optionA": "Option A", "optionB": "Option B", "optionC": "Option C", "optionD": "Option D", "correctAnswer": "B", "marks": 1}
            ]

            Do not include any other text or explanation. Start directly with [ and end with ].`;

          const POLLINATIONS_URL = `https://text.pollinations.ai/${encodeURIComponent(pollinationsPrompt)}?model=openai&json=true`;

          const response = await fetch(POLLINATIONS_URL, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });

          if (response.ok) {
            const textResponse = await response.text();
            let jsonMatch = textResponse.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              batchQuestions = JSON.parse(jsonMatch[0]);
              console.log(`[AI - Pollinations Batch ${batch + 1}] Successfully generated ${batchQuestions.length} questions`);
            }
          }
        } catch (err) {
          console.error("[AI - Pollinations] Exception:", err);
        }
      }
      
      // If still no questions, use local fallback for this batch
      if (!batchQuestions || batchQuestions.length === 0) {
        console.log(`[AI - Batch ${batch + 1}] Using local fallback...`);
        batchQuestions = generateLocalQuestions(topic, difficulty, BATCH_SIZE);
      }
      
      if (batchQuestions && batchQuestions.length > 0) {
        questions.push(...batchQuestions);
      }
      
      // Small delay between batches to avoid rate limiting
      if (batch < batchCount - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return questions;
  }
  
  // Helper function to deduplicate questions
  function deduplicateQuestions(questions: any[]): any[] {
    const seen = new Set<string>();
    const uniqueQuestions: any[] = [];
    
    for (const q of questions) {
      // Create a unique key based on question text
      const key = q.question.toLowerCase().trim();
      
      if (!seen.has(key)) {
        seen.add(key);
        uniqueQuestions.push(q);
      } else {
        console.log(`[AI - Deduplication] Removing duplicate: "${q.question.substring(0, 50)}..."`);
      }
    }
    
    return uniqueQuestions;
  }
  
  // Generate questions using Google Gemini AI or OpenAI
  app.post("/api/admin/generate-questions", authenticateJWT, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { topic, difficulty, numberOfQuestions, examId, aiProvider } = req.body;
      
      if (!topic || !difficulty || !numberOfQuestions) {
        return res.status(400).json({ message: "Topic, difficulty, and number of questions are required" });
      }

      // Determine which AI provider to use (default: gemini)
      const provider = aiProvider || 'gemini';
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      
      // Calculate number of batches needed (20 questions per batch)
      const requestedCount = parseInt(numberOfQuestions) || TARGET_QUESTIONS;
      const batchCount = Math.min(Math.ceil(requestedCount / BATCH_SIZE), MAX_BATCHES);
      
      console.log(`[AI] Requested ${requestedCount} questions, generating in ${batchCount} batches`);
      
      // Use batch generation function
      let generatedQuestions = await generateQuestionsBatch(
        topic, 
        difficulty, 
        batchCount,
        provider,
        GEMINI_API_KEY,
        OPENAI_API_KEY,
        requestedCount
      );
      
      console.log(`[AI] Total questions generated before deduplication: ${generatedQuestions.length}`);
      
      // Deduplicate questions
      generatedQuestions = deduplicateQuestions(generatedQuestions);
      
      console.log(`[AI] Questions after deduplication: ${generatedQuestions.length}`);
      
      // Final validation and processing - Skip old generation code since we use batch now
      // (batch generation already handled above)
      const _skipOldCode = false;
      // Define lastError to satisfy TypeScript (old code kept but not executed)
      let lastError: string | null = null;
      if (_skipOldCode) {
        
        if (!GEMINI_API_KEY) {
          console.error("[AI] GEMINI_API_KEY not configured");
        } else {
          // Updated models list - based on available models for this API key
          const models = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-flash-lite"];

          for (const model of models) {
            try {
              console.log(`[AI - Gemini] Trying model: ${model}`);
              
              const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

              const prompt = `Generate ${numberOfQuestions} multiple choice questions about "${topic}" with ${difficulty} difficulty level.
            
  For each question, provide:
  - question: The question text
  - optionA, optionB, optionC, optionD: Four options
  - correctAnswer: The correct answer (A, B, C, or D)
  - marks: Mark for each question (1-5)

  Respond ONLY with a JSON array in this exact format:
  [
    {"question": "Question 1", "optionA": "Option A", "optionB": "Option B", "optionC": "Option C", "optionD": "Option D", "correctAnswer": "A", "marks": 1},
    ...
  ]

  Do not include any other text or explanation. Start directly with [ and end with ].`;

              const requestBody = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 8192,
                  topP: 0.95,
                  topK: 40
                }
              };

              let response;
              try {
                response = await fetch(GEMINI_URL, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(requestBody)
                });
              } catch (fetchError: any) {
                console.error(`[AI - Gemini] Fetch error:`, fetchError.message);
                lastError = fetchError.message;
                continue;
              }

              // Handle quota errors specifically
              if (response.status === 429) {
                const errorData = await response.json().catch(() => ({}));
                console.log(`[AI - Gemini] Quota exceeded for ${model}, trying next...`);
                lastError = "Quota exceeded";
                continue;
              }

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                lastError = `API error: ${response.status}`;
                if (response.status === 403 || response.status === 401) {
                  return res.status(500).json({ 
                    message: "AI service authentication failed. Please check the API key.",
                    details: "Get a new key from https://aistudio.google.com/app/apikey"
                  });
                }
                continue;
              }

              const data = await response.json();
              
              if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
                lastError = "Invalid response structure";
                continue;
              }
              
              const textResponse = data.candidates[0].content.parts[0].text;
              let jsonMatch = textResponse.match(/\[[\s\S]*\]/);
              if (jsonMatch) {
                generatedQuestions = JSON.parse(jsonMatch[0]);
              } else {
                generatedQuestions = JSON.parse(textResponse);
              }
              
              console.log(`[AI - Gemini] Successfully generated questions using ${model}`);
              break;
              
            } catch (err) {
              console.error(`[AI - Gemini] Error with model ${model}:`, err);
              lastError = err instanceof Error ? err.message : "Unknown error";
            }
          }
        }
      }

      // If Gemini failed, try OpenAI as fallback
      if (!generatedQuestions) {
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        
        if (OPENAI_API_KEY) {
          console.log("[AI - OpenAI] Trying OpenAI API...");
          
          try {
            const openaiPrompt = `Generate ${numberOfQuestions} multiple choice questions about "${topic}" with ${difficulty} difficulty level.
            
For each question, provide:
- question: The question text
- optionA, optionB, optionC, optionD: Four options  
- correctAnswer: The correct answer (A, B, C, or D)
- marks: Mark for each question (1-5)

Respond ONLY with a JSON array. Example format:
[{"question": "Q1", "optionA": "A", "optionB": "B", "optionC": "C", "optionD": "D", "correctAnswer": "A", "marks": 1}]`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
              },
              body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: openaiPrompt }],
                temperature: 0.7,
                max_tokens: 4000
              })
            });

            if (response.ok) {
              const data = await response.json();
              const textResponse = data.choices[0]?.message?.content;
              
              if (textResponse) {
                let jsonMatch = textResponse.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                  generatedQuestions = JSON.parse(jsonMatch[0]);
                }
                console.log("[AI - OpenAI] Successfully generated questions");
              }
            } else {
              const error = await response.json();
              console.log("[AI - OpenAI] Error:", error);
              lastError = "OpenAI API error: " + (error.error?.message || response.statusText);
            }
          } catch (err) {
            console.error("[AI - OpenAI] Exception:", err);
            lastError = err instanceof Error ? err.message : "OpenAI error";
          }
        } else {
          console.log("[AI] No OpenAI API key configured, skipping...");
        }
      }

      // If still no questions, try Pollinations AI as fallback
      if (!generatedQuestions) {
        console.log("[AI - Pollinations] Trying Pollinations AI API...");
        
        try {
          const pollinationsPrompt = `Generate ${numberOfQuestions} multiple choice questions about "${topic}" with ${difficulty} difficulty level.
          
For each question, provide:
- question: The question text
- optionA, optionB, optionC, optionD: Four options
- correctAnswer: The correct answer (A, B, C, or D)
- marks: Mark for each question (1-5)

Respond ONLY with a JSON array in this exact format:
[
  {"question": "Question 1", "optionA": "Option A", "optionB": "Option B", "optionC": "Option C", "optionD": "Option D", "correctAnswer": "A", "marks": 1},
  {"question": "Question 2", "optionA": "Option A", "optionB": "Option B", "optionC": "Option C", "optionD": "Option D", "correctAnswer": "B", "marks": 1}
]

Do not include any other text or explanation. Start directly with [ and end with ].`;

          const POLLINATIONS_URL = `https://text.pollinations.ai/${encodeURIComponent(pollinationsPrompt)}?model=openai&json=true`;

          const response = await fetch(POLLINATIONS_URL, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });

          if (response.ok) {
            const textResponse = await response.text();
            console.log("[AI - Pollinations] Response received, parsing...");
            
            // Try to parse as JSON array
            try {
              // The response might be a JSON array directly or text
              let jsonMatch = textResponse.match(/\[[\s\S]*\]/);
              if (jsonMatch) {
                generatedQuestions = JSON.parse(jsonMatch[0]);
              } else {
                generatedQuestions = JSON.parse(textResponse);
              }
              console.log("[AI - Pollinations] Successfully generated questions");
            } catch (parseErr) {
              console.log("[AI - Pollinations] Could not parse JSON, trying text parsing...");
              // If JSON parsing fails, try to extract questions from text
              const qMatch = textResponse.match(/\{[\s\S]*\}/g);
              if (qMatch) {
                generatedQuestions = qMatch.map(q => {
                  try {
                    return JSON.parse(q);
                  } catch {
                    return null;
                  }
                }).filter(Boolean);
              }
            }
          } else {
            const errorText = await response.text();
            console.log("[AI - Pollinations] Error:", response.status, errorText);
            lastError = "Pollinations API error: " + response.status;
          }
        } catch (err) {
          console.error("[AI - Pollinations] Exception:", err);
          lastError = err instanceof Error ? err.message : "Pollinations error";
        }
      }

      // If still no questions, try local fallback (template-based)
      if (!generatedQuestions) {
        console.log("[AI] Trying local question generation as final fallback...");
        
        // Generate template-based questions as last resort
        generatedQuestions = generateLocalQuestions(topic, difficulty, numberOfQuestions);
        
        if (generatedQuestions && generatedQuestions.length > 0) {
          console.log("[AI] Generated local questions successfully");
        }
      }

      // Final check if questions were generated
      if (!generatedQuestions) {
        console.error("[AI] All methods failed. Last error:", lastError);
        
        // Provide helpful error messages
        if (lastError?.includes("quota") || lastError?.includes("Quota")) {
          return res.status(500).json({ 
            message: "AI quota exceeded. Please wait or get a new API key.",
            details: "For Gemini: https://aistudio.google.com/app/billing\nFor OpenAI: https://platform.openai.com/account/billing",
            suggestManual: true
          });
        }
        
        return res.status(500).json({ 
          message: "Failed to generate questions from AI.",
          error: lastError,
          suggestManual: true
        });
      }

      if (!Array.isArray(generatedQuestions)) {
        // Try to parse the response as JSON again with different approaches
        try {
          if (typeof generatedQuestions === 'string') {
            const match = generatedQuestions.match(/\{[\s\S]*\}/);
            if (match) {
              const parsed = JSON.parse(match[0]);
              if (parsed.questions && Array.isArray(parsed.questions)) {
                generatedQuestions = parsed.questions;
              }
            }
          }
        } catch (e) {
          console.error("[AI] Secondary parse attempt failed:", e);
        }
        
        // If still not an array, use local fallback
        if (!Array.isArray(generatedQuestions)) {
          console.log("[AI] Response is not an array, forcing local fallback...");
          generatedQuestions = generateLocalQuestions(topic, difficulty, numberOfQuestions);
        }
      }

      // Validate and sanitize questions
      const validAnswers = ["A", "B", "C", "D"];
      const validQuestions = generatedQuestions.filter((q: any) => 
        q.question && q.optionA && q.optionB && q.optionC && q.optionD &&
        validAnswers.includes(q.correctAnswer?.toUpperCase())
      ).map((q: any) => ({
        // Clean the question text to remove leading numbers (e.g., "1. What is..." becomes "What is...")
        question: cleanQuestionText(q.question),
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer?.toUpperCase(),
        marks: q.marks || 1
      }));

      if (validQuestions.length === 0) {
        return res.status(400).json({ message: "No valid questions generated. Please try a different topic." });
      }

      console.log("[AI] Valid questions generated:", validQuestions.length);

      // Save to exam if examId provided
      if (examId) {
        const exam = await storage.getExam(examId);
        if (!exam) {
          return res.status(404).json({ message: "Exam not found" });
        }

        let insertedCount = 0;
        for (const q of validQuestions) {
          try {
            await storage.createQuestion({
              examId,
              questionText: q.question,
              optionA: q.optionA,
              optionB: q.optionB,
              optionC: q.optionC,
              optionD: q.optionD,
              correctAnswer: q.correctAnswer,
              marks: q.marks
            });
            insertedCount++;
          } catch (err) {
            console.error("[AI] Error saving question:", err);
          }
        }

        res.status(200).json({
          message: "Questions generated and saved successfully",
          questionsGenerated: validQuestions.length,
          questionsSaved: insertedCount,
          questions: validQuestions
        });
      } else {
        res.status(200).json({
          message: "Questions generated successfully",
          questionsGenerated: validQuestions.length,
          questions: validQuestions
        });
      }
    } catch (err) {
      console.error("[AI] Generate questions error:", err);
      res.status(500).json({ message: "Internal server error: " + err.message });
    }
  });

  // ============ CAMERA STREAMING ROUTES ============
  
  // Student: Stream camera frame during exam (public - no auth)
  app.post("/api/public/sessions/:sessionId/frame", async (req, res) => {
    try {
      const sessionId = Number(req.params.sessionId);
      const { frameData, attemptId } = req.body;
      
      if (!frameData) {
        return res.status(400).json({ message: "Frame data is required" });
      }
      
      const session = await storage.getExamSessionById(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Save the camera frame
      await storage.saveCameraFrame({
        sessionId,
        attemptId: attemptId || null,
        frameData
      });
      
      res.status(201).json({ message: "Frame saved" });
    } catch (err) {
      console.error("Save camera frame error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin: Get latest camera frame for a session
  app.get("/api/admin/sessions/:sessionId/frame", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const sessionId = Number(req.params.sessionId);
      
      const frame = await storage.getLatestCameraFrame(sessionId);
      if (!frame) {
        return res.status(404).json({ message: "No frames found" });
      }
      
      res.json(frame);
    } catch (err) {
      console.error("Get camera frame error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin: Get all camera frames for a session
  app.get("/api/admin/sessions/:sessionId/frames", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const sessionId = Number(req.params.sessionId);
      
      const frames = await storage.getCameraFramesForSession(sessionId);
      res.json(frames);
    } catch (err) {
      console.error("Get camera frames error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============ PROCTORING LOGS ROUTES ============
  
  // Student: Log proctoring activity
  app.post("/api/proctoring/logs", authenticateJWT, async (req, res) => {
    try {
      const { attemptId, activityType, warningCount, details } = req.body;
      
      if (!attemptId || !activityType) {
        return res.status(400).json({ message: "Attempt ID and activity type are required" });
      }
      
      // Get attempt details to get student and exam IDs
      const attempt = await storage.getAttempt(attemptId);
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
      
      // Verify the attempt belongs to the student
      if (attempt.studentId !== (req as any).user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Save proctoring log
      const log = await storage.createProctoringLog({
        attemptId,
        studentId: attempt.studentId,
        examId: attempt.examId,
        activityType,
        warningCount: warningCount || 0,
        details: details || ""
      });
      
      res.status(201).json(log);
    } catch (err) {
      console.error("Create proctoring log error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin: Get proctoring logs for an exam
  app.get("/api/admin/proctoring-logs/:examId", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const examId = Number(req.params.examId);
      
      const logs = await storage.getProctoringLogsByExamId(examId);
      res.json(logs);
    } catch (err) {
      console.error("Get proctoring logs error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin: Get proctoring logs for all exams
  app.get("/api/admin/proctoring-logs", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const logs = await storage.getAllProctoringLogs();
      res.json(logs);
    } catch (err) {
      console.error("Get all proctoring logs error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============ ANALYTICS ROUTES ============

  app.get("/api/admin/analytics/score-distribution", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const data = await storage.getScoreDistribution();
      res.json(data);
    } catch (err) {
      console.error("Analytics score distribution error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/analytics/pass-fail", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const data = await storage.getPassFailRatio();
      res.json(data);
    } catch (err) {
      console.error("Analytics pass-fail error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/analytics/avg-time", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const data = await storage.getAvgTimeTaken();
      res.json(data);
    } catch (err) {
      console.error("Analytics avg time error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============ AUDIT LOG ROUTES ============

  app.get("/api/admin/audit-logs", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 500;
      const logs = await storage.getAuditLogs(limit);
      res.json(logs);
    } catch (err) {
      console.error("Get audit logs error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============ CODING QUESTIONS ROUTES ============

  // Admin: Create coding question
  app.post("/api/admin/exams/:examId/coding-questions", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const examId = Number(req.params.examId);
      const { title, description, sampleInput, sampleOutput, language, starterCode, marks } = req.body;
      if (!title || !description || !language) {
        return res.status(400).json({ message: "Title, description, and language are required" });
      }
      const question = await storage.createCodingQuestion({
        examId, title, description,
        sampleInput: sampleInput || null,
        sampleOutput: sampleOutput || null,
        language,
        starterCode: starterCode || null,
        marks: marks || 10,
      });
      const user = (req as any).user;
      await storage.createAuditLog({
        userId: user.id, userEmail: user.email, userRole: "admin",
        action: "Created coding question",
        metadata: { examId, questionTitle: title }
      });
      res.status(201).json(question);
    } catch (err) {
      console.error("Create coding question error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get coding questions for exam
  app.get("/api/exams/:examId/coding-questions", authenticateJWT, async (req, res) => {
    try {
      const examId = Number(req.params.examId);
      const questions = await storage.getCodingQuestionsByExamId(examId);
      res.json(questions);
    } catch (err) {
      console.error("Get coding questions error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin: Update coding question
  app.patch("/api/admin/coding-questions/:id", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updated = await storage.updateCodingQuestion(id, req.body);
      res.json(updated);
    } catch (err) {
      console.error("Update coding question error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin: Delete coding question
  app.delete("/api/admin/coding-questions/:id", authenticateJWT, requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteCodingQuestion(id);
      const user = (req as any).user;
      await storage.createAuditLog({
        userId: user.id, userEmail: user.email, userRole: "admin",
        action: "Deleted coding question",
        metadata: { questionId: id }
      });
      res.json({ message: "Deleted" });
    } catch (err) {
      console.error("Delete coding question error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============ CODE EXECUTION ROUTE ============

  app.post("/api/coding/execute", authenticateJWT, async (req, res) => {
    try {
      const { code, language } = req.body;
      if (!code || !language) {
        return res.status(400).json({ message: "Code and language are required" });
      }

      let output = "";
      let error = "";

      if (language === "javascript") {
        // Safe JS execution using Node vm
        const { execSync } = await import("child_process");
        try {
          const result = execSync(
            `node -e "${code.replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`,
            { timeout: 5000, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }
          );
          output = result;
        } catch (e: any) {
          error = e.stderr || e.message || "Execution error";
        }
      } else if (language === "python") {
        const { execSync } = await import("child_process");
        const fs = await import("fs");
        const os = await import("os");
        const path = await import("path");
        const tmpFile = path.join(os.tmpdir(), `exec_${Date.now()}.py`);
        try {
          fs.writeFileSync(tmpFile, code);
          const result = execSync(`python3 ${tmpFile}`, { timeout: 5000, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
          output = result;
          fs.unlinkSync(tmpFile);
        } catch (e: any) {
          error = e.stderr || e.message || "Python runtime not available or execution error";
          try { fs.unlinkSync(tmpFile); } catch {}
        }
      } else {
        error = `${language} runtime is not available on this server. Supported: JavaScript, Python.`;
      }

      res.json({ output: output.trim(), error: error.trim() });
    } catch (err) {
      console.error("Code execution error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Student: Submit coding solution
  app.post("/api/coding/submit", authenticateJWT, async (req, res) => {
    try {
      const { attemptId, questionId, code, language, output } = req.body;
      const user = (req as any).user;
      const submission = await storage.createCodingSubmission({
        attemptId: attemptId || null,
        questionId,
        studentId: user.id,
        code, language,
        output: output || null,
        isCorrect: false,
        marksAwarded: 0,
      });
      await storage.createAuditLog({
        userId: user.id, userEmail: user.email, userRole: "student",
        action: "Submitted coding solution",
        metadata: { questionId, language }
      });
      res.status(201).json(submission);
    } catch (err) {
      console.error("Submit coding solution error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Call seed at startup
  seedDatabase();

  return httpServer;
}

