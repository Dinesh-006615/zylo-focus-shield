import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Unlock } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { startFocusSession } from "@/lib/store";

const presets = [
  { label: "15m", value: 15 },
  { label: "30m", value: 30 },
  { label: "1h", value: 60 },
  { label: "2h", value: 120 },
];

export default function Timer() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(30);
  const [custom, setCustom] = useState(30);
  const [strictMode, setStrictMode] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  const duration = isCustom ? custom : selected;

  const handleStart = () => {
    startFocusSession(duration, strictMode);
    navigate("/");
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground mb-6">
        <ArrowLeft size={20} />
        <span className="text-sm">Back</span>
      </button>

      <h1 className="text-2xl font-bold mb-1">Set Timer</h1>
      <p className="text-sm text-muted-foreground mb-6">Choose your focus duration</p>

      {/* Presets */}
      <div className="grid grid-cols-4 gap-3 mb-6" style={{ animation: "slide-up 0.3s ease-out" }}>
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => { setSelected(p.value); setIsCustom(false); }}
            className={`py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              !isCustom && selected === p.value
                ? "gradient-primary text-primary-foreground glow-primary scale-105"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom */}
      <GlassCard className="mb-6" style={{ animation: "slide-up 0.4s ease-out" }}>
        <p className="text-sm font-medium mb-3">Custom Duration</p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={5}
            max={180}
            value={custom}
            onChange={(e) => { setCustom(Number(e.target.value)); setIsCustom(true); }}
            className="flex-1 accent-primary"
          />
          <span className="text-lg font-bold min-w-[50px] text-right gradient-text">
            {custom}m
          </span>
        </div>
      </GlassCard>

      {/* Strict Mode */}
      <GlassCard
        className="mb-8 flex items-center justify-between"
        glow={strictMode}
        onClick={() => setStrictMode(!strictMode)}
        style={{ animation: "slide-up 0.5s ease-out" }}
      >
        <div className="flex items-center gap-3">
          {strictMode ? (
            <Lock size={20} className="text-secondary" />
          ) : (
            <Unlock size={20} className="text-muted-foreground" />
          )}
          <div>
            <p className="font-medium">Strict Mode</p>
            <p className="text-xs text-muted-foreground">Cannot cancel once started</p>
          </div>
        </div>
        <div
          className={`w-12 h-7 rounded-full transition-all duration-300 flex items-center px-1 ${
            strictMode ? "gradient-primary" : "bg-muted"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-foreground transition-transform duration-300 ${
              strictMode ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      </GlassCard>

      {/* Start */}
      <button
        onClick={handleStart}
        className="w-full py-4 rounded-2xl gradient-hero text-primary-foreground font-bold text-lg glow-primary transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{ animation: "slide-up 0.6s ease-out" }}
      >
        Start {duration} min Focus
      </button>
    </div>
  );
}
