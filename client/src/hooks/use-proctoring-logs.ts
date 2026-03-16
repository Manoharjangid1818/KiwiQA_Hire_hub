import { apiSlice } from '@/lib/queryClient';
import { ProctoringLog } from '@shared/schema';

// Endpoints
export const proctoringApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProctoringLogsByExamId: builder.query<ProctoringLog[], number>({
      query: (examId) => `/admin/proctoring-logs/${examId}`,
      providesTags: (result, error, examId) => [
        { type: 'ProctoringLog', id: 'LIST' },
        { type: 'ProctoringLog', id: `EXAM_${examId}` },
      ],
    }),

    getProctoringLogsByAttemptId: builder.query<ProctoringLog[], number>({
      query: (attemptId) => `/attempts/${attemptId}/proctoring`,
      providesTags: (result, error, attemptId) => [
        { type: 'ProctoringLog', id: `ATTEMPT_${attemptId}` },
      ],
    }),

    getAllProctoringLogs: builder.query<ProctoringLog[], void>({
      query: () => '/admin/proctoring-logs',
      providesTags: [{ type: 'ProctoringLog', id: 'LIST' }],
    }),

    logProctoringActivity: builder.mutation<void, {
      attemptId: number;
      activityType: string;
      warningCount?: number;
      details?: string;
    }>({
      query: (body) => ({
        url: '/proctoring/logs',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { attemptId }) => [
        { type: 'ProctoringLog', id: `ATTEMPT_${attemptId}` },
        { type: 'ProctoringLog', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetProctoringLogsByExamIdQuery,
  useGetProctoringLogsByAttemptIdQuery,
  useGetAllProctoringLogsQuery,
  useLogProctoringActivityMutation,
} = proctoringApi;

export const selectProctoringLogsByExamId = (examId: number) =>
  apiSlice.endpoints.getProctoringLogsByExamId.select(examId);

export default proctoringApi;

