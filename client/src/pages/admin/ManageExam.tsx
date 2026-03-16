import { useState } from "react";
import { useRoute, Link } from "wouter";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useExam } from "@/hooks/use-exams";
import { useCreateQuestion, useDeleteQuestion } from "@/hooks/use-questions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Plus, Trash2, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ManageExam() {
  const [, params] = useRoute("/admin/exams/:id");
  const examId = params ? parseInt(params.id) : 0;
  
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
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="bg-secondary px-2.5 py-0.5 rounded-full">{exam.durationMinutes} Minutes</span>
              <span className="bg-secondary px-2.5 py-0.5 rounded-full">{exam.totalMarks} Total Marks</span>
              <span className="bg-secondary px-2.5 py-0.5 rounded-full">{exam.questions?.length || 0} Questions</span>
            </div>
          </div>
          {!isFormOpen && (
            <Button onClick={() => setIsFormOpen(true)} className="rounded-xl shadow-md h-11 px-6">
              <Plus className="w-4 h-4 mr-2" /> Add Question
            </Button>
          )}
        </div>

        {isFormOpen && (
          <Card className="border-primary/30 shadow-lg shadow-primary/5 rounded-3xl">
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

        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" /> Question Bank
          </h3>
          
          {exam.questions?.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-border">
              <p className="text-muted-foreground">No questions added yet. Create one above.</p>
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
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
