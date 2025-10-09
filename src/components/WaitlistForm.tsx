import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { addToWaitlist } from "@/services/waitlistService";
import { sendWaitlistWelcomeEmail, sendAdminNotification } from "@/services/emailService";
import { CheckCircle2, Loader2, Mail, AlertCircle } from "lucide-react";

const professions = [
  { value: "nurse", label: "Registered Nurse" },
  { value: "care_assistant", label: "Healthcare Assistant" },
  { value: "doctor", label: "Doctor" },
  { value: "midwife", label: "Midwife" },
  { value: "paramedic", label: "Paramedic" },
  { value: "allied_health", label: "Allied Health Professional" },
  { value: "other", label: "Other Healthcare Professional" },
];

const services = [
  { id: "training", label: "Healthcare Professional Training" },
  { id: "cultural", label: "Cultural Orientation Program" },
  { id: "recruitment", label: "Recruitment & Placement" },
  { id: "certification", label: "Certification Programs" },
];

const referralSources = [
  { value: "search", label: "Search Engine (Google, etc.)" },
  { value: "social", label: "Social Media" },
  { value: "friend", label: "Friend/Colleague Referral" },
  { value: "advertisement", label: "Advertisement" },
  { value: "healthcare_facility", label: "Healthcare Facility" },
  { value: "recruitment_agency", label: "Recruitment Agency" },
  { value: "other", label: "Other" },
];

export function WaitlistForm() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    profession: "",
    yearsOfExperience: "",
    message: "",
    referralSource: "",
    interestedServices: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      interestedServices: prev.interestedServices.includes(serviceId)
        ? prev.interestedServices.filter(s => s !== serviceId)
        : [...prev.interestedServices, serviceId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      // Add to waitlist database
      const result = await addToWaitlist({
        email: formData.email,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        phone: formData.phone || undefined,
        profession: formData.profession || undefined,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
        message: formData.message || undefined,
        referralSource: formData.referralSource || undefined,
        interestedServices: formData.interestedServices.length > 0 ? formData.interestedServices : undefined,
      });

      if (result.success && result.data) {
        // Database entry created successfully
        const name = formData.firstName || formData.email.split('@')[0];

        // Try to send welcome email (non-blocking)
        try {
          await sendWaitlistWelcomeEmail(
            formData.email,
            name
          );
        } catch (emailError) {
          // Log error but don't block user flow
          console.error('Failed to send welcome email:', emailError);
        }

        // Try to send admin notification (non-blocking)
        try {
          await sendAdminNotification({
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            profession: formData.profession,
            interestedServices: formData.interestedServices,
          });
        } catch (emailError) {
          // Log error but don't block user flow
          console.error('Failed to send admin notification:', emailError);
        }

        // Show success regardless of email status
        setSubmitted(true);
      } else {
        // Handle specific error cases
        const errorMessage = result.error || "Failed to join waitlist. Please try again.";

        if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
          setError(
            "This email address is already on our waitlist. " +
            "If you haven't received a confirmation email, please check your spam folder or contact us for assistance."
          );
        } else {
          setError(errorMessage);
        }
      }
    } catch (err: any) {
      console.error('Waitlist submission error:', err);

      // Provide user-friendly error messages
      if (err.message?.includes('network') || err.message?.includes('fetch')) {
        setError("Network error. Please check your connection and try again.");
      } else if (err.message?.includes('timeout')) {
        setError("Request timed out. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again or contact support if the problem persists.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-0 shadow-card">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-montserrat font-bold text-foreground mb-3">
            Thank You for Joining!
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We've received your application and will be in touch soon with more information about our programs and opportunities.
          </p>
          <div className="bg-css-gold-light p-4 rounded-lg mb-6 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-css-gold mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground text-left">
                A welcome email has been sent to <strong>{formData.email}</strong>.
                Please check your inbox (and spam folder just in case). Feel free to reply to the email with any questions!
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                email: "",
                firstName: "",
                lastName: "",
                phone: "",
                profession: "",
                yearsOfExperience: "",
                message: "",
                referralSource: "",
                interestedServices: [],
              });
            }}
            variant="outline"
          >
            Submit Another Application
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-card">
      <CardHeader>
        <CardTitle className="font-montserrat text-2xl text-center">
          Join Our Waitlist
        </CardTitle>
        <CardDescription className="text-center">
          Be the first to know about our training programs and opportunities in Northern Ireland healthcare
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email - Required */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Smith"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+44 7700 900000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Profession and Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profession">Current Profession</Label>
              <Select
                value={formData.profession}
                onValueChange={(value) => setFormData({ ...formData, profession: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select profession" />
                </SelectTrigger>
                <SelectContent>
                  {professions.map((prof) => (
                    <SelectItem key={prof.value} value={prof.value}>
                      {prof.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                max="50"
                placeholder="5"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
              />
            </div>
          </div>

          {/* Interested Services */}
          <div className="space-y-3">
            <Label>Interested Services</Label>
            <div className="space-y-2">
              {services.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={service.id}
                    checked={formData.interestedServices.includes(service.id)}
                    onCheckedChange={() => handleServiceToggle(service.id)}
                  />
                  <label
                    htmlFor={service.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {service.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Referral Source */}
          <div className="space-y-2">
            <Label htmlFor="referralSource">How did you hear about us?</Label>
            <Select
              value={formData.referralSource}
              onValueChange={(value) => setFormData({ ...formData, referralSource: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {referralSources.map((source) => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Tell us about your interest in healthcare opportunities in Northern Ireland..."
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-800 mb-1">
                    Unable to Complete Registration
                  </h4>
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Join Waitlist"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By joining our waitlist, you agree to receive communications about our programs and services.
            You can unsubscribe at any time.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
