import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GraduationCap, Shield, UserPlus } from "lucide-react";

export default function Register() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 relative bg-slate-900 items-center justify-center overflow-hidden">
        {/* landing page hero library abstract */}
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop" 
            alt="Library"
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tl from-indigo-900/90 to-emerald-600/80 mix-blend-multiply" />
        
        <div className="relative z-10 p-12 text-white max-w-2xl">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm inline-block mb-6">
            <GraduationCap className="w-12 h-12" />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">KiwiQA Services Pvt Ltd</h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Secure online examination platform with live monitoring and real-time proctoring.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden bg-emerald-100 text-emerald-700 p-3 rounded-2xl inline-flex mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Registration Disabled</h2>
            <p className="mt-2 text-muted-foreground">Student registration is handled through exam links</p>
          </div>

          <Card className="border-2 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-xl">How Students Take Exams</CardTitle>
              <CardDescription className="mt-2">
                Students don't need to register. They can access exams directly through unique exam links shared by the admin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">For Students:</h4>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
                  <li>Receive exam link from admin</li>
                  <li>Click the link to join the exam</li>
                  <li>Enter name and email to start</li>
                  <li>Take the exam with camera monitoring</li>
                </ol>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">For Admins:</h4>
                <p className="text-sm text-muted-foreground">
                  Login to create exams and generate unique shareable links. Monitor students in real-time.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <Link href="/login">
              <Button className="w-full h-12 text-base font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700">
                Go to Admin Login
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Already have an admin account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

