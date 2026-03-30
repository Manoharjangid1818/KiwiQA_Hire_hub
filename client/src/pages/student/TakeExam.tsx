import { useState, useEffect, useRef, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { useAttempt, useSubmitAttempt } from "@/hooks/use-attempts";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Loader2, Timer, CheckCircle, ChevronRight, ChevronLeft, Camera, CameraOff, AlertTriangle, Eye, XCircle, User, EyeOff, Mic, MicOff, Maximize, Minimize, Shield, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { FixedBottomBar } from "@/components/layout/FixedBottomBar";

const MAX_WARNINGS = 5;
const FACE_CHECK_INTERVAL = 3000; // 3 seconds
const AUDIO_CHECK_INTERVAL = 5000; // 5 seconds
const FULLSCREEN_CHECK_INTERVAL = 1000; // 1 second

// Voice Activity Detection constants
const VOICE_DETECTION_DURATION = 2500;  // ms of sustained voice before warning (2.5s)
const AUDIO_WARNING_COOLDOWN = 30000;   // ms between successive audio warnings
// Primary speech formant range (F1–F3) — covers vowel / consonant resonances
const VOICE_FORMANT_LOW_HZ = 300;
const VOICE_FORMANT_HIGH_HZ = 3400;
// Fundamental frequency (F0) range — unique to voiced human speech
const VOICE_FUNDAMENTAL_LOW_HZ = 85;
const VOICE_FUNDAMENTAL_HIGH_HZ = 255;
const VOICE_MIN_FUNDAMENTAL_ENERGY = 10; // avg energy required in F0 band
const VOICE_MIN_FORMANT_ENERGY = 22;    // minimum avg formant bin energy (0-255)
const VOICE_FORMANT_RATIO_THRESHOLD = 0.42; // formant energy / total energy ratio
const VOICE_MIN_OVERALL_LEVEL = 12;     // minimum overall level to avoid silence triggers
const VOICE_RESET_GAP_MS = 400;         // brief gap allowed before resetting voice timer

// TensorFlow.js and face detection imports - loaded dynamically
let faceLandmarksDetection: any = null;
let tf: any = null;
let faceMesh: any = null;

// Load TensorFlow.js and face detection models dynamically
const loadFaceDetectionModels = async () => {
  if (faceLandmarksDetection) return;
  
  try {
    tf = await import(/* @vite-ignore */ '@tensorflow/tfjs');
    await import(/* @vite-ignore */ '@tensorflow/tfjs-backend-webgl');
    await tf.setBackend('webgl');
    await tf.ready();
    
    faceLandmarksDetection = await import(/* @vite-ignore */ '@tensorflow-models/face-landmarks-detection');
    
    faceMesh = await faceLandmarksDetection.createDetector(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
      {
        runtime: 'tfjs',
        refineLandmarks: true,
        maxFaces: 1
      }
    );
    
    console.log('Face detection models loaded successfully');
  } catch (err) {
    console.error('Failed to load face detection models:', err);
  }
};

export default function TakeExam() {
  const [, params] = useRoute("/student/take/:id");
  const attemptId = params ? parseInt(params.id) : 0;
  
  const { data: attempt, isLoading } = useAttempt(attemptId);
  const { mutateAsync: submitAttempt, isPending: isSubmitting } = useSubmitAttempt();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Shuffled questions state
  const [questions, setQuestions] = useState<any[]>([]);
  const [originalQuestionOrder, setOriginalQuestionOrder] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Warning system
  const [warnings, setWarnings] = useState(0);
  const [lastWarningTime, setLastWarningTime] = useState<number | null>(null);
  const [warningType, setWarningType] = useState<string | null>(null);
  const warningCountRef = useRef(0);
  
  // Completion screen state
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);

  // Camera related states
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [photoCount, setPhotoCount] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(true);
  const [multipleFaces, setMultipleFaces] = useState(false);
  
  // Microphone states
  const [micEnabled, setMicEnabled] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [suspiciousAudio, setSuspiciousAudio] = useState(false);
  
  // Fullscreen states
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Tab switch tracking (enhanced)
  const lastTabSwitchRef = useRef<number | null>(null);

  // Camera blocked detection
  const [cameraBlocked, setCameraBlocked] = useState(false);
  const cameraBlockedRef = useRef(false);
  const noFaceTimeRef = useRef<number>(0);

  // Enhanced termination refs
  const tabTerminateCountRef = useRef(0);
  const faceLossStartTimeRef = useRef<number | null>(null);
  const fullscreenTerminateCountRef = useRef(0);
  const hasTerminatedRef = useRef(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const photoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const faceCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullscreenCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Voice Activity Detection refs
  const voiceDetectionStartRef = useRef<number | null>(null); // when sustained voice started
  const lastAudioWarningRef = useRef<number | null>(null);    // last time an audio warning fired
  const lastNonVoiceTimeRef = useRef<number | null>(null);    // last time a non-voice frame was seen

  // Refs for use in closures
  const answersRef = useRef<Record<number, string>>({});
  const attemptRef = useRef<any>(null);
  const isSubmittingRef = useRef(false);
  const warningsRef = useRef(0);
  const requireCameraRef = useRef(false);

  // Keep refs updated
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { attemptRef.current = attempt; }, [attempt]);
  useEffect(() => { warningsRef.current = warnings; }, [warnings]);
  useEffect(() => { requireCameraRef.current = attempt?.exam?.requireCamera || false; }, [attempt]);

  // Shuffle function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize questions with shuffle on mount
  useEffect(() => {
    if (attempt?.exam?.questions && attempt.exam.questions.length > 0) {
      const originalQuestions = attempt.exam.questions;
      const shuffled = shuffleArray(originalQuestions);
      setOriginalQuestionOrder(shuffled.map(q => q.id));
      setQuestions(shuffled);
    }
  }, [attempt?.exam?.questions]);

  // Add warning function
  const addWarning = useCallback((type: string) => {
    const newCount = warningsRef.current + 1;
    warningCountRef.current = newCount;
    setWarnings(newCount);
    setWarningType(type);
    setLastWarningTime(Date.now());

    // Log to console for debugging
    console.log(`[PROCTORING] Warning added: ${type}. Total: ${newCount}`);

    const remaining = MAX_WARNINGS - newCount;
    toast({
      title: `Warning ${newCount}/${MAX_WARNINGS}`,
      description: `${type}. ${remaining} warning(s) remaining before auto-submit.`,
      variant: "destructive",
      duration: 5000,
    });

    // Log activity to server
    logProctoringActivity(type, newCount);

        // Auto-submit if max warnings reached
    if (newCount >= MAX_WARNINGS) {
      toast({
        title: "Maximum warnings reached",
        description: "Your exam is being auto-submitted due to violations.",
        variant: "destructive",
      });
      setTimeout(() => {
        submit(answersRef.current, true);
      }, 2000);
    }
  }, [toast]);

  // Log proctoring activity to server (non-blocking, won't break if endpoint doesn't exist)
  const logProctoringActivity = async (activityType: string, warningCount: number) => {
    if (!attemptId) return;
    
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("kiwiqa_token");
      // Use timeout to avoid blocking - endpoint may not exist yet
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      await fetch(`/api/proctoring/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          attemptId,
          activityType,
          warningCount,
          details: `${activityType} - Warning ${warningCount}`
        }),
        signal: controller.signal
      }).catch(() => {}); // Silently ignore errors
      
      clearTimeout(timeoutId);
    } catch (err) {
      // Silently ignore logging errors
    }
  };

  // Capture photo
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !attemptId) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const photoData = canvas.toDataURL('image/jpeg', 0.5);
    
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("kiwiqa_token");
      const response = await fetch(`/api/attempts/${attemptId}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          photoData, 
          faceDetected: faceDetected,
          multipleFaces: multipleFaces
        })
      });
      
      if (response.ok) {
        setPhotoCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Failed to save photo:', err);
    }
  }, [attemptId, faceDetected, multipleFaces]);

  // Gaze tracking state
  const [gazeStatus, setGazeStatus] = useState<'center' | 'left' | 'right' | 'up' | 'down' | 'missing'>('center');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const faceDetectedRef = useRef(true);
  const gazeStatusRef = useRef<'center' | 'left' | 'right' | 'up' | 'down' | 'missing'>('center');

  useEffect(() => { faceDetectedRef.current = faceDetected; }, [faceDetected]);
  useEffect(() => { gazeStatusRef.current = gazeStatus; }, [gazeStatus]);

  // Check gaze direction
  const checkGazeDirection = useCallback(async () => {
    if (!videoRef.current || !faceMesh || !canvasRef.current) return;
    
    try {
      const video = videoRef.current;
      const faces = await faceMesh.estimateFaces(video);
      
      if (faces.length === 0) {
        if (faceDetectedRef.current) {
          // First loss
          faceLossStartTimeRef.current = Date.now();
          toast({
            title: "Face Lost",
            description: "Please face the camera. 15 second limit.",
            variant: "destructive",
          });
        } else {
          // Ongoing loss - check timer
          if (faceLossStartTimeRef.current && (Date.now() - faceLossStartTimeRef.current >= 15000)) {
            logProctoringActivity('face_loss_15s', 999);
            if (!hasTerminatedRef.current) {
              hasTerminatedRef.current = true;
              toast({
                title: "Exam Terminated - Face Loss",
                description: "Face not detected for 15+ seconds.",
                variant: "destructive",
              });
              setTimeout(() => submit(answersRef.current, true), 2000);
            }
          }
        }
        setFaceDetected(false);
        setGazeStatus('missing');
        faceDetectedRef.current = false;
        return;
      } else {
        // Face recovered
        faceLossStartTimeRef.current = null;
        if (!faceDetectedRef.current) {
          setFaceDetected(true);
          faceDetectedRef.current = true;
        }
      }
      
      if (faces.length > 1) {
        logProctoringActivity('multiple_faces', 999);
        if (!hasTerminatedRef.current) {
          hasTerminatedRef.current = true;
          setMultipleFaces(true);
          toast({
            title: "Exam Terminated - Multiple Faces",
            description: "Multiple faces detected in camera view.",
            variant: "destructive",
          });
          setTimeout(() => submit(answersRef.current, true), 2000);
        }
        return;
      }
      
      setMultipleFaces(false);
      const face = faces[0];
      const landmarks = face.keypoints;
      
      const leftEyeLeft = landmarks[33];
      const rightEyeRight = landmarks[133];
      const rightPupil = landmarks[473];
      const leftPupil = landmarks[468];
      
      const leftEyeCenter = {
        x: (leftEyeLeft.x + rightEyeRight.x) / 2,
        y: (leftEyeLeft.y + rightEyeRight.y) / 2
      };
      
      const eyeWidth = rightEyeRight.x - leftEyeLeft.x;
      const pupilOffsetX = (rightPupil.x - leftEyeCenter.x) / eyeWidth;
      const pupilOffsetY = (rightPupil.y - leftEyeCenter.y) / eyeWidth;
      
      let newGaze: 'center' | 'left' | 'right' | 'up' | 'down' | 'missing' = 'center';
      
      if (pupilOffsetX < -0.15) newGaze = 'right';
      else if (pupilOffsetX > 0.15) newGaze = 'left';
      else if (pupilOffsetY < -0.2) newGaze = 'down';
      else if (pupilOffsetY > 0.2) newGaze = 'up';
      
      if (!faceDetectedRef.current) setFaceDetected(true);
      setGazeStatus(newGaze);
      
      if (newGaze !== 'center' && attemptRef.current && !attemptRef.current.completedAt) {
        const gazeDirections: Record<string, string> = {
          'left': 'Looking to the left',
          'right': 'Looking to the right',
          'up': 'Looking up',
          'down': 'Looking down'
        };
        addWarning(gazeDirections[newGaze] || 'Looking away from camera');
      }
      
    } catch (err) {
      console.error('Gaze detection error:', err);
    }
  }, [addWarning]);

  // Voice Activity Detection — detects only human speech, ignores background noise
  const checkAudioLevel = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const sampleRate = audioContextRef.current.sampleRate;
    const fftSize = analyserRef.current.fftSize;           // 2048
    const binCount = analyserRef.current.frequencyBinCount; // 1024
    const hzPerBin = sampleRate / fftSize;

    const dataArray = new Uint8Array(binCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Bin ranges for F0 (fundamental frequency — 85–255 Hz, unique to voiced speech)
    const f0LowBin  = Math.floor(VOICE_FUNDAMENTAL_LOW_HZ  / hzPerBin);
    const f0HighBin = Math.min(binCount - 1, Math.ceil(VOICE_FUNDAMENTAL_HIGH_HZ / hzPerBin));

    // Bin ranges for speech formants F1–F3 (300–3400 Hz)
    const formantLowBin  = Math.floor(VOICE_FORMANT_LOW_HZ  / hzPerBin);
    const formantHighBin = Math.min(binCount - 1, Math.ceil(VOICE_FORMANT_HIGH_HZ / hzPerBin));

    let totalEnergy      = 0;
    let f0Energy         = 0;
    let formantEnergy    = 0;

    for (let i = 0; i < binCount; i++) {
      totalEnergy += dataArray[i];
      if (i >= f0LowBin && i <= f0HighBin) f0Energy += dataArray[i];
      if (i >= formantLowBin && i <= formantHighBin) formantEnergy += dataArray[i];
    }

    // Visual audio level indicator (overall)
    const avgTotal = totalEnergy / binCount;
    const level = Math.min(100, avgTotal * 1.5);
    setAudioLevel(level);

    // --- Multi-band human voice classification ---
    const f0BinCount       = f0HighBin - f0LowBin + 1;
    const formantBinCount  = formantHighBin - formantLowBin + 1;
    const avgF0Energy      = f0Energy / f0BinCount;
    const avgFormantEnergy = formantEnergy / formantBinCount;
    const formantRatio     = totalEnergy > 0 ? formantEnergy / totalEnergy : 0;

    // A frame is classified as human voice ONLY when all three conditions hold:
    //  1. Overall level above silence floor (avoids triggering on quiet hiss)
    //  2. Energy in the F0 band (85–255 Hz) — fan / AC noise lacks this
    //  3. Formant band (300–3400 Hz) strong AND dominant in spectrum
    //     (music / noise tends to spread energy more evenly across all bins)
    const isVoiceFrame =
      level >= VOICE_MIN_OVERALL_LEVEL &&
      avgF0Energy >= VOICE_MIN_FUNDAMENTAL_ENERGY &&
      avgFormantEnergy >= VOICE_MIN_FORMANT_ENERGY &&
      formantRatio >= VOICE_FORMANT_RATIO_THRESHOLD;

    const now = Date.now();

    if (isVoiceFrame) {
      lastNonVoiceTimeRef.current = null;

      // Start — or continue — tracking sustained voice
      if (!voiceDetectionStartRef.current) {
        voiceDetectionStartRef.current = now;
      }

      const voiceDuration = now - voiceDetectionStartRef.current;

      if (voiceDuration >= VOICE_DETECTION_DURATION) {
        const cooldownPassed =
          !lastAudioWarningRef.current ||
          now - lastAudioWarningRef.current >= AUDIO_WARNING_COOLDOWN;

        if (cooldownPassed) {
          lastAudioWarningRef.current    = now;
          voiceDetectionStartRef.current = null;
          setSuspiciousAudio(true);
          addWarning("Human voice detected during exam");
          console.log(
            `[PROCTORING-AUDIO] Human voice confirmed — ` +
            `f0=${avgF0Energy.toFixed(1)}, ` +
            `formantRatio=${formantRatio.toFixed(2)}, ` +
            `avgFormant=${avgFormantEnergy.toFixed(1)}, ` +
            `level=${level.toFixed(1)}`
          );
        }
      }
    } else {
      // Allow a small gap before fully resetting the voice timer
      // This prevents brief silent moments in speech from breaking the detection
      if (!lastNonVoiceTimeRef.current) {
        lastNonVoiceTimeRef.current = now;
      } else if (now - lastNonVoiceTimeRef.current > VOICE_RESET_GAP_MS) {
        voiceDetectionStartRef.current = null;
        lastNonVoiceTimeRef.current = null;
      }
      if (suspiciousAudio) setSuspiciousAudio(false);
    }
  }, [suspiciousAudio, addWarning]);

  // Fullscreen detection
  const checkFullscreen = useCallback(() => {
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
    );
    
    if (requireCameraRef.current && !isCurrentlyFullscreen && isFullscreen && !hasTerminatedRef.current) {
      // User exited fullscreen
      fullscreenTerminateCountRef.current += 1;
      logProctoringActivity('fullscreen_exit', fullscreenTerminateCountRef.current);
      
      if (fullscreenTerminateCountRef.current >= 2) {
        hasTerminatedRef.current = true;
        toast({
          title: "Exam Terminated - Fullscreen Exit",
          description: "Too many fullscreen exits (2+).",
          variant: "destructive",
        });
        setTimeout(() => submit(answersRef.current, true), 2000);
      } else {
        toast({
          title: `Fullscreen Exit ${fullscreenTerminateCountRef.current}/2`,
          description: "Please stay in fullscreen mode.",
          variant: "destructive",
        });
      }
    }
    
    setIsFullscreen(isCurrentlyFullscreen);
  }, [isFullscreen]);

  // Camera blocked detection - check if camera is covered or disabled
  const checkCameraBlocked = useCallback(() => {
    if (!requireCameraRef.current || !videoRef.current || !streamRef.current) return;
    
    // Check if camera track is enabled
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack || videoTrack.enabled === false) {
      // Camera is turned off - add warning
      if (!cameraBlockedRef.current) {
        cameraBlockedRef.current = true;
        setCameraBlocked(true);
        addWarning("Camera disabled");
        toast({
          title: "Camera Disabled",
          description: "Please enable your camera to continue the exam.",
          variant: "destructive",
        });
      }
      return;
    }
    
    // Check if face is not detected for extended time (potential camera blockage)
    if (!faceDetectedRef.current) {
      noFaceTimeRef.current += 5; // Add 5 seconds worth of checking
      if (noFaceTimeRef.current >= 10 && !cameraBlockedRef.current) {
        // Face not visible for 10+ seconds - likely camera blocked
        cameraBlockedRef.current = true;
        setCameraBlocked(true);
        addWarning("Camera view blocked");
        toast({
          title: "Camera Blocked",
          description: "Please ensure your camera view is not obstructed.",
          variant: "destructive",
        });
      }
    } else {
      // Reset counter when face is detected
      noFaceTimeRef.current = 0;
      if (cameraBlockedRef.current) {
        cameraBlockedRef.current = false;
        setCameraBlocked(false);
      }
    }
  }, [addWarning, toast]);

  // Start camera function
  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API not supported in this browser');
        return;
      }
      
      // Load face detection models
      setIsLoadingModels(true);
      try {
        await loadFaceDetectionModels();
        setModelsLoaded(true);
      } catch (modelErr) {
        console.warn('Could not load face detection models:', modelErr);
      }
      setIsLoadingModels(false);
      
      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = async () => {
          setVideoReady(true);
          try { await videoRef.current?.play(); } catch (e) { console.error(e); }
        };
      }
      
      setCameraEnabled(true);
      setCameraError(null);
      
      // Get microphone stream
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = micStream;
        setMicEnabled(true);
        
        // Set up audio analysis with 2048-bin FFT for voice frequency resolution
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(micStream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;
        analyserRef.current.smoothingTimeConstant = 0.5; // moderate smoothing for responsiveness
        source.connect(analyserRef.current);
      } catch (micErr) {
        console.warn('Microphone access denied:', micErr);
        setMicEnabled(false);
        setMicError('Microphone access denied');
      }
      
      
      // Start face/gaze checking
      if (faceMesh) {
        faceCheckIntervalRef.current = setInterval(checkGazeDirection, FACE_CHECK_INTERVAL);
      }
      
      // Start photo capture interval (every 25 seconds)
      photoIntervalRef.current = setInterval(() => {
        capturePhoto();
        // Check for camera blocked during photo capture
        checkCameraBlocked();
      }, 25000);
      
      // Start audio monitoring
      if (analyserRef.current) {
        const updateAudio = () => {
          checkAudioLevel();
          animationFrameRef.current = requestAnimationFrame(updateAudio);
        };
        updateAudio();
      }
      
      // Start fullscreen checking
      fullscreenCheckIntervalRef.current = setInterval(checkFullscreen, FULLSCREEN_CHECK_INTERVAL);
      
      // Capture first photo
      setTimeout(capturePhoto, 2000);
      
    } catch (err: any) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera access denied. Please allow camera access in your browser settings.');
        addWarning("Camera access denied");
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found. Please connect a camera.');
        addWarning("No camera detected");
      } else {
        setCameraError(`Camera error: ${err.message || 'Unknown error'}`);
      }
      setCameraEnabled(false);
    }
  }, [capturePhoto, checkGazeDirection, checkAudioLevel, checkFullscreen, addWarning]);

  // Stop camera function
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    // Clear all intervals
    const intervals = [photoIntervalRef, faceCheckIntervalRef, audioCheckIntervalRef, fullscreenCheckIntervalRef];
    intervals.forEach(ref => {
      if (ref.current) {
        clearInterval(ref.current);
        ref.current = null;
      }
    });
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    setCameraEnabled(false);
    setMicEnabled(false);
  }, []);

  // Tab switch detection
  useEffect(() => {
  const handleVisibilityChange = () => {
    if (!attempt?.exam?.requireCamera || hasSubmitted || isSubmittingRef.current || hasTerminatedRef.current) return;
    
    if (document.visibilityState === 'hidden') {
      const now = Date.now();
      
      // Only count if >5s since last
      if (!lastTabSwitchRef.current || (now - lastTabSwitchRef.current) > 5000) {
        lastTabSwitchRef.current = now;
        tabTerminateCountRef.current += 1;
        logProctoringActivity('tab_switch', tabTerminateCountRef.current);
        
        if (tabTerminateCountRef.current >= 3) {
          hasTerminatedRef.current = true;
          toast({
            title: "Exam Terminated - Tab Switching",
            description: "Too many tab switches (3+). Exam auto-submitted.",
            variant: "destructive",
          });
          setTimeout(() => submit(answersRef.current, true), 2000);
        } else {
          toast({
            title: `Tab Switch ${tabTerminateCountRef.current}/3`,
            description: "Stay on the exam tab. Limit: 3 switches.",
            variant: "destructive",
          });
        }
      }
    }
  };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(answersRef.current).length > 0 && !hasSubmitted && !isSubmittingRef.current) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    // Prevent right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Prevent copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    // Prevent cut
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    // Prevent paste
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+U, Ctrl+Shift+I, F12, Ctrl+Shift+J
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'u')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
        e.key === 'F12' ||
        (e.altKey && e.key === 'Tab')
      ) {
        if (!hasTerminatedRef.current) {
          logProctoringActivity('devtools_attempt', 1);
          addWarning("Developer tools or copy/paste blocked");
        }
        e.preventDefault();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [attempt?.exam?.requireCamera, hasSubmitted, addWarning]);

  // Initialize camera when exam requires camera
  useEffect(() => {
    if (attempt?.exam?.requireCamera && !attempt.completedAt && !hasSubmitted) {
      startCamera();
    }
    
    return () => { stopCamera(); };
  }, [attempt?.exam?.requireCamera, attempt?.completedAt, hasSubmitted, startCamera, stopCamera]);

  // Submit function
  const submit = useCallback(async (finalAnswers: Record<number, string>, isAutoSubmit: boolean = false) => {
    if (!attemptRef.current || !attemptRef.current.exam) return;
    if (hasSubmitted || isSubmittingRef.current) return;
    
    isSubmittingRef.current = true;
    setHasSubmitted(true);
    stopCamera();

    // Map shuffled questions back to original order for grading
    const originalAnswers = originalQuestionOrder.map((qId, idx) => ({
      questionId: qId,
      selectedAnswer: finalAnswers[questions[idx]?.id] || null
    }));

    const formattedAnswers = originalAnswers.map(ans => ({
      questionId: ans.questionId,
      selectedAnswer: ans.selectedAnswer
    }));

    try {
      await submitAttempt({ attemptId, data: { answers: formattedAnswers } });
      
      if (isAutoSubmit) {
        toast({ title: "Exam Auto-Submitted", description: "Your exam has been submitted automatically due to violations." });
      } else {
        toast({ title: "Exam Submitted", description: "Your answers have been saved." });
      }
      
      // Show completion screen instead of redirecting immediately
      setShowCompletionScreen(true);
      
    } catch (err: any) {
      isSubmittingRef.current = false;
      setHasSubmitted(false);
      toast({ title: "Error submitting", description: err.message, variant: "destructive" });
    }
  }, [attemptId, originalQuestionOrder, questions, submitAttempt, toast, hasSubmitted, stopCamera]);

  // Timer logic
  useEffect(() => {
    if (attempt && attempt.exam && !attempt.completedAt) {
      const start = new Date(attempt.startedAt).getTime();
      const durationMs = attempt.exam.durationMinutes * 60 * 1000;
      const end = start + durationMs;
      
      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((end - now) / 1000));
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          clearInterval(interval);
          toast({ title: "Time's up!", description: "Submitting your exam..." });
          submit(answersRef.current);
        }
      };
      
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    } else if (attempt?.completedAt) {
      setLocation(`/student/attempts/${attempt.id}`);
    }
  }, [attempt, setLocation, submit, toast]);

