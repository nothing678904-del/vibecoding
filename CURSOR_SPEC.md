# Gas Price Mood — Complete Cursor Implementation Spec

> **ROLE**: You are an Awwwards-level creative developer building an ultra-premium, immersive web experience.
> **GOAL**: Convert Ethereum gas prices into a visual/emotional "network stress" representation.
> **VIBE**: Organic, living, breathing — the UI feels alive. Think fluid gradients, morphing shapes, ambient sound.
> **DEADLINE**: Hackathon — prioritize visual impact and working demo over perfection.

---

## 1. PROJECT SETUP

### 1.1 Initialize Next.js

```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

### 1.2 Install Dependencies

```bash
npm install gsap @gsap/react framer-motion @react-three/fiber @react-three/drei @react-three/postprocessing three lenis @studio-freight/react-lenis @supabase/supabase-js @vercel/analytics howler
npm install -D @types/three @types/howler
```

### 1.3 Environment Files

**`.env.local`**:
```
NEXT_PUBLIC_ETHERSCAN_API_KEY=demo
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_MODE=demo
```

**`.env.example`**:
```
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_MODE=demo  # "demo" or "live"
```

---

## 2. DESIGN SYSTEM

### 2.1 Color Palette

```
STRESS COLORS (used for ALL stress-reactive elements):
  calm:     #06d6a0  (cyan-green)
  moderate: #118ab2  (ocean blue)
  tense:    #ffd166  (amber)
  stressed: #ef476f  (red-pink)
  critical: #ff006e  (neon red)

DARK THEME:
  bg-primary:    #09090b
  bg-secondary:  #111113
  bg-card:       rgba(255,255,255,0.03)
  border:        rgba(255,255,255,0.06)
  text-primary:  #fafafa
  text-secondary: #a1a1aa
  text-muted:    #52525b

LIGHT THEME:
  bg-primary:    #fafafa
  bg-secondary:  #f4f4f5
  bg-card:       rgba(0,0,0,0.02)
  border:        rgba(0,0,0,0.08)
  text-primary:  #18181b
  text-secondary: #52525b
  text-muted:    #a1a1aa

NOTE: The 3D canvas ALWAYS stays dark regardless of theme.
      Only UI chrome (navbar, cards, text, backgrounds) switches.

STRESS BACKGROUNDS (dark mode):
  calm:     #09090b (unchanged)
  moderate: #0a1628 (dark blue tint)
  tense:    #1a1000 (dark amber tint)
  stressed: #1a0005 (dark red tint)
  critical: #1a0010 (deep red tint)

STRESS BACKGROUNDS (light mode):
  calm:     #f0fdf9 (mint tint)
  moderate: #eff6ff (sky tint)
  tense:    #fffbeb (cream tint)
  stressed: #fff1f2 (rose tint)
  critical: #ffe4e6 (deep rose tint)
```

### 2.2 Typography

```
Google Fonts to load:
  - Inter (weights: 300, 400, 500, 600, 700) — body text
  - Space Grotesk (weights: 400, 500, 600, 700) — headings, display

Font sizes (rem):
  display:  clamp(3rem, 8vw, 6rem)
  h1:       clamp(2.5rem, 6vw, 4.5rem)
  h2:       clamp(2rem, 4vw, 3rem)
  h3:       clamp(1.25rem, 2vw, 1.75rem)
  body:     1rem (16px)
  small:    0.875rem
  caption:  0.75rem
```

### 2.3 Glassmorphism Recipe

```css
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
}
/* Light mode */
.light .glass {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.08);
}
```

### 2.4 Animation Constants

```
TIMING:
  fast:    0.2s
  normal:  0.4s
  slow:    0.8s
  scroll:  1.2s

EASING:
  smooth:  cubic-bezier(0.16, 1, 0.3, 1)
  bounce:  cubic-bezier(0.34, 1.56, 0.64, 1)
  spring:  { type: "spring", stiffness: 100, damping: 15 }
```

---

## 3. FILE STRUCTURE

```
vibecoding/
├── public/
│   ├── favicon.svg                    # Gas pump SVG icon
│   ├── og-image.png                   # Social sharing image (generate)
│   └── sounds/
│       └── ambient.mp3                # Ambient drone sound (generate or use royalty-free)
├── src/
│   ├── app/
│   │   ├── globals.css                # Global styles, CSS variables, keyframes
│   │   ├── layout.tsx                 # Root layout with providers
│   │   └── page.tsx                   # Main page assembling all sections
│   ├── components/
│   │   ├── three/
│   │   │   ├── StressScene.tsx        # Canvas wrapper + perf detection
│   │   │   ├── MorphBlob.tsx          # Central morphing orb
│   │   │   ├── ParticleField.tsx      # Reactive particle system
│   │   │   └── PostEffects.tsx        # Bloom, chromatic aberration
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx        # "Feel the Network"
│   │   │   ├── ProblemSection.tsx      # Number confusion showcase
│   │   │   ├── AIActivationSection.tsx # GasBot activation
│   │   │   ├── StressVizSection.tsx    # Core stress visualization (pinned)
│   │   │   ├── PlaygroundSection.tsx   # Interactive stress slider
│   │   │   ├── DecisionSection.tsx     # When to transact cards
│   │   │   ├── FeaturesSection.tsx     # Bento grid features
│   │   │   └── FooterSection.tsx       # CTA + credits
│   │   └── ui/
│   │       ├── Navbar.tsx             # Fixed glassmorphism nav
│   │       ├── StressGauge.tsx        # Circular SVG gauge
│   │       ├── GasCounter.tsx         # Animated gwei counter
│   │       ├── ChatPanel.tsx          # GasBot floating chat
│   │       ├── StressBar.tsx          # Horizontal stress spectrum
│   │       ├── StressSlider.tsx       # Manual stress preview control
│   │       ├── Sparkline.tsx          # Mini SVG trend chart
│   │       ├── ThemeToggle.tsx        # Dark/light mode switch
│   │       └── SoundToggle.tsx        # Ambient sound on/off
│   ├── providers/
│   │   ├── ScrollProvider.tsx         # Lenis smooth scroll
│   │   ├── GasProvider.tsx            # Gas data context
│   │   ├── ThemeProvider.tsx          # Dark/light theme context
│   │   └── SoundProvider.tsx          # Ambient audio context
│   ├── services/
│   │   └── gasService.ts             # API calls + stress mapping
│   ├── lib/
│   │   ├── gsapConfig.ts             # GSAP plugin registration
│   │   ├── supabase.ts               # Supabase client
│   │   ├── constants.ts              # Stress thresholds, messages
│   │   └── utils.ts                  # Helper functions
│   └── hooks/
│       ├── useStress.ts              # Computed stress values
│       ├── useGasHistory.ts          # localStorage gas history
│       └── usePerformance.ts         # FPS detection for 3D fallback
├── tailwind.config.ts
├── next.config.mjs
├── .env.local
├── .env.example
├── README.md
└── package.json
```

---

## 4. STRESS MAPPING LOGIC (CRITICAL)

This is the brain of the app. Every visual element reads from this.

```typescript
// src/lib/constants.ts

