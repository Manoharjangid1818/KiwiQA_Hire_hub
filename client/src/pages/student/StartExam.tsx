import { useState, useEffect, useRef } from "react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useExam } from "@/hooks/use-exams";
import { useStartAttempt } from "@/hooks/use-attempts";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, FileText, Loader2, AlertTriangle, Camera, Monitor, Eye, XCircle, CheckCircle2, PowerOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProctoringStep = 'instructions' | 'permissions' | 'ready';

export default function StartExam() {
  const [, params] = useRoute("/student/exams/:id/start");
  const examId = params ? parseInt(params.id) : 0;
  
  const { data: exam, isLoading } = useExam(examId);
  const { mutateAsync: startAttempt, isPending } = useStartAttempt();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [acceptedInstructions, setAcceptedInstructions] = useState(false);
  const [proctoringStep, setProctoringStep] = useState<ProctoringStep>('instructions');
  
  // Camera/Mic permission states
  const [cameraStatus, setCameraStatus] = useState<'waiting' | 'connected' | 'denied'>('waiting');
  const [micStatus, setMicStatus] = useState<'waiting' | 'connected' | 'denied'>('waiting');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Check if exam is disabled
  const isExamDisabled = exam && exam.isEnabled === false;
  const requireCamera = exam?.requireCamera || false;

  // Initialize camera and microphone
  const initializeMedia = async () => {
    try {
      // Request camera
      const videoStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240, facingMode: "user" },
        audio: false
      });
      setCameraStream(videoStream);
      setCameraStatus('connected');
      
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setCameraStatus('denied');
    }

    try {
      // Request microphone
      const audioStream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });
      setMicStream(audioStream);
      setMicStatus('connected');
      
      // Set up audio level monitoring
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(audioStream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);
        
        const updateAudioLevel = () => {
          if (analyserRef.current) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(Math.min(100, average * 1.5));
          }
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        };
        updateAudioLevel();
      }
    } catch (err: any) {
      console.error('Microphone error:', err);
      setMicStatus('denied');
    }
  };

  // Clean up media streams
  const cleanupMedia = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      setMicStream(null);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMedia();
    };
  }, []);

  // Check if both permissions are granted
  const canStartExam = requireCamera 
    ? cameraStatus === 'connected' && micStatus === 'connected' 
    : true;

  const handleProceedToPermissions = () => {
    if (!acceptedInstructions) {
      toast({
        title: "Instructions Not Accepted",
        description: "Please accept the instructions to continue",
        variant: "destructive"
      });
      return;
    }
    setProctoringStep('permissions');
    initializeMedia();
  };

  const handleStartExam = async () => {
    if (requireCamera && !canStartExam) {
      toast({
        title: "Permissions Required",
        description: "Camera and microphone access are required to start the exam.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const attempt = await startAttempt(examId);
      toast({ title: "Exam Started", description: "Good luck!" });
      setLocation(`/student/take/${attempt.id}`);
    } catch (err: any) {
      toast({
        title: "Cannot start exam",
        description: err.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleRetryPermissions = () => {
    setCameraStatus('waiting');
    setMicStatus('waiting');
    initializeMedia();
  };

  if (isLoading) return (
    <ProtectedRoute requireRole="student">
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    </ProtectedRoute>
  );
  
  if (!exam) return (
    <ProtectedRoute requireRole="student">
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Exam not found</p>
      </div>
    </ProtectedRoute>
  );

  // Show disabled message if exam is disabled
  if (isExamDisabled) {
    return (
      <ProtectedRoute requireRole="student">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4">
          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden max-w-md w-full">
            <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 p-6">
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <PowerOff className="w-7 h-7" />
                Exam Unavailable
              </h1>
              <p className="text-red-100 mt-1">This exam is currently disabled</p>
            </div>
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <PowerOff className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-muted-foreground">
                This exam is currently disabled. Please contact your instructor for more information.
              </p>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => setLocation("/student")}
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  // Render permissions step
  if (proctoringStep === 'permissions') {
    const allPermissionsGranted = cameraStatus === 'connected' && micStatus === 'connected';
    
    return (
      <ProtectedRoute requireRole="student">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Camera className="w-7 h-7" />
                  Proctoring Setup
                </h1>
                <p className="text-blue-100 mt-1">Allow camera and microphone access to continue</p>
              </div>
              
              <CardContent className="p-8 space-y-6">
                {/* Camera Preview */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Camera Access (Video Proctoring)
                  </h2>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-40 h-30 bg-black rounded-xl overflow-hidden relative">
                      <video 
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {cameraStatus === 'waiting' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className={`flex items-center gap-2 p-3 rounded-lg ${
                        cameraStatus === 'connected' ? 'bg-green-100 dark:bg-green-900/30' : 
                        cameraStatus === 'denied' ? 'bg-red-100 dark:bg-red-900/30' : 
                        'bg-amber-100 dark:bg-amber-900/30'
                      }`}>
                        {cameraStatus === 'connected' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : cameraStatus === 'denied' ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                        )}
                        <span className={
                          cameraStatus === 'connected' ? 'text-green-700 dark:text-green-300' :
                          cameraStatus === 'denied' ? 'text-red-700 dark:text-red-300' :
                          'text-amber-700 dark:text-amber-300'
                        }>
                          {cameraStatus === 'connected' ? 'Camera Connected' : 
                           cameraStatus === 'denied' ? 'Camera Access Denied' : 
                           'Connecting...'}
                        </span>
                      </div>
                      
                      {cameraStatus === 'denied' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={handleRetryPermissions}
                        >
                          Retry Camera
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Microphone */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Mic className="w-5 h-5" />
                    Microphone Access (Audio Proctoring)
                  </h2>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-40 h-30 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                      {micStatus === 'connected' ? (
                        <div className="w-full px-4">
                          <div className="text-xs text-center mb-2 text-muted-foreground">Audio Level</div>
                          <Progress value={audioLevel} className="h-3" />
                        </div>
                      ) : micStatus === 'denied' ? (
                        <div className="text-center">
                          <MicOff className="w-8 h-8 mx-auto text-red-500 mb-2" />
                          <span className="text-sm text-red-500">Denied</span>
                        </div>
                      ) : (
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className={`flex items-center gap-2 p-3 rounded-lg ${
                        micStatus === 'connected' ? 'bg-green-100 dark:bg-green-900/30' : 
                        micStatus === 'denied' ? 'bg-red-100 dark:bg-red-900/30' : 
                        'bg-amber-100 dark:bg-amber-900/30'
                      }`}>
                        {micStatus === 'connected' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : micStatus === 'denied' ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                        )}
                        <span className={
                          micStatus === 'connected' ? 'text-green-700 dark:text-green-300' :
                          micStatus === 'denied' ? 'text-red-700 dark:text-red-300' :
                          'text-amber-700 dark:text-amber-300'
                        }>
                          {micStatus === 'connected' ? 'Microphone Connected' : 
                           micStatus === 'denied' ? 'Microphone Access Denied' : 
                           'Connecting...'}
                        </span>
                      </div>
                      
                      {micStatus === 'denied' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={handleRetryPermissions}
                        >
                          Retry Microphone
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Permission Error Message */}
                {requireCamera && !allPermissionsGranted && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-800 dark:text-red-300">Camera and microphone access are required to start the exam.</p>
                        <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                          Please allow access in your browser settings and click "Retry" to try again.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {(!requireCamera || allPermissionsGranted) && (
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <p className="font-semibold text-green-800 dark:text-green-300">
                        All permissions granted! You can start the exam.
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    variant="outline"
                    className="flex-1 h-12 text-base font-semibold rounded-xl"
                    onClick={() => {
                      cleanupMedia();
                      setProctoringStep('instructions');
                    }}
                  >
                    Back
                  </Button>
                  <Button 
                    className={`flex-1 h-12 text-base font-bold rounded-xl ${
                      allPermissionsGranted 
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-lg' : 
                        'bg-slate-400 cursor-not-allowed'
                    }`}
                    onClick={handleStartExam}
                    disabled={!allPermissionsGranted}
                  >
                    {isPending ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Starting...</>
                    ) : (
                      <><CheckCircle2 className="w-5 h-5 mr-2" /> Start Exam</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Default: Show instructions
  return (
    <ProtectedRoute requireRole="student">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Instructions Card */}
          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 p-6">
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Monitor className="w-7 h-7" />
                Exam Instructions
              </h1>
              <p className="text-emerald-100 mt-1">Please read all instructions carefully before starting</p>
            </div>
            
            <CardContent className="p-8 space-y-6">
              {/* Exam Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-5 text-center">
                  <Clock className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Duration</span>
                  <p className="text-2xl font-bold mt-1">{exam.durationMinutes} mins</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-5 text-center">
                  <FileText className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Total Marks</span>
                  <p className="text-2xl font-bold mt-1">{exam.totalMarks}</p>
                </div>
              </div>

              {/* Rules Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Important Rules & Guidelines
                </h2>
                
                <div className="space-y-3">
                  {/* Rule 1 - Tab Switch */}
                  <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800 dark:text-red-300">Do Not Switch Tabs</p>
                      <p className="text-sm text-red-700 dark:text-red-400">Switching to another tab or browser window will be detected and may result in automatic exam submission.</p>
                    </div>
                  </div>

                  {/* Rule 2 - Camera */}
                  <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                    <Camera className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-800 dark:text-amber-300">Webcam Must Remain Active</p>
                      <p className="text-sm text-amber-700 dark:text-amber-400">Your webcam must stay on throughout the exam. Any attempt to cover or disable the camera may result in disqualification.</p>
                    </div>
                  </div>

                  {/* Rule 3 - Microphone */}
                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                    <Mic className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-800 dark:text-blue-300">Microphone Must Stay On</p>
                      <p className="text-sm text-blue-700 dark:text-blue-400">Audio monitoring is active during the exam. Any suspicious audio activity will be flagged.</p>
                    </div>
                  </div>

                  {/* Rule 4 - Face Detection */}
                  <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-xl">
                    <Eye className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-800 dark:text-orange-300">Looking Away From Screen</p>
                      <p className="text-sm text-orange-700 dark:text-orange-400">Looking away from the laptop screen or camera for extended periods will trigger warnings. 4 warnings will auto-submit your exam.</p>
                    </div>
                  </div>

                  {/* Rule 5 - Time */}
                  <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 rounded-xl">
                    <Clock className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-purple-800 dark:text-purple-300">Time Limit</p>
                      <p className="text-sm text-purple-700 dark:text-purple-400">The exam will automatically submit when the time expires. Ensure you submit before the deadline.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning System Info */}
              <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-5">
                <h3 className="font-bold flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Warning System
                </h3>
                <p className="text-sm text-muted-foreground">
                  You will receive warnings for: tab switching, looking away from camera, camera/microphone disabled, or leaving the exam page. 
                  After <span className="font-bold text-red-600">4 warnings</span>, your exam will be automatically submitted.
                </p>
              </div>

              {/* Acceptance Checkbox */}
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="accept-instructions" 
                    checked={acceptedInstructions}
                    onCheckedChange={(checked) => setAcceptedInstructions(checked as boolean)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="accept-instructions" 
                    className="text-base font-semibold cursor-pointer leading-relaxed"
                  >
                    I have read and understood all the instructions above. I agree to abide by the exam rules and understand that 
                    any violation may result in automatic submission or disqualification of my exam.
                  </Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1 h-12 text-base font-semibold rounded-xl"
                  onClick={() => setLocation("/student")}
                >
                  Go Back
                </Button>
                <Button 
                  className="flex-1 h-12 text-base font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-lg hover:shadow-emerald-500/30 transition-all"
                  onClick={handleProceedToPermissions}
                  disabled={!acceptedInstructions}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Continue to Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

