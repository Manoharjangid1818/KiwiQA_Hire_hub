import { useState, useEffect, useRef, useCallback } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Clock, Camera, CameraOff, AlertTriangle, Timer, CheckCircle, ChevronLeft, ChevronRight, Eye, EyeOff, Mic, MicOff, Minimize, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FixedBottomBar } from "@/components/layout/FixedBottomBar";

const MAX_WARNINGS = 5;
const FACE_CHECK_INTERVAL = 3000;
const FULLSCREEN_CHECK_INTERVAL = 1000;

let faceLandmarksDetection: any = null;
let tf: any = null;
let faceMesh: any = null;

const loadFaceDetectionModels = async () => {
  if (faceLandmarksDetection) return;
  try {
    tf = await import("@tensorflow/tfjs");
    await import("@tensorflow/tfjs-backend-webgl");
    await tf.setBackend("webgl");
    await tf.ready();
    faceLandmarksDetection = await import("@tensorflow-models/face-landmarks-detection");
    faceMesh = await faceLandmarksDetection.createDetector(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
      { runtime: "tfjs", refineLandmarks: true, maxFaces: 1 }
    );
    console.log("[PublicExam] Face detection loaded");
  } catch (err) {
    console.warn("[PublicExam] Face detection unavailable:", err);
  }
};

type Step = "loading" | "join" | "info" | "exam" | "done" | "error";

