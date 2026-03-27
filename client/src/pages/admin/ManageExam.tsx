import { useState, useRef } from "react";
import { useRoute, Link } from "wouter";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useExam } from "@/hooks/use-exams";
import { useCreateQuestion, useDeleteQuestion } from "@/hooks/use-questions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Plus, Trash2, HelpCircle, Code2, Upload, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type CodingQuestion = {
  id: number;
  examId: number;
  title: string;
  description: string;
  sampleInput: string | null;
  sampleOutput: string | null;
  language: string;
  starterCode: string | null;
  marks: number;
};

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
};

export default function ManageExam() {
  const [, params] = useRoute("/admin/exams/:id");
  const examId = params ? parseInt(params.id) : 0;
  const queryClient = useQueryClient();
  
  const { data: exam, isLoading } = useExam(examId);
  const { mutateAsync: createQ, isPending: isCreating } = useCreateQuestion(examId);
  const { mutateAsync: deleteQ, isPending: isDeleting } = useDeleteQuestion(examId);
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newQ, setNewQ] = useState({
    questionText: "",
    optionA: "", optionB: "", optionC: "", optionD: "",
    correctAnswer: "A", marks: 1
  });

  // Coding questions state
  const [isCodingFormOpen, setIsCodingFormOpen] = useState(false);
  const [newCodingQ, setNewCodingQ] = useState({
    title: "",
    description: "",
    language: "javascript",
    sampleInput: "",
    sampleOutput: "",
    starterCode: "",
    marks: 10,
  });
  const [isCreatingCoding, setIsCreatingCoding] = useState(false);
  const [isDeletingCoding, setIsDeletingCoding] = useState<number | null>(null);

  // CSV upload state (for adding questions while editing)
  const [csvUploadFile, setCsvUploadFile] = useState<File | null>(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const [showCsvSection, setShowCsvSection] = useState(false);
  const csvFileInputRef = useRef<HTMLInputElement>(null);

  const { data: codingQuestions = [], isLoading: loadingCoding } = useQuery<CodingQuestion[]>({
    queryKey: [`/api/exams/${examId}/coding-questions`],
    enabled: !!examId,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createQ({
        ...newQ,
        marks: Number(newQ.marks)
      });
      toast({ title: "Question Added" });
      setNewQ({ questionText: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A", marks: 1 });
      setIsFormOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this question?")) {
      await deleteQ(id);
      toast({ title: "Question Deleted" });
    }
  };

  const handleCreateCodingQ = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingCoding(true);
    try {
      await apiRequest("POST", `/api/admin/exams/${examId}/coding-questions`, {
        ...newCodingQ,
        marks: Number(newCodingQ.marks),
        sampleInput: newCodingQ.sampleInput || null,
        sampleOutput: newCodingQ.sampleOutput || null,
        starterCode: newCodingQ.starterCode || null,
      });
      await queryClient.invalidateQueries({ queryKey: [`/api/exams/${examId}/coding-questions`] });
      toast({ title: "Coding Question Added" });
      setNewCodingQ({ title: "", description: "", language: "javascript", sampleInput: "", sampleOutput: "", starterCode: "", marks: 10 });
      setIsCodingFormOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsCreatingCoding(false);
    }
  };

  const handleDeleteCodingQ = async (id: number) => {
    if (!confirm("Delete this coding question?")) return;
    setIsDeletingCoding(id);
    try {
      await apiRequest("DELETE", `/api/admin/coding-questions/${id}`);
      await queryClient.invalidateQueries({ queryKey: [`/api/exams/${examId}/coding-questions`] });
      toast({ title: "Coding Question Deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsDeletingCoding(null);
    }
  };

  // Validate CSV has at least 1 question
  const validateCsvContent = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (!text || !text.trim()) {
          resolve("The CSV file is empty. Please upload a file with at least 1 question.");
          return;
        }
        const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
        const dataLines = lines.filter(l => {
          const cols = l.split(",");
          return cols.length >= 6 && cols[0].trim() && !cols[0].trim().toLowerCase().startsWith("question");
        });
        if (dataLines.length === 0) {
          resolve("No valid questions found. Format: question, optionA, optionB, optionC, optionD, correctAnswer, marks");
          return;
        }
        resolve(null);
      };
      reader.onerror = () => resolve("Failed to read the CSV file.");
      reader.readAsText(file);
    });
  };

  // Handle CSV upload for adding questions to existing exam
  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvUploadFile) {
      toast({ title: "No File Selected", description: "Please select a CSV file to upload.", variant: "destructive" });
      return;
    }
    const csvError = await validateCsvContent(csvUploadFile);
    if (csvError) {
      toast({ title: "Invalid CSV", description: csvError, variant: "destructive" });
      return;
    }
    setCsvUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", csvUploadFile);
      formData.append("examId", examId.toString());
      const token = localStorage.getItem("kiwiqa_token");
      const response = await fetch("/api/admin/upload-questions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        const count = result.totalInserted ?? result.inserted ?? 0;
        toast({
          title: "Questions Uploaded",
          description: count ? `Successfully added ${count} question(s) to this exam.` : "Questions uploaded successfully."
        });
        await queryClient.invalidateQueries({ queryKey: [`/api/exams/${examId}`] });
        setCsvUploadFile(null);
        setShowCsvSection(false);
        if (csvFileInputRef.current) csvFileInputRef.current.value = "";
      } else {
        toast({ title: "Upload Failed", description: result.message || "Failed to upload questions.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to upload CSV.", variant: "destructive" });
    } finally {
      setCsvUploading(false);
    }
  };

  if (isLoading) return <ProtectedRoute requireRole="admin"><div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div></ProtectedRoute>;
  if (!exam) return <ProtectedRoute requireRole="admin"><div>Exam not found</div></ProtectedRoute>;

  return (
    <ProtectedRoute requireRole="admin">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{exam.title}</h1>
            <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="bg-secondary px-2.5 py-0.5 rounded-full">{exam.durationMinutes} Minutes</span>
              <span className="bg-secondary px-2.5 py-0.5 rounded-full">{exam.totalMarks} Total Marks</span>
              <span className="bg-secondary px-2.5 py-0.5 rounded-full">{exam.questions?.length || 0} MCQ Questions</span>
              <span className="bg-secondary px-2.5 py-0.5 rounded-full">{codingQuestions.length} Coding Questions</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="mcq" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="mcq" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> MCQ Questions
              <Badge variant="secondary" className="ml-1">{exam.questions?.length || 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="coding" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Coding Questions
              <Badge variant="secondary" className="ml-1">{codingQuestions.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* MCQ Questions Tab */}
          <TabsContent value="mcq">
            <div className="flex justify-end gap-3 mb-4 flex-wrap">
              {!isFormOpen && (
                <Button
                  variant="outline"
                  onClick={() => { setShowCsvSection(v => !v); setIsFormOpen(false); }}
                  className="rounded-xl h-11 px-6"
                  data-testid="button-upload-csv-questions"
                >
                  <Upload className="w-4 h-4 mr-2" /> Upload Questions via CSV
                </Button>
              )}
              {!isFormOpen && (
                <Button onClick={() => { setIsFormOpen(true); setShowCsvSection(false); }} className="rounded-xl shadow-md h-11 px-6" data-testid="button-add-question">
                  <Plus className="w-4 h-4 mr-2" /> Add MCQ Question
                </Button>
              )}
            </div>

            {/* CSV Upload Section */}
            {showCsvSection && (
              <Card className="border-primary/30 shadow-md rounded-3xl mb-6">
                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 rounded-t-3xl border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" /> Upload Questions via CSV
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleCsvUpload} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-semibold">CSV File <span className="text-destructive">*</span></Label>
                      <Input
                        ref={csvFileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) setCsvUploadFile(f); }}
                        className="h-12 rounded-xl"
                        data-testid="input-csv-upload-edit"
                      />
                      <p className="text-xs text-muted-foreground">
                        Format: question, optionA, optionB, optionC, optionD, correctAnswer, marks
                      </p>
                      <p className="text-xs text-muted-foreground">
                        New questions will be <strong>merged</strong> with existing questions.
                      </p>
                      {csvUploadFile && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {csvUploadFile.name} selected
                        </p>
                      )}
                    </div>
                    <div className="flex gap-3 justify-end pt-2 border-t border-border/50">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => { setShowCsvSection(false); setCsvUploadFile(null); if (csvFileInputRef.current) csvFileInputRef.current.value = ""; }}
                        className="rounded-xl px-6"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={csvUploading || !csvUploadFile}
                        className="rounded-xl px-8 shadow-md"
                        data-testid="button-submit-csv-upload"
                      >
                        {csvUploading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Uploading...</> : <><Upload className="w-4 h-4 mr-2" /> Upload & Merge Questions</>}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}


            {isFormOpen && (
              <Card className="border-primary/30 shadow-lg shadow-primary/5 rounded-3xl mb-6">
                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 rounded-t-3xl border-b border-border/50">
                  <CardTitle className="text-xl">Create New Question</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleCreate} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Question Text</Label>
                      <Input required value={newQ.questionText} onChange={e => setNewQ({...newQ, questionText: e.target.value})} className="h-12 rounded-xl" placeholder="e.g. What is the capital of France?" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-border/50">
                      <div className="space-y-2">
                        <Label>Option A</Label>
                        <Input required value={newQ.optionA} onChange={e => setNewQ({...newQ, optionA: e.target.value})} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Option B</Label>
                        <Input required value={newQ.optionB} onChange={e => setNewQ({...newQ, optionB: e.target.value})} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Option C</Label>
                        <Input required value={newQ.optionC} onChange={e => setNewQ({...newQ, optionC: e.target.value})} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Option D</Label>
                        <Input required value={newQ.optionD} onChange={e => setNewQ({...newQ, optionD: e.target.value})} className="rounded-xl" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-semibold">Correct Answer</Label>
                        <Select value={newQ.correctAnswer} onValueChange={v => setNewQ({...newQ, correctAnswer: v})}>
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Select correct option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Option A</SelectItem>
                            <SelectItem value="B">Option B</SelectItem>
                            <SelectItem value="C">Option C</SelectItem>
                            <SelectItem value="D">Option D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-semibold">Marks</Label>
                        <Input required type="number" min={1} value={newQ.marks} onChange={e => setNewQ({...newQ, marks: e.target.value as any})} className="h-12 rounded-xl" />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-border/50">
                      <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="rounded-xl px-6">Cancel</Button>
                      <Button type="submit" disabled={isCreating} className="rounded-xl px-8 shadow-md">
                        {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
                        Save Question
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {exam.questions?.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-border">
                  <p className="text-muted-foreground">No MCQ questions added yet.</p>
                </div>
              ) : (
                exam.questions?.map((q: any, i: number) => (
                  <Card key={q.id} className="relative group overflow-hidden border-l-4 border-l-primary/50 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-4 w-full">
                          <div className="flex items-start gap-3">
                            <span className="font-bold text-lg text-primary">{i + 1}.</span>
                            <p className="font-semibold text-lg leading-relaxed">{q.questionText}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
                            {['A', 'B', 'C', 'D'].map(opt => {
                              const isCorrect = q.correctAnswer === opt;
                              return (
                                <div key={opt} className={`flex items-center gap-3 p-3 rounded-xl border ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-slate-50 dark:bg-slate-900/50 border-border/50'}`}>
                                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${isCorrect ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>{opt}</span>
                                  <span className={`text-sm ${isCorrect ? 'font-medium text-green-900 dark:text-green-300' : 'text-muted-foreground'}`}>{q[`option${opt}`]}</span>
                                  {isCorrect && <span className="ml-auto text-xs font-bold text-green-600 dark:text-green-500 tracking-wider">CORRECT</span>}
                                </div>
                              )
                            })}
                          </div>
                          
                          <div className="pl-8 pt-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                              {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                            </span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(q.id)}
                          disabled={isDeleting}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-delete-question-${q.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Coding Questions Tab */}
          <TabsContent value="coding">
            <div className="flex justify-end mb-4">
              {!isCodingFormOpen && (
                <Button
                  onClick={() => setIsCodingFormOpen(true)}
                  className="rounded-xl shadow-md h-11 px-6"
                  data-testid="button-add-coding-question"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Coding Question
                </Button>
              )}
            </div>

            {isCodingFormOpen && (
              <Card className="border-indigo-300/40 shadow-lg rounded-3xl mb-6">
                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 rounded-t-3xl border-b border-border/50">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-indigo-500" /> New Coding Question
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleCreateCodingQ} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-semibold">Title</Label>
                        <Input required value={newCodingQ.title} onChange={e => setNewCodingQ({...newCodingQ, title: e.target.value})} className="h-11 rounded-xl" placeholder="e.g. Reverse a String" data-testid="input-coding-title" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-semibold">Language</Label>
                        <Select value={newCodingQ.language} onValueChange={v => setNewCodingQ({...newCodingQ, language: v})}>
                          <SelectTrigger className="h-11 rounded-xl" data-testid="select-coding-language">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="javascript">JavaScript</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-semibold">Problem Description</Label>
                      <Textarea required value={newCodingQ.description} onChange={e => setNewCodingQ({...newCodingQ, description: e.target.value})} className="rounded-xl min-h-[100px]" placeholder="Describe the problem clearly..." data-testid="textarea-coding-description" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Sample Input <span className="text-muted-foreground text-xs">(optional)</span></Label>
                        <Textarea value={newCodingQ.sampleInput} onChange={e => setNewCodingQ({...newCodingQ, sampleInput: e.target.value})} className="rounded-xl font-mono text-sm" placeholder='"hello"' />
                      </div>
                      <div className="space-y-2">
                        <Label>Sample Output <span className="text-muted-foreground text-xs">(optional)</span></Label>
                        <Textarea value={newCodingQ.sampleOutput} onChange={e => setNewCodingQ({...newCodingQ, sampleOutput: e.target.value})} className="rounded-xl font-mono text-sm" placeholder='"olleh"' />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Starter Code <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <Textarea value={newCodingQ.starterCode} onChange={e => setNewCodingQ({...newCodingQ, starterCode: e.target.value})} className="rounded-xl font-mono text-sm min-h-[80px]" placeholder="// Provide initial code structure..." />
                    </div>

                    <div className="space-y-2 max-w-[180px]">
                      <Label className="font-semibold">Marks</Label>
                      <Input type="number" min={1} value={newCodingQ.marks} onChange={e => setNewCodingQ({...newCodingQ, marks: Number(e.target.value)})} className="h-11 rounded-xl" data-testid="input-coding-marks" />
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-border/50">
                      <Button type="button" variant="ghost" onClick={() => setIsCodingFormOpen(false)} className="rounded-xl px-6">Cancel</Button>
                      <Button type="submit" disabled={isCreatingCoding} className="rounded-xl px-8 shadow-md" data-testid="button-save-coding-question">
                        {isCreatingCoding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Save Coding Question
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {loadingCoding ? (
                <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
              ) : codingQuestions.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-border">
                  <Code2 className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-muted-foreground">No coding questions yet. Add one above.</p>
                </div>
              ) : (
                codingQuestions.map((q, i) => (
                  <Card key={q.id} className="relative group overflow-hidden border-l-4 border-l-indigo-400/60 shadow-sm rounded-2xl" data-testid={`card-coding-question-${q.id}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-3 w-full">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-bold text-lg text-indigo-500">{i + 1}.</span>
                            <p className="font-semibold text-lg">{q.title}</p>
                            <Badge className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700">
                              {LANGUAGE_LABELS[q.language] || q.language}
                            </Badge>
                            <Badge variant="outline">{q.marks} marks</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed pl-8 line-clamp-3">{q.description}</p>
                          {(q.sampleInput || q.sampleOutput) && (
                            <div className="pl-8 flex gap-4 flex-wrap">
                              {q.sampleInput && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1 font-medium">Input</p>
                                  <pre className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg font-mono">{q.sampleInput}</pre>
                                </div>
                              )}
                              {q.sampleOutput && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1 font-medium">Output</p>
                                  <pre className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg font-mono">{q.sampleOutput}</pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCodingQ(q.id)}
                          disabled={isDeletingCoding === q.id}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-delete-coding-${q.id}`}
                        >
                          {isDeletingCoding === q.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