export type StressLevel = 'calm' | 'moderate' | 'tense' | 'stressed' | 'critical';

export interface StressConfig {
  level: StressLevel;
  label: string;
  color: string;
  bgDark: string;
  bgLight: string;
  particleSpeed: number;
  particleCount: number;    // reduced from max for performance
  bloomIntensity: number;
  chromaticAberration: number;
  shakeIntensity: number;   // max 3px
  orbDistortion: number;    // 0 = smooth sphere, 1 = max distortion
  orbScale: number;
  orbRotationSpeed: number;
  soundPitch: number;       // 0.5 = low hum, 2.0 = high tension
  emoji: string;
}

// REALISTIC THRESHOLDS (live mode)
export const LIVE_THRESHOLDS = [
  { max: 15, level: 'calm' },
  { max: 35, level: 'moderate' },
  { max: 60, level: 'tense' },
  { max: 100, level: 'stressed' },
  { max: Infinity, level: 'critical' },
];

// LOW THRESHOLDS (for current low-gas era, demo-realistic)
export const DEMO_THRESHOLDS = [
  { max: 3, level: 'calm' },
  { max: 8, level: 'moderate' },
  { max: 15, level: 'tense' },
  { max: 30, level: 'stressed' },
  { max: Infinity, level: 'critical' },
];

export const STRESS_CONFIGS: Record<StressLevel, StressConfig> = {
  calm: {
    level: 'calm',
    label: 'Calm',
    color: '#06d6a0',
    bgDark: '#09090b',
    bgLight: '#f0fdf9',
    particleSpeed: 0.2,
    particleCount: 2000,
    bloomIntensity: 0.5,
    chromaticAberration: 0,
    shakeIntensity: 0,
    orbDistortion: 0.05,
    orbScale: 1.0,
    orbRotationSpeed: 0.3,
    soundPitch: 0.5,
    emoji: '😌',
  },
  moderate: {
    level: 'moderate',
    label: 'Moderate',
    color: '#118ab2',
    bgDark: '#0a1628',
    bgLight: '#eff6ff',
    particleSpeed: 0.5,
    particleCount: 2000,
    bloomIntensity: 0.8,
    chromaticAberration: 0.002,
    shakeIntensity: 0,
    orbDistortion: 0.15,
    orbScale: 1.05,
    orbRotationSpeed: 0.5,
    soundPitch: 0.7,
    emoji: '🙂',
  },
  tense: {
    level: 'tense',
    label: 'Tense',
    color: '#ffd166',
    bgDark: '#1a1000',
    bgLight: '#fffbeb',
    particleSpeed: 1.0,
    particleCount: 1800,
    bloomIntensity: 1.5,
    chromaticAberration: 0.008,
    shakeIntensity: 1,
    orbDistortion: 0.35,
    orbScale: 1.1,
    orbRotationSpeed: 0.8,
    soundPitch: 1.0,
    emoji: '😐',
  },
  stressed: {
    level: 'stressed',
    label: 'Stressed',
    color: '#ef476f',
    bgDark: '#1a0005',
    bgLight: '#fff1f2',
    particleSpeed: 2.0,
    particleCount: 1500,
    bloomIntensity: 2.5,
    chromaticAberration: 0.015,
    shakeIntensity: 2,
    orbDistortion: 0.6,
    orbScale: 1.15,
    orbRotationSpeed: 1.2,
    soundPitch: 1.5,
    emoji: '😰',
  },
  critical: {
    level: 'critical',
    label: 'Critical',
    color: '#ff006e',
    bgDark: '#1a0010',
    bgLight: '#ffe4e6',
    particleSpeed: 3.5,
    particleCount: 1200,
    bloomIntensity: 3.5,
    chromaticAberration: 0.025,
    shakeIntensity: 3,
    orbDistortion: 0.9,
    orbScale: 1.3,
    orbRotationSpeed: 2.0,
    soundPitch: 2.0,
    emoji: '🔥',
  },
};
```

### GasBot Messages (Casual & Fun tone)

```typescript
export const GASBOT_MESSAGES: Record<StressLevel, string[]> = {
  calm: [
    "Yo, the network is super chill rn! 🧘 Perfect time to send those transactions!",
    "Gas is looking beautiful! 💚 Go ahead, treat yourself to some on-chain action.",
    "Network vibes: immaculate ✨ Fees are at basement prices, let's gooo!",
  ],
  moderate: [
    "Things are warming up a bit! Still a solid window though 🏄",
    "Network's got a slight buzz going. Nothing to sweat about! ⚡",
    "Gas is cruising at moderate levels. You're still good to go! 👍",
  ],
  tense: [
    "Heads up! Network's getting a bit spicy 🌶️ Maybe wait for a dip?",
    "Gas is climbing... might wanna hold off on non-urgent stuff ⚠️",
    "The chain's feeling the pressure. Patience might save you some gwei! 🤔",
  ],
  stressed: [
    "Whoa, it's getting intense out there! 🔥 Only send if it's urgent!",
    "Network stress is REAL right now. Your wallet will thank you for waiting 💸",
    "Gas prices are wilding! Maybe grab a coffee and check back later ☕",
  ],
  critical: [
    "🚨 FULL SEND CHAOS! Network is absolutely COOKING right now!",
    "Bro the gas is INSANE 💀 Unless it's life or death, WAIT!",
    "Network meltdown mode activated! 🫠 This is NOT the time to transact!",
  ],
};
```
## 5. PROVIDER SPECIFICATIONS

### 5.1 GasProvider.tsx

```
PURPOSE: Central gas data state management
TYPE: "use client" React Context Provider