const handleSelect = (questionId: number, option: string) => {
    if (hasSubmitted || showCompletionScreen) return;
    // Find the actual question ID from the shuffled questions
    const actualQuestionId = questions[currentQ]?.id;
    setAnswers(prev => ({ ...prev, [actualQuestionId]: option }));
  };

  const handleManualSubmit = () => {
    // Check if at least one question has been answered
    const answeredCount = Object.keys(answers).filter(key => answers[parseInt(key)]).length;
    if (answeredCount === 0) {
      toast({
        title: "Cannot Submit",
        description: "You must answer at least one question before submitting the exam.",
        variant: "destructive",
      });
      return;
    }
    
    if (window.confirm("Are you sure you want to submit your exam? You cannot change your answers after submitting.")) {
      submit(answers);
    }
  };

  // Local state for loading models
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  if (isLoading || timeLeft === null) return (
    <ProtectedRoute requireRole="student">
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    </ProtectedRoute>
  );
  
  if (!attempt || !attempt.exam) return (
    <ProtectedRoute requireRole="student">
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Attempt not found</p>
      </div>
    </ProtectedRoute>
  );

  const requireCamera = attempt.exam.requireCamera;
  const examQuestions = questions.length > 0 ? questions : attempt.exam.questions || [];
  const question = examQuestions[currentQ];
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft < 300;

  const getWarningColor = () => {
    if (warnings >= 3) return "bg-red-600";
    if (warnings >= 2) return "bg-orange-500";
    return "bg-yellow-500";
  };

  // Get current answer for this question
  const currentAnswer = answers[question?.id] || "";

  return (
    <ProtectedRoute requireRole="student">
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Warning Banner */}
      {warnings > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-white py-2 px-4 flex items-center justify-center gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-bold">WARNING {warnings}/{MAX_WARNINGS}: {warningType}</span>
        </div>
      )}
      
      {/* Proctoring Panel - Picture in Picture Style */}
      {requireCamera && (
        <div className={`fixed bottom-4 right-4 z-40 ${warnings > 0 ? 'bottom-20' : ''}`}>
          {cameraEnabled ? (
            <div className="bg-black rounded-lg overflow-hidden shadow-lg border-2 border-white">
              <video 
                ref={videoRef}
                autoPlay
                playsInline
                muted
                width="192"
                height="144"
                className="w-48 h-36 object-cover"
              />
              {/* Status indicators */}
              <div className="flex flex-wrap gap-1">
                {/* Gaze Status */}
                <div className={`${
                  gazeStatus === 'center' && faceDetected ? 'bg-green-600' : 
                  gazeStatus === 'missing' ? 'bg-red-600' : 'bg-orange-500'
                } text-white text-xs px-2 py-1 flex items-center gap-1`}>
                  {gazeStatus === 'center' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {gazeStatus === 'center' ? 'OK' : gazeStatus === 'missing' ? 'No Face' : gazeStatus}
                </div>
                
                {/* Mic Status — shows voice detection state */}
                {micEnabled && (
                  <div className={`${
                    suspiciousAudio ? 'bg-red-600' :
                    audioLevel < 5   ? 'bg-green-600' : 'bg-green-600'
                  } text-white text-xs px-2 py-1 flex items-center gap-1`} data-testid="status-mic-audio">
                    <Mic className="w-3 h-3" />
                    {suspiciousAudio ? 'Voice!' : 'Listening'}
                  </div>
                )}
                
                {/* Photo count */}
                <div className="bg-slate-700 text-white text-xs px-2 py-1">
                  {photoCount}📷
                </div>
              </div>
            </div>
          ) : cameraError ? (
            <div className="bg-red-600 text-white p-3 rounded-lg shadow-lg max-w-xs">
              <div className="flex items-center gap-2">
                <CameraOff className="w-5 h-5" />
                <span className="text-sm font-medium">Camera Issue</span>
              </div>
              <p className="text-xs mt-1 opacity-90">{cameraError}</p>
              <Button size="sm" variant="secondary" className="mt-2 w-full" onClick={startCamera}>
                Retry Camera
              </Button>
            </div>
          ) : isLoadingModels ? (
            <div className="bg-blue-600 text-white p-3 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Loading AI...</span>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-600 text-white p-3 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                <span className="text-sm font-medium">Starting Camera...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Warning Counter Indicator */}
      {warnings > 0 && (
        <div className="fixed top-24 right-4 z-40">
          <div className={`${getWarningColor()} text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2`}>
            <XCircle className="w-4 h-4" />
            <span className="font-bold">{warnings}/{MAX_WARNINGS}</span>
          </div>
        </div>
      )}

      {/* Fullscreen indicator */}
      {requireCamera && !isFullscreen && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-amber-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Minimize className="w-4 h-4" />
          <span className="text-sm font-medium">Please enable fullscreen for exam</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto pb-28 md:pb-24 pt-6">
        {/* Sticky Header */}
        <div className="sticky top-0 sm:top-20 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md rounded-2xl shadow-sm border border-border p-4 mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg hidden sm:block">{attempt.exam.title}</h2>
            <p className="text-sm text-muted-foreground">Question {currentQ + 1} of {examQuestions.length}</p>
          </div>
          
          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl font-bold text-xl font-mono ${isWarning ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-primary/10 text-primary'}`}>
            <Timer className="w-6 h-6" />
            {formatTime(timeLeft)}
          </div>
          
          <Button onClick={handleManualSubmit} disabled={isSubmitting} variant="secondary" className="font-bold bg-green-500/10 text-green-700 hover:bg-green-500/20">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-2" /> Submit</>}
          </Button>
        </div>

        {/* Question Area */}
        <Card className={`p-8 shadow-md border-border/50 rounded-3xl mb-6 ${hasSubmitted || showCompletionScreen ? 'pointer-events-none opacity-75' : ''}`}>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary dark:bg-primary/20 rounded-xl flex items-center justify-center font-bold text-xl shrink-0">
              {currentQ + 1}
            </div>
            <div className="flex-1 space-y-6">
              <h3 className="text-2xl font-medium leading-relaxed">{question?.questionText}</h3>
              
              <div className="space-y-3 pt-4">
{['A', 'B', 'C', 'D'].map((opt) => {
                  const val = question?.[`option${opt}` as keyof typeof question];
                  const isSelected = currentAnswer === opt;
                  const isDisabledState = hasSubmitted || showCompletionScreen;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(question?.id, opt)}
                      disabled={isDisabledState}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 cursor-pointer ${
                        isDisabledState 
                          ? 'opacity-60 cursor-not-allowed border-gray-300 bg-gray-100 hover:bg-gray-100' 
                          : isSelected 
                            ? 'border-primary bg-primary/5 shadow-sm hover:border-primary' 
                            : 'border-border/50 hover:border-primary/30 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        isDisabledState 
                          ? 'bg-gray-400 text-gray-600' 
                          : isSelected 
                            ? 'bg-primary text-white' 
                            : 'bg-slate-200 dark:bg-slate-700'
                      }`}>
                        {opt}
                      </div>
                      <span className={`text-lg font-medium ${isDisabledState ? 'text-gray-500' : ''}`}>{val}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Content ends here, buttons in FixedBottomBar */}
      </div>

      {/* Fixed Bottom Action Bar */}
      <FixedBottomBar
          leftButton={
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => {
                if (hasSubmitted || showCompletionScreen) return;
                setCurrentQ(q => Math.max(0, q - 1));
              }} 
              disabled={currentQ === 0 || isSubmitting || hasSubmitted || showCompletionScreen}
              className="rounded-xl h-12 px-6"
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Previous
            </Button>
          }
          centerContent={
            <div className="flex gap-1 overflow-x-auto px-2 py-1 max-w-xs">
              {examQuestions.map((q: any, i: number) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQ(i)}
                  className={`w-10 h-10 shrink-0 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${
                    currentQ === i ? 'ring-2 ring-primary bg-primary/20 text-primary shadow-md' :
                    answers[q.id] ? 'bg-primary text-white shadow-md' :
                    'bg-slate-100 dark:bg-slate-700 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          }
          rightButton={
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => {
                  if (hasSubmitted || showCompletionScreen) return;
                  setCurrentQ(q => Math.min(examQuestions.length - 1, q + 1));
                }} 
                disabled={currentQ === examQuestions.length - 1 || isSubmitting || hasSubmitted || showCompletionScreen}
                className="rounded-xl h-12 px-6"
              >
                Next <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
              <Button 
                onClick={handleManualSubmit} 
                disabled={isSubmitting || hasSubmitted} 
                variant="secondary" 
                className="font-bold bg-green-500/20 hover:bg-green-500/30 text-green-800 h-12 px-8 rounded-xl shadow-lg"
                size="lg"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {hasSubmitted ? "Submitted" : "Submit Exam"}
              </Button>
            </div>
          }
        />\n\n      {/* Exam Completion Screen - Full Screen */}
      {showCompletionScreen && (
        <div className="fixed inset-0 z-50 bg-green-600 dark:bg-green-800 flex items-center justify-center">
          <div className="text-center text-white p-8 max-w-2xl">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Thank You!</h1>
            <p className="text-2xl mb-8">Your exam has been submitted successfully.</p>
            <div className="bg-white/20 rounded-xl p-6 mb-8">
              <p className="text-lg mb-2">What happens next?</p>
              <ul className="text-left space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Your answers have been saved
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Your exam is being graded
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Results will be available in your dashboard
                </li>
              </ul>
            </div>
            <Button 
              onClick={() => {
                // Disable back navigation by replacing history state
                window.history.replaceState(null, '', '/student/dashboard');
                setLocation('/student/dashboard');
              }}
              className="bg-white text-green-700 hover:bg-green-50 px-8 py-3 text-lg font-bold rounded-xl"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

