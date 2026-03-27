import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { api, buildUrl } from "../../../shared/routes";
import { ProctoringLog } from '@shared/schema';

// Custom queryFn for proctoring logs (uses getQueryFn pattern)
const proctoringQueryFn = getQueryFn({ on401: "throw" });

// GET Queries matching original endpoints - with RTK-style hook names for compatibility
export function useGetProctoringLogsByExamIdQuery(examId?: number) {
  return useQuery({
    queryKey: ['proctoring-logs', 'exam', examId],
    queryFn: proctoringQueryFn,
    enabled: !!examId,
  }) as import("@tanstack/react-query").UseQueryResult<ProctoringLog[], Error>;
}

export function useGetProctoringLogsByAttemptIdQuery(attemptId?: number) {
  return useQuery({
    queryKey: ['proctoring-logs', 'attempt', attemptId],
    queryFn: proctoringQueryFn,
    enabled: !!attemptId,
  }) as import("@tanstack/react-query").UseQueryResult<ProctoringLog[], Error>;
}

export function useGetAllProctoringLogsQuery() {
  return useQuery({
    queryKey: ['proctoring-logs', 'all'],
    queryFn: proctoringQueryFn,
  }) as import("@tanstack/react-query").UseQueryResult<ProctoringLog[], Error>;
}

// POST mutation for logging proctoring activity
export function useLogProctoringActivityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: {
      attemptId: number;
      activityType: string;
      warningCount?: number;
      details?: string;
    }) => {
      const res = await apiRequest('POST', '/api/proctoring/logs', body);
      return res.json();
    },
    onSuccess: () => {
      // Invalidate related queries (matching original invalidatesTags)
      queryClient.invalidateQueries({ queryKey: ['proctoring-logs'] });
      queryClient.invalidateQueries({ queryKey: ['proctoring-logs', 'all'] });
    },
  });
}

// Legacy selectors (for compatibility)
export const selectProctoringLogsByExamId = (examId: number) => ({
  queryKey: ['proctoring-logs', 'exam', examId]
});