STATE:
  - gasData: { safe: number, average: number, fast: number } | null
  - stressLevel: StressLevel
  - stressConfig: StressConfig (from constants)
  - isLoading: boolean
  - error: string | null
  - lastUpdated: Date | null
  - mode: 'demo' | 'live'
  - setMode: (mode) => void

BEHAVIOR:
  - On mount, check NEXT_PUBLIC_APP_MODE env var
  - DEMO MODE: Generate cycling gas values that transition through all stress levels
    - Cycle pattern: calm(5s) → moderate(5s) → tense(5s) → stressed(5s) → critical(3s) → back to calm
    - Add small random variance (±2 gwei) for realism
  - LIVE MODE: Fetch from Etherscan every 10 seconds
    - URL: https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey={KEY}
    - Parse: result.SafeGasPrice, result.ProposeGasPrice, result.FastGasPrice
    - Use ProposeGasPrice (average) for stress calculation
    - On error: fall back to last known value, show error toast
  - Store each reading in gasHistory (max 50 entries)
  - Persist gasHistory to localStorage key: "gasmood_history"
  - Load history from localStorage on mount
  - Use appropriate thresholds based on mode (LIVE_THRESHOLDS vs DEMO_THRESHOLDS)
```

### 5.2 ThemeProvider.tsx

```
PURPOSE: Dark/light mode toggle with system preference detection
TYPE: "use client" React Context Provider

STATE:
  - theme: 'dark' | 'light'
  - toggleTheme: () => void

BEHAVIOR:
  - On mount: check localStorage "gasmood_theme", fallback to system preference
  - Apply class "dark" or "light" to <html> element
  - Persist preference to localStorage
  - When theme changes, ALL stress-reactive colors must recalculate
    (components use stressConfig.bgDark vs bgLight based on current theme)
  - Save preference to Supabase if connected
```

### 5.3 ScrollProvider.tsx

```
PURPOSE: Lenis smooth scrolling + GSAP ScrollTrigger sync
TYPE: "use client" wrapper component

SETUP:
  - Initialize Lenis: { lerp: 0.1, duration: 1.2, smoothWheel: true }
  - Sync with GSAP:
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
  - Cleanup on unmount
```

### 5.4 SoundProvider.tsx

```
PURPOSE: Ambient sound that reacts to stress level
TYPE: "use client" React Context Provider

STATE:
  - isMuted: boolean
  - toggleSound: () => void

BEHAVIOR:
  - Use Howler.js for audio playback
  - Load ambient drone sound (low-frequency hum)
  - Map stress level to pitch: calm=0.5, moderate=0.7, tense=1.0, stressed=1.5, critical=2.0
  - Map stress level to volume: calm=0.1, critical=0.4
  - Smooth transition between pitch/volume values (don't jump)
  - Default: muted (user must opt-in)
  - Persist mute preference to localStorage
  - If no audio file available, generate a simple oscillator using Web Audio API:
    - Base frequency: 60Hz sine wave
    - Stress increases frequency (60Hz → 200Hz) and adds harmonics
    - Add subtle LFO modulation for "breathing" effect
```

---

## 6. THREE.JS COMPONENT SPECIFICATIONS

### 6.1 StressScene.tsx

```
PURPOSE: Wrapper canvas for the entire 3D scene
TYPE: "use client" component

RENDERS:
  <div className="fixed inset-0 -z-10"> (or positioned behind content)
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.2} />
      <MorphBlob stressConfig={currentStress} />
      <ParticleField stressConfig={currentStress} />
      <PostEffects stressConfig={currentStress} />
      <Environment preset="night" />
    </Canvas>
  </div>

PERFORMANCE:
  - Use usePerformance hook to track FPS
  - If FPS < 30 for 3 consecutive seconds: reduce particle count by 50%
  - If FPS < 20: disable post-processing
  - Mobile (<768px): start with 500 particles max, no post-processing
```

### 6.2 MorphBlob.tsx (THE CENTERPIECE)

```
PURPOSE: Central morphing organic blob that represents network consciousness
TYPE: R3F component inside Canvas

GEOMETRY: IcosahedronGeometry(1, 64) — high detail for smooth morphing

CUSTOM SHADER MATERIAL:
  Vertex Shader:
    - Displace vertices using simplex noise
    - displacement = noise3D(position * frequency + time * speed) * amplitude
    - frequency: 1.5 (calm) → 3.0 (critical) — more complex distortion
    - amplitude: 0.05 (calm) → 0.9 (critical) — more extreme morphing
    - speed: orbRotationSpeed from stressConfig
    - Add secondary noise layer at 2x frequency for detail

  Fragment Shader:
    - Base color: stressConfig.color (interpolate smoothly between levels)
    - Fresnel effect: edges glow brighter than center
    - Emissive intensity: 0.3 (calm) → 1.5 (critical)
    - Pulsing: sin(time) * pulseAmount — subtle at calm, dramatic at critical
    - Add iridescent shimmer (slight hue shift based on view angle)

