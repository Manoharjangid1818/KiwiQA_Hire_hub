import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Navbar } from "./Navbar";

type Role = "admin" | "student" | "any";

export function ProtectedRoute({
  children,
  requireRole = "admin",
}: {
  children: React.ReactNode;
  requireRole?: Role;
}) {
  const { user, isLoading } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    } else if (!isLoading && user) {
      if (requireRole === "admin" && user.role !== "admin") {
        setLocation("/");
      } else if (requireRole === "student" && user.role !== "student") {
        setLocation("/admin");
      }
    }
  }, [user, isLoading, setLocation, requireRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="font-medium animate-pulse">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // For admin routes
  if (requireRole === "admin" && user.role !== "admin") {
    return null;
  }

  // For student routes
  if (requireRole === "student" && user.role !== "student") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        {children}
      </main>
    </div>
  );
}

