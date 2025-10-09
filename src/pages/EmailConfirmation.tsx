import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { confirmEmail } from "@/services/waitlistService";
import { sendWelcomeEmail } from "@/services/emailService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function EmailConfirmation() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const confirmEmailAddress = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid confirmation link. The token is missing.");
        return;
      }

      try {
        const result = await confirmEmail(token);

        if (result.success && result.data) {
          setUserEmail(result.data.email);

          // Try to send welcome email (non-blocking)
          try {
            const name = result.data.firstName || result.data.email.split('@')[0];
            await sendWelcomeEmail(result.data.email, name);
          } catch (emailError) {
            // Log error but don't block confirmation success
            console.error('Failed to send welcome email:', emailError);
          }

          setStatus("success");
          setMessage("Your email has been confirmed successfully!");
        } else {
          setStatus("error");

          // Provide specific error messages
          const errorMsg = result.error || "";
          if (errorMsg.includes("Invalid") || errorMsg.includes("token")) {
            setMessage(
              "This confirmation link is invalid or has already been used. " +
              "If you've already confirmed your email, you're all set! " +
              "Otherwise, please try joining the waitlist again."
            );
          } else {
            setMessage(errorMsg || "Failed to confirm email. Please try again or contact support.");
          }
        }
      } catch (err: any) {
        console.error('Email confirmation error:', err);
        setStatus("error");

        // Provide user-friendly error messages based on error type
        if (err.message?.includes('network') || err.message?.includes('fetch')) {
          setMessage("Network error. Please check your connection and try refreshing the page.");
        } else if (err.message?.includes('timeout')) {
          setMessage("Request timed out. Please refresh the page to try again.");
        } else {
          setMessage("An unexpected error occurred. Please try again or contact support if the problem persists.");
        }
      }
    };

    confirmEmailAddress();
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-12 pb-8">
          <div className="text-center">
            {status === "loading" && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-css-gold-light p-4">
                    <Loader2 className="h-12 w-12 text-css-gold animate-spin" />
                  </div>
                </div>
                <h1 className="text-2xl font-montserrat font-bold text-foreground mb-3">
                  Confirming Your Email...
                </h1>
                <p className="text-muted-foreground">
                  Please wait while we verify your email address.
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-montserrat font-bold text-foreground mb-3">
                  Email Confirmed!
                </h1>
                <p className="text-muted-foreground mb-6">
                  {message}
                </p>
                <div className="bg-css-gold-light p-4 rounded-lg mb-6">
                  <p className="text-sm text-foreground">
                    You're now on our waitlist. We've sent a welcome email to{" "}
                    <strong>{userEmail}</strong> with more information about what's next.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button asChild className="w-full bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold">
                    <Link to="/">Return to Home</Link>
                  </Button>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-red-100 p-4">
                    <XCircle className="h-12 w-12 text-red-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-montserrat font-bold text-foreground mb-3">
                  Confirmation Failed
                </h1>
                <p className="text-muted-foreground mb-6">
                  {message}
                </p>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                  <p className="text-sm text-red-700">
                    If you continue to experience issues, please contact our support team
                    or try joining the waitlist again.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button asChild className="w-full bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold">
                    <Link to="/">Return to Home</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