export default function PublicExam() {
  const [, params] = useRoute("/exam/:code");
  const code = params?.code || "";
  const { toast } = useToast();

  // Flow state
  const [step, setStep] = useState<Step>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [examData, setExamData] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [examStartedAt, setExamStartedAt] = useState<number | null>(null);

  // Join form
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Exam state
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Permission check state
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Proctoring state
  const [warnings, setWarnings] = useState(0);
  const [warningType, setWarningType] = useState<string | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [photoCount, setPhotoCount] = useState(0);
  const [faceDetected, setFaceDetected] = useState(true);
  const [multipleFaces, setMultipleFaces] = useState(false);
  const [gazeStatus, setGazeStatus] = useState<"center" | "left" | "right" | "up" | "down" | "missing">("center");
  const [micEnabled, setMicEnabled] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [suspiciousAudio, setSuspiciousAudio] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const photoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const faceCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullscreenCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const answersRef = useRef<Record<number, string>>({});
  const sessionRef = useRef<any>(null);
  const attemptIdRef = useRef<number | null>(null);
  const warningsRef = useRef(0);
  const requireCameraRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const hasTerminatedRef = useRef(false);
  const tabSwitchCountRef = useRef(0);
  const lastTabSwitchRef = useRef<number | null>(null);
  const fullscreenExitCountRef = useRef(0);
  const faceLossStartRef = useRef<number | null>(null);
  const faceDetectedRef = useRef(true);
  const gazeStatusRef = useRef<"center" | "left" | "right" | "up" | "down" | "missing">("center");
  const noFaceTimeRef = useRef(0);

  // Keep refs in sync
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { sessionRef.current = session; }, [session]);
  useEffect(() => { attemptIdRef.current = attemptId; }, [attemptId]);
  useEffect(() => { warningsRef.current = warnings; }, [warnings]);
  useEffect(() => { faceDetectedRef.current = faceDetected; }, [faceDetected]);
  useEffect(() => { gazeStatusRef.current = gazeStatus; }, [gazeStatus]);

  // Fetch exam info on mount
  useEffect(() => {
    if (!code) {
      setErrorMsg("Invalid exam link.");
      setStep("error");
      return;
    }
    fetch(`/api/public/exam/${code}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Exam not found");
        }
        return res.json();
      })
      .then((data) => {
        console.log("[PublicExam] Exam fetched:", data.exam?.title, "Questions:", data.exam?.questions?.length);
        setExamData(data);
        requireCameraRef.current = data.exam?.requireCamera || false;
        const qs = data.exam?.questions || [];
        if (qs.length === 0) {
          setErrorMsg("This exam has no questions yet. Please contact the exam administrator.");
          setStep("error");
        } else {
          // Shuffle questions
          const shuffled = [...qs].sort(() => Math.random() - 0.5);
          setQuestions(shuffled);
          setStep("join");
        }
      })
      .catch((err) => {
        console.error("[PublicExam] Fetch error:", err);
        setErrorMsg(err.message || "Failed to load exam.");
        setStep("error");
      });
  }, [code]);

  // Log proctoring activity (non-blocking)
  const logActivity = useCallback((activityType: string, warningCount: number) => {
    const sid = sessionRef.current?.id;
    const aid = attemptIdRef.current;
    if (!sid) return;
    fetch(`/api/public/sessions/${sid}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId: aid || 0, activityType, warningCount, details: `${activityType} - Warning ${warningCount}` })
    }).catch(() => {});
  }, []);

  // Add warning
  const addWarning = useCallback((type: string) => {
    if (isSubmittingRef.current || hasTerminatedRef.current) return;
    const newCount = warningsRef.current + 1;
    setWarnings(newCount);
    setWarningType(type);
    warningsRef.current = newCount;
    toast({ title: `Warning ${newCount}/${MAX_WARNINGS}`, description: `${type}. ${MAX_WARNINGS - newCount} remaining before auto-submit.`, variant: "destructive", duration: 5000 });
    logActivity(type, newCount);
    if (newCount >= MAX_WARNINGS) {
      toast({ title: "Maximum warnings reached", description: "Auto-submitting your exam...", variant: "destructive" });
      setTimeout(() => submitExam(answersRef.current, true), 2000);
    }
  }, [toast, logActivity]);

  // Capture photo
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    setPhotoCount((p) => p + 1);
  }, []);

  // Check gaze / face
  const checkGaze = useCallback(async () => {
    if (!videoRef.current || !faceMesh) return;
    try {
      const faces = await faceMesh.estimateFaces(videoRef.current);
      if (faces.length === 0) {
        if (faceDetectedRef.current) {
          faceLossStartRef.current = Date.now();
          toast({ title: "Face Lost", description: "Please face the camera. 15 second limit.", variant: "destructive" });
        } else if (faceLossStartRef.current && Date.now() - faceLossStartRef.current >= 15000 && !hasTerminatedRef.current) {
          hasTerminatedRef.current = true;
          toast({ title: "Exam Terminated", description: "Face not detected for 15+ seconds.", variant: "destructive" });
          setTimeout(() => submitExam(answersRef.current, true), 2000);
        }
        setFaceDetected(false);
        setGazeStatus("missing");
        faceDetectedRef.current = false;
        return;
      }
      faceLossStartRef.current = null;
      if (!faceDetectedRef.current) { setFaceDetected(true); faceDetectedRef.current = true; }

      if (faces.length > 1 && !hasTerminatedRef.current) {
        hasTerminatedRef.current = true;
        setMultipleFaces(true);
        toast({ title: "Exam Terminated", description: "Multiple faces detected.", variant: "destructive" });
        setTimeout(() => submitExam(answersRef.current, true), 2000);
        return;
      }
      setMultipleFaces(false);

      const lm = faces[0].keypoints;
      const l = lm[33], r = lm[133], rp = lm[473];
      const center = { x: (l.x + r.x) / 2, y: (l.y + r.y) / 2 };
      const ew = r.x - l.x;
      const ox = (rp.x - center.x) / ew;
      const oy = (rp.y - center.y) / ew;
      let gaze: "center" | "left" | "right" | "up" | "down" | "missing" = "center";
      if (ox < -0.15) gaze = "right";
      else if (ox > 0.15) gaze = "left";
      else if (oy < -0.2) gaze = "down";
      else if (oy > 0.2) gaze = "up";
      setGazeStatus(gaze);
      if (gaze !== "center") {
        const labels: Record<string, string> = { left: "Looking left", right: "Looking right", up: "Looking up", down: "Looking down" };
        addWarning(labels[gaze]);
      }
    } catch (err) {
      console.warn("[PublicExam] Gaze error:", err);
    }
  }, [addWarning, toast]);

  // Fullscreen check
  const checkFullscreen = useCallback(() => {
    const fs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement);
    if (requireCameraRef.current && !fs && isFullscreen && !hasTerminatedRef.current) {
      fullscreenExitCountRef.current += 1;
      logActivity("fullscreen_exit", fullscreenExitCountRef.current);
      if (fullscreenExitCountRef.current >= 2) {
        hasTerminatedRef.current = true;
        toast({ title: "Exam Terminated", description: "Too many fullscreen exits.", variant: "destructive" });
        setTimeout(() => submitExam(answersRef.current, true), 2000);
      } else {
        toast({ title: `Fullscreen Exit ${fullscreenExitCountRef.current}/2`, description: "Please stay in fullscreen.", variant: "destructive" });
      }
    }
    setIsFullscreen(fs);
  }, [isFullscreen, logActivity, toast]);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setIsLoadingModels(true);
      try { await loadFaceDetectionModels(); setModelsLoaded(true); } catch { /* continue */ }
      setIsLoadingModels(false);

      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = async () => {
          try { await videoRef.current?.play(); } catch {}
        };
      }
      setCameraEnabled(true);
      setCameraError(null);

      try {
        const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = mic;
        setMicEnabled(true);
        audioContextRef.current = new AudioContext();
        const src = audioContextRef.current.createMediaStreamSource(mic);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        src.connect(analyserRef.current);
        const updateAudio = () => {
          if (!analyserRef.current) return;
          const data = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(data);
          const avg = Math.min(100, (data.reduce((a, b) => a + b, 0) / data.length) * 1.5);
          setAudioLevel(avg);
          if (avg > 70 && !suspiciousAudio) { setSuspiciousAudio(true); addWarning("Suspicious audio detected"); }
          else if (avg <= 70) setSuspiciousAudio(false);
          animationFrameRef.current = requestAnimationFrame(updateAudio);
        };
        updateAudio();
      } catch { setMicEnabled(false); }

      if (faceMesh) faceCheckIntervalRef.current = setInterval(checkGaze, FACE_CHECK_INTERVAL);
      photoIntervalRef.current = setInterval(capturePhoto, 25000);
      fullscreenCheckIntervalRef.current = setInterval(checkFullscreen, FULLSCREEN_CHECK_INTERVAL);
      setTimeout(capturePhoto, 2000);
    } catch (err: any) {
      setIsLoadingModels(false);
      const msg = err.name === "NotAllowedError" ? "Camera access denied. Please allow camera in browser settings." :
        err.name === "NotFoundError" ? "No camera found." : `Camera error: ${err.message}`;
      setCameraError(msg);
      setCameraEnabled(false);
      addWarning("Camera access denied");
    }
  }, [capturePhoto, checkGaze, checkFullscreen, addWarning, suspiciousAudio]);

  // Stop camera
  const stopCamera = useCallback(() => {
    [streamRef, micStreamRef].forEach(ref => { if (ref.current) { ref.current.getTracks().forEach(t => t.stop()); ref.current = null; } });
    if (audioContextRef.current) { audioContextRef.current.close(); audioContextRef.current = null; }
    [photoIntervalRef, faceCheckIntervalRef, fullscreenCheckIntervalRef].forEach(ref => { if (ref.current) { clearInterval(ref.current); ref.current = null; } });
    if (animationFrameRef.current) { cancelAnimationFrame(animationFrameRef.current); animationFrameRef.current = null; }
    setCameraEnabled(false);
    setMicEnabled(false);
  }, []);

  // Check camera and microphone permissions before exam starts
  const checkCameraPermission = useCallback(async () => {
    setIsCheckingPermission(true);
    setPermissionError(null);
    let tempStream: MediaStream | null = null;
    try {
      tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setPermissionGranted(true);
      setPermissionError(null);
    } catch (err: any) {
      setPermissionGranted(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionError("Camera and microphone access denied. Please allow access in your browser settings and try again.");
      } else if (err.name === "NotFoundError") {
        setPermissionError("No camera or microphone found. Please connect a device and try again.");
      } else {
        setPermissionError(`Permission error: ${err.message}`);
      }
    } finally {
      if (tempStream) tempStream.getTracks().forEach(t => t.stop());
      setIsCheckingPermission(false);
    }
  }, []);

  // Ensure video plays when camera is enabled (fix for browsers that don't auto-play)
  useEffect(() => {
    if (cameraEnabled && videoRef.current && streamRef.current) {
      if (!videoRef.current.srcObject) {
        videoRef.current.srcObject = streamRef.current;
      }
      videoRef.current.play().catch(() => {});
    }
  }, [cameraEnabled]);

  // Tab switch detection
  useEffect(() => {
    if (step !== "exam") return;
    const onVisibility = () => {
      if (document.visibilityState !== "hidden" || hasSubmitted || isSubmittingRef.current || hasTerminatedRef.current) return;
      const now = Date.now();
      if (lastTabSwitchRef.current && now - lastTabSwitchRef.current < 5000) return;
      lastTabSwitchRef.current = now;
      tabSwitchCountRef.current += 1;
      logActivity("tab_switch", tabSwitchCountRef.current);
      if (tabSwitchCountRef.current >= 3) {
        hasTerminatedRef.current = true;
        toast({ title: "Exam Terminated", description: "Too many tab switches.", variant: "destructive" });
        setTimeout(() => submitExam(answersRef.current, true), 2000);
      } else {
        toast({ title: `Tab Switch ${tabSwitchCountRef.current}/3`, description: "Stay on the exam tab.", variant: "destructive" });
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey && ["c","v","x","u"].includes(e.key)) || (e.ctrlKey && e.shiftKey && ["I","i"].includes(e.key)) || e.key === "F12" || (e.altKey && e.key === "Tab")) {
        e.preventDefault();
        addWarning("Developer tools or copy/paste blocked");
      }
    };
    const onContext = (e: MouseEvent) => e.preventDefault();
    const onCopy = (e: ClipboardEvent) => e.preventDefault();
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("keydown", onKey);
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("copy", onCopy);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("copy", onCopy);
    };
  }, [step, hasSubmitted, addWarning, logActivity, toast]);

  // Timer
  useEffect(() => {
    if (step !== "exam" || !examStartedAt || !examData?.exam?.durationMinutes) return;
    const endMs = examStartedAt + examData.exam.durationMinutes * 60 * 1000;
    const tick = () => {
      const remaining = Math.max(0, Math.floor((endMs - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        toast({ title: "Time's up!", description: "Submitting your exam..." });
        submitExam(answersRef.current, false);
      }
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [step, examStartedAt, examData]);

  // Camera init when exam step reached
  useEffect(() => {
    if (step === "exam" && requireCameraRef.current) startCamera();
    return () => { if (step !== "exam") stopCamera(); };
  }, [step, startCamera, stopCamera]);

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  // --- Actions ---

  const handleJoin = async () => {
    if (!studentName.trim() || !studentEmail.trim()) {
      toast({ title: "Required", description: "Please enter your name and email.", variant: "destructive" });
      return;
    }
    setIsJoining(true);
    try {
      const res = await fetch(`/api/public/exam/${code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName: studentName.trim(), studentEmail: studentEmail.trim().toLowerCase() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to join");
      console.log("[PublicExam] Joined, session:", data.session?.id);
      setSession(data.session);
      setStep("info");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsJoining(false);
    }
  };

  const handleStartExam = async () => {
    if (!session) return;
    setIsStarting(true);
    try {
      const res = await fetch(`/api/public/sessions/${session.id}/start-attempt`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to start exam");
      const aid = data.attemptId;
      const startedAt = data.startedAt ? new Date(data.startedAt).getTime() : Date.now();
      console.log("[PublicExam] Attempt created:", aid, "startedAt:", startedAt);
      setAttemptId(aid);
      setExamStartedAt(startedAt);
      setStep("exam");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsStarting(false);
    }
  };

  const submitExam = useCallback(async (finalAnswers: Record<number, string>, isAuto: boolean) => {
    if (hasSubmitted || isSubmittingRef.current) return;
    if (!sessionRef.current || !attemptIdRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setHasSubmitted(true);
    stopCamera();

    const formatted = questions.map((q) => ({ questionId: q.id, selectedAnswer: finalAnswers[q.id] || null }));
    try {
      const res = await fetch(`/api/public/sessions/${sessionRef.current.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId: attemptIdRef.current, answers: formatted })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submit failed");
      setScore(data.score ?? null);
      toast({ title: isAuto ? "Exam Auto-Submitted" : "Exam Submitted", description: "Your answers have been saved." });
      setStep("done");
    } catch (err: any) {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      setHasSubmitted(false);
      toast({ title: "Submit Error", description: err.message, variant: "destructive" });
    }
  }, [questions, stopCamera, toast, hasSubmitted]);

  const handleManualSubmit = () => {
    const answered = Object.keys(answers).filter(k => answers[parseInt(k)]).length;
    if (answered === 0) { toast({ title: "Cannot Submit", description: "Answer at least one question before submitting.", variant: "destructive" }); return; }
    if (!window.confirm("Submit your exam? You cannot change answers after submitting.")) return;
    submitExam(answers, false);
  };

  // --- Render helpers ---
  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const requireCamera = !!examData?.exam?.requireCamera;
  const question = questions[currentQ];
  const currentAnswer = answers[question?.id] || "";
  const isWarning = (timeLeft ?? Infinity) < 300;

  // ---- RENDER ----

  if (step === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (step === "error") return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Exam Unavailable</h1>
        <p className="text-muted-foreground">{errorMsg}</p>
      </div>
    </div>
  );

  if (step === "done") return (
    <div className="fixed inset-0 z-50 bg-green-600 dark:bg-green-800 flex items-center justify-center">
      <div className="text-center text-white p-8 max-w-2xl mx-auto">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        <h1 className="text-5xl font-bold mb-4">Thank You!</h1>
        <p className="text-2xl mb-8">Your exam has been submitted successfully.</p>
        {score !== null && (
          <div className="bg-white/20 rounded-xl p-6 mb-6">
            <p className="text-xl font-semibold">Your Score</p>
            <p className="text-4xl font-bold mt-2">{score} / {examData?.exam?.totalMarks ?? "?"}</p>
          </div>
        )}
        <div className="bg-white/20 rounded-xl p-6">
          <ul className="text-left space-y-2">
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Your answers have been saved</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Results recorded successfully</li>
          </ul>
        </div>
      </div>
    </div>
  );

  if (step === "join") return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">{examData?.exam?.title}</h1>
          {examData?.exam?.description && <p className="text-muted-foreground mt-2">{examData.exam.description}</p>}
        </div>
        <Card className="p-6 space-y-4 shadow-lg">
          <h2 className="text-xl font-semibold">Enter Your Details</h2>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" data-testid="input-student-name" placeholder="Your full name" value={studentName} onChange={e => setStudentName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleJoin()} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" data-testid="input-student-email" type="email" placeholder="your@email.com" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleJoin()} />
          </div>
          <Button data-testid="button-join-exam" className="w-full" size="lg" onClick={handleJoin} disabled={isJoining}>
            {isJoining ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Continue to Exam
          </Button>
        </Card>
      </div>
    </div>
  );

  if (step === "info") return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background p-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{examData?.exam?.title}</h1>
          <p className="text-muted-foreground mt-2">Hello, {studentName}! Please read the instructions before starting.</p>
        </div>
        <Card className="p-6 space-y-4 shadow-lg">
          <h2 className="text-xl font-semibold">Exam Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-2xl font-bold text-primary">{examData?.exam?.durationMinutes} min</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Questions</p>
              <p className="text-2xl font-bold text-primary">{questions.length}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Marks</p>
              <p className="text-2xl font-bold text-primary">{examData?.exam?.totalMarks}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Camera</p>
              <p className="text-lg font-bold text-primary">{requireCamera ? "Required" : "Not required"}</p>
            </div>
          </div>
          {requireCamera && (
            <div className="space-y-3">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 flex gap-3">
                <Camera className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-300">Camera & Microphone Required</p>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">You must grant camera and microphone access before starting. You will be monitored throughout the exam.</p>
                </div>
              </div>
              {!permissionGranted ? (
                <div className="space-y-2">
                  <Button
                    data-testid="button-check-permissions"
                    type="button"
                    variant="outline"
                    className="w-full h-11 rounded-xl border-amber-400 text-amber-700 hover:bg-amber-50"
                    onClick={checkCameraPermission}
                    disabled={isCheckingPermission}
                  >
                    {isCheckingPermission ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
                    {isCheckingPermission ? "Checking permissions..." : "Allow Camera & Microphone"}
                  </Button>
                  {permissionError && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">{permissionError}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">Camera & microphone access granted</p>
                </div>
              )}
            </div>
          )}
          <div className="bg-muted rounded-xl p-4 space-y-1 text-sm text-muted-foreground">
            <p>• Answer all questions using the options provided</p>
            <p>• You can navigate between questions freely</p>
            <p>• The exam will auto-submit when time runs out</p>
            {requireCamera && <p>• Stay in fullscreen and keep your face visible at all times</p>}
          </div>
          <Button
            data-testid="button-start-exam"
            className="w-full"
            size="lg"
            onClick={handleStartExam}
            disabled={isStarting || (requireCamera && !permissionGranted)}
          >
            {isStarting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isStarting ? "Starting..." : requireCamera && !permissionGranted ? "Grant Permissions to Start" : "Start Exam"}
          </Button>
        </Card>
      </div>
    </div>
  );

  // ---- EXAM STEP ----
  return (
    <div className="min-h-screen bg-background">
      <canvas ref={canvasRef} className="hidden" />

      {/* Warning banner */}
      {warnings > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-white py-2 px-4 flex items-center justify-center gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-bold">WARNING {warnings}/{MAX_WARNINGS}: {warningType}</span>
        </div>
      )}

      {/* Proctoring camera panel */}
      {requireCamera && (
        <div className="fixed bottom-20 right-4 z-40">
          {cameraEnabled ? (
            <div className="bg-black rounded-xl overflow-hidden shadow-xl border-2 border-white">
              <video ref={videoRef} autoPlay playsInline muted width={192} height={144} className="w-48 h-36 object-cover" />
              <div className="flex flex-wrap gap-1 p-1">
                <div className={`${gazeStatus === "center" && faceDetected ? "bg-green-600" : gazeStatus === "missing" ? "bg-red-600" : "bg-orange-500"} text-white text-xs px-2 py-1 rounded flex items-center gap-1`}>
                  {gazeStatus === "center" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {gazeStatus === "center" ? "OK" : gazeStatus === "missing" ? "No Face" : gazeStatus}
                </div>
                {micEnabled && (
                  <div className={`${audioLevel < 30 ? "bg-green-600" : audioLevel > 70 ? "bg-red-600" : "bg-blue-600"} text-white text-xs px-2 py-1 rounded flex items-center gap-1`}>
                    <Mic className="w-3 h-3" />{audioLevel.toFixed(0)}%
                  </div>
                )}
                <div className="bg-slate-700 text-white text-xs px-2 py-1 rounded">{photoCount}📷</div>
              </div>
            </div>
          ) : cameraError ? (
            <div className="bg-red-600 text-white p-3 rounded-xl shadow-xl max-w-xs">
              <div className="flex items-center gap-2"><CameraOff className="w-5 h-5" /><span className="text-sm font-medium">Camera Issue</span></div>
              <p className="text-xs mt-1 opacity-90">{cameraError}</p>
              <Button size="sm" variant="secondary" className="mt-2 w-full" onClick={startCamera}>Retry</Button>
            </div>
          ) : isLoadingModels ? (
            <div className="bg-blue-600 text-white p-3 rounded-xl shadow-xl flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Loading AI...</span>
            </div>
          ) : (
            <div className="bg-yellow-600 text-white p-3 rounded-xl shadow-xl flex items-center gap-2">
              <Camera className="w-5 h-5" /><span className="text-sm">Starting Camera...</span>
            </div>
          )}
        </div>
      )}

      {/* Warnings counter */}
      {warnings > 0 && (
        <div className="fixed top-16 right-4 z-40">
          <div className={`${warnings >= 3 ? "bg-red-600" : warnings >= 2 ? "bg-orange-500" : "bg-yellow-500"} text-white px-3 py-2 rounded-xl shadow-lg flex items-center gap-2`}>
            <XCircle className="w-4 h-4" /><span className="font-bold">{warnings}/{MAX_WARNINGS}</span>
          </div>
        </div>
      )}

      {/* Fullscreen reminder */}
      {requireCamera && !isFullscreen && step === "exam" && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 bg-amber-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
          <Minimize className="w-4 h-4" /><span className="text-sm font-medium">Please enable fullscreen for this exam</span>
        </div>
      )}

      {/* Main exam area */}
      <div className="max-w-4xl mx-auto pb-28 pt-6 px-4">
        {/* Header */}
        <div className={`sticky ${warnings > 0 ? "top-10" : "top-0"} z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md rounded-2xl shadow-sm border border-border p-4 mb-8 flex items-center justify-between`}>
          <div>
            <h2 className="font-bold text-lg hidden sm:block">{examData?.exam?.title}</h2>
            <p className="text-sm text-muted-foreground">Question {currentQ + 1} of {questions.length}</p>
          </div>
          {timeLeft !== null && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xl font-mono ${isWarning ? "bg-destructive/10 text-destructive animate-pulse" : "bg-primary/10 text-primary"}`}>
              <Timer className="w-5 h-5" />{formatTime(timeLeft)}
            </div>
          )}
          <Button data-testid="button-submit-header" onClick={handleManualSubmit} disabled={isSubmitting || hasSubmitted} variant="secondary" className="font-bold bg-green-500/10 text-green-700 hover:bg-green-500/20">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-1" />Submit</>}
          </Button>
        </div>

        {/* No questions fallback */}
        {questions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground text-lg">No questions available for this exam.</p>
          </Card>
        ) : (
          <Card className="p-8 shadow-md border-border/50 rounded-3xl mb-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-xl shrink-0">{currentQ + 1}</div>
              <div className="flex-1 space-y-6">
                <h3 className="text-2xl font-medium leading-relaxed">{question?.questionText}</h3>
                {!question?.optionA && !question?.optionB && !question?.optionC && !question?.optionD ? (
                  <p className="text-muted-foreground italic">No options available for this question.</p>
                ) : (
                  <div className="space-y-3 pt-4">
                    {(["A", "B", "C", "D"] as const).map((opt) => {
                      const val = question?.[`option${opt}`];
                      if (!val) return null;
                      const isSelected = currentAnswer === opt;
                      return (
                        <button
                          key={opt}
                          data-testid={`option-${opt.toLowerCase()}`}
                          onClick={() => { if (!hasSubmitted) setAnswers(prev => ({ ...prev, [question.id]: opt })); }}
                          disabled={hasSubmitted}
                          className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${hasSubmitted ? "opacity-60 cursor-not-allowed border-border bg-muted" : isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border/50 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${hasSubmitted ? "bg-muted-foreground/30 text-muted-foreground" : isSelected ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-700"}`}>{opt}</div>
                          <span className="text-lg font-medium">{val}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Bottom navigation bar */}
      <FixedBottomBar
        leftButton={
          <Button data-testid="button-prev" variant="outline" size="lg" onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0 || hasSubmitted} className="rounded-xl h-12 px-6">
            <ChevronLeft className="w-5 h-5 mr-1" />Previous
          </Button>
        }
        centerContent={
          <div className="flex gap-1 overflow-x-auto px-2 py-1 max-w-xs">
            {questions.map((q, i) => (
              <button key={q.id} data-testid={`nav-q-${i + 1}`} onClick={() => setCurrentQ(i)}
                className={`w-10 h-10 shrink-0 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${currentQ === i ? "ring-2 ring-primary bg-primary/20 text-primary" : answers[q.id] ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 hover:bg-slate-200"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        }
        rightButton={
          <div className="flex gap-2">
            <Button data-testid="button-next" variant="outline" size="lg" onClick={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))} disabled={currentQ === questions.length - 1 || hasSubmitted} className="rounded-xl h-12 px-6">
              Next<ChevronRight className="w-5 h-5 ml-1" />
            </Button>
            <Button data-testid="button-submit-exam" onClick={handleManualSubmit} disabled={isSubmitting || hasSubmitted} variant="secondary" size="lg" className="font-bold bg-green-500/20 hover:bg-green-500/30 text-green-800 h-12 px-8 rounded-xl shadow-lg">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {hasSubmitted ? "Submitted" : "Submit Exam"}
            </Button>
          </div>
        }
      />
    </div>
  );
}
