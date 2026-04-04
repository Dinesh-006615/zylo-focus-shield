import { MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getFocusSession } from "@/lib/store";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

export default function BlockOverlay() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState("");
  const session = getFocusSession();

  useEffect(() => {
    const interval = setInterval(() => {
      const s = getFocusSession();
      if (!s?.active) {
        navigate("/");
        return;
      }
      const elapsed = (Date.now() - s.startTime) / 60000;
      const remaining = Math.max(0, s.duration - elapsed);
      const mins = Math.floor(remaining);
      const secs = Math.floor((remaining - mins) * 60);
      setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center px-6">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-1/3 left-1/3 w-48 h-48 rounded-full bg-secondary/10 blur-[80px]" />

      <div className="relative z-10 text-center" style={{ animation: "slide-up 0.5s ease-out" }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
          <img src={logo} alt="Antigram" className="w-16 h-16 object-contain" />
        </div>

        <h1 className="text-3xl font-bold mb-2">Focus Mode Active</h1>
        <p className="text-muted-foreground mb-2">Reels & Feed Blocked</p>

        {timeLeft && (
          <p className="text-5xl font-bold gradient-text mb-8">{timeLeft}</p>
        )}

        <p className="text-xs text-muted-foreground mb-8">
          {session?.strictMode ? "🔒 Strict mode — cannot be cancelled" : "Stay focused, you're doing great"}
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <button
            onClick={() => navigate("/")}
            className="w-full py-3.5 rounded-xl gradient-accent text-accent-foreground font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle size={18} />
            Allow Messages
          </button>

          {!session?.strictMode && (
            <button
              onClick={() => navigate("/")}
              className="w-full py-3.5 rounded-xl glass text-muted-foreground font-medium flex items-center justify-center gap-2 transition-all hover:text-foreground"
            >
              <X size={18} />
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
