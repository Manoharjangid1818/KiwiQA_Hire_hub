import { useState, useEffect, useCallback } from "react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Editor from "@monaco-editor/react";
import {
  Play, Send, ChevronLeft, ChevronRight, Code2, Terminal,
  CheckCircle2, AlertCircle, Clock, BookOpen
} from "lucide-react";

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

const STARTER_TEMPLATES: Record<string, string> = {
  javascript: `// Write your solution here
function solution(input) {
  // Your code
  return result;
}

console.log(solution());`,
  python: `# Write your solution here
def solution(input_data):
    # Your code
    pass

print(solution(""))`,
  java: `// Write your solution here
public class Solution {
    public static void main(String[] args) {
        // Your code here
        System.out.println("Hello, World!");
    }
}`,
};

function CodingExamContent() {
  const params = useParams<{ examId: string }>();
  const examId = Number(params.examId);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState<Record<number, string>>({});
  const [output, setOutput] = useState<Record<number, { stdout: string; stderr: string; running: boolean }>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  const { data: questions, isLoading } = useQuery<CodingQuestion[]>({
    queryKey: [`/api/exams/${examId}/coding-questions`],
    enabled: !!examId,
  });

  const currentQuestion = questions?.[currentIndex];

  // Initialize code when question changes
  useEffect(() => {
    if (currentQuestion && !code[currentQuestion.id]) {
      const lang = currentQuestion.language || language;
      setLanguage(lang);
      setCode(prev => ({
        ...prev,
        [currentQuestion.id]: currentQuestion.starterCode || STARTER_TEMPLATES[lang] || ""
      }));
    } else if (currentQuestion) {
      setLanguage(currentQuestion.language || language);
    }
  }, [currentQuestion?.id]);

  // Anti-cheat: detect tab switching
  useEffect(() => {
    let violations = 0;
    const handleVisibility = () => {
      if (document.hidden) {
        violations++;
        toast({
          title: "Warning: Tab Switch Detected",
          description: `Violation #${violations}. Switching tabs during a coding exam is not allowed.`,
          variant: "destructive",
        });
      }
    };

    // Detect DevTools (width trick)
    const devtoolsCheck = setInterval(() => {
      const threshold = 160;
      if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
        toast({
          title: "Warning: DevTools Detected",
          description: "Developer tools are not allowed during the exam.",
          variant: "destructive",
        });
      }
    }, 3000);

    // Detect screen resize
    const handleResize = () => {
      toast({
        title: "Warning: Screen Resize Detected",
        description: "Please keep your browser window at a fixed size during the exam.",
        variant: "destructive",
      });
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      clearInterval(devtoolsCheck);
    };
  }, []);

  const handleRunCode = useCallback(async () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const currentCode = code[qId] || "";

    setOutput(prev => ({ ...prev, [qId]: { stdout: "", stderr: "", running: true } }));

    try {
      const res = await apiRequest("POST", "/api/coding/execute", {
        code: currentCode,
        language,
      });
      const data = await res.json();
      setOutput(prev => ({
        ...prev,
        [qId]: { stdout: data.output || "", stderr: data.error || "", running: false }
      }));
    } catch (e: any) {
      setOutput(prev => ({
        ...prev,
        [qId]: { stdout: "", stderr: e.message || "Execution failed", running: false }
      }));
    }
  }, [currentQuestion, code, language]);

  const handleSubmitSolution = useCallback(async () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const currentCode = code[qId] || "";
    const currentOutput = output[qId];

    try {
      await apiRequest("POST", "/api/coding/submit", {
        questionId: qId,
        code: currentCode,
        language,
        output: currentOutput?.stdout || "",
      });
      setSubmitted(prev => ({ ...prev, [qId]: true }));
      toast({
        title: "Solution Submitted",
        description: `Your solution for "${currentQuestion.title}" has been saved.`,
      });
    } catch (e: any) {
      toast({
        title: "Submission Failed",
        description: e.message || "Could not submit solution. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentQuestion, code, language, output]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500">Loading coding questions…</div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <Code2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No Coding Questions</h2>
            <p className="text-gray-500 text-sm mb-4">This exam does not have any coding questions yet.</p>
            <Button onClick={() => setLocation("/student")} data-testid="button-back-student">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const q = currentQuestion!;
  const qCode = code[q.id] || STARTER_TEMPLATES[language] || "";
  const qOutput = output[q.id];
  const isSubmitted = !!submitted[q.id];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/student")}
            className="text-gray-400 hover:text-white"
            data-testid="button-back-student"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Exit
          </Button>
          <Separator orientation="vertical" className="h-5 bg-gray-700" />
          <Code2 className="h-5 w-5 text-indigo-400" />
          <span className="font-semibold text-white">Coding Assessment</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-gray-400 border-gray-700">
            <BookOpen className="h-3 w-3 mr-1" />
            {questions.length} Question{questions.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Question Panel */}
        <div className="w-96 bg-gray-900 border-r border-gray-800 flex flex-col overflow-y-auto">
          {/* Question navigation */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Question {currentIndex + 1} of {questions.length}</span>
              <div className="flex gap-1">
                {questions.map((qu, i) => (
                  <button
                    key={qu.id}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                      i === currentIndex
                        ? "bg-indigo-600 text-white"
                        : submitted[qu.id]
                        ? "bg-green-700 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    data-testid={`button-question-nav-${i}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(i => i - 1)}
                className="text-gray-400 hover:text-white"
                data-testid="button-prev-question"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex(i => i + 1)}
                className="text-gray-400 hover:text-white"
                data-testid="button-next-question"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Question details */}
          <div className="p-4 flex-1">
            <div className="flex items-center gap-2 mb-3">
              {isSubmitted && <CheckCircle2 className="h-4 w-4 text-green-400" />}
              <h2 className="text-base font-semibold text-white">{q.title}</h2>
            </div>
            <div className="flex gap-2 mb-4">
              <Badge className="bg-indigo-900/50 text-indigo-300 border-indigo-700">
                {LANGUAGE_LABELS[q.language] || q.language}
              </Badge>
              <Badge className="bg-gray-800 text-gray-300 border-gray-700">
                {q.marks} marks
              </Badge>
              {isSubmitted && (
                <Badge className="bg-green-900/50 text-green-300 border-green-700">
                  Submitted
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap mb-4">
              {q.description}
            </div>

            {(q.sampleInput || q.sampleOutput) && (
              <div className="space-y-3">
                {q.sampleInput && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Sample Input</p>
                    <pre className="bg-gray-800 rounded p-2 text-xs text-green-300 overflow-x-auto">
                      {q.sampleInput}
                    </pre>
                  </div>
                )}
                {q.sampleOutput && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Sample Output</p>
                    <pre className="bg-gray-800 rounded p-2 text-xs text-yellow-300 overflow-x-auto">
                      {q.sampleOutput}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Editor + Output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor toolbar */}
          <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Select
                value={language}
                onValueChange={val => {
                  setLanguage(val);
                  if (!code[q.id]) {
                    setCode(prev => ({ ...prev, [q.id]: STARTER_TEMPLATES[val] || "" }));
                  }
                }}
              >
                <SelectTrigger
                  className="w-40 h-8 bg-gray-800 border-gray-700 text-gray-200 text-sm"
                  data-testid="select-language"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 h-8"
                onClick={handleRunCode}
                disabled={qOutput?.running}
                data-testid="button-run-code"
              >
                {qOutput?.running ? (
                  <><Clock className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Running…</>
                ) : (
                  <><Play className="h-3.5 w-3.5 mr-1.5 fill-green-400 text-green-400" /> Run Code</>
                )}
              </Button>
              <Button
                size="sm"
                className={`h-8 ${isSubmitted ? "bg-green-700 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
                onClick={handleSubmitSolution}
                disabled={isSubmitted}
                data-testid="button-submit-solution"
              >
                {isSubmitted ? (
                  <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Submitted</>
                ) : (
                  <><Send className="h-3.5 w-3.5 mr-1.5" /> Submit</>
                )}
              </Button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language === "python" ? "python" : language === "java" ? "java" : "javascript"}
              value={qCode}
              onChange={val => {
                setCode(prev => ({ ...prev, [q.id]: val || "" }));
              }}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                lineNumbers: "on",
                renderLineHighlight: "line",
                cursorBlinking: "smooth",
              }}
            />
          </div>

          {/* Output panel */}
          <div className="bg-gray-950 border-t border-gray-800 h-44 flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 bg-gray-900">
              <Terminal className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400 font-medium">Output</span>
              {qOutput?.stderr && (
                <Badge variant="destructive" className="ml-auto text-xs">Error</Badge>
              )}
              {qOutput && !qOutput.stderr && !qOutput.running && (
                <Badge className="ml-auto bg-green-800 text-green-200 border-green-700 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Success
                </Badge>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm" data-testid="div-output">
              {!qOutput || qOutput.running ? (
                <span className="text-gray-600">
                  {qOutput?.running ? "Running code…" : "Click 'Run Code' to see output here."}
                </span>
              ) : qOutput.stderr ? (
                <div>
                  {qOutput.stdout && (
                    <pre className="text-gray-300 mb-2 whitespace-pre-wrap">{qOutput.stdout}</pre>
                  )}
                  <pre className="text-red-400 whitespace-pre-wrap">
                    <AlertCircle className="inline h-3 w-3 mr-1" />
                    {qOutput.stderr}
                  </pre>
                </div>
              ) : (
                <pre className="text-green-300 whitespace-pre-wrap">{qOutput.stdout || "(no output)"}</pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CodingExam() {
  return (
    <ProtectedRoute requiredRole="student">
      <CodingExamContent />
    </ProtectedRoute>
  );
}
