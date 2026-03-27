import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/routes";

export function useStudents() {
  return useQuery({
    queryKey: [api.users.students.path],
  }) as import("@tanstack/react-query").UseQueryResult<any[], Error>;
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (studentId: number) => {
      const token = localStorage.getItem("kiwiqa_token");
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to delete student');
      }
      return json;
    },
    onSuccess: () => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: [api.users.students.path] });
    }
  });
}
