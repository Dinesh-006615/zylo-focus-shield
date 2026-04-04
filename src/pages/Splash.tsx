import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/home"), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-secondary/10 blur-[80px]" />

      <div className="relative z-10 text-center" style={{ animation: "slide-up 0.8s ease-out" }}>
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
          <img src={logo} alt="Antigram logo" className="w-20 h-20 object-contain" />
        </div>
        <h1 className="text-4xl font-black gradient-text mb-2">Antigram</h1>
        <p className="text-sm text-muted-foreground">Take control. Stay focused.</p>
      </div>
    </div>
  );
}
