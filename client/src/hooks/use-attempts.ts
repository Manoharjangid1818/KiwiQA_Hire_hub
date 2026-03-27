import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "../../../shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

type SubmitAttemptInput = z.infer<typeof api.attempts.submit.input>;

export function useStartAttempt() {
  return useMutation({
    mutationFn: async (examId: number) => {
      const res = await apiRequest("POST", buildUrl(api.attempts.start.path, { examId }));
      return await res.json();
    }
  });
}

export function useSubmitAttempt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ attemptId, data }: { attemptId: number, data: SubmitAttemptInput }) => {
      const res = await apiRequest("POST", buildUrl(api.attempts.submit.path, { attemptId }), data);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [buildUrl(api.attempts.get.path, { attemptId: variables.attemptId })] });
      queryClient.invalidateQueries({ queryKey: [api.attempts.history.path] });
    }
  });
}

export function useUpdateAttemptStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ attemptId, status }: { attemptId: number, status: string | null }) => {
      const res = await apiRequest("PUT", `/api/admin/attempts/${attemptId}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.attempts.all.path] });
      queryClient.invalidateQueries({ queryKey: [api.attempts.history.path] });
    }
  });
}

export function useAttempt(attemptId: number) {
  const baseQuery = useQuery({
    queryKey: [buildUrl(api.attempts.get.path, { attemptId })],
    enabled: !!attemptId,
  }) as import("@tanstack/react-query").UseQueryResult<any, Error>;

  const proctoringQuery = useQuery({
    queryKey: [`/api/attempts/${attemptId}/proctoring`],
    enabled: !!attemptId && baseQuery.data,
  }) as import("@tanstack/react-query").UseQueryResult<any[], Error>;

  const photosQuery = useQuery({
    queryKey: [`/api/attempts/${attemptId}/photos`],
    enabled: !!attemptId && baseQuery.data,
  }) as import("@tanstack/react-query").UseQueryResult<any[], Error>;

  return {
    ...baseQuery,
    data: baseQuery.data ? {
      ...baseQuery.data,
      proctoringLogs: proctoringQuery.data || [],
      photos: photosQuery.data || []
    } : undefined,
    isLoading: baseQuery.isLoading || proctoringQuery.isLoading || photosQuery.isLoading,
    isError: baseQuery.isError || proctoringQuery.isError || photosQuery.isError
  };
}

export function useStudentAttempts() {
  return useQuery({
    queryKey: [api.attempts.history.path],
  }) as import("@tanstack/react-query").UseQueryResult<any[], Error>;
}

export function useAllAttempts() {
  return useQuery({
    queryKey: [api.attempts.all.path],
  }) as import("@tanstack/react-query").UseQueryResult<any[], Error>;
}

export function useAttemptDetails(attemptId: number) {
  return useQuery({
    queryKey: [buildUrl(api.attempts.get.path, { attemptId })],
    enabled: !!attemptId,
  }) as import("@tanstack/react-query").UseQueryResult<any, Error>;
}

// Download Results Hook
export function useDownloadResults() {
  return useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("kiwiqa_token");
      const response = await apiRequest("GET", "/api/student/results");
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to download results");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my_exam_results.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  });
}

// Re-exam request hooks
export function useReexamRequests() {
  return useQuery({
    queryKey: ['reexam-requests'],
  }) as import("@tanstack/react-query").UseQueryResult<any[], Error>;
}

export function useAdminReexamRequests() {
  return useQuery({
    queryKey: ['admin-reexam-requests'],
  }) as import("@tanstack/react-query").UseQueryResult<any[], Error>;
}

export function useCreateReexamRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { attemptId: number; examId: number; reason: string }) => {
      const res = await apiRequest("POST", "/api/reexam-requests", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reexam-requests'] });
    }
  });
}

export function useUpdateReexamRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ requestId, status, adminNote }: { requestId: number; status: string; adminNote?: string }) => {
      const res = await apiRequest("PUT", `/api/admin/reexam-requests/${requestId}`, { status, adminNote });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reexam-requests'] });
    }
  });
}
