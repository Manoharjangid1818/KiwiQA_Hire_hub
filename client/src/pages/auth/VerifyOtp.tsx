import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, KeyRound, ArrowLeft, RefreshCw } from "lucide-react";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const { verifyOtp, resendOtp, isVerifying, isResendingOtp } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const searchParams = new URLSearchParams(window.location.search);
  const email = searchParams.get("email");
  const otpParam = searchParams.get("otp");

  useEffect(() => {
    if (!email) {
      setLocation("/register");
    }
    // Auto-fill OTP from URL if provided (for testing without email)
    if (otpParam) {
      setOtp(otpParam);
      toast({
        title: "OTP Auto-filled",
        description: "OTP was provided in the URL for testing",
      });
    }
  }, [email, otpParam, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await verifyOtp({ email, otp });
      toast({
        title: "Account Verified",
        description: "You can now sign in.",
      });
      setLocation("/login");
    } catch (err: any) {
      toast({
        title: "Verification Failed",
        description: err.message || "Invalid or expired OTP",
        variant: "destructive",
      });
    }
  };

  const handleResend = async () => {
    if (!email) return;

    try {
      await resendOtp(email);
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (err: any) {
      toast({
        title: "Failed to Resend OTP",
        description: err.message || "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <div className="w-full max-w-md bg-card p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-border/50">
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="bg-primary/10 text-primary p-4 rounded-full mb-6 ring-8 ring-primary/5">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Verify Your Email</h2>
          <p className="mt-2 text-muted-foreground text-sm">
            We sent a verification code to <br/>
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            placeholder="Enter 6-digit code"
            className="text-center text-2xl tracking-widest h-14 rounded-xl font-mono"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            maxLength={6}
          />

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5"
            disabled={isVerifying || otp.length < 6}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={isResendingOtp}
            className="text-muted-foreground hover:text-primary"
          >
            {isResendingOtp ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend OTP
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/login")} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Button>
        </div>
      </div>
    </div>
  );
}

