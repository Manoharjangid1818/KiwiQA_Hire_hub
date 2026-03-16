import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, isLoading, error } = useAuth();
  const [_, setLocation] = useLocation();
  const [hasError, setHasError] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(0);

  useEffect(() => {
    // Handle auth loading complete - either success or failure
    // Always redirect after loading completes, regardless of result
    if (!isLoading) {
      // Small delay to show the spinner briefly for better UX
      const timer = setTimeout(() => {
        if (user) {
          // User is authenticated, redirect to appropriate dashboard
          console.log("User authenticated, redirecting to dashboard:", user.role);
          setLocation(user.role === "admin" ? "/admin" : "/student");
        } else {
          // No user or error, redirect to login
          console.log("No user or auth error, redirecting to login");
          setLocation("/login");
        }
      }, 100); // Brief delay for UI smoothness
      
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, setLocation]);

  // Handle error state - show error message and redirect
  useEffect(() => {
    if (error) {
      console.error("Auth error:", error);
      setHasError(true);
      // Redirect after showing error
      const timer = setTimeout(() => {
        setLocation("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, setLocation]);

  // Countdown timer for error state
  useEffect(() => {
    if (hasError && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasError, redirectCountdown]);

  // If showing an error, display it briefly
  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <p className="text-muted-foreground mb-2">Authentication error. Redirecting to login...</p>
        <p className="text-sm text-muted-foreground mb-4">
          {error?.message || "Unable to verify authentication"}
        </p>
        <Button variant="outline" onClick={() => setLocation("/login")}>
          Go to Login Now
        </Button>
      </div>
    );
  }

  // Show loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading...</p>
        <p className="text-xs text-muted-foreground">Checking authentication</p>
      </div>
    </div>
  );
}