ANIMATION (useFrame):
  - Rotate: y += deltaTime * orbRotationSpeed
  - Scale: lerp toward orbScale (springy, not instant)
  - At "critical": add random jitter to rotation (chaotic spinning)
  - Pulse scale: sin(time * 2) * 0.05 at calm, sin(time * 5) * 0.15 at critical

MOUSE INTERACTION:
  - Track mouse position via pointer events on Canvas
  - Blob slightly tilts toward cursor (max 15 degrees)
  - On hover: glow intensifies 20%
```

### 6.3 ParticleField.tsx

```
PURPOSE: 2000 particles orbiting the blob, reacting to stress
TYPE: R3F component using InstancedMesh or Points with BufferGeometry

SETUP:
  - Create BufferGeometry with 2000 particles
  - Attributes: position (Float32, xyz), color (Float32, rgb), size (Float32), velocity (Float32, xyz)
  - Initial positions: random on sphere surface, radius 1.5-3.0
  - Use Points with a custom ShaderMaterial for best performance

BEHAVIOR BY STRESS LEVEL:
  calm:
    - Slow circular orbit around blob (speed 0.2)
    - Evenly distributed on sphere
    - Color: stress color with slight variance
    - Size: uniform small dots
    - Pattern: orderly, meditative

  moderate:
    - Slightly faster orbit (speed 0.5)
    - Begin clustering into streams/trails
    - Slight color variance (blue spectrum)

  tense:
    - Faster, chaotic orbits (speed 1.0)
    - Some particles drift further from center
    - Amber color, size variance increases
    - Movement becomes less predictable

  stressed:
    - Rapid movement (speed 2.0)
    - Particles fly in erratic paths
    - Red color, particles flash/blink
    - Some particles eject outward then get pulled back

  critical:
    - Explosive scatter (speed 3.5)
    - Particles spray outward chaotically
    - Neon red, strobing opacity
    - Extreme velocity variance

MOUSE INTERACTION:
  - Particles gently repel from cursor position (radius 1.0)
  - Repel force: 0.3 (subtle push, not aggressive)

PERFORMANCE:
  - Use Points (not InstancedMesh) for 2000+ particles
  - All animation in vertex shader where possible
  - Reduce count on mobile/low-perf
```

### 6.4 PostEffects.tsx

```
PURPOSE: Post-processing effects that intensify with stress
TYPE: R3F component using @react-three/postprocessing

EFFECTS:
  - Bloom:
    luminanceThreshold: 0.6
    intensity: stressConfig.bloomIntensity (0.5 → 3.5)
    radius: 0.8

  - ChromaticAberration:
    offset: [stressConfig.chromaticAberration, stressConfig.chromaticAberration]
    (0 at calm → 0.025 at critical)

  - Vignette:
    offset: 0.3
    darkness: 0.5 (calm) → 0.8 (critical)

  - Noise (subtle film grain):
    opacity: 0.03 (always subtle)

