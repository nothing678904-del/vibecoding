export type StressLevel = "calm" | "moderate" | "tense" | "stressed" | "critical";

export interface StressConfig {
  level: StressLevel;
  label: string;
  color: string;
  bgDark: string;
  bgLight: string;
  particleSpeed: number;
  particleCount: number;
  bloomIntensity: number;
  chromaticAberration: number;
  shakeIntensity: number;
  orbDistortion: number;
  orbScale: number;
  orbRotationSpeed: number;
  soundPitch: number;
  emoji: string;
}

export const LIVE_THRESHOLDS = [
  // Calibrated for current (often sub-1 gwei) reality.
  // These still leave headroom for occasional spikes.
  { max: 0.5, level: "calm" },
  { max: 1.5, level: "moderate" },
  { max: 3, level: "tense" },
  { max: 6, level: "stressed" },
  { max: Infinity, level: "critical" },
] as const;

export const DEMO_THRESHOLDS = [
  { max: 3, level: "calm" },
  { max: 8, level: "moderate" },
  { max: 15, level: "tense" },
  { max: 30, level: "stressed" },
  { max: Infinity, level: "critical" },
] as const;

export const STRESS_CONFIGS: Record<StressLevel, StressConfig> = {
  calm: { level: "calm", label: "Calm", color: "#00f0ff", bgDark: "#10141b", bgLight: "#f0fdf9", particleSpeed: 0.2, particleCount: 2000, bloomIntensity: 0.5, chromaticAberration: 0, shakeIntensity: 0, orbDistortion: 0.05, orbScale: 1, orbRotationSpeed: 0.3, soundPitch: 0.5, emoji: "😌" },
  moderate: { level: "moderate", label: "Moderate", color: "#5e6ad2", bgDark: "#131422", bgLight: "#eff6ff", particleSpeed: 0.5, particleCount: 2000, bloomIntensity: 0.8, chromaticAberration: 0.002, shakeIntensity: 0, orbDistortion: 0.15, orbScale: 1.05, orbRotationSpeed: 0.5, soundPitch: 0.7, emoji: "🙂" },
  tense: { level: "tense", label: "Tense", color: "#f6a541", bgDark: "#1a1612", bgLight: "#fffbeb", particleSpeed: 1, particleCount: 1800, bloomIntensity: 1.5, chromaticAberration: 0.008, shakeIntensity: 1, orbDistortion: 0.35, orbScale: 1.1, orbRotationSpeed: 0.8, soundPitch: 1, emoji: "😐" },
  stressed: { level: "stressed", label: "Stressed", color: "#ff3b7c", bgDark: "#1c1116", bgLight: "#fff1f2", particleSpeed: 2, particleCount: 1500, bloomIntensity: 2.5, chromaticAberration: 0.015, shakeIntensity: 2, orbDistortion: 0.6, orbScale: 1.15, orbRotationSpeed: 1.2, soundPitch: 1.5, emoji: "😰" },
  critical: { level: "critical", label: "Critical", color: "#ff1a2b", bgDark: "#1f0f12", bgLight: "#ffe4e6", particleSpeed: 3.5, particleCount: 1200, bloomIntensity: 3.5, chromaticAberration: 0.025, shakeIntensity: 3, orbDistortion: 0.9, orbScale: 1.3, orbRotationSpeed: 2, soundPitch: 2, emoji: "🔥" },
};

export const GASBOT_MESSAGES: Record<StressLevel, string[]> = {
  calm: ["Yo, the network is super chill rn! 😌 Perfect time to send those transactions!", "Gas is looking beautiful! 🧊 Go ahead, treat yourself to some on-chain action."],
  moderate: ["Things are warming up a bit! Still a solid window though 🙂", "Network's got a slight buzz going. Nothing to sweat about! 💨"],
  tense: ["Heads up! Network's getting a bit spicy 🌶️ Maybe wait for a dip?", "Gas is climbing... might wanna hold off on non-urgent stuff 📈"],
  stressed: ["Whoa, it's getting intense out there! 😰 Only send if it's urgent!", "Network stress is REAL right now. Your wallet will thank you for waiting 🚫"],
  critical: ["🔥 FULL SEND CHAOS! Network is absolutely COOKING right now!", "Bro the gas is INSANE 💀 Unless it's life or death, WAIT!"],
};
