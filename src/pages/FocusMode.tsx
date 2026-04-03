import { ArrowLeft, Shield, ShieldCheck, ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import { getFocusSession, clearFocusSession } from "@/lib/store";
import { useState, useEffect } from "react";

export default function FocusMode() {
  const navigate = useNavigate();
  const [session, setSession] = useState(getFocusSession());
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const s = getFocusSession();
      setSession(s);
      if (s?.active) {
        const elapsed = (Date.now() - s.startTime) / 60000;
        const remaining = Math.max(0, s.duration - elapsed);
        const mins = Math.floor(remaining);
        const secs = Math.floor((remaining - mins) * 60);
        setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEnd = () => {
    clearFocusSession();
    setSession(null);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground mb-6">
        <ArrowLeft size={20} />
        <span className="text-sm">Back</span>
      </button>

      <h1 className="text-2xl font-bold mb-1">Focus Mode</h1>
      <p className="text-sm text-muted-foreground mb-6">Control your Instagram blocking</p>

      {session?.active ? (
        <div className="text-center" style={{ animation: "slide-up 0.3s ease-out" }}>
          <div className="w-32 h-32 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <ShieldCheck size={56} className="text-primary-foreground" />
          </div>
          <p className="text-4xl font-bold gradient-text mb-2">{timeLeft}</p>
          <p className="text-muted-foreground mb-1">Focus mode is active</p>
          <p className="text-xs text-muted-foreground mb-8">
            {session.strictMode ? "🔒 Strict — cannot cancel" : "Reels & feed are blocked"}
          </p>

          <GlassCard className="mb-4">
            <p className="text-sm font-medium mb-2">What's blocked</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Instagram Reels</span>
                <span className="text-destructive text-xs font-medium">Blocked</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Instagram Feed</span>
                <span className="text-destructive text-xs font-medium">Blocked</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Direct Messages</span>
                <span className="text-accent text-xs font-medium">Allowed</span>
              </div>
            </div>
          </GlassCard>

          {!session.strictMode && (
            <button
              onClick={handleEnd}
              className="w-full py-3 rounded-xl glass text-muted-foreground font-medium transition-all hover:text-foreground"
            >
              End Focus Session
            </button>
          )}

          <button
            onClick={() => navigate("/block")}
            className="w-full mt-3 py-3 rounded-xl gradient-accent text-accent-foreground font-semibold transition-all hover:scale-[1.02]"
          >
            View Block Screen
          </button>
        </div>
      ) : (
        <div className="text-center" style={{ animation: "slide-up 0.3s ease-out" }}>
          <div className="w-32 h-32 rounded-full glass flex items-center justify-center mx-auto mb-6">
            <ShieldOff size={56} className="text-muted-foreground" />
          </div>
          <p className="text-xl font-semibold mb-2">No Active Session</p>
          <p className="text-sm text-muted-foreground mb-8">Start a focus session to block distractions</p>

          <button
            onClick={() => navigate("/timer")}
            className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-lg glow-primary transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Set Timer & Start
          </button>
        </div>
      )}
    </div>
  );
}