All values should LERP smoothly when stress changes (don't snap).
Use useMemo for effect configurations.
```

---

## 7. SECTION SPECIFICATIONS

### 7.1 HeroSection.tsx

```
LAYOUT: Full viewport height (100vh), centered content, 3D scene visible behind

CONTENT:
  - Badge: "⚡ Live Network Status" with glow border (stress color)
  - Title: "Feel the Network" — Space Grotesk, display size
    - Gradient text: stress color → white
    - GSAP: fade-in from y:60, opacity:0, duration:1s, ease:smooth
  - Subtitle: "Experience Ethereum's heartbeat in real time"
    - Inter, h3 size, text-secondary color
    - GSAP: fade-in 0.3s after title
  - GasCounter component showing current gwei (large, monospace)
  - Stress badge pill showing current level + emoji
  - Scroll indicator: animated chevron bouncing at bottom
    - Framer Motion: y: [0, 10, 0] loop

GSAP SCROLLTRIGGER:
  - trigger: section element
  - On scroll down: title and subtitle parallax up (y moves -50%)
  - 3D scene opacity fades slightly as user scrolls past
```

### 7.2 ProblemSection.tsx

```
LAYOUT: Min 100vh, flex column centered

CONTENT:
  - Title: "Numbers Don't Tell the Story"
  - Two-column comparison (stacked on mobile):

    LEFT CARD (glassmorphism):
      Title: "Traditional View"
      Content: Fake gas data display
        - "Safe: 12 gwei" / "Standard: 25 gwei" / "Fast: 45 gwei"
        - Numbers scramble/glitch randomly (setInterval changing digits)
        - Red/green colors randomly flashing
        - Confusing chart lines (SVG noise)
        - Overall feel: chaotic, hard to read
        - Slight red-tinted glow

    RIGHT CARD (glassmorphism):
      Title: "Our Interpretation"
      Content:
        - Large stress emoji (current level)
        - Stress color circle, pulsing gently
        - Simple text: "Network is calm. Fees are low."
        - Clean, readable, calming
        - Stress-colored glow border

GSAP SCROLLTRIGGER:
  - Left card: x: -100 → 0, opacity: 0 → 1
  - Right card: x: 100 → 0, opacity: 0 → 1, 0.2s delay
  - Stagger timing: 0.15s
```

### 7.3 AIActivationSection.tsx

```
LAYOUT: 100vh, centered, dramatic

CONTENT:
  - Title: "Activate the Interpreter" (typewriter reveal on scroll)
  - Subtitle: "Let GasBot decode the network for you"
  - Large circular button:
    - Inner text: "ACTIVATE" with power icon
    - Outer ring: SVG circle with animated dash offset (progress ring)
    - Glow: pulsing stress-colored box-shadow
    - Framer Motion: scale spring on hover (1 → 1.08)
    - On click:
      1. Button scales to 1.5 then fades
      2. White flash overlay (opacity 0 → 0.8 → 0, duration 0.5s)
      3. The ChatPanel component slides in from bottom-right
      4. 3D blob pulses dramatically (scale 1 → 1.5 → 1, duration 1s)
      5. Button replaced with "✓ GasBot Active" text

STATE: isActivated (boolean) — once activated, button stays hidden

GSAP SCROLLTRIGGER:
  - Button scales from 0.5 → 1.0 as section enters viewport
  - Title typewriter: each character appears with 30ms delay
```

### 7.4 StressVizSection.tsx (CORE EXPERIENCE — PINNED)

```
LAYOUT: 100vh, PINNED (stays fixed while user scrolls through)
PIN DURATION: equivalent to 200vh of scroll distance (scroll through slowly)

CONTENT (overlay on 3D scene):
  - Left panel (glassmorphism, floating):
    - StressGauge component (circular, large)
    - Current gwei number below gauge
    - Stress level label with emoji
    - "Last updated: Xs ago"

  - Right panel (glassmorphism, floating):
    - Three gas displays:
      "⛽ Safe: XX gwei"
      "⚡ Standard: XX gwei"
      "🚀 Fast: XX gwei"
    - Sparkline chart (last 10 readings)
    - Recommended action text (from GASBOT_MESSAGES)

  - Bottom: StressBar (horizontal gradient bar with pointer)

  - Mode toggle: "Demo / Live" switch in corner

STRESS UI EFFECTS:
  - Entire section background transitions to stress BG color
  - At shakeIntensity > 0: apply CSS transform with random x/y offset
    - Use requestAnimationFrame for smooth shake
    - MAX 3px offset (subtle, not disruptive)
  - Border glows pulse at stress color
  - Text color for key metrics matches stress color

GSAP SCROLLTRIGGER:
  - pin: true
  - scrub: 1
  - During pinned scroll: stress level can manually progress through a curated sequence
    (but live data overrides if connected)
```

### 7.5 PlaygroundSection.tsx

```
LAYOUT: Min 100vh, centered

CONTENT:
  - Title: "Playground Mode"
  - Subtitle: "Drag the slider to preview how the network feels at different stress levels"
  - StressSlider component (full-width range input):
    - Range: 0-150 gwei
    - Track: gradient from calm → critical colors
    - Thumb: glowing circle matching current stress color
    - Labels at key thresholds
  - Below slider: real-time display of what changes:
    - Mini embedded 3D preview (smaller canvas, 500 particles) OR
    - CSS-only preview: colored circle with blur/scale effects
    - Current stress config values displayed:
      "Bloom: 0.5 | Shake: 0px | Particles: 2000"
  - Note: "Drag to preview. Release to return to live data."

BEHAVIOR:
  - While dragging: override GasProvider stress level with slider value
  - On release: restore to live/demo data after 2 second delay
  - Smooth transitions as slider moves

GSAP SCROLLTRIGGER:
  - Fade in from below on scroll enter
```
## 7.6 DecisionSection.tsx

```
LAYOUT: Min 100vh, centered

CONTENT:
  - Title: "Know When to Act"
  - Subtitle: "Real-time transaction timing powered by network mood"
  - Three cards in a row (stack on mobile):

    CARD 1 — "Send Now" (green theme):
      - Icon: ✅ or 🟢
      - Title: "Go Ahead"
      - Description: "Network is calm. Ideal for all transactions."
      - Border glow: #06d6a0
      - Framer Motion hover: y: -8, scale: 1.02, shadow intensifies

    CARD 2 — "Wait a Bit" (amber theme):
      - Icon: ⏳ or 🟡
      - Title: "Hold On"
      - Description: "Moderate activity. Consider waiting for a dip."
      - Border glow: #ffd166

    CARD 3 — "Not Now" (red theme):
      - Icon: 🛑 or 🔴
      - Title: "Avoid"
      - Description: "High congestion. Only urgent transactions."
      - Border glow: #ef476f

  - ACTIVE INDICATOR: The card matching current stress level gets:
    - Scale: 1.05 (slightly larger)
    - Brighter glow
    - "← CURRENT" badge
    - Pulsing border animation
  - The other two cards are slightly dimmed (opacity: 0.6)

GSAP SCROLLTRIGGER:
  - Cards stagger from bottom: y: 80 → 0, opacity: 0 → 1
  - Stagger: 0.15s between cards
  - Ease: power2.out
```

### 7.7 FeaturesSection.tsx

```
LAYOUT: Min 100vh, padding-heavy for breathing room

CONTENT:
  - Title: "What Makes This Different"
  - Bento grid layout (CSS Grid):
    Desktop: 3 columns, 2 rows
    Tablet: 2 columns, 3 rows
    Mobile: 1 column, 6 rows

  CARDS (all glassmorphism):
    1. "Real-Time Data" — icon: 🌐
       "Live Ethereum gas prices, updated every 10 seconds"
       SPAN: 1x1

    2. "Visual Mapping" — icon: 🎨
       "Colors, motion, and intensity replace confusing numbers"
       SPAN: 1x1

    3. "AI Interpretation" — icon: 🤖
       "GasBot explains what the data means in plain English"
       SPAN: 1x1

    4. "Stress Metrics" — icon: 📊
       "Intuitive gauge shows network health at a glance"
       SPAN: 1x1

    5. "Decision Support" — icon: ⚡
       "Know exactly when to transact and when to wait"
       SPAN: 1x1

    6. "Future Ready" — icon: 🔮
       "Multi-chain support, predictions, and alerts coming soon"
       SPAN: 1x1

  CARD INTERACTIONS:
    - Hover: 3D perspective tilt (rotateX/Y based on mouse position within card)
      - Max tilt: 8 degrees
      - Use onMouseMove to calculate tilt from cursor position relative to card center
    - Hover glow: stress-colored border glow appears
    - Transition: transform 0.3s ease, box-shadow 0.3s ease
    - Each card has a subtle gradient bg that shifts on hover

GSAP SCROLLTRIGGER:
  - Each card staggers in: y: 60 → 0, opacity: 0 → 1
  - Stagger: 0.1s
  - Start: "top 80%"
```

### 7.8 FooterSection.tsx

```
LAYOUT: ~50vh, centered, dark regardless of theme

CONTENT:
  - Large tagline: "Stop Calculating. Start Feeling."
    - Space Grotesk, h1 size
    - Gradient text (current stress color → white)
  - "Back to Top" button:
    - Framer Motion: spring hover
    - On click: Lenis scrollTo(0) smooth scroll to top
  - Divider line
  - Bottom row:
    - Left: "Built for ETH Global Hackathon 2025"
    - Right: "Powered by Etherscan API"
  - Copyright: "© 2025 GasMood"

VISUAL:
  - Subtle CSS-only particle effect in background:
    - 20 small circles with CSS animation (float upward, fade)
    - No Three.js here (performance)
```

---

## 8. UI COMPONENT SPECIFICATIONS

### 8.1 Navbar.tsx

```
POSITION: fixed top, full width, z-50
STYLE: glassmorphism background, height: 64px

CONTENT (left to right):
  - Logo: "⛽ GasMood" — Space Grotesk, bold, gradient text
  - Nav links (hidden on mobile): Hero | Problem | Visualize | Decide | Features
    - On click: smooth scroll to section via Lenis
  - Right side:
    - Live gas badge: small pill showing "XX gwei" with stress-colored dot
    - ThemeToggle component
    - SoundToggle component
    - Mode toggle: "Demo/Live" small switch

BEHAVIOR:
  - Framer Motion: slides down from y: -100 on mount
  - Auto-hide: on scroll down, navbar slides up (y: -100)
  - Auto-show: on scroll up, navbar slides back down (y: 0)
  - Track scroll direction with useRef storing last scroll position
  - Always show on hover near top of screen

MOBILE:
  - Hamburger menu icon (right side)
  - Opens full-screen overlay with nav links
  - Framer Motion: AnimatePresence for mount/unmount
```

### 8.2 StressGauge.tsx

```
TYPE: SVG-based circular gauge

STRUCTURE:
  <svg viewBox="0 0 200 200">
    - Background circle (dark track): stroke-dasharray full circle, opacity 0.1
    - Foreground arc (stress colored): stroke-dashoffset based on stress percentage
    - Gradient definition for the arc (stress color variations)
    - Center text: current gwei value (large, bold)
    - Sub text: stress level label
    - Stress emoji above the number

ANIMATION:
  - Arc fill: Framer Motion useSpring for smooth transition
  - On value change: spring animation (stiffness: 50, damping: 15)
  - Glow filter on the arc (SVG filter with feGaussianBlur)

STRESS PERCENTAGE MAPPING:
  calm: 0-20%
  moderate: 20-40%
  tense: 40-60%
  stressed: 60-80%
  critical: 80-100%
```

### 8.3 GasCounter.tsx

```
TYPE: Animated number display

DISPLAY: "XX.X gwei" in monospace font (Space Grotesk or JetBrains Mono)

ANIMATION:
  - Use Framer Motion useSpring to animate from old value to new value
  - Duration: 0.8s
  - Display with 1 decimal place
  - Color: current stress color (transition: color 0.5s)
  - On change: subtle scale bounce (1 → 1.05 → 1)

SIZE VARIANTS:
  - "lg": text-5xl (hero section)
  - "md": text-2xl (stress viz section)
  - "sm": text-sm (navbar badge)
```

### 8.4 ChatPanel.tsx (GasBot)

```
TYPE: Floating bottom-right panel
VISIBILITY: Hidden until AI activation button is clicked

STRUCTURE:
  - Container: fixed bottom-right, w-80 (320px), max-h-96
  - Header bar:
    - GasBot avatar (gradient circle with 🤖 emoji)
    - "GasBot" title
    - Status dot (green = active, pulsing)
    - Minimize button (chevron down) and close button (X)
  - Messages area (scrollable):
    - Each message: glassmorphism bubble, left-aligned
    - Avatar + message text + timestamp
    - Most recent message at bottom
  - Typing indicator: three bouncing dots when "typing"

BEHAVIOR:
  - On activation: panel slides up from bottom-right (Framer Motion: y: 100 → 0)
  - Initial message: "Hey! I'm GasBot 🤖 I'll keep you updated on network vibes!"
  - On stress level change:
    1. Show typing indicator for 1.5s
    2. Add random message from GASBOT_MESSAGES[currentLevel]
    3. Scroll to bottom
  - Max messages shown: 20 (oldest removed)
  - Minimize: collapses to just header bar (toggle height)
  - Close: panel disappears with AnimatePresence

STATES:
  - hidden (before activation)
  - open (full panel visible)
  - minimized (only header visible)
  - closed (hidden after user closes, small "reopen" fab button appears)

MOBILE:
  - Full-width at bottom of screen when open
  - Auto-minimize after 5 seconds of being open
```

### 8.5 StressBar.tsx

```
TYPE: Horizontal gradient bar showing stress spectrum

STRUCTURE:
  - Full-width bar (height 8px, rounded)
  - Background: linear-gradient(to right, #06d6a0, #118ab2, #ffd166, #ef476f, #ff006e)
  - Pointer/indicator: small circle (12px) positioned based on current gwei
  - Pointer has stress-colored glow (box-shadow)
  - Labels below: "Calm" (left) ... "Critical" (right)

ANIMATION:
  - Pointer position: Framer Motion useSpring (smooth sliding)
  - Pointer glow pulses at stress rate
```

### 8.6 StressSlider.tsx

```
TYPE: Range input for playground section

STRUCTURE:
  - <input type="range" min="0" max="150" step="1">
  - Custom styled track: gradient background (calm → critical)
  - Custom thumb: 24px circle, stress-colored, with glow
  - Above slider: current value label "XX gwei — {StressLevel}"
  - Below slider: threshold markers at each boundary

BEHAVIOR:
  - onChange: dispatch override stress level to GasProvider
  - onMouseUp / onTouchEnd: clear override after 2s delay
  - Visual: all stress-reactive elements on page respond in real-time
```

### 8.7 Sparkline.tsx

```
TYPE: Tiny SVG line chart

STRUCTURE:
  <svg viewBox="0 0 100 30" preserveAspectRatio="none">
    - <polyline> connecting last 10-20 gas readings
    - Stroke: current stress color
    - Fill: none (line only) or subtle gradient fill below line
    - No axes, no labels — pure visual trend

DATA: Read from gasHistory in GasProvider (persisted via localStorage)

ANIMATION:
  - On new data point: line animates to include new point
  - Use stroke-dasharray/dashoffset trick for "drawing" effect
  - pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 → 0
```

### 8.8 ThemeToggle.tsx

```
TYPE: Toggle button with sun/moon icon

STRUCTURE:
  - Button with icon: ☀️ (light mode) / 🌙 (dark mode)
  - Framer Motion: rotate icon 180° on toggle
  - Background: transparent
  - Border: 1px solid border color

BEHAVIOR:
  - Toggle theme via ThemeProvider
  - Persist to localStorage
  - Smooth transition: all CSS custom properties transition over 0.3s
```

### 8.9 SoundToggle.tsx

```
TYPE: Toggle button with speaker icon

STRUCTURE:
  - Button with icon: 🔊 (on) / 🔇 (off)
  - Framer Motion: scale bounce on click
  - Tooltip: "Toggle ambient sound"

BEHAVIOR:
  - Toggle via SoundProvider
  - First click: user gesture enables Web Audio API (browser requirement)
  - Visual: icon pulses gently when sound is on
```

---

## 9. LAYOUT.TSX ASSEMBLY

```tsx
// src/app/layout.tsx
// Wrap order (outermost to innermost):

<html lang="en" className={theme}>
  <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
    <ThemeProvider>
      <SoundProvider>
        <GasProvider>
          <ScrollProvider>
            <Analytics /> {/* @vercel/analytics */}
            {children}
          </ScrollProvider>
        </GasProvider>
      </SoundProvider>
    </ThemeProvider>
  </body>
</html>
```

## 10. PAGE.TSX ASSEMBLY

```tsx
// src/app/page.tsx
// "use client" — needed for context consumers

<main>
  <StressScene />          {/* Fixed behind everything */}
  <Navbar />               {/* Fixed top */}
  <HeroSection />          {/* Section 1 */}
  <ProblemSection />       {/* Section 2 */}
  <AIActivationSection />  {/* Section 3 */}
  <StressVizSection />     {/* Section 4 — PINNED */}
  <PlaygroundSection />    {/* Section 5 */}
  <DecisionSection />      {/* Section 6 */}
  <FeaturesSection />      {/* Section 7 */}
  <FooterSection />        {/* Section 8 */}
  <ChatPanel />            {/* Floating, bottom-right */}
</main>
```

---

## 11. GSAP CONFIG

```typescript
// src/lib/gsapConfig.ts
"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

---

## 12. SUPABASE SETUP

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Table: user_preferences
// Columns: id (uuid), theme (text), sound_enabled (boolean), mode (text), created_at (timestamp)
// If supabase is null (no env vars), gracefully fall back to localStorage only
```

---

## 13. HOOKS

### useStress.ts
```
Consumes GasProvider context.
Returns computed values:
  - stressConfig: full StressConfig object
  - stressColor: hex string
  - stressPercent: 0-100 number
  - shouldShake: boolean
  - shakeStyle: { transform: `translate(${x}px, ${y}px)` } — random jitter
  - bgColor: string (respects current theme)
  - glowShadow: CSS box-shadow string
  - transitionCSS: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
```

### useGasHistory.ts
```
Manages localStorage persistence for gas history.
  - loadHistory(): GasReading[] from localStorage key "gasmood_history"
  - saveReading(reading): appends to array, trims to max 50, saves
  - clearHistory(): clears localStorage key
  - getRecentReadings(count): returns last N readings
Returns: { history, addReading, clearHistory, recentReadings }
```

### usePerformance.ts
```
Tracks FPS for dynamic quality adjustment.
  - Uses requestAnimationFrame loop
  - Calculates rolling average FPS over last 60 frames
  - Returns: { fps, quality: 'high' | 'medium' | 'low' }
  - high: fps >= 45 (full effects)
  - medium: 30 <= fps < 45 (reduce particles to 1000)
  - low: fps < 30 (500 particles, no post-processing)
```

---

## 14. RESPONSIVE BREAKPOINTS

```
Mobile:  < 768px
  - Single column layouts
  - 3D scene: 500 particles, no post-processing
  - Navbar: hamburger menu
  - ChatPanel: full-width at bottom
  - "Best viewed on desktop" subtle banner at top (dismissible)
  - Sections: reduced padding
  - Font sizes: use clamp() minimums

Tablet: 768px - 1024px
  - 2-column grids
  - 3D scene: 1000 particles
  - ChatPanel: standard floating panel

Desktop: > 1024px
  - Full experience
  - 3D scene: 2000 particles, all post-processing
  - Multi-column layouts
```

---

## 15. GLOBAL CSS KEYFRAMES

```css
/* src/app/globals.css — include these keyframes */

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px var(--stress-color); }
  50% { box-shadow: 0 0 40px var(--stress-color), 0 0 60px var(--stress-color); }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes particle-float {
  0% { transform: translateY(100vh) scale(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-10vh) scale(1); opacity: 0; }
}

@keyframes subtle-shake {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(var(--shake-x, 1px), var(--shake-y, -1px)); }
  50% { transform: translate(var(--shake-x-neg, -1px), var(--shake-y, 1px)); }
  75% { transform: translate(var(--shake-y, 1px), var(--shake-x, -1px)); }
}

