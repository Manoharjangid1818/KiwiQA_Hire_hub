import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useExams } from "@/hooks/use-exams";
import { useStudentAttempts, useDownloadResults } from "@/hooks/use-attempts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Clock, FileText, PowerOff, Download, Loader2 } from "lucide-react";

export default function StudentDashboard() {
  const { data: exams, isLoading: loadingExams } = useExams();
  const { data: attempts } = useStudentAttempts();
  const downloadResults = useDownloadResults();
  const [_, setLocation] = useLocation();

  return (
    <ProtectedRoute requireRole="student">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Student Portal</h1>
            <p className="text-muted-foreground mt-2 text-lg">Select an exam to begin your assessment.</p>
            {attempts && attempts.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                📊 {attempts.length} exam{attempts.length > 1 ? 's' : ''} completed
              </p>
            )}
          </div>
          {attempts && attempts.length > 0 && (
            <div className="flex gap-3">
              <Button 
                size="lg" 
                onClick={() => downloadResults.mutate()}
                disabled={downloadResults.isPending}
                className="gap-2 shadow-lg hover:shadow-xl font-semibold rounded-xl px-6 flex-1"
              >
                {downloadResults.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    All Results
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    All Results
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => setLocation('/student/attempts')}
                className="gap-2 shadow-lg hover:shadow-xl font-semibold rounded-xl px-6"
              >
                <FileText className="w-4 h-4" />
                View Reports
              </Button>
            </div>
          )}
        </div>

        {loadingExams ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="h-48 animate-pulse bg-slate-100 dark:bg-slate-800 border-none" />
            ))}
          </div>
        ) : exams && exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam: any) => {
              const isDisabled = exam.isEnabled === false;
              return (
                <Card key={exam.id} className={`hover:shadow-xl transition-all duration-300 flex flex-col ${isDisabled ? 'opacity-60 bg-slate-50 dark:bg-slate-800/50' : 'hover:border-primary/20'}`}>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 leading-tight">{exam.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{exam.description || "No description provided."}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex flex-col gap-3 text-sm text-muted-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        {exam.durationMinutes} Minutes
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        {exam.totalMarks} Total Marks
                      </div>
                      {isDisabled && (
                        <div className="flex items-center gap-2 text-red-500">
                          <PowerOff className="w-4 h-4" />
                          Currently Disabled
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {isDisabled ? (
                      <Button 
                        className="w-full rounded-xl shadow-md" 
                        disabled
                        variant="secondary"
                      >
                        Exam Unavailable
                      </Button>
                    ) : (
                      <Button 
                        className="w-full rounded-xl shadow-md hover:-translate-y-0.5 transition-transform" 
                        onClick={() => setLocation(`/student/exams/${exam.id}/start` as any)}
                      >
                        Start Exam
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-border">
            <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold">No exams available</h3>
            <p className="text-muted-foreground mt-2">Check back later for new assessments.</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

