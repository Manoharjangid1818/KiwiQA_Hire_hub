import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

type CreateExamInput = z.infer<typeof api.exams.create.input>;

export function useExams() {
  return useQuery({
    queryKey: [api.exams.list.path],
  }) as import("@tanstack/react-query").UseQueryResult<any[], Error>;
}

export function useExam(id: number) {
  return useQuery({
    queryKey: [buildUrl(api.exams.get.path, { id })],
    enabled: !!id,
  }) as import("@tanstack/react-query").UseQueryResult<any, Error>;
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateExamInput) => {
      console.log("useCreateExam: Sending data to server:", JSON.stringify(data, null, 2));
      const res = await apiRequest("POST", api.exams.create.path, data);
      if (!res.ok) {
        const errorData = await res.json();
        console.error("useCreateExam: Server error:", errorData);
        throw new Error(errorData.message || "Failed to create exam");
      }
      const result = await res.json();
      console.log("useCreateExam: Server response:", result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.exams.list.path] });
    },
    onError: (error) => {
      console.error("useCreateExam: Mutation error:", error);
    }
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PUT", `/api/exams/${id}`, data);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.exams.list.path] });
      queryClient.invalidateQueries({ queryKey: [`/api/exams/${variables.id}`] });
    },
  });
}

export function useToggleExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("kiwiqa_token");
      console.log("[useToggleExam] Sending toggle request for exam:", id);
      console.log("[useToggleExam] Token exists:", !!token);
      
      const res = await apiRequest("PATCH", `/api/admin/exams/${id}/toggle`);
      
      console.log("[useToggleExam] Response status:", res.status);
      console.log("[useToggleExam] Response headers:", res.headers.get("content-type"));
      
      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("[useToggleExam] Non-JSON response:", text.substring(0, 500));
        throw new Error(`Server returned non-JSON response: ${res.status}. Please check if the server is running properly.`);
      }
      
      if (!res.ok) {
        let errorMessage = "Failed to toggle exam status";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }
      
      // Parse JSON response
      const data = await res.json();
      console.log("[useToggleExam] Response data:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.exams.list.path] });
    },
    onError: (error) => {
      console.error("useToggleExam: Mutation error:", error);
    }
  });
}
// Exam Links Hooks
export function useExamLinks(examId: number) {
  return useQuery({
    queryKey: [`/api/admin/exam-links/${examId}`],
    enabled: !!examId,
  }) as import("@tanstack/react-query").UseQueryResult<any[], Error>;
}

export function useCreateExamLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { examId: number; expiresAt?: string }) => {
      const res = await apiRequest("POST", "/api/admin/exam-links", data);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/exam-links/${variables.examId}`] });
    },
  });
}

export function useDeleteExamLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, examId }: { id: number; examId: number }) => {
      const res = await apiRequest("DELETE", `/api/admin/exam-links/${id}`);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/exam-links/${variables.examId}`] });
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/exams/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete exam");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.exams.list.path] });
    },
  });
}

export function useCopyExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ examId, newTitle }: { examId: number; newTitle: string }) => {
      const res = await apiRequest("POST", `/api/admin/exams/${examId}/copy`, { newTitle });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to copy exam");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.exams.list.path] });
    },
  });
}

// Exam Stats Hook
export function useExamStats(examId: number) {
  return useQuery({
    queryKey: [`/api/admin/exam-stats/${examId}`],
    enabled: !!examId,
    refetchInterval: 5000, // Poll every 5 seconds for real-time updates
  }) as import("@tanstack/react-query").UseQueryResult<any, Error>;
}

// Exam Sessions Hook
export function useExamSessions(examId: number) {
  return useQuery({
    queryKey: [`/api/admin/exam-sessions/${examId}`],
    enabled: !!examId,
    refetchInterval: 5000, // Poll every 5 seconds
  }) as import("@tanstack/react-query").UseQueryResult<any[], Error>;
}

export function useActiveExamSessions(examId: number) {
  return useQuery({
    queryKey: [`/api/admin/exam-sessions/${examId}/active`],
    enabled: !!examId,
    refetchInterval: 3000, // Poll every 3 seconds for active sessions
  }) as import("@tanstack/react-query").UseQueryResult<any[], Error>;
}

// Proctoring Logs Hook
export function useProctoringLogs(examId?: number) {
  const endpoint = examId ? `/api/admin/proctoring-logs/${examId}` : '/api/admin/proctoring-logs';
  return useQuery({
    queryKey: [endpoint],
    enabled: examId !== undefined ? !!examId : true,
    refetchInterval: 10000, // Poll every 10 seconds
  }) as import("@tanstack/react-query").UseQueryResult<any[], Error>;
}
