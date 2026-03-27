import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useExams, useCreateExam, useUpdateExam, useExamLinks, useCreateExamLink, useDeleteExamLink, useExamStats, useExamSessions, useActiveExamSessions, useDeleteExam, useCopyExam, useToggleExam } from "@/hooks/use-exams";
import { useGetProctoringLogsByExamIdQuery } from "@/hooks/use-proctoring-logs";
import { useStudents } from "@/hooks/use-users";
import { useAllAttempts, useAdminReexamRequests, useUpdateReexamRequest } from "@/hooks/use-attempts";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { User, PlusCircle, Upload, FileText, Users, CheckCircle2, Clock, Camera, Settings, Copy, Edit2, Pencil, ListChecks, Monitor, Trash2, Play, ExternalLink, RotateCw, Sparkles, Power, PowerOff, Download, FileDown, Shield, AlertTriangle, Loader2, BarChart2, Code2 } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { data: exams, isLoading: loadingExams } = useExams();
  const { mutateAsync: createExam, isPending: isCreating } = useCreateExam();
  const { mutateAsync: updateExam, isPending: isUpdating } = useUpdateExam();
  const { mutateAsync: deleteExam, isPending: isDeleting } = useDeleteExam();
  const { mutateAsync: copyExam, isPending: isCopying } = useCopyExam();
  const { mutateAsync: toggleExam, isPending: isToggling } = useToggleExam();
  
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExam, setNewExam] = useState({ title: "", description: "", durationMinutes: 60, totalMarks: 100, passingMarks: 0, requireCamera: false });
  
  // For editing exam
  const [editExamId, setEditExamId] = useState<number | null>(null);
  const [editExam, setEditExam] = useState({ title: "", description: "", durationMinutes: 60, totalMarks: 100, passingMarks: 0, requireCamera: false });
  
  // For copying exam
  const [copyExamId, setCopyExamId] = useState<number | null>(null);
  const [copyExamTitle, setCopyExamTitle] = useState("");
  
  // For CSV upload during exam creation
  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvExamId, setCsvExamId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // For AI question generation during creation
  const [showAiGenerate, setShowAiGenerate] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiDifficulty, setAiDifficulty] = useState("medium");
  const [aiNumQuestions, setAiNumQuestions] = useState(100);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  // For AI question regeneration (existing exam)
  const [showAiRegenerate, setShowAiRegenerate] = useState(false);
  const [regenerateExamId, setRegenerateExamId] = useState<number | null>(null);
  const [regenerateTopic, setRegenerateTopic] = useState("");
  const [regenerateDifficulty, setRegenerateDifficulty] = useState("medium");
  const [regenerateNumQuestions, setRegenerateNumQuestions] = useState(100);
  const [regenerateClearExisting, setRegenerateClearExisting] = useState(false);
  const [regeneratingQuestions, setRegeneratingQuestions] = useState(false);
  const [regeneratedQuestions, setRegeneratedQuestions] = useState<any[]>([]);

  // For exam link management
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const { data: examLinks, isLoading: loadingExamLinks } = useExamLinks(selectedExamId || 0);
  const { mutateAsync: createExamLink, isPending: isCreatingLink } = useCreateExamLink();
  const { mutateAsync: deleteExamLink, isPending: isDeletingLink } = useDeleteExamLink();
  
  // For exam stats and monitoring
  const [monitoringExamId, setMonitoringExamId] = useState<number | null>(null);
  const { data: examStats, isLoading: loadingStats } = useExamStats(monitoringExamId || 0);
  const { data: examSessions, isLoading: loadingSessions } = useExamSessions(monitoringExamId || 0);
  const { data: activeSessions, isLoading: loadingActive } = useActiveExamSessions(monitoringExamId || 0);

  // For live camera view
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [cameraFeeds, setCameraFeeds] = useState<Record<number, string>>({});

  // For download results
  const [examAttemptsCount, setExamAttemptsCount] = useState<Record<number, number>>({});
  const [downloadingExamId, setDownloadingExamId] = useState<number | null>(null);

  // For proctoring logs
  const [selectedProctoringExamId, setSelectedProctoringExamId] = useState<number | undefined>(undefined);
  const { data: proctoringLogs, isLoading: loadingProctoringLogs } = useGetProctoringLogsByExamIdQuery(selectedProctoringExamId!, { skip: !selectedProctoringExamId });

  // Total appeared candidates stat
  const { data: appearedStats } = useQuery<{ total: number; publicCandidates: number; registeredCandidates: number }>({
    queryKey: ['/api/admin/stats/appeared'],
  });

  // Candidates tab state
  const { data: students, isLoading: loadingStudents } = useStudents();
  const { data: allAttempts, isLoading: loadingAllAttempts } = useAllAttempts();
  const [candidateSearch, setCandidateSearch] = useState("");
  const [candidateExamFilter, setCandidateExamFilter] = useState<string>("all");
  const [candidateSortBy, setCandidateSortBy] = useState<"name" | "marks" | "email">("name");

  // Re-exam requests tab state
  const { data: adminReexamRequests, isLoading: loadingReexamRequests } = useAdminReexamRequests();
  const { mutateAsync: updateReexamRequest, isPending: isUpdatingReexam } = useUpdateReexamRequest();
  const [reexamActionId, setReexamActionId] = useState<number | null>(null);

  // Fetch exam attempts count on mount - FIXED: dependency optimized
  useEffect(() => {
    const fetchAttemptsCount = async () => {
      // Try both token keys for compatibility
      const token = localStorage.getItem("token") || localStorage.getItem("kiwiqa_token");
      if (!token) return;
      
      try {
        const response = await fetch("/api/admin/exams-attempts-count", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const countMap: Record<number, number> = {};
          data.forEach((item: any) => {
            countMap[item.examId] = item.attemptCount;
          });
          setExamAttemptsCount(countMap);
        }
      } catch (err) {
        console.error("Error fetching attempts count:", err);
      }
    };
    fetchAttemptsCount();
  }, []);

  // Handle download exam results
  const handleDownloadResults = async (examId: number, examTitle: string) => {
    setDownloadingExamId(examId);
    try {
      const token = localStorage.getItem("kiwiqa_token");
      const response = await fetch(`/api/admin/exams/${examId}/results`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to download results");
      }

      // Get filename from content-disposition header or generate one
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `${examTitle.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}_results.csv`;
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition.split("filename=")[1].replace(/"/g, "");
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({ title: "Download Complete", description: `Results downloaded as ${filename}` });
    } catch (err: any) {
      console.error("Download error:", err);
      toast({ title: "Download Failed", description: err.message || "Failed to download results", variant: "destructive" });
    } finally {
      setDownloadingExamId(null);
    }
  };

  // Validate CSV file content — returns error string or null if valid
  const validateCsvContent = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (!text || !text.trim()) {
          resolve("The CSV file is empty. Please upload a file containing at least 1 question.");
          return;
        }
        const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
        // Check if there is at least 1 data row (skip header if present)
        const dataLines = lines.filter(l => {
          const cols = l.split(",");
          return cols.length >= 6 && cols[0].trim() && !cols[0].trim().toLowerCase().startsWith("question");
        });
        if (dataLines.length === 0) {
          resolve("The CSV contains no valid questions. Ensure at least 1 row with: question, optionA, optionB, optionC, optionD, correctAnswer, marks");
          return;
        }
        resolve(null);
      };
      reader.onerror = () => resolve("Failed to read the CSV file. Please try again.");
      reader.readAsText(file);
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      toast({ title: "CSV Required", description: "Please upload a CSV file with questions before creating an exam.", variant: "destructive" });
      return;
    }
    const csvError = await validateCsvContent(csvFile);
    if (csvError) {
      toast({ title: "Invalid CSV", description: csvError, variant: "destructive" });
      return;
    }
    try {
      const examData = {
        title: newExam.title,
        description: newExam.description || "",
        durationMinutes: parseInt(String(newExam.durationMinutes), 10),
        totalMarks: parseInt(String(newExam.totalMarks), 10),
        passingMarks: parseInt(String(newExam.passingMarks), 10) || 0,
        requireCamera: Boolean(newExam.requireCamera)
      };
      console.log("Creating exam with data:", examData);
      const exam = await createExam(examData);
      // Upload questions CSV immediately after creation
      await handleCsvUpload(exam.id);
    } catch (err: any) {
      console.error("Create exam error:", err);
      toast({ title: "Error", description: err.message || "Failed to create exam", variant: "destructive" });
    }
  };
  
  // Handle CSV upload for questions
  const handleCsvUpload = async (examId: number) => {
    if (!csvFile) return;
    
    setCsvUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", csvFile);
      formData.append("examId", examId.toString());
      
      const token = localStorage.getItem("kiwiqa_token");
      const response = await fetch("/api/admin/upload-questions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast({ 
          title: "Questions Uploaded", 
          description: result.totalInserted ? `Successfully uploaded ${result.totalInserted} questions.` : "Questions uploaded successfully." 
        });
        setCsvFile(null);
        setShowCsvUpload(false);
        setCsvExamId(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Redirect to exam questions page
        setLocation(`/admin/exams/${examId}`);
      } else {
        toast({ title: "Upload Failed", description: result.message || "Failed to upload questions", variant: "destructive" });
      }
    } catch (err: any) {
      console.error("CSV upload error:", err);
      toast({ title: "Error", description: err.message || "Failed to upload CSV", variant: "destructive" });
    } finally {
      setCsvUploading(false);
    }
  };
  
  // Handle creating exam with CSV
  const handleCreateWithCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      toast({ title: "CSV Required", description: "Please select a CSV file first.", variant: "destructive" });
      return;
    }
    const csvError = await validateCsvContent(csvFile);
    if (csvError) {
      toast({ title: "Invalid CSV", description: csvError, variant: "destructive" });
      return;
    }
    try {
      const examData = {
        title: newExam.title,
        description: newExam.description || "",
        durationMinutes: parseInt(String(newExam.durationMinutes), 10),
        totalMarks: parseInt(String(newExam.totalMarks), 10),
        passingMarks: parseInt(String(newExam.passingMarks), 10) || 0,
        requireCamera: Boolean(newExam.requireCamera)
      };
      
      const exam = await createExam(examData);
      
      // Upload CSV after creating exam
      await handleCsvUpload(exam.id);
      
      setIsDialogOpen(false);
      setNewExam({ title: "", description: "", durationMinutes: 60, totalMarks: 100, passingMarks: 0, requireCamera: false });
    } catch (err: any) {
      console.error("Create exam with CSV error:", err);
      toast({ title: "Error", description: err.message || "Failed to create exam", variant: "destructive" });
    }
  };

  // Open edit exam dialog
  const openEditExam = (exam: any) => {
    setEditExamId(exam.id);
    setEditExam({
      title: exam.title,
      description: exam.description || "",
      durationMinutes: exam.durationMinutes,
      totalMarks: exam.totalMarks,
      passingMarks: exam.passingMarks || 0,
      requireCamera: exam.requireCamera || false
    });
  };

  // Open AI regeneration dialog
  const openAiRegenerate = (exam: any) => {
    setRegenerateExamId(exam.id);
    setRegenerateTopic(exam.title || "");
    setRegenerateDifficulty("medium");
    setRegenerateNumQuestions(100);
    setRegenerateClearExisting(false);
    setRegeneratedQuestions([]);
    setShowAiRegenerate(true);
  };

  // Navigate to questions page
  const openQuestionsPage = (examId: number) => {
    setLocation(`/admin/exams/${examId}`);
  };

  // Handle update exam
  const handleUpdateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editExamId) return;
    try {
      await updateExam({
        id: editExamId,
        data: {
          title: editExam.title,
          description: editExam.description,
          durationMinutes: Number(editExam.durationMinutes),
          totalMarks: Number(editExam.totalMarks),
          passingMarks: Number(editExam.passingMarks) || 0,
          requireCamera: editExam.requireCamera
        }
      });
      toast({ title: "Exam Updated", description: "Exam details have been updated." });
      setEditExamId(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteExam = async (examId: number) => {
    if (confirm("Are you sure you want to delete this exam? This action cannot be undone and will remove all questions, attempts, and related data.")) {
      try {
        await deleteExam(examId);
        toast({ title: "Exam Deleted", description: "The exam has been successfully deleted." });
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    }
  };

  // Handle toggle exam enabled/disabled
  const handleToggleExam = async (examId: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      const result = await toggleExam(examId);
      toast({ 
        title: result.isEnabled ? "Exam Enabled" : "Exam Disabled", 
        description: result.message 
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to toggle exam status", variant: "destructive" });
    }
  };

  // Open copy exam dialog
  const openCopyExam = (exam: any) => {
    setCopyExamId(exam.id);
    // Default new title: "ExamName (1)"
    const baseTitle = exam.title.replace(/\(\d+\)$/g, '').trim();
    setCopyExamTitle(`${baseTitle} (1)`);
  };

  // Handle copy exam
  const handleCopyExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copyExamId || !copyExamTitle.trim()) return;
    
    try {
      const result = await copyExam({ examId: copyExamId, newTitle: copyExamTitle.trim() });
      toast({ title: "Exam Copied", description: `Created "${result.exam.title}" with all questions.` });
      setCopyExamId(null);
      setCopyExamTitle("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Exam Link Functions
  const openExamLinksDialog = async (examId: number) => {
    // First, check if exam has questions
    const token = localStorage.getItem("kiwiqa_token");
    try {
      const response = await fetch(`/api/exams/${examId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const examData = await response.json();
      
      if (!examData.questions || examData.questions.length === 0) {
        toast({ 
          title: "No Questions Found", 
          description: "Please add questions to the exam before generating a link. Go to Questions tab to add questions.", 
          variant: "destructive" 
        });
        return;
      }
      
      setSelectedExamId(examId);
    } catch (err) {
      console.error("Error checking exam questions:", err);
      toast({ 
        title: "Error", 
        description: "Failed to verify exam questions", 
        variant: "destructive" 
      });
    }
  };

  const openMonitoringDialog = (examId: number) => {
    setMonitoringExamId(examId);
  };

  const handleCreateExamLink = async (examId: number) => {
    try {
      const link = await createExamLink({ examId });
      toast({ title: "Link Generated", description: "Exam link has been created successfully." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteExamLink = async (id: number, examId: number) => {
    try {
      await deleteExamLink({ id, examId });
      toast({ title: "Link Deleted", description: "Exam link has been removed." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Link copied to clipboard." });
  };

  const getExamLinkUrl = (code: string) => {
    return `${window.location.origin}/#/exam/${code}`;
  };

  // Get unique exam IDs from sessions for stats
  const getUniqueExamStats = () => {
    if (!examSessions) return { totalOpened: 0, inProgress: 0, completed: 0 };
    return {
      totalOpened: examSessions.length,
      inProgress: examSessions.filter((s: any) => s.status === "in_progress").length,
      completed: examSessions.filter((s: any) => s.status === "completed").length
    };
  };

  const uniqueStats = monitoringExamId ? getUniqueExamStats() : null;

  return (
    <ProtectedRoute requireRole="admin">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-lg">Manage exams, generate exam links, and monitor students in real-time.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              className="h-12 px-5 rounded-xl"
              onClick={() => setLocation("/admin/analytics")}
              data-testid="button-nav-analytics"
            >
              <BarChart2 className="w-4 h-4 mr-2" /> Analytics
            </Button>
            <Button
              variant="outline"
              className="h-12 px-5 rounded-xl"
              onClick={() => setLocation("/admin/audit-logs")}
              data-testid="button-nav-audit-logs"
            >
              <Shield className="w-4 h-4 mr-2" /> Audit Logs
            </Button>
            <Button 
              variant="outline" 
              className="h-12 px-6 rounded-xl"
              onClick={() => setLocation("/admin/profile")}
            >
              <User className="w-5 h-5 mr-2" /> Profile
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 px-6 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all">
                  <PlusCircle className="w-5 h-5 mr-2" /> Create New Exam
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-3xl max-h-[85vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
                  <DialogTitle className="text-2xl">Create New Exam</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleCreate} className="flex flex-col flex-1 overflow-hidden">
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input required value={newExam.title} onChange={e => setNewExam({...newExam, title: e.target.value})} className="h-12 rounded-xl" placeholder="Enter exam title" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input value={newExam.description} onChange={e => setNewExam({...newExam, description: e.target.value})} className="h-12 rounded-xl" placeholder="Enter exam description" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Duration (Minutes)</Label>
                        <Input required type="number" min={1} value={newExam.durationMinutes} onChange={e => setNewExam({...newExam, durationMinutes: e.target.value as any})} className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Marks</Label>
                        <Input required type="number" min={1} value={newExam.totalMarks} onChange={e => setNewExam({...newExam, totalMarks: e.target.value as any})} className="h-12 rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Minimum Passing Marks</Label>
                      <Input 
                        type="number" 
                        min={0} 
                        value={newExam.passingMarks} 
                        onChange={e => setNewExam({...newExam, passingMarks: e.target.value as any})} 
                        className="h-12 rounded-xl" 
                        placeholder="Enter passing marks (optional)"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="requireCamera"
                        checked={newExam.requireCamera}
                        onChange={(e) => setNewExam({...newExam, requireCamera: e.target.checked})}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="requireCamera" className="text-base cursor-pointer">Require Camera Access</Label>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        CSV Questions File <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) setCsvFile(f); }}
                        className="h-12 rounded-xl"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Required. CSV format: question, optionA, optionB, optionC, optionD, correctAnswer, marks
                      </p>
                      {csvFile && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {csvFile.name} selected
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t bg-background/95 backdrop-blur-sm shrink-0 rounded-b-3xl shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
                    <Button type="submit" disabled={isCreating || csvUploading || !csvFile} className="w-full h-12 rounded-xl">
                      {isCreating || csvUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isCreating ? "Creating..." : "Uploading Questions..."}</> : "Create Exam with Questions"}
                    </Button>
                    {!csvFile && (
                      <p className="text-xs text-muted-foreground text-center mt-2">Upload a CSV file to enable exam creation</p>
                    )}
                  </div>
                </form>

                {/* CSV Upload Dialog */}
                <Dialog open={showCsvUpload} onOpenChange={setShowCsvUpload}>
                  <DialogContent className="sm:max-w-[500px] rounded-3xl max-h-[85vh] flex flex-col p-0 gap-0">
                    <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
                      <DialogTitle>Upload Questions from CSV</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateWithCsv} className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        <div className="space-y-2">
                          <Label>Exam Title</Label>
                          <Input required value={newExam.title} onChange={e => setNewExam({...newExam, title: e.target.value})} className="h-12 rounded-xl" placeholder="Enter exam title" />
                        </div>
                        <div className="space-y-2">
                          <Label>Description (Optional)</Label>
                          <Input value={newExam.description} onChange={e => setNewExam({...newExam, description: e.target.value})} className="h-12 rounded-xl" placeholder="Enter exam description" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Duration (Minutes)</Label>
                            <Input required type="number" min={1} value={newExam.durationMinutes} onChange={e => setNewExam({...newExam, durationMinutes: e.target.value as any})} className="h-12 rounded-xl" />
                          </div>
                          <div className="space-y-2">
                            <Label>Total Marks</Label>
                            <Input required type="number" min={1} value={newExam.totalMarks} onChange={e => setNewExam({...newExam, totalMarks: e.target.value as any})} className="h-12 rounded-xl" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Minimum Passing Marks</Label>
                          <Input 
                            type="number" 
                            min={0} 
                            value={newExam.passingMarks} 
                            onChange={e => setNewExam({...newExam, passingMarks: e.target.value as any})} 
                            className="h-12 rounded-xl" 
                            placeholder="Enter passing marks (optional)"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="requireCameraCsv"
                            checked={newExam.requireCamera}
                            onChange={(e) => setNewExam({...newExam, requireCamera: e.target.checked})}
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="requireCameraCsv" className="text-base cursor-pointer">Require Camera Access</Label>
                        </div>
                        <div className="space-y-2">
                          <Label>CSV File</Label>
                          <Input 
                            ref={fileInputRef}
                            type="file" 
                            accept=".csv"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setCsvFile(file);
                            }}
                            className="h-12 rounded-xl"
                          />
                          <p className="text-xs text-muted-foreground">
                            CSV format: question, optionA, optionB, optionC, optionD, correctAnswer, marks
                          </p>
                        </div>
                      </div>
                      <div className="px-6 py-4 border-t bg-background/95 backdrop-blur-sm shrink-0 rounded-b-3xl shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
                        <Button type="submit" disabled={csvUploading || !csvFile} className="w-full h-12 rounded-xl">
                          {csvUploading ? "Uploading..." : "Create Exam with CSV"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-sm">
            <CardContent className="p-6">
              <FileText className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-3xl font-bold">{exams?.length || 0}</h3>
              <p className="text-muted-foreground font-medium text-sm">Total Exams</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20 shadow-sm">
            <CardContent className="p-6">
              <Power className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="text-3xl font-bold">{exams?.filter((e: any) => e.isEnabled !== false).length || 0}</h3>
              <p className="text-muted-foreground font-medium text-sm">Active Exams</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 shadow-sm">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-3xl font-bold">{appearedStats?.total ?? (students?.length || 0)}</h3>
              <p className="text-muted-foreground font-medium text-sm">Total Candidates Appeared</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20 shadow-sm">
            <CardContent className="p-6">
              <AlertTriangle className="w-8 h-8 text-red-600 mb-3" />
              <h3 className="text-3xl font-bold">
                {adminReexamRequests?.filter((r: any) => r.status === "pending").length || 0}
              </h3>
              <p className="text-muted-foreground font-medium text-sm">Pending Re-exam Requests</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="exams" className="w-full">
          <TabsList className="h-14 p-1 bg-muted/50 rounded-xl mb-6 flex flex-wrap w-auto border border-border/50 gap-1">
            <TabsTrigger value="exams" className="rounded-lg h-10 px-5 font-medium">Manage Exams</TabsTrigger>
            <TabsTrigger value="candidates" className="rounded-lg h-10 px-5 font-medium">Candidates</TabsTrigger>
            <TabsTrigger value="reexam" className="rounded-lg h-10 px-5 font-medium flex items-center gap-2">
              Re-exam Requests
              {adminReexamRequests?.filter((r: any) => r.status === "pending").length ? (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                  {adminReexamRequests.filter((r: any) => r.status === "pending").length}
                </span>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="download" className="rounded-lg h-10 px-5 font-medium">Download Results</TabsTrigger>
            <TabsTrigger value="proctoring" className="rounded-lg h-10 px-5 font-medium">Proctoring Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="exams">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams?.map((exam: any) => (
                <Card key={exam.id} className="flex flex-col hover:shadow-lg transition-all border-border/60">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{exam.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex gap-4 text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-border/50">
                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {exam.durationMinutes}m</div>
                      <div className="flex items-center gap-1.5"><FileText className="w-4 h-4"/> {exam.totalMarks} marks</div>
                    </div>
                    {exam.requireCamera && (
                      <div className="mt-2 flex items-center gap-1.5 text-sm text-amber-600">
                        <Camera className="w-4 h-4"/> Camera Required
                      </div>
                    )}
                    {/* Enable/Disable Status */}
                    <div className={`mt-2 flex items-center gap-1.5 text-sm ${exam.isEnabled !== false ? 'text-green-600' : 'text-red-600'}`}>
                      {exam.isEnabled !== false ? (
                        <>
                          <Power className="w-4 h-4"/> Enabled
                        </>
                      ) : (
                        <>
                          <PowerOff className="w-4 h-4"/> Disabled
                        </>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 bg-transparent flex flex-col gap-2">
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1 h-10 rounded-xl border-primary/20 text-primary hover:bg-primary/5" onClick={() => setLocation(`/admin/exams/${exam.id}`)}>
                        <Settings className="w-4 h-4 mr-2" /> Questions
                      </Button>
                      <Button variant="outline" className="flex-1 h-10 rounded-xl border-blue-500/20 text-blue-600 hover:bg-blue-50" onClick={() => openExamLinksDialog(exam.id)}>
                        <Copy className="w-4 h-4 mr-2" /> Link
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" className="w-full h-10 rounded-xl">
                          <Edit2 className="w-4 h-4 mr-2" /> Edit Exam
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuItem onClick={() => openEditExam(exam)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Exam Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openCopyExam(exam)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Exam
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openQuestionsPage(exam.id)}>
                          <ListChecks className="mr-2 h-4 w-4" />
                          Edit Questions
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={(e) => handleToggleExam(exam.id, e)}
                          disabled={isToggling}
                        >
                          {exam.isEnabled !== false ? (
                            <>
                              <PowerOff className="mr-2 h-4 w-4" />
                              Disable Exam
                            </>
                          ) : (
                            <>
                              <Power className="mr-2 h-4 w-4" />
                              Enable Exam
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" className="w-full h-10 rounded-xl border-purple-500/20 text-purple-600 hover:bg-purple-50" onClick={() => openMonitoringDialog(exam.id)}>
                      <Monitor className="w-4 h-4 mr-2" /> Live Monitor
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full h-10 rounded-xl border-red-500/20 text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete Exam
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Exam</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{exam.title}"? This action cannot be undone and will remove all questions, attempts, student answers, exam links, and related data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteExam(exam.id)} className="bg-red-600 hover:bg-red-700">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── Candidates Tab ── */}
          <TabsContent value="candidates">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Candidate Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <Input
                    placeholder="Search by name or email..."
                    value={candidateSearch}
                    onChange={e => setCandidateSearch(e.target.value)}
                    className="h-10 rounded-xl flex-1"
                  />
                  <Select value={candidateExamFilter} onValueChange={setCandidateExamFilter}>
                    <SelectTrigger className="h-10 rounded-xl w-full sm:w-[220px]">
                      <SelectValue placeholder="Filter by exam" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Exams</SelectItem>
                      {exams?.map((exam: any) => (
                        <SelectItem key={exam.id} value={String(exam.id)}>{exam.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={candidateSortBy} onValueChange={v => setCandidateSortBy(v as any)}>
                    <SelectTrigger className="h-10 rounded-xl w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Sort by Name</SelectItem>
                      <SelectItem value="email">Sort by Email</SelectItem>
                      <SelectItem value="marks">Sort by Marks (High→Low)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {loadingStudents || loadingAllAttempts ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (() => {
                  const attemptsArr: any[] = allAttempts || [];
                  const studentsArr: any[] = students || [];

                  const rows = studentsArr
                    .map((student: any) => {
                      const studentAttempts = attemptsArr.filter((a: any) => a.studentId === student.id);
                      const filteredAttempts = candidateExamFilter === "all"
                        ? studentAttempts
                        : studentAttempts.filter((a: any) => String(a.examId) === candidateExamFilter);
                      const bestScore = filteredAttempts.length
                        ? Math.max(...filteredAttempts.map((a: any) => a.score ?? 0))
                        : null;
                      const latestAttempt = filteredAttempts.sort((a: any, b: any) =>
                        new Date(b.startedAt || 0).getTime() - new Date(a.startedAt || 0).getTime()
                      )[0];
                      return { student, filteredAttempts, bestScore, latestAttempt };
                    })
                    .filter(({ student, filteredAttempts }) => {
                      const matchesSearch =
                        !candidateSearch ||
                        student.fullName?.toLowerCase().includes(candidateSearch.toLowerCase()) ||
                        student.email?.toLowerCase().includes(candidateSearch.toLowerCase());
                      const matchesExam = candidateExamFilter === "all" || filteredAttempts.length > 0;
                      return matchesSearch && matchesExam;
                    })
                    .sort((a, b) => {
                      if (candidateSortBy === "marks") return (b.bestScore ?? -1) - (a.bestScore ?? -1);
                      if (candidateSortBy === "email") return a.student.email.localeCompare(b.student.email);
                      return (a.student.fullName || "").localeCompare(b.student.fullName || "");
                    });

                  if (!rows.length) {
                    return (
                      <div className="text-center py-10 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No candidates found.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto rounded-xl border border-border/50">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900 border-b border-border/50">
                            <th className="text-left p-3 font-semibold">Candidate</th>
                            <th className="text-left p-3 font-semibold">Email</th>
                            <th className="text-center p-3 font-semibold">Exams Taken</th>
                            <th className="text-center p-3 font-semibold">Best Score</th>
                            <th className="text-center p-3 font-semibold">Last Attempt</th>
                            <th className="text-center p-3 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map(({ student, filteredAttempts, bestScore, latestAttempt }) => {
                            const examForBest = latestAttempt
                              ? exams?.find((e: any) => e.examId === latestAttempt.examId || e.id === latestAttempt.examId)
                              : null;
                            const passing = examForBest?.passingMarks ?? 0;
                            const passed = bestScore !== null && passing > 0 ? bestScore >= passing : null;
                            return (
                              <tr key={student.id} className="border-b border-border/30 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                <td className="p-3 font-medium">{student.fullName || "—"}</td>
                                <td className="p-3 text-muted-foreground">{student.email}</td>
                                <td className="p-3 text-center">{filteredAttempts.length}</td>
                                <td className="p-3 text-center font-semibold">
                                  {bestScore !== null ? bestScore : <span className="text-muted-foreground">—</span>}
                                </td>
                                <td className="p-3 text-center text-muted-foreground text-xs">
                                  {latestAttempt?.startedAt
                                    ? format(new Date(latestAttempt.startedAt), "MMM d, yyyy")
                                    : "—"}
                                </td>
                                <td className="p-3 text-center">
                                  {passed === true && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                      <CheckCircle2 className="w-3 h-3 mr-1" /> Passed
                                    </span>
                                  )}
                                  {passed === false && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                      Failed
                                    </span>
                                  )}
                                  {passed === null && filteredAttempts.length > 0 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                      Attempted
                                    </span>
                                  )}
                                  {filteredAttempts.length === 0 && (
                                    <span className="text-muted-foreground text-xs">No attempts</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <div className="p-3 text-xs text-muted-foreground border-t border-border/30">
                        Showing {rows.length} candidate{rows.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Re-exam Requests Tab ── */}
          <TabsContent value="reexam">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCw className="w-5 h-5" />
                  Re-exam Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingReexamRequests ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : adminReexamRequests && adminReexamRequests.length > 0 ? (
                  <div className="space-y-3">
                    {adminReexamRequests.map((req: any) => (
                      <div
                        key={req.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border/50 gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold">{req.student?.fullName || `Student #${req.studentId}`}</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              req.status === "pending"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                : req.status === "approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{req.student?.email}</p>
                          <p className="text-sm font-medium mt-1">
                            Exam: {req.exam?.title || `Exam #${req.examId}`}
                          </p>
                          {req.reason && (
                            <p className="text-sm text-muted-foreground mt-1 italic">"{req.reason}"</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Requested: {req.createdAt ? format(new Date(req.createdAt), "MMM d, yyyy h:mm a") : "—"}
                          </p>
                        </div>
                        {req.status === "pending" && (
                          <div className="flex gap-2 shrink-0">
                            <Button
                              size="sm"
                              className="rounded-xl bg-green-600 hover:bg-green-700 text-white"
                              disabled={isUpdatingReexam && reexamActionId === req.id}
                              onClick={async () => {
                                setReexamActionId(req.id);
                                try {
                                  await updateReexamRequest({ requestId: req.id, status: "approved" });
                                  toast({ title: "Request Approved", description: "The candidate may now retake the exam." });
                                } catch (err: any) {
                                  toast({ title: "Error", description: err.message, variant: "destructive" });
                                } finally {
                                  setReexamActionId(null);
                                }
                              }}
                            >
                              {isUpdatingReexam && reexamActionId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-xl border-red-500/40 text-red-600 hover:bg-red-50"
                              disabled={isUpdatingReexam && reexamActionId === req.id}
                              onClick={async () => {
                                setReexamActionId(req.id);
                                try {
                                  await updateReexamRequest({ requestId: req.id, status: "rejected" });
                                  toast({ title: "Request Rejected", description: "The re-exam request has been declined." });
                                } catch (err: any) {
                                  toast({ title: "Error", description: err.message, variant: "destructive" });
                                } finally {
                                  setReexamActionId(null);
                                }
                              }}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {req.status !== "pending" && req.adminNote && (
                          <p className="text-xs text-muted-foreground italic shrink-0">Note: {req.adminNote}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <RotateCw className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No re-exam requests yet.</p>
                    <p className="text-sm">Requests will appear here when students submit them after completing an exam.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="download">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileDown className="w-5 h-5" />
                  Download Exam Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Download exam results as CSV files. Each file contains student performance data including marks, pass/fail status, and time taken.
                </p>
                
                {exams && exams.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {exams.map((exam: any) => (
                        <div 
                          key={exam.id} 
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border/50"
                        >
                          <div className="flex-1 min-w-0 mr-3">
                            <p className="font-medium truncate">{exam.title}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {examAttemptsCount[exam.id] || 0} student{examAttemptsCount[exam.id] !== 1 ? 's' : ''} attempted
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadResults(exam.id, exam.title)}
                            disabled={downloadingExamId === exam.id}
                            className="shrink-0"
                          >
                            {downloadingExamId === exam.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                            <span className="ml-2">Download</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    {(examAttemptsCount[exams[0]?.id] || 0) === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileDown className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No exam attempts found.</p>
                        <p className="text-sm">Results will be available after students complete the exams.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No exams created yet.</p>
                    <p className="text-sm">Create an exam first to download results.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proctoring">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Proctoring Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  View proctoring violations and suspicious behavior detected during exams. Select an exam to filter logs.
                </p>
                
                {/* Exam Filter */}
                <div className="mb-4">
                  <Select 
                    value={selectedProctoringExamId?.toString() || "all"} 
                    onValueChange={(val) => setSelectedProctoringExamId(val === "all" ? undefined : Number(val))}
                  >
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue placeholder="Select an exam to filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Exams</SelectItem>
                      {exams?.map((exam: any) => (
                        <SelectItem key={exam.id} value={exam.id.toString()}>
                          {exam.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {loadingProctoringLogs ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : proctoringLogs && proctoringLogs.length > 0 ? (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {proctoringLogs.map((log: any, idx: number) => (
                      <div 
                        key={log.id || idx} 
                        className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border/50"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            log.warningCount >= 5 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                            log.warningCount >= 3 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{log.activityType}</p>
                            <p className="text-sm text-muted-foreground">
                              Student ID: {log.studentId} | Exam ID: {log.examId}
                            </p>
                            {log.details && (
                              <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {log.timestamp ? format(new Date(log.timestamp), "MMM d, yyyy h:mm:ss a") : 'No timestamp'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            log.warningCount >= 5 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            log.warningCount >= 3 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {log.warningCount} warning{log.warningCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No proctoring logs found.</p>
                    <p className="text-sm">
                      {selectedProctoringExamId 
                        ? "No violations detected for this exam yet." 
                        : "No violations detected in any exam yet."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Exam Links Dialog */}
        <Dialog open={!!selectedExamId} onOpenChange={(open) => !open && setSelectedExamId(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Exam Links</DialogTitle>
            </DialogHeader>
            
            {loadingExamLinks ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <Button 
                  onClick={() => handleCreateExamLink(selectedExamId!)} 
                  disabled={isCreatingLink}
                  className="w-full"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {isCreatingLink ? "Generating..." : "Generate New Link"}
                </Button>

                {examLinks && examLinks.length > 0 ? (
                  <div className="space-y-3">
                    {examLinks.map((link: any) => (
                      <div key={link.id} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${link.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="font-medium text-sm">
                              {link.isActive ? "Active" : "Inactive"}
                            </span>
                            {link.expiresAt && (
                              <span className="text-xs text-muted-foreground">
                                Expires: {format(new Date(link.expiresAt), "MMM d, yyyy")}
                              </span>
                            )}
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Exam Link</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this exam link? Students will no longer be able to access the exam using this link.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteExamLink(link.id, selectedExamId!)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                        <div className="flex gap-2">
                          <Input 
                            value={getExamLinkUrl(link.uniqueCode)} 
                            readOnly 
                            className="flex-1 text-sm"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyToClipboard(getExamLinkUrl(link.uniqueCode))}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                          >
                            <a href={getExamLinkUrl(link.uniqueCode)} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created: {format(new Date(link.createdAt), "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Copy className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No exam links generated yet.</p>
                    <p className="text-sm">Click "Generate New Link" to create one.</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Exam Dialog */}
        <Dialog open={!!editExamId} onOpenChange={(open) => !open && setEditExamId(null)}>
          <DialogContent className="sm:max-w-[500px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Edit Exam</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateExam} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input required value={editExam.title} onChange={e => setEditExam({...editExam, title: e.target.value})} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={editExam.description} onChange={e => setEditExam({...editExam, description: e.target.value})} className="h-12 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration (Minutes)</Label>
                  <Input required type="number" min={1} value={editExam.durationMinutes} onChange={e => setEditExam({...editExam, durationMinutes: e.target.value as any})} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Total Marks</Label>
                  <Input required type="number" min={1} value={editExam.totalMarks} onChange={e => setEditExam({...editExam, totalMarks: e.target.value as any})} className="h-12 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Minimum Passing Marks</Label>
                <Input 
                  type="number" 
                  min={0} 
                  value={editExam.passingMarks} 
                  onChange={e => setEditExam({...editExam, passingMarks: e.target.value as any})} 
                  className="h-12 rounded-xl" 
                  placeholder="Enter passing marks (optional)"
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="editRequireCamera"
                  checked={editExam.requireCamera}
                  onChange={(e) => setEditExam({...editExam, requireCamera: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="editRequireCamera" className="text-base cursor-pointer">Require Camera Access</Label>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" disabled={isUpdating} className="w-full h-12 rounded-xl">
                  {isUpdating ? "Updating..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Live Monitoring Dialog */}
        <Dialog open={!!monitoringExamId} onOpenChange={(open) => !open && setMonitoringExamId(null)}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Live Monitoring
              </DialogTitle>
            </DialogHeader>
            
            {loadingStats || loadingSessions ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats Cards Section */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Student Activity
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                      <CardContent className="p-4 text-center">
                        <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{uniqueStats?.totalOpened || 0}</p>
                        <p className="text-sm text-muted-foreground">Link Opened</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
                      <CardContent className="p-4 text-center">
                        <Play className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{uniqueStats?.inProgress || 0}</p>
                        <p className="text-sm text-muted-foreground">In Progress</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
                      <CardContent className="p-4 text-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{uniqueStats?.completed || 0}</p>
                        <p className="text-sm text-muted-foreground">Completed</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Student Sessions List */}
                {examSessions && examSessions.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Student Sessions ({examSessions.length})
                    </h3>
                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                      {examSessions.map((session: any) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              session.status === 'completed' ? 'bg-green-500' : 
                              session.status === 'in_progress' ? 'bg-amber-500 animate-pulse' : 
                              'bg-gray-400'
                            }`}></div>
                            <div>
                              <p className="font-medium">{session.studentName}</p>
                              <p className="text-xs text-muted-foreground">{session.studentEmail}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                              session.status === 'in_progress' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 
                              'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                            }`}>
                              {session.status === 'in_progress' ? 'In Progress' : 
                               session.status === 'completed' ? 'Completed' : 
                               session.status === 'not_started' ? 'Not Started' : session.status}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">
                              {session.joinedAt ? format(new Date(session.joinedAt), "h:mm a") : '-'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Camera Feeds Section */}
                {activeSessions && activeSessions.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Live Camera Feeds ({activeSessions.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {activeSessions.map((session: any) => (
                        <div 
                          key={session.id} 
                          className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-amber-500"
                        >
                          {cameraFeeds[session.id] ? (
                            <img 
                              src={cameraFeeds[session.id]} 
                              alt={`${session.studentName}'s camera`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-white text-center">
                                <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-xs">{session.studentName}</p>
                              </div>
                            </div>
                          )}
                          <div className="absolute top-2 left-2 flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-white bg-black/50 px-1 rounded">LIVE</span>
                          </div>
                          <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-1 rounded">
                            {session.studentName}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* AI Regenerate Questions Dialog */}
        <Dialog open={showAiRegenerate} onOpenChange={(open) => {
          if (!open) {
            setShowAiRegenerate(false);
            setRegenerateExamId(null);
            setRegeneratedQuestions([]);
          }
        }}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <RotateCw className="w-5 h-5" />
                Regenerate Questions with AI
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Question Regeneration
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Generate new questions using Google Gemini AI. You can choose to clear existing questions or add to them.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Topic</Label>
                <Input 
                  value={regenerateTopic} 
                  onChange={e => setRegenerateTopic(e.target.value)} 
                  className="h-12 rounded-xl" 
                  placeholder="e.g., Python Programming, Mathematics, History"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select value={regenerateDifficulty} onValueChange={setRegenerateDifficulty}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Number of Questions</Label>
                  <Input 
                    type="number" 
                    min={1} 
                    max={500}
                    value={regenerateNumQuestions}
                    onChange={e => setRegenerateNumQuestions(Number(e.target.value))}
                    className="h-12 rounded-xl" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <input 
                  type="checkbox" 
                  id="regenerateClearExisting"
                  checked={regenerateClearExisting}
                  onChange={(e) => setRegenerateClearExisting(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="regenerateClearExisting" className="text-base cursor-pointer text-amber-800 dark:text-amber-200">
                  Clear existing questions before adding new ones
                </Label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowAiRegenerate(false);
                    setRegenerateExamId(null);
                    setRegeneratedQuestions([]);
                  }}
                  className="flex-1 h-12 rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={async () => {
                    if (!regenerateTopic.trim()) {
                      toast({ title: "Error", description: "Please enter a topic", variant: "destructive" });
                      return;
                    }
                    
                    setRegeneratingQuestions(true);
                    try {
                      // First, clear existing questions if requested
                      if (regenerateClearExisting && regenerateExamId) {
                        // Call the new API endpoint to delete all questions for the exam
                        const token = localStorage.getItem("kiwiqa_token");
                        const deleteResponse = await fetch(`/api/admin/exams/${regenerateExamId}/questions`, {
                          method: "DELETE",
                          headers: {
                            "Authorization": `Bearer ${token}`
                          }
                        });
                        
                        if (!deleteResponse.ok) {
                          const errorData = await deleteResponse.json();
                          throw new Error(errorData.message || "Failed to clear existing questions");
                        }
                        console.log("Existing questions cleared for exam:", regenerateExamId);
                      }

                      const token = localStorage.getItem("kiwiqa_token");
                      const response = await fetch("/api/admin/generate-questions", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                          topic: regenerateTopic,
                          difficulty: regenerateDifficulty,
                          numberOfQuestions: regenerateNumQuestions,
                          examId: regenerateExamId
                        })
                      });
                      
                      const result = await response.json();
                      
                      if (response.ok) {
                        setRegeneratedQuestions(result.questions || []);
                        toast({ 
                          title: "Questions Regenerated", 
                          description: `Successfully generated ${result.questionsGenerated} questions!` 
                        });
                      } else {
                        toast({ title: "Error", description: result.message || "Failed to regenerate questions", variant: "destructive" });
                      }
                    } catch (err: any) {
                      console.error("AI regeneration error:", err);
                      toast({ title: "Error", description: err.message || "Failed to regenerate questions", variant: "destructive" });
                    } finally {
                      setRegeneratingQuestions(false);
                    }
                  }}
                  disabled={!regenerateTopic.trim() || regeneratingQuestions}
                  className="flex-1 h-12 rounded-xl"
                >
                  {regeneratingQuestions ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Questions
                    </>
                  )}
                </Button>
              </div>
              
              {regeneratedQuestions.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h4 className="font-semibold">Generated Questions ({regeneratedQuestions.length})</h4>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {regeneratedQuestions.map((q: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm">
                        <p className="font-medium">{idx + 1}. {q.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          A: {q.optionA} | B: {q.optionB} | C: {q.optionC} | D: {q.optionD}
                        </p>
                        <p className="text-xs text-green-600">Correct: {q.correctAnswer} ({q.marks} marks)</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowAiRegenerate(false);
                        setRegenerateExamId(null);
                        setRegeneratedQuestions([]);
                      }}
                      className="flex-1 h-10 rounded-xl"
                    >
                      Close
                    </Button>
                    <Button 
                      onClick={() => {
                        toast({ title: "Questions Saved", description: "Questions have been added to the exam." });
                        setShowAiRegenerate(false);
                        setRegenerateExamId(null);
                        setRegeneratedQuestions([]);
                        // Optionally redirect to questions page
                        if (regenerateExamId) {
                          setLocation(`/admin/exams/${regenerateExamId}`);
                        }
                      }}
                      className="flex-1 h-10 rounded-xl"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Copy Exam Dialog */}
        <Dialog open={!!copyExamId} onOpenChange={(open) => !open && setCopyExamId(null)}>
          <DialogContent className="sm:max-w-[500px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Copy Exam</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCopyExam} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>New Exam Title</Label>
                <Input 
                  required 
                  value={copyExamTitle} 
                  onChange={e => setCopyExamTitle(e.target.value)} 
                  className="h-12 rounded-xl" 
                  placeholder="Enter new exam title"
                />
                <p className="text-xs text-muted-foreground">
                  This will create a new exam with all the questions from the original exam.
                </p>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" disabled={isCopying || !copyExamTitle.trim()} className="w-full h-12 rounded-xl">
                  {isCopying ? "Copying..." : "Copy Exam"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}

