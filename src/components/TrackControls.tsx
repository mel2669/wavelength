"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { PlayerState } from "@/hooks/usePlayer";

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

// ── Progress Bar ───────────────────────────────────────────────────────────

interface ProgressBarProps {
  progress: number;
  currentTime: number;
  duration: number;
  accentColor: string;
  onSeek: (value: number) => void;
}

function ProgressBar({
  progress,
  currentTime,
  duration,
  accentColor,
  onSeek,
}: ProgressBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  const thumbScale = isHovering || isDragging ? 1.5 : 1;

  return (
    <div className="flex flex-col gap-2">
      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-10 flex items-center cursor-pointer group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseDown={handleMouseDown}
      >
        {/* Visual track */}
        <div
          className="absolute inset-x-0 h-[3px] rounded-full"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          {/* Filled portion */}
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: accentColor }}
            transition={{ ease: "linear" }}
          />
        </div>

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 w-3 h-3 rounded-full bg-white shadow-md pointer-events-none"
          style={{ left: `${progress}%`, x: "-50%", y: "-50%" }}
          animate={{ scale: thumbScale }}
          transition={thumbScale === 1
            ? { type: "spring", bounce: 0.55, duration: 0.45 }
            : { type: "spring", stiffness: 500, damping: 25 }}
        />
      </div>

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

  return (
    <div className="flex flex-col gap-4 mt-6">
      {/* Progress bar */}
      <ProgressBar
        progress={progress}
        currentTime={currentTime}
        duration={currentTrack.duration}
        accentColor={currentTrack.accentColor}
        onSeek={handleSeek}
      />

      {/* Playback controls */}
      <div className="flex items-center justify-center gap-3">
        {/* Previous */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          onClick={handlePrev}
          className="flex items-center justify-center w-10 h-10 text-white/60 hover:text-white transition-colors"
          aria-label="Previous"
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
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          onClick={handleNext}
          className="flex items-center justify-center w-10 h-10 text-white/60 hover:text-white transition-colors"
          aria-label="Next"
        >
          <IconNext />
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
