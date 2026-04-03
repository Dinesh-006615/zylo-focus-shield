// Local storage based state management for Zylo

export interface UsageData {
  date: string;
  opens: number;
  timeSpent: number; // minutes
  reelAttempts: number;
  focusCompleted: number; // minutes
}

export interface FocusSession {
  startTime: number;
  duration: number; // minutes
  strictMode: boolean;
  active: boolean;
}

const USAGE_KEY = "zylo_usage";
const FOCUS_KEY = "zylo_focus";
const SETTINGS_KEY = "zylo_settings";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function getTodayUsage(): UsageData {
  const all = getAllUsage();
  const today = getToday();
  return all.find((d) => d.date === today) || { date: today, opens: 0, timeSpent: 0, reelAttempts: 0, focusCompleted: 0 };
}

export function getAllUsage(): UsageData[] {
  try {
    const data = localStorage.getItem(USAGE_KEY);
    return data ? JSON.parse(data) : generateDemoData();
  } catch {
    return generateDemoData();
  }
}

export function updateTodayUsage(updates: Partial<UsageData>) {
  const all = getAllUsage();
  const today = getToday();
  const idx = all.findIndex((d) => d.date === today);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...updates };
  } else {
    all.push({ date: today, opens: 0, timeSpent: 0, reelAttempts: 0, focusCompleted: 0, ...updates });
  }
  localStorage.setItem(USAGE_KEY, JSON.stringify(all));
}

export function incrementOpens() {
  const today = getTodayUsage();
  updateTodayUsage({ opens: today.opens + 1 });
}

export function incrementReelAttempts() {
  const today = getTodayUsage();
  updateTodayUsage({ reelAttempts: today.reelAttempts + 1 });
}

export function getFocusSession(): FocusSession | null {
  try {
    const data = localStorage.getItem(FOCUS_KEY);
    if (!data) return null;
    const session: FocusSession = JSON.parse(data);
    if (session.active) {
      const elapsed = (Date.now() - session.startTime) / 60000;
      if (elapsed >= session.duration) {
        clearFocusSession();
        return null;
      }
    }
    return session;
  } catch {
    return null;
  }
}

export function startFocusSession(duration: number, strictMode: boolean) {
  const session: FocusSession = {
    startTime: Date.now(),
    duration,
    strictMode,
    active: true,
  };
  localStorage.setItem(FOCUS_KEY, JSON.stringify(session));
}

export function clearFocusSession() {
  localStorage.removeItem(FOCUS_KEY);
}

export function getAddictionScore(): number {
  const usage = getAllUsage();
  const last7 = usage.slice(-7);
  if (last7.length === 0) return 0;
  const avgOpens = last7.reduce((s, d) => s + d.opens, 0) / last7.length;
  const avgTime = last7.reduce((s, d) => s + d.timeSpent, 0) / last7.length;
  const score = Math.min(100, Math.round((avgOpens * 2 + avgTime) / 2));
  return score;
}

export function getMostAddictiveHour(): string {
  // Demo: return a realistic hour
  return "11 PM";
}

export function getSmartNudge(): string {
  const today = getTodayUsage();
  const nudges = [
    `You opened Instagram ${today.opens} times today`,
    `You tried to view reels ${today.reelAttempts} times`,
    `Your most addictive time is ${getMostAddictiveHour()}`,
    `You've spent ${today.timeSpent} minutes on Instagram today`,
    "Try keeping your phone away during meals",
    "Every time you resist, your focus grows stronger",
  ];
  return nudges[Math.floor(Math.random() * nudges.length)];
}

function generateDemoData(): UsageData[] {
  const data: UsageData[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      opens: Math.floor(Math.random() * 25) + 5,
      timeSpent: Math.floor(Math.random() * 120) + 15,
      reelAttempts: Math.floor(Math.random() * 15) + 2,
      focusCompleted: Math.floor(Math.random() * 60) + 10,
    });
  }
  localStorage.setItem(USAGE_KEY, JSON.stringify(data));
  return data;
}