/* Smooth theme transitions */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: var(--stress-color, #06d6a0);
  border-radius: 3px;
}
```

---

## 16. FAVICON

```svg
<!-- public/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#06d6a0"/>
      <stop offset="100%" style="stop-color:#ff006e"/>
    </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="28" fill="url(#g)" opacity="0.9"/>
  <text x="32" y="42" text-anchor="middle" font-size="28">⛽</text>
</svg>
```

---

## 17. CRITICAL IMPLEMENTATION NOTES

1. **ALL "use client"**: Every component using React hooks, context, browser APIs, Three.js,
   Framer Motion, or GSAP MUST have "use client" at the top.

2. **LERP everything**: Never snap between stress states. Always interpolate:
   ```ts
   currentValue += (targetValue - currentValue) * 0.05; // per frame
   ```

3. **CSS custom properties for stress color**: Set `--stress-color` on a parent element
   so all children can reference it without re-rendering.

4. **Dynamic imports for Three.js**: Use `next/dynamic` with `ssr: false` for StressScene:
   ```tsx
   const StressScene = dynamic(() => import('@/components/three/StressScene'), { ssr: false });
   ```

5. **Sound autoplay policy**: Browsers block autoplay. Sound must start from a user gesture.
   The SoundToggle click or AI Activation button click are valid gestures.

6. **GSAP cleanup**: Always return cleanup functions from useGSAP or useEffect:
   ```ts
   return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
   ```

7. **Mobile detection**: Use `window.matchMedia('(max-width: 768px)')` not user-agent.

8. **Stress color transitions**: Use CSS transitions (0.5s) for color changes,
   not React state re-renders. Set CSS variables and let CSS handle the animation.

9. **Three.js memory**: Dispose geometries, materials, and textures on unmount.

10. **localStorage safety**: Always wrap in try-catch (may be disabled in incognito).

---

## 18. README.md TEMPLATE

```markdown
# ⛽ Gas Price Mood

