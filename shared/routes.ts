import { z } from 'zod';
import { users, exams, questions, examAttempts, studentAnswers } from './schema';

// Explicit Zod schemas for better validation control
export const examInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  durationMinutes: z.number().int().positive("Duration must be a positive number"),
  totalMarks: z.number().int().positive("Total marks must be a positive number"),
  passingMarks: z.number().int().min(0).optional(),
  requireCamera: z.boolean().optional().default(false),
});

export const questionInputSchema = z.object({
  examId: z.number().int().positive(),
  questionText: z.string().min(1, "Question text is required"),
  optionA: z.string().min(1, "Option A is required"),
  optionB: z.string().min(1, "Option B is required"),
  optionC: z.string().min(1, "Option C is required"),
  optionD: z.string().min(1, "Option D is required"),
  correctAnswer: z.enum(["A", "B", "C", "D"], {
    errorMap: () => ({ message: "Correct answer must be A, B, C, or D" })
  }),
  marks: z.number().int().positive("Marks must be a positive number").default(1),
});

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  unauthorized: z.object({ message: z.string() }),
  forbidden: z.object({ message: z.string() }),
  notFound: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/auth/register' as const,
      input: z.object({ fullName: z.string(), email: z.string().email(), password: z.string() }),
      responses: {
        201: z.object({ message: z.string(), userId: z.number() }),
        400: errorSchemas.validation,
      }
    },
    verifyOtp: {
      method: 'POST' as const,
      path: '/api/auth/verify-otp' as const,
      input: z.object({ email: z.string().email(), otp: z.string() }),
      responses: {
        200: z.object({ message: z.string() }),
        400: errorSchemas.validation,
      }
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({ email: z.string().email(), password: z.string() }),
      responses: {
        200: z.object({ token: z.string(), user: z.object({ id: z.number(), fullName: z.string(), email: z.string(), role: z.string() }) }),
        401: errorSchemas.unauthorized,
        403: errorSchemas.forbidden,
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.object({ user: z.object({ id: z.number(), fullName: z.string(), email: z.string(), role: z.string() }) }),
        401: errorSchemas.unauthorized,
      }
    },
    forgotPassword: {
      method: 'POST' as const,
      path: '/api/auth/forgot-password' as const,
      input: z.object({ email: z.string().email() }),
      responses: {
        200: z.object({ message: z.string() }),
        404: errorSchemas.notFound,
      }
    },
    resetPassword: {
      method: 'POST' as const,
      path: '/api/auth/reset-password' as const,
      input: z.object({ email: z.string().email(), otp: z.string(), newPassword: z.string().min(6) }),
      responses: {
        200: z.object({ message: z.string() }),
        400: errorSchemas.validation,
      }
    }
  },
  admin: {
    updateProfile: {
      method: 'PUT' as const,
      path: '/api/admin/profile' as const,
      input: z.object({ 
        email: z.string().email().optional(), 
        currentPassword: z.string().optional(),
        newPassword: z.string().min(6).optional()
      }).refine(data => data.email || data.newPassword, {
        message: "At least one of email or newPassword is required"
      }),
      responses: {
        200: z.object({ message: z.string() }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        403: errorSchemas.forbidden,
      }
    }
  },
  exams: {
    list: {
      method: 'GET' as const,
      path: '/api/exams' as const,
      responses: {
        200: z.array(z.custom<typeof exams.$inferSelect>()),
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/exams/:id' as const,
      responses: {
        200: z.any(),
        404: errorSchemas.notFound,
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/exams' as const,
      input: examInputSchema,
      responses: {
        201: z.custom<typeof exams.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        403: errorSchemas.forbidden,
      }
    },
  },
  questions: {
    create: {
      method: 'POST' as const,
      path: '/api/exams/:examId/questions' as const,
      input: questionInputSchema.omit({ examId: true }),
      responses: {
        201: z.custom<typeof questions.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        403: errorSchemas.forbidden,
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/questions/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      }
    }
  },
  attempts: {
    start: {
      method: 'POST' as const,
      path: '/api/exams/:examId/attempts' as const,
      responses: {
        201: z.custom<typeof examAttempts.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    },
    submit: {
      method: 'POST' as const,
      path: '/api/attempts/:attemptId/submit' as const,
      input: z.object({
        answers: z.array(z.object({
          questionId: z.number(),
          selectedAnswer: z.string().nullable()
        }))
      }),
      responses: {
        200: z.any(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/attempts/:attemptId' as const,
      responses: {
        200: z.any(),
        404: errorSchemas.notFound,
      }
    },
    history: {
      method: 'GET' as const,
      path: '/api/student/attempts' as const,
      responses: {
        200: z.array(z.any()),
        401: errorSchemas.unauthorized,
      }
    },
    all: {
      method: 'GET' as const,
      path: '/api/admin/attempts' as const,
      responses: {
        200: z.array(z.any()),
        403: errorSchemas.forbidden,
      }
    }
  },
  users: {
    students: {
      method: 'GET' as const,
      path: '/api/admin/students' as const,
      responses: {
        200: z.array(z.object({
          id: z.number(),
          fullName: z.string(),
          email: z.string(),
          isVerified: z.boolean().nullable(),
          createdAt: z.any(),
        })),
        403: errorSchemas.forbidden,
      }
    },
    deleteStudent: {
      method: 'DELETE' as const,
      path: '/api/admin/students/:id' as const,
      responses: {
        200: z.object({ message: z.string() }),
        403: errorSchemas.forbidden,
        404: errorSchemas.notFound,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

