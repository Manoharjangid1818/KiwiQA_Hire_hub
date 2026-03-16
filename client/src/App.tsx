import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerifyOtp from "@/pages/auth/VerifyOtp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import PublicExam from "@/pages/PublicExam";

import AdminDashboard from "@/pages/admin/Dashboard";
import ManageExam from "@/pages/admin/ManageExam";
import ProfileSettings from "@/pages/admin/ProfileSettings";

import StudentDashboard from "@/pages/student/Dashboard";
import StartExam from "@/pages/student/StartExam";
import TakeExam from "@/pages/student/TakeExam";
import ExamResult from "@/pages/student/ExamResult";
import ExamReport from "@/pages/student/ExamReport";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/verify-otp" component={VerifyOtp} />
      <Route path="/forgot-password" component={ForgotPassword} />
      
      {/* Public Exam Access - Students can access via unique link */}
      <Route path="/exam/:code" component={PublicExam} />

      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/profile" component={ProfileSettings} />
      <Route path="/admin/exams/:id" component={ManageExam} />

      {/* Student Routes */}
      <Route path="/student" component={StudentDashboard} />
      <Route path="/student/exams/:id/start" component={StartExam} />
      <Route path="/student/take/:id" component={TakeExam} />
      <Route path="/student/attempts/:id" component={ExamResult} />
      <Route path="/student/reports/:id" component={ExamReport} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