> Feel the Ethereum Network — Don't Calculate It

An immersive web experience that transforms real-time Ethereum gas prices into
visual and emotional stress representations using 3D particles, morphing blobs,
and dynamic UI effects.

## 🚀 Live Demo
[gasmood.vercel.app](https://gasmood.vercel.app)

## ✨ Features
- Real-time Ethereum gas price visualization
- 3D morphing blob that reacts to network stress
- 2000+ reactive particles with GPU-accelerated animation
- AI-powered chat (GasBot) with casual, fun explanations
- Interactive playground to preview all stress levels
- Ambient sound design reacting to network mood
- Dark/Light theme with full stress-color adaptation
- Demo mode for showcasing without API key

## 🛠 Tech Stack
Next.js 14 | React Three Fiber | GSAP | Framer Motion | Tailwind CSS | Lenis | Supabase | Vercel

## 📦 Setup
1. Clone and install: `npm install`
2. Copy `.env.example` to `.env.local` and fill in values
3. Run: `npm run dev`
4. Open: http://localhost:3000

## 🔑 Environment Variables
- `NEXT_PUBLIC_ETHERSCAN_API_KEY` — Get free at etherscan.io
- `NEXT_PUBLIC_SUPABASE_URL` — Optional, for preference persistence
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Optional
- `NEXT_PUBLIC_APP_MODE` — "demo" or "live"

## 📄 License
MIT
```

---

## 19. BUILD ORDER (FOR CURSOR)

Execute in this exact order for zero dependency issues:

```
PHASE 1 — Foundation:
  1. Project init (create-next-app + npm install)
  2. tailwind.config.ts (design tokens)
  3. globals.css (variables, keyframes, base styles)
  4. next.config.mjs (transpilePackages)
  5. .env files

PHASE 2 — Core Logic:
  6. src/lib/constants.ts (stress configs, messages)
  7. src/lib/utils.ts (helpers)
  8. src/lib/gsapConfig.ts
  9. src/lib/supabase.ts
  10. src/services/gasService.ts
  11. src/hooks/useGasHistory.ts
  12. src/hooks/usePerformance.ts
  13. src/hooks/useStress.ts

PHASE 3 — Providers:
  14. src/providers/ThemeProvider.tsx
  15. src/providers/SoundProvider.tsx
  16. src/providers/GasProvider.tsx
  17. src/providers/ScrollProvider.tsx

PHASE 4 — UI Components:
  18. src/components/ui/ThemeToggle.tsx
  19. src/components/ui/SoundToggle.tsx
  20. src/components/ui/GasCounter.tsx
  21. src/components/ui/StressGauge.tsx
  22. src/components/ui/StressBar.tsx
  23. src/components/ui/Sparkline.tsx
  24. src/components/ui/StressSlider.tsx
  25. src/components/ui/ChatPanel.tsx
  26. src/components/ui/Navbar.tsx

PHASE 5 — 3D Scene:
  27. src/components/three/MorphBlob.tsx
  28. src/components/three/ParticleField.tsx
  29. src/components/three/PostEffects.tsx
  30. src/components/three/StressScene.tsx

PHASE 6 — Sections:
  31. src/components/sections/HeroSection.tsx
  32. src/components/sections/ProblemSection.tsx
  33. src/components/sections/AIActivationSection.tsx
  34. src/components/sections/StressVizSection.tsx
  35. src/components/sections/PlaygroundSection.tsx
  36. src/components/sections/DecisionSection.tsx
  37. src/components/sections/FeaturesSection.tsx
  38. src/components/sections/FooterSection.tsx

PHASE 7 — Assembly:
  39. src/app/layout.tsx
  40. src/app/page.tsx

PHASE 8 — Assets & Polish:
  41. public/favicon.svg
  42. README.md
  43. Generate OG image
  44. Test all sections
  45. Mobile responsiveness pass
  46. Performance optimization
```

---

**END OF SPECIFICATION — THIS DOCUMENT IS COMPLETE AND SELF-CONTAINED.**
**Cursor should be able to implement the entire project from this spec alone.**
