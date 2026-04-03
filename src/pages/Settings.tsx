import { ArrowLeft, Bell, ShieldCheck, Layers, Info, Trash2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";

export default function Settings() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Permissions",
      items: [
        { icon: Layers, label: "Usage Access", desc: "Track Instagram usage", status: "Granted" },
        { icon: ShieldCheck, label: "Accessibility", desc: "Detect reels & feed", status: "Granted" },
        { icon: ExternalLink, label: "Overlay", desc: "Show block screen", status: "Granted" },
      ],
    },
    {
      title: "Notifications",
      items: [
        { icon: Bell, label: "Smart Nudges", desc: "Addiction awareness alerts", status: "On" },
      ],
    },
    {
      title: "Data",
      items: [
        { icon: Trash2, label: "Clear Data", desc: "Reset all usage stats", status: "", action: () => { localStorage.clear(); window.location.reload(); } },
        { icon: Info, label: "About Zylo", desc: "Version 1.0.0 — Hackathon Demo", status: "" },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground mb-6">
        <ArrowLeft size={20} />
        <span className="text-sm">Back</span>
      </button>

      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {sections.map((section, i) => (
        <div key={section.title} className="mb-5" style={{ animation: `slide-up ${0.3 + i * 0.1}s ease-out` }}>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">{section.title}</p>
          <GlassCard className="divide-y divide-border p-0 overflow-hidden">
            {section.items.map(({ icon: Icon, label, desc, status, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/30"
              >
                <Icon size={18} className="text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                {status && (
                  <span className="text-xs text-accent font-medium">{status}</span>
                )}
              </button>
            ))}
          </GlassCard>
        </div>
      ))}
    </div>
  );
}
