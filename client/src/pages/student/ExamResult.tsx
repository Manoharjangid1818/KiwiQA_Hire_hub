import { useRoute, Link } from "wouter";
import { useAttempt, useReexamRequests, useCreateReexamRequest } from "@/hooks/use-attempts";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle, Clock, XCircle, Trophy, FileText } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function ExamResult() {
  const [, params] = useRoute("/student/attempts/:id");
  const attemptId = params ? parseInt(params.id) : 0;
  
  const { data: attempt, isLoading } = useAttempt(attemptId);
  const { data: reexamRequests, isLoading: loadingReexamRequests } = useReexamRequests();
  const { mutateAsync: createReexamRequest, isPending: isSubmittingReexam } = useCreateReexamRequest();
  
  const [reexamDialogOpen, setReexamDialogOpen] = useState(false);
  const [reexamReason, setReexamReason] = useState("");
  
  const { toast } = useToast();
  const { token } = useAuth();

  // Calculate pass/fail status
  const passingMarks = attempt?.exam?.passingMarks || 0;
  const totalMarks = attempt?.exam?.totalMarks || 0;
  const score = attempt?.score || 0;
  const isPassed = passingMarks > 0 && score >= passingMarks;
  const isPassedPercentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

  const handleRequestReexam = async () => {
    if (!reexamReason.trim()) {
      toast({ title: "Error", description: "Please provide a reason for your re-exam request", variant: "destructive" });
      return;
    }
    
    try {
      await createReexamRequest({
        attemptId: attempt.id,
        examId: attempt.examId,
        reason: reexamReason
      });
      setReexamDialogOpen(false);
      setReexamReason("");
      toast({ title: "Request Submitted", description: "Your re-exam request has been sent to the admin." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to submit request", variant: "destructive" });
    }
  };

  // Check if there's already a pending request for this attempt
  const hasPendingRequest = reexamRequests?.some((r: any) => r.attemptId === attemptId && r.status === "pending");
  const existingRequest = reexamRequests?.find((r: any) => r.attemptId === attemptId);

  if (isLoading) return <ProtectedRoute requireRole="student"><div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div></ProtectedRoute>;
  if (!attempt) return <ProtectedRoute requireRole="student"><div>Attempt not found</div></ProtectedRoute>;

  return (
    <ProtectedRoute requireRole="student">
      <div className="max-w-2xl mx-auto space-y-8">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
          <Link href="/student" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </Button>

        <div className={`bg-white dark:bg-slate-900 rounded-3xl p-10 text-center shadow-xl border border-border/50 relative overflow-hidden ${isPassed ? '' : passingMarks > 0 ? 'border-red-200 dark:border-red-800' : ''}`}>
          <div className={`absolute top-0 inset-x-0 h-2 ${isPassed ? 'bg-green-500' : passingMarks > 0 ? 'bg-red-500' : 'bg-green-500'}`} />
          
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 shadow-inner ring-8 ${isPassed ? 'bg-green-50 dark:bg-green-900/20 ring-green-100 dark:ring-green-900/30' : passingMarks > 0 ? 'bg-red-50 dark:bg-red-900/20 ring-red-100 dark:ring-red-900/30' : 'bg-green-50 dark:bg-green-900/20 ring-green-100 dark:ring-green-900/30'}`}>
            {isPassed ? (
              <Trophy className="w-12 h-12 text-green-500" />
            ) : passingMarks > 0 ? (
              <XCircle className="w-12 h-12 text-red-500" />
            ) : (
              <CheckCircle className="w-12 h-12 text-green-500" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-2">
            {isPassed ? 'Congratulations! You Passed!' : passingMarks > 0 ? 'Keep Trying! You Can Do It!' : 'Exam Completed Successfully!'}
          </h1>
          <p className="text-muted-foreground text-lg mb-8">Your answers have been submitted successfully.</p>
          
          {/* Score Display */}
          {passingMarks > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{score}</p>
                  <p className="text-sm text-muted-foreground">Your Score</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-muted-foreground">{passingMarks}</p>
                  <p className="text-sm text-muted-foreground">Passing Marks</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-muted-foreground">{totalMarks}</p>
                  <p className="text-sm text-muted-foreground">Total Marks</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className={`text-lg font-semibold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                  {isPassed ? '✓ You passed the exam!' : `✗ You need ${passingMarks - score} more marks to pass`}
                </p>
              </div>
            </div>
          )}
          
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Submitted on</span>
            </div>
            <p className="text-xl font-semibold">
              {attempt.completedAt ? new Date(attempt.completedAt).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Results Pending Review</h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            Your exam has been submitted successfully. The results are being processed and will be available after teacher review. Please check back later or contact your instructor for more information.
          </p>
        </div>

        {/* Re-exam Request Section */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
          <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Request Re-Exam</h3>
          <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">
            If you believe there was an issue with your exam submission, you can request a re-exam. Please provide a detailed reason.
          </p>
          
          {loadingReexamRequests ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
          ) : existingRequest ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Your Request Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  existingRequest.status === "pending" 
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : existingRequest.status === "approved"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {existingRequest.status === "pending" ? "Pending Review" : 
                   existingRequest.status === "approved" ? "Approved" : "Rejected"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-medium">Reason:</span> {existingRequest.reason}
              </p>
              {existingRequest.admin_note && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Admin Note:</span> {existingRequest.admin_note}
                </p>
              )}
              {existingRequest.status === "rejected" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 border-amber-500 text-amber-600 hover:bg-amber-50"
                  onClick={() => setReexamDialogOpen(true)}
                >
                  Request Again
                </Button>
              )}
            </div>
          ) : (
            <Dialog open={reexamDialogOpen} onOpenChange={setReexamDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                  Request Re-Exam
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Request Re-Exam</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Explain why you need a re-exam (e.g., technical issues, answer not recorded, etc.)" 
                    value={reexamReason} 
                    onChange={(e) => setReexamReason(e.target.value)}
                    rows={4}
                  />
                  <Button 
                    onClick={handleRequestReexam}
                    disabled={isSubmittingReexam}
                    className="w-full"
                  >
                    {isSubmittingReexam ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* View Full Report Button */}
        <Button asChild className="w-full py-6 text-lg rounded-xl bg-primary/90 hover:bg-primary">
          <Link href={`/student/reports/${attempt.id}`} className="inline-flex items-center gap-2">
            <FileText className="w-5 h-5" /> View Full Report
          </Link>
        </Button>

        <Button variant="outline" asChild className="w-full py-6 text-lg rounded-xl">
          <Link href="/student">Return to Dashboard</Link>
        </Button>
      </div>
    </ProtectedRoute>
  );
}
