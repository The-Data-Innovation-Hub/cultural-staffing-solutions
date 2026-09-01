import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Lock } from "lucide-react";

const SITE_PASSWORD = "H3althcare1!";
const STORAGE_KEY = "siteAccessGranted";

const SiteGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
    } else {
      setError("Incorrect site password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src="/images/logos/csmart-logo.svg"
            alt="C-Smart"
            className="h-14 w-auto mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-foreground">Private preview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the site password to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl shadow-lg p-6 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="site-password">Site password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="site-password"
                type="password"
                autoFocus
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="pl-10 h-11 rounded-xl"
                required
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full h-11 rounded-xl" disabled={!password}>
            Unlock site
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SiteGate;
