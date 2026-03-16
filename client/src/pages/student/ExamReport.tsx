import { useRoute, Link } from "wouter";
import { useAttempt } from "@/hooks/use-attempts";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle, XCircle, FileText, Printer } from "lucide-react";
import { useState, useRef } from "react";

export default function ExamReport() {
  const [, params] = useRoute("/student/reports/:id");
  const attemptId = params ? parseInt(params.id) : 0;
  
  const { data: attempt, isLoading } = useAttempt(attemptId);
  const printRef = useRef<HTMLDivElement>(null);
  
  // Calculate pass/fail status
  const passingMarks = attempt?.exam?.passingMarks || 0;
  const totalMarks = attempt?.exam?.totalMarks || 0;
  const score = attempt?.score || 0;
  const isPassed = passingMarks > 0 && score >= passingMarks;
  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
  
  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  if (isLoading) return <ProtectedRoute requireRole="student"><div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div></ProtectedRoute>;
  if (!attempt) return <ProtectedRoute requireRole="student"><div>Attempt not found</div></ProtectedRoute>;

  // Merge answers with questions for display
  const questionsWithAnswers = attempt.exam?.questions?.map((question: any) => {
    const answer = attempt.answers?.find((a: any) => a.questionId === question.id);
    return {
      ...question,
      selectedAnswer: answer?.selectedAnswer || null,
      isCorrect: answer?.isCorrect || false,
      marksAwarded: answer?.marksAwarded || 0
    };
  }) || [];

  return (
    <ProtectedRoute requireRole="student">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
            <Link href="/student/attempts" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to My Exams
            </Link>
          </Button>
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" /> Print Report
          </Button>
        </div>

        {/* Report Content */}
        <div ref={printRef} className="space-y-6">
          {/* Student & Exam Info Card */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Exam Report Card
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Student Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student Name</p>
                  <p className="font-semibold text-lg">{attempt.student?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{attempt.student?.email || 'N/A'}</p>
                </div>
              </div>
              
              {/* Exam Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Exam Name</p>
                  <p className="font-semibold text-lg">{attempt.exam?.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Exam Date</p>
                  <p className="font-semibold">
                    {attempt.completedAt ? new Date(attempt.completedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score Summary Card */}
          <Card className={`border-2 ${isPassed ? 'border-green-500/30' : passingMarks > 0 ? 'border-red-500/30' : 'border-primary/20'}`}>
            <CardHeader className={`${isPassed ? 'bg-green-500/10' : passingMarks > 0 ? 'bg-red-500/10' : 'bg-primary/5'} pb-4`}>
              <CardTitle className="flex items-center gap-2">
                {isPassed ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-green-600">PASSED</span>
                  </>
                ) : passingMarks > 0 ? (
                  <>
                    <XCircle className="w-6 h-6 text-red-500" />
                    <span className="text-red-600">NOT PASSED</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6 text-primary" />
                    <span className="text-primary">COMPLETED</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Score Display */}
              {passingMarks > 0 && (
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-3xl font-bold text-primary">{score}</p>
                    <p className="text-sm text-muted-foreground">Marks Obtained</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-3xl font-bold text-muted-foreground">{passingMarks}</p>
                    <p className="text-sm text-muted-foreground">Passing Marks</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-3xl font-bold text-muted-foreground">{totalMarks}</p>
                    <p className="text-sm text-muted-foreground">Total Marks</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className={`text-3xl font-bold ${isPassed ? 'text-green-500' : 'text-red-500'}`}>{percentage}%</p>
                    <p className="text-sm text-muted-foreground">Percentage</p>
                  </div>
                </div>
              )}

              {/* Simple Score Display (when no passing marks) */}
              {passingMarks === 0 && (
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-3xl font-bold text-primary">{score}</p>
                    <p className="text-sm text-muted-foreground">Marks Obtained</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-3xl font-bold text-muted-foreground">{totalMarks}</p>
                    <p className="text-sm text-muted-foreground">Total Marks</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-3xl font-bold text-primary">{percentage}%</p>
                    <p className="text-sm text-muted-foreground">Percentage</p>
                  </div>
                </div>
              )}

              {/* Pass/Fail Message */}
              <div className={`p-4 rounded-xl text-center ${isPassed ? 'bg-green-50 dark:bg-green-900/20' : passingMarks > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                {passingMarks > 0 ? (
                  <p className={`text-lg font-semibold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                    {isPassed 
                      ? `✓ Congratulations! You passed the exam!` 
                      : `✗ You need ${passingMarks - score} more marks to pass`
                    }
                  </p>
                ) : (
                  <p className="text-lg font-semibold text-muted-foreground">
                    ✓ Exam completed successfully!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Questions & Answers Section */}
          <Card>
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle>Question-by-Question Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              {questionsWithAnswers.map((q: any, index: number) => (
                <div 
                  key={q.id} 
                  className={`p-4 rounded-xl border-2 ${
                    q.selectedAnswer === q.correctAnswer 
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' 
                      : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                  }`}
                >
                  {/* Question Number and Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                        {index + 1}
                      </span>
                      {q.selectedAnswer === q.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      q.selectedAnswer === q.correctAnswer 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {q.selectedAnswer === q.correctAnswer ? 'Correct' : 'Incorrect'} ({q.marksAwarded}/{q.marks} marks)
                    </span>
                  </div>

                  {/* Question Text */}
                  <p className="font-medium text-lg mb-4">{q.questionText}</p>

                  {/* Options */}
                  <div className="grid md:grid-cols-2 gap-2">
                    {['A', 'B', 'C', 'D'].map((option) => {
                      const optionKey = `option${option}` as keyof typeof q;
                      const optionText = q[optionKey];
                      const isSelected = q.selectedAnswer === option;
                      const isCorrectAnswer = q.correctAnswer === option;
                      
                      return (
                        <div 
                          key={option}
                          className={`p-3 rounded-lg border-2 flex items-center gap-2 ${
                            isCorrectAnswer
                              ? 'border-green-500 bg-green-100 dark:bg-green-900/20'
                              : isSelected
                                ? 'border-red-500 bg-red-100 dark:bg-red-900/20'
                                : 'border-border bg-slate-50 dark:bg-slate-800/50'
                          }`}
                        >
                          <span className={`flex items-center justify-center w-6 h-6 rounded-full font-semibold text-sm ${
                            isCorrectAnswer
                              ? 'bg-green-500 text-white'
                              : isSelected
                                ? 'bg-red-500 text-white'
                                : 'bg-slate-200 dark:bg-slate-700'
                          }`}>
                            {option}
                          </span>
                          <span className="flex-1">{optionText}</span>
                          {isCorrectAnswer && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {isSelected && !isCorrectAnswer && (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation if wrong */}
                  {q.selectedAnswer !== q.correctAnswer && (
                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        <span className="font-semibold">Correct Answer:</span> {q.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Proctoring Report Section */}
          {attempt.proctoringLogs && attempt.proctoringLogs.length > 0 && (
            <Card className="border-warning/20">
              <CardHeader className="bg-warning/10 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-warning" />
                  Proctoring Report
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span>{attempt.photos?.length || 0} photos captured</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span>{attempt.proctoringLogs.length} violations logged</span>
                  </div>
                </div>
                
                {/* Violations Summary */}
                {attempt.proctoringLogs.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-warning">Violations Detected:</h4>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {attempt.proctoringLogs.slice(0, 10).map((log: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                          <div>
                            <p className="font-medium">{log.activityType}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()} - Warning {log.warningCount}
                            </p>
                            {log.details && (
                              <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      {attempt.proctoringLogs.length > 10 && (
                        <p className="text-center text-sm text-muted-foreground py-2">
                          ... and {attempt.proctoringLogs.length - 10} more
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Photo Gallery */}
                {attempt.photos && attempt.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {attempt.photos.slice(0, 8).map((photo: any, idx: number) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-black/20 group">
                        <img 
                          src={photo.photoData} 
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs px-2 py-1 bg-black/50 rounded">
                            Photo {idx + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                    {attempt.photos.length > 8 && (
                      <div className="col-span-1 aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">+{attempt.photos.length - 8}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center text-muted-foreground text-sm py-4">
            <p>Generated on {new Date().toLocaleString()}</p>
            <p>KiwiQA Online Examination System</p>
          </div>
        </div>

        {/* Back Button */}
        <Button asChild className="w-full py-6 text-lg rounded-xl">
          <Link href="/student/attempts">Return to My Exams</Link>
        </Button>
      </div>
    </ProtectedRoute>
  );
}

