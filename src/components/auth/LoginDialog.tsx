import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ACCOUNT_ID, GOOGLE_CLIENT_ID } from "@/config/auth";
import { loadGoogleIdentityScript } from "@/lib/googleIdentity";
import { signinWithGoogle } from "@/services/authApi";

export function LoginDialog() {
  const { showLoginDialog, setShowLoginDialog, login, loginWithSession } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const googleButtonContainerRef = useRef<HTMLDivElement | null>(null);

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    // Mock: auto-login after 1.5s
    setTimeout(() => {
      login();
      setSent(false);
      setEmail("");
    }, 1500);
  };

  const handleOpenChange = (open: boolean) => {
    setShowLoginDialog(open);
    if (!open) {
      setSent(false);
      setEmail("");
      setGoogleError(null);
    }
  };

  useEffect(() => {
    let cancelled = false;

    if (!showLoginDialog) {
      return;
    }

    if (!ACCOUNT_ID) {
      const message = "Google sign-in is unavailable. Missing VITE_ACCOUNT_ID.";
      setGoogleError(message);
      toast({
        title: "Google sign-in unavailable",
        description: "Set VITE_ACCOUNT_ID in your environment and reload.",
        variant: "destructive",
      });
      return;
    }

    const initGoogleButton = async () => {
      setGoogleError(null);
      setIsGoogleLoading(true);

      try {
        await loadGoogleIdentityScript();
        if (cancelled) {
          return;
        }

        if (!window.google?.accounts?.id || !googleButtonContainerRef.current) {
          throw new Error("Google Identity Services is not available right now.");
        }

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          ux_mode: "popup",
          auto_select: false,
          cancel_on_tap_outside: true,
          callback: async (response) => {
            if (!response.credential) {
              const message = "Google sign-in did not return an ID token.";
              setGoogleError(message);
              toast({
                title: "Sign-in failed",
                description: message,
                variant: "destructive",
              });
              return;
            }

            if (!ACCOUNT_ID) {
              const message = "Google sign-in is unavailable. Missing VITE_ACCOUNT_ID.";
              setGoogleError(message);
              toast({
                title: "Google sign-in unavailable",
                description: "Set VITE_ACCOUNT_ID in your environment and reload.",
                variant: "destructive",
              });
              return;
            }

            setIsGoogleLoading(true);
            try {
              const authSession = await signinWithGoogle({
                id_token: response.credential,
                account_id: ACCOUNT_ID,
              });
              if (cancelled) {
                return;
              }

              loginWithSession(authSession);
              setSent(false);
              setEmail("");
              setGoogleError(null);
            } catch (error) {
              if (cancelled) {
                return;
              }

              const message =
                error instanceof Error ? error.message : "Unable to complete Google sign-in.";
              setGoogleError(message);
              toast({
                title: "Google sign-in failed",
                description: message,
                variant: "destructive",
              });
            } finally {
              if (!cancelled) {
                setIsGoogleLoading(false);
              }
            }
          },
        });

        googleButtonContainerRef.current.innerHTML = "";
        const buttonWidth = Math.min(360, Math.max(240, googleButtonContainerRef.current.clientWidth));
        window.google.accounts.id.renderButton(googleButtonContainerRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: buttonWidth,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unable to load Google sign-in right now.";
        setGoogleError(message);
        toast({
          title: "Google sign-in unavailable",
          description: message,
          variant: "destructive",
        });
      } finally {
        if (!cancelled) {
          setIsGoogleLoading(false);
        }
      }
    };

    initGoogleButton();

    return () => {
      cancelled = true;
    };
  }, [loginWithSession, showLoginDialog, toast]);

  return (
    <Dialog open={showLoginDialog} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-bold text-card-foreground text-center">
            Welcome to Telemetrio
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            Sign in to access analytics, ads intelligence, and more.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Google SSO */}
          <div className="space-y-2">
            <div ref={googleButtonContainerRef} className="w-full min-h-11 flex justify-center" />
            {isGoogleLoading && (
              <p className="text-xs text-center text-muted-foreground">Loading Google sign-in…</p>
            )}
            {googleError && <p className="text-xs text-center text-destructive">{googleError}</p>}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Magic Link */}
          <form onSubmit={handleMagicLink} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
              disabled={sent}
            />
            <Button
              type="submit"
              className="w-full h-11 gap-2"
              disabled={!email.trim() || sent}
            >
              {sent ? (
                "Check your email ✓"
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Magic Link
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center pt-1">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
