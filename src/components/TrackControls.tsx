"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerState } from "@/hooks/usePlayer";
import { useWaveform } from "@/hooks/useWaveform";

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, "0")}`;
}

// ── Icons ──────────────────────────────────────────────────────────────────

function IconPrev() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function IconVolumeLow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white/40"
    >
      <path d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
    </svg>
  );
}

function IconVolumeHigh() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white/40"
    >
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

// ── Waveform Progress Bar ──────────────────────────────────────────────────

const WAVEFORM_BARS = 72;

/** Seeded LCG — produces a stable waveform shape per track */
function generateWaveform(seed: string, count: number): number[] {
  let s = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const raw = Array.from({ length: count }, rand);
  // Smooth over neighbours so it looks like real audio energy
  const smoothed = raw.map((v, i) => {
    const win = [raw[i - 2], raw[i - 1], v, raw[i + 1], raw[i + 2]].filter(
      (x): x is number => x !== undefined
    );
    return win.reduce((a, b) => a + b, 0) / win.length;
  });
  const min = Math.min(...smoothed);
  const max = Math.max(...smoothed);
  return smoothed.map((v) => 0.12 + ((v - min) / (max - min)) * 0.88);
}

interface ProgressBarProps {
  progress: number;
  currentTime: number;
  duration: number;
  accentColor: string;
  trackId: string;
  trackSrc: string;
  onSeek: (value: number) => void;
}

function ProgressBar({
  progress,
  currentTime,
  duration,
  accentColor,
  trackId,
  trackSrc,
  onSeek,
}: ProgressBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const realWaveform = useWaveform(trackId, trackSrc);
  const seedWaveform = useMemo(() => generateWaveform(trackId, WAVEFORM_BARS), [trackId]);
  const bars = realWaveform ?? seedWaveform;

  const getPct = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return progress;
      const rect = trackRef.current.getBoundingClientRect();
      return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    },
    [progress]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
      onSeek(getPct(e.clientX));

      const onMove = (ev: MouseEvent) => onSeek(getPct(ev.clientX));
      const onUp = () => {
        setIsDragging(false);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [getPct, onSeek]
  );

  const active = isHovering || isDragging;

  return (
    <div className="flex flex-col gap-2">
      <motion.div
        ref={trackRef}
        className="relative h-[25px] cursor-pointer select-none"
        animate={{ opacity: active ? 1 : 0.4 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          cursor: isDragging ? "grabbing" : "pointer",
          // Mask fades the left and right edges into transparency
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseDown={handleMouseDown}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={trackId}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Dim layer — full waveform */}
            <div className="absolute inset-0 flex items-center gap-[2px]">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 h-full flex items-center">
                  <div className="w-full rounded-full" style={{ height: `${h * 100}%`, backgroundColor: "rgba(255,255,255,0.15)" }} />
                </div>
              ))}
            </div>

            {/* Accent layer — clipped to progress */}
            <div
              className="absolute inset-0 flex items-center gap-[2px]"
              style={{ clipPath: `inset(0 ${100 - progress}% 0 0 round 1px)` }}
            >
              {bars.map((h, i) => (
                <div key={i} className="flex-1 h-full flex items-center">
                  <div
                    className="w-full rounded-full"
                    style={{ height: `${h * 100}%`, backgroundColor: accentColor }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Times */}
      <div className="flex justify-between text-xs text-white/35 tabular-nums select-none">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

// ── Volume Slider ──────────────────────────────────────────────────────────

interface VolumeSliderProps {
  volume: number;
  onChange: (v: number) => void;
  accentColor: string;
}

function VolumeSlider({ volume, onChange, accentColor }: VolumeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const getPct = useCallback((clientX: number) => {
    if (!trackRef.current) return volume;
    const rect = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, [volume]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      onChange(getPct(e.clientX));
      const onMove = (ev: MouseEvent) => onChange(getPct(ev.clientX));
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [getPct, onChange]
  );

  return (
    <div className="flex items-center gap-2 w-32">
      <IconVolumeLow />
      <div
        ref={trackRef}
        className="relative flex-1 h-10 flex items-center cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseDown={handleMouseDown}
      >
        {/* Visual track */}
        <div
          className="absolute inset-x-0 h-[3px] rounded-full"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-colors duration-500"
            style={{ width: `${volume * 100}%`, backgroundColor: accentColor }}
          />
        </div>
        <motion.div
          className="absolute top-1/2 w-2.5 h-2.5 rounded-full bg-white pointer-events-none"
          style={{ left: `${volume * 100}%`, x: "-50%", y: "-50%" }}
          animate={{ scale: isHovering ? 1.4 : 1 }}
          transition={isHovering
            ? { type: "spring", stiffness: 500, damping: 25 }
            : { type: "spring", bounce: 0.55, duration: 0.45 }}
        />
      </div>
      <IconVolumeHigh />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

interface Props {
  player: PlayerState;
}

export default function TrackControls({ player }: Props) {
  const {
    currentTrack,
    isPlaying,
    progress,
    currentTime,
    volume,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleSeek,
    setVolume,
  } = player;

  const [controlsHovered, setControlsHovered] = useState(false);

  // A small offset keeps the positional shift subtle — just enough to imply
  // direction without looking like the buttons are flying in from far away.
  const skipOffset = 22;

  const skipVariants = {
    hidden: (dir: number) => ({
      opacity: 0,
      x: dir * skipOffset,
    }),
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  // Per-property transitions so opacity and position can feel independent:
  // - opacity fades in quickly and cleanly on a gentle ease-in
  // - x drifts in on an expo-out curve: fast start, long graceful deceleration
  //   so the button feels like it materialises rather than slides into place
  const skipTransition = {
    opacity: {
      type: "tween" as const,
      duration: 0.18,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
    x: {
      type: "tween" as const,
      duration: 0.42,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      {/* Progress bar */}
      <ProgressBar
        progress={progress}
        currentTime={currentTime}
        duration={currentTrack.duration}
        accentColor={currentTrack.accentColor}
        trackId={currentTrack.id}
        trackSrc={currentTrack.src}
        onSeek={handleSeek}
      />

      {/* Playback controls */}
      <div
        className="flex items-center justify-center gap-3"
        onMouseEnter={() => setControlsHovered(true)}
        onMouseLeave={() => setControlsHovered(false)}
      >
        {/* Like */}
        <motion.button
          custom={1}
          variants={skipVariants}
          animate={controlsHovered ? "visible" : "hidden"}
          transition={skipTransition}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.88 }}
          className="flex items-center justify-center w-10 h-10 text-white/50 hover:text-white transition-colors"
          aria-label="Like"
          style={{ pointerEvents: controlsHovered ? "auto" : "none" }}
        >
          <IconHeart />
        </motion.button>

        {/* Previous */}
        <motion.button
          custom={1}
          variants={skipVariants}
          animate={controlsHovered ? "visible" : "hidden"}
          transition={skipTransition}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.88 }}
          onClick={handlePrev}
          className="flex items-center justify-center w-10 h-10 text-white/60 hover:text-white transition-colors"
          aria-label="Previous"
          style={{ pointerEvents: controlsHovered ? "auto" : "none" }}
        >
          <IconPrev />
        </motion.button>

        {/* Play / Pause — pill button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 600, damping: 22 }}
          onClick={handleTogglePlay}
          className="flex items-center justify-center w-14 h-14 rounded-[22px] text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${currentTrack.accentColor}cc, ${currentTrack.accentColor}88)`,
            boxShadow: `0 4px 20px ${currentTrack.accentColor}55`,
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <motion.div
            key={isPlaying ? "pause" : "play"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
          </motion.div>
        </motion.button>

        {/* Next */}
        <motion.button
          custom={-1}
          variants={skipVariants}
          animate={controlsHovered ? "visible" : "hidden"}
          transition={skipTransition}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.88 }}
          onClick={handleNext}
          className="flex items-center justify-center w-10 h-10 text-white/60 hover:text-white transition-colors"
          aria-label="Next"
          style={{ pointerEvents: controlsHovered ? "auto" : "none" }}
        >
          <IconNext />
        </motion.button>

        {/* Share */}
        <motion.button
          custom={-1}
          variants={skipVariants}
          animate={controlsHovered ? "visible" : "hidden"}
          transition={skipTransition}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.88 }}
          className="flex items-center justify-center w-10 h-10 text-white/50 hover:text-white transition-colors"
          aria-label="Share"
          style={{ pointerEvents: controlsHovered ? "auto" : "none" }}
        >
          <IconShare />
        </motion.button>
      </div>

      {/* Volume */}
      <div className="flex justify-center">
        <VolumeSlider
          volume={volume}
          onChange={setVolume}
          accentColor={currentTrack.accentColor}
        />
      </div>
    </div>
  );
}
