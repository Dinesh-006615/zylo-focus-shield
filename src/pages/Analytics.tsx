import { ArrowLeft, TrendingDown, TrendingUp, Eye, Clock, Film, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import { getAllUsage, getMostAddictiveHour, getTodayUsage } from "@/lib/store";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from "recharts";

export default function Analytics() {
  const navigate = useNavigate();
  const usage = getAllUsage().slice(-7);
  const today = getTodayUsage();

  const opensData = usage.map((d) => ({
    day: new Date(d.date).toLocaleDateString("en", { weekday: "short" }),
    value: d.opens,
  }));

  const timeData = usage.map((d) => ({
    day: new Date(d.date).toLocaleDateString("en", { weekday: "short" }),
    value: d.timeSpent,
  }));

  const totalOpens = usage.reduce((s, d) => s + d.opens, 0);
  const totalTime = usage.reduce((s, d) => s + d.timeSpent, 0);
  const totalReelAttempts = usage.reduce((s, d) => s + d.reelAttempts, 0);
  const avgOpens = Math.round(totalOpens / usage.length);

  const trend = usage.length >= 2
    ? usage[usage.length - 1].opens < usage[usage.length - 2].opens
    : false;

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground mb-6">
        <ArrowLeft size={20} />
        <span className="text-sm">Back</span>
      </button>

      <h1 className="text-2xl font-bold mb-1">Analytics</h1>
      <p className="text-sm text-muted-foreground mb-6">Your Instagram usage insights</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-5" style={{ animation: "slide-up 0.3s ease-out" }}>
        <GlassCard>
          <Eye size={16} className="text-primary mb-1" />
          <p className="text-xl font-bold">{today.opens}</p>
          <p className="text-[10px] text-muted-foreground">Today's Opens</p>
        </GlassCard>
        <GlassCard>
          <Clock size={16} className="text-secondary mb-1" />
          <p className="text-xl font-bold">{today.timeSpent}m</p>
          <p className="text-[10px] text-muted-foreground">Time Today</p>
        </GlassCard>
        <GlassCard>
          <Film size={16} className="text-primary mb-1" />
          <p className="text-xl font-bold">{totalReelAttempts}</p>
          <p className="text-[10px] text-muted-foreground">Reel Attempts (7d)</p>
        </GlassCard>
        <GlassCard>
          <Zap size={16} className="text-primary mb-1" />
          <p className="text-xl font-bold">{getMostAddictiveHour()}</p>
          <p className="text-[10px] text-muted-foreground">Peak Hour</p>
        </GlassCard>
      </div>

      {/* Opens Chart */}
      <GlassCard className="mb-4" style={{ animation: "slide-up 0.4s ease-out" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">Opens Per Day</p>
          {trend ? (
            <span className="flex items-center gap-1 text-xs text-accent"><TrendingDown size={14} /> Improving</span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-primary"><TrendingUp size={14} /> Rising</span>
          )}
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={opensData}>
            <defs>
              <linearGradient id="opensGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 75%, 50%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(0, 75%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: "hsl(0 0% 50%)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: "hsl(0 0% 7% / 0.9)", border: "1px solid hsl(0 0% 100% / 0.1)", borderRadius: "12px", color: "hsl(0 0% 95%)", fontSize: 12 }} />
            <Area type="monotone" dataKey="value" stroke="hsl(0, 75%, 50%)" fill="url(#opensGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Time Chart */}
      <GlassCard className="mb-4" style={{ animation: "slide-up 0.5s ease-out" }}>
        <p className="text-sm font-semibold mb-3">Time Spent (min)</p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={timeData}>
            <XAxis dataKey="day" tick={{ fill: "hsl(0 0% 50%)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: "hsl(0 0% 7% / 0.9)", border: "1px solid hsl(0 0% 100% / 0.1)", borderRadius: "12px", color: "hsl(0 0% 95%)", fontSize: 12 }} />
            <Bar dataKey="value" fill="url(#timeGrad)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 75%, 50%)" />
                <stop offset="100%" stopColor="hsl(0, 60%, 35%)" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Weekly Trend */}
      <GlassCard style={{ animation: "slide-up 0.6s ease-out" }}>
        <p className="text-sm font-semibold mb-2">Weekly Summary</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>📊 Avg {avgOpens} opens/day</p>
          <p>⏱ Total {Math.round(totalTime / 60)}h {totalTime % 60}m this week</p>
          <p>🎬 {totalReelAttempts} reel attempts blocked</p>
          <p>🔥 Most active: {getMostAddictiveHour()}</p>
        </div>
      </GlassCard>
    </div>
  );
}
