import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "../../../shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

type CreateQuestionInput = z.infer<typeof api.questions.create.input>;

export function useCreateQuestion(examId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateQuestionInput) => {
      const res = await apiRequest("POST", buildUrl(api.questions.create.path, { examId }), data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [buildUrl(api.exams.get.path, { id: examId })] });
    },
  });
}

export function useDeleteQuestion(examId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", buildUrl(api.questions.delete.path, { id }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [buildUrl(api.exams.get.path, { id: examId })] });
    },
  });
}
