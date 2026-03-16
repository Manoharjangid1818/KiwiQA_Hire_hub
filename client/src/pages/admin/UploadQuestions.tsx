import { useState } from "react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useExams } from "@/hooks/use-exams";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UploadQuestions() {
  const { data: exams, isLoading: loadingExams } = useExams();
  const { toast } = useToast();

  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; totalInserted?: number; message?: string; errors?: string[] } | null>(null);

  // Filter and validate exams to ensure they have valid ids
  const validExams = exams?.filter((exam: any) => exam.id != null) || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast({
          title: "Invalid File",
          description: "Please select a CSV file",
          variant: "destructive"
        });
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedExamId) {
      toast({
        title: "Select Exam",
        description: "Please select an exam first",
        variant: "destructive"
      });
      return;
    }

    if (!file) {
      toast({
        title: "Select File",
        description: "Please select a CSV file to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("examId", selectedExamId);

      const token = localStorage.getItem("kiwiqa_token");
      const response = await fetch("/api/admin/upload-questions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          totalInserted: data.totalInserted,
          message: data.message,
          errors: data.errors
        });
        toast({
          title: "Upload Successful",
          description: `${data.totalInserted} questions uploaded successfully`,
        });
      } else {
        setResult({
          success: false,
          message: data.message
        });
        toast({
          title: "Upload Failed",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred during upload"
      });
      toast({
        title: "Error",
        description: "An error occurred during upload",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSampleCSV = () => {
    // CSV format as per requirements: Question,OptionA,OptionB,OptionC,OptionD,CorrectAnswer
    const sampleCSV = `Question,OptionA,OptionB,OptionC,OptionD,CorrectAnswer,Marks
What is the capital of France?,Berlin,Madrid,Paris,Rome,C,1
2 + 2 = ?,3,4,5,6,B,1
What is the largest ocean?,Atlantic,Indian,Arctic,Pacific,D,1
Which planet is known as the Red Planet?,Venus,Mars,Jupiter,Saturn,B,1
What is 5 x 5?,20,25,30,35,B,1
What is the capital of Japan?,Seoul,Tokyo,Beijing,Bangkok,B,1
Which is a programming language?,HTML,Python,Excel,PowerPoint,B,2
What is the square root of 64?,6,7,8,9,C,1
What is 100 - 37?,53,63,73,83,B,1
Which element has the chemical symbol O?,Gold,Oxygen,Silver,Iron,B,1`;

    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_questions.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute requireRole="admin">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Bulk Upload Questions</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Upload multiple questions at once using a CSV file
          </p>
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Exam Selection */}
            <div className="space-y-2">
              <Label htmlFor="exam">Select Exam</Label>
              {loadingExams ? (
                <div className="h-12 flex items-center text-muted-foreground">Loading exams...</div>
              ) : (
                <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Select an exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {validExams.length > 0 ? (
                      validExams.map((exam: any) => (
                        <SelectItem key={exam.id} value={exam.id.toString()}>
                          {exam.title}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">No exams available</div>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* File Input */}
            <div className="space-y-2">
              <Label htmlFor="file">Upload CSV File</Label>
              <Input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="h-12 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {file && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Selected: {file.name}
                </p>
              )}
            </div>

            {/* Sample CSV Download */}
            <div className="bg-muted/50 p-4 rounded-xl">
              <p className="text-sm text-muted-foreground mb-3">
                <strong>CSV Format:</strong> Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, Marks<br/>
                <span className="text-xs">Supported headers (case-insensitive): Question, QuestionText, OptionA/Option_A, OptionB/Option_B, etc.</span>
              </p>
              <p className="text-xs text-amber-600 mb-3">
                ✓ Supports 100+ questions • ✓ CorrectAnswer: A, B, C, or D • ✓ Marks: optional (default 1)
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSampleCSV}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download Sample CSV
              </Button>
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={isUploading || !selectedExamId || !file}
              className="w-full h-12 rounded-xl"
              size="lg"
            >
              {isUploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Questions
                </>
              )}
            </Button>

            {/* Result Message */}
            {result && (
              <div
                className={`p-4 rounded-xl ${
                  result.success
                    ? "bg-green-50 border border-green-200 dark:bg-green-900/20"
                    : "bg-red-50 border border-red-200 dark:bg-red-900/20"
                }`}
              >
                {result.success ? (
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">
                      {result.totalInserted} questions uploaded successfully!
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{result.message}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}

