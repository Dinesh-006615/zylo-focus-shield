import { useNavigate } from "react-router-dom";
import { Eye, Clock, Flame, Zap, TrendingUp, AlertTriangle, BarChart3, Shield } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { getTodayUsage, getAllUsage, getAddictionScore, getSmartNudge, getFocusSession } from "@/lib/store";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function Home() {
  const navigate = useNavigate();
  const [today, setToday] = useState(getTodayUsage());
  const [score, setScore] = useState(getAddictionScore());
  const [nudge, setNudge] = useState(getSmartNudge());
  const [focusSession, setFocusSession] = useState(getFocusSession());
  const [timeLeft, setTimeLeft] = useState("");
  const weeklyData = getAllUsage().slice(-7);

  useEffect(() => {
    const interval = setInterval(() => {
      setToday(getTodayUsage());
      setScore(getAddictionScore());
      const session = getFocusSession();
      setFocusSession(session);
      if (session?.active) {
        const elapsed = (Date.now() - session.startTime) / 60000;
        const remaining = Math.max(0, session.duration - elapsed);
        const mins = Math.floor(remaining);
        const secs = Math.floor((remaining - mins) * 60);
        setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const chartData = weeklyData.map((d) => ({
    day: new Date(d.date).toLocaleDateString("en", { weekday: "short" }),
    opens: d.opens,
    time: d.timeSpent,
  }));

  const scoreColor = score > 70 ? "text-destructive" : score > 40 ? "text-yellow-400" : "text-accent";

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6" style={{ animation: "slide-up 0.3s ease-out" }}>
        <div>
          <h1 className="text-2xl font-bold gradient-text">Zylo</h1>
          <p className="text-sm text-muted-foreground">Take control of your time</p>
        </div>
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center animate-pulse-glow">
          <Zap size={18} className="text-primary-foreground" />
        </div>
      </div>

      {/* Smart Nudge */}
      <GlassCard className="mb-4 flex items-center gap-3 border-l-2 border-l-primary" glow>
        <AlertTriangle size={18} className="text-secondary shrink-0" />
        <p className="text-sm text-muted-foreground">{nudge}</p>
      </GlassCard>

      {/* Focus Timer */}
      {focusSession?.active ? (
        <GlassCard className="mb-4 text-center" glow>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Focus Active</p>
          <p className="text-4xl font-bold gradient-text">{timeLeft}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {focusSession.strictMode ? "🔒 Strict Mode" : "Standard Mode"}
          </p>
        </GlassCard>
      ) : (
        <button
          onClick={() => navigate("/timer")}
          className="w-full mb-4 py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold text-lg glow-primary transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Start Focus Session
        </button>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-4" style={{ animation: "slide-up 0.4s ease-out" }}>
        <GlassCard className="text-center">
          <Eye size={18} className="text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold">{today.opens}</p>
          <p className="text-[10px] text-muted-foreground">Opens</p>
        </GlassCard>
        <GlassCard className="text-center">
          <Clock size={18} className="text-secondary mx-auto mb-1" />
          <p className="text-2xl font-bold">{today.timeSpent}m</p>
          <p className="text-[10px] text-muted-foreground">Time Spent</p>
        </GlassCard>
        <GlassCard className="text-center">
          <Flame size={18} className={`mx-auto mb-1 ${scoreColor}`} />
          <p className={`text-2xl font-bold ${scoreColor}`}>{score}</p>
          <p className="text-[10px] text-muted-foreground">Addiction</p>
        </GlassCard>
      </div>

      {/* Weekly Chart */}
      <GlassCard className="mb-4" style={{ animation: "slide-up 0.5s ease-out" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">Weekly Overview</p>
          <TrendingUp size={16} className="text-accent" />
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData}>
            <XAxis dataKey="day" tick={{ fill: "hsl(240 5% 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: "hsl(240 15% 8% / 0.9)",
                border: "1px solid hsl(0 0% 100% / 0.1)",
                borderRadius: "12px",
                color: "hsl(0 0% 95%)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="opens" fill="url(#gradient)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(270, 80%, 60%)" />
                <stop offset="100%" stopColor="hsl(320, 70%, 55%)" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3" style={{ animation: "slide-up 0.6s ease-out" }}>
        <GlassCard onClick={() => navigate("/analytics")} className="text-center">
          <BarChart3 size={22} className="text-accent mx-auto mb-2" />
          <p className="text-sm font-medium">Analytics</p>
        </GlassCard>
        <GlassCard onClick={() => navigate("/focus")} className="text-center">
          <Shield size={22} className="text-secondary mx-auto mb-2" />
          <p className="text-sm font-medium">Focus Mode</p>
        </GlassCard>
      </div>
    </div>
  );
}
