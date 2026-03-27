import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { useLocation } from "wouter";

type LoginInput = z.infer<typeof api.auth.login.input>;
type RegisterInput = z.infer<typeof api.auth.register.input>;
type VerifyOtpInput = z.infer<typeof api.auth.verifyOtp.input>;
type ForgotPasswordInput = z.infer<typeof api.auth.forgotPassword.input>;
type ResetPasswordInput = z.infer<typeof api.auth.resetPassword.input>;
type UpdateProfileInput = z.infer<typeof api.admin.updateProfile.input>;

export function useAuth() {
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const token = localStorage.getItem("kiwiqa_token");
      if (!token) return null;
      
      try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const res = await fetch(import.meta.env.VITE_API_URL + api.auth.me.path, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // If response is not OK, handle based on status
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("kiwiqa_token");
            return null;
          }
          // Don't throw for other errors, just return null to allow app to work
          console.warn("Auth check failed with status:", res.status);
          return null;
        }
        
        const data = await res.json();
        return api.auth.me.responses[200].parse(data).user;
      } catch (err) {
        // Network error, abort error, or parsing error - clear token and return null
        // Don't keep retrying for network errors
        console.warn("Auth check failed:", err);
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was aborted due to timeout
          localStorage.removeItem("kiwiqa_token");
        }
        return null;
      }
    },
    retry: false, // Don't retry on failure - fail fast
    staleTime: 5 * 60 * 1000, // 5 minutes
  }) as import("@tanstack/react-query").UseQueryResult<any, Error>;

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await apiRequest("POST", api.auth.login.path, data);
      const json = await res.json();
      return api.auth.login.responses[200].parse(json);
    },
    onSuccess: (data) => {
      localStorage.setItem("kiwiqa_token", data.token);
      queryClient.setQueryData([api.auth.me.path], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await apiRequest("POST", api.auth.register.path, data);
      return await res.json();
    }
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: VerifyOtpInput) => {
      const res = await apiRequest("POST", api.auth.verifyOtp.path, data);
      return await res.json();
    }
  });

  const resendOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/auth/resend-otp", { email });
      return await res.json();
    }
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      const res = await apiRequest("POST", api.auth.forgotPassword.path, data);
      return await res.json();
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      const res = await apiRequest("POST", api.auth.resetPassword.path, data);
      return await res.json();
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      const token = localStorage.getItem("kiwiqa_token");
      const res = await apiRequest("PUT", api.admin.updateProfile.path, data);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to update profile');
      }
      return json;
    }
  });

  const logout = () => {
    localStorage.removeItem("kiwiqa_token");
    queryClient.setQueryData([api.auth.me.path], null);
    queryClient.clear();
    setLocation("/login");
  };

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    verifyOtp: verifyOtpMutation.mutateAsync,
    isVerifying: verifyOtpMutation.isPending,
    resendOtp: resendOtpMutation.mutateAsync,
    isResendingOtp: resendOtpMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isForgotPasswordPending: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResetPasswordPending: resetPasswordMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdateProfilePending: updateProfileMutation.isPending,
    logout,
  };
}
