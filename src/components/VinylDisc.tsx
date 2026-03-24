"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { Track } from "@/lib/tracks";
import FrequencyVisualizer from "./FrequencyVisualizer";

interface Props {
  track: Track;
  isPlaying: boolean;
  analyserNode: AnalyserNode | null;
  onScratch: (rate: number) => void;
  onScratchEnd: () => void;
}

const VINYL_GROOVES = `
  radial-gradient(
    circle at center,
    #222 0%,
    #222 27%,
    rgba(255,255,255,0.035) 27.3%,
    #161616 27.8%,
    #161616 30.5%,
    rgba(255,255,255,0.025) 30.8%,
    #161616 31.3%,
    #161616 34%,
    rgba(255,255,255,0.025) 34.3%,
    #161616 34.8%,
    #161616 37.5%,
    rgba(255,255,255,0.025) 37.8%,
    #161616 38.3%,
    #161616 41%,
    rgba(255,255,255,0.025) 41.3%,
    #161616 41.8%,
    #161616 44.5%,
    rgba(255,255,255,0.02) 44.8%,
    #161616 45.3%,
    #161616 100%
  )
`;

/** Returns the angle (degrees) of a point relative to a center. */
function getAngle(cx: number, cy: number, mx: number, my: number): number {
  return Math.atan2(my - cy, mx - cx) * (180 / Math.PI);
}

/** Shortest signed difference between two angles, handling the ±180 wrap. */
function angleDiff(a: number, b: number): number {
  let d = a - b;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

export default function VinylDisc({ track, isPlaying, analyserNode, onScratch, onScratchEnd }: Props) {
  const rotation    = useMotionValue(0);
  const isPlayingRef   = useRef(isPlaying);
  const isScratchingRef = useRef(false);
  const discRef     = useRef<HTMLDivElement>(null);
  const lastAngleRef   = useRef(0);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // Auto-rotate while playing and not being scratched
  useAnimationFrame((_, delta) => {
    if (isPlayingRef.current && !isScratchingRef.current) {
      rotation.set(rotation.get() + (delta / 8000) * 360);
    }
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isScratchingRef.current = true;

    const rect = discRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    lastAngleRef.current = getAngle(cx, cy, e.clientX, e.clientY);

    const onMove = (ev: MouseEvent) => {
      const r = discRef.current?.getBoundingClientRect();
      if (!r) return;
      const ccx = r.left + r.width  / 2;
      const ccy = r.top  + r.height / 2;

      const currentAngle = getAngle(ccx, ccy, ev.clientX, ev.clientY);
      const delta = angleDiff(currentAngle, lastAngleRef.current);
      lastAngleRef.current = currentAngle;

      // Rotate the disc to follow the drag
      rotation.set(rotation.get() + delta);

      // Pass raw delta — positive = forward, negative = backward.
      // usePlayer handles the forward/backward audio logic.
      onScratch(delta);
    };

    const onUp = () => {
      isScratchingRef.current = false;
      onScratchEnd();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className="relative flex justify-center items-center py-2">
      {/* Left frequency visualizer */}
      <FrequencyVisualizer
        analyserNode={analyserNode}
        accentColor={track.accentColor}
        isPlaying={isPlaying}
        side="left"
      />

      {/* Ambient glow */}
      <motion.div
        className="absolute rounded-full blur-3xl pointer-events-none"
        animate={{
          backgroundColor: track.accentColor,
          opacity: isPlaying ? 0.28 : 0.12,
          scale:   isPlaying ? 1    : 0.85,
        }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ width: "60%", height: "60%", top: "20%", left: "20%" }}
      />

      {/* Vinyl disc */}
      <motion.div
        ref={discRef}
        className="relative w-72 h-72 rounded-full cursor-grab active:cursor-grabbing"
        style={{
          rotate: rotation,
          background: VINYL_GROOVES,
          boxShadow: "0 8px 40px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Outer label edge ring */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, transparent 24%, rgba(0,0,0,0.4) 24.5%, transparent 25%)",
          }}
        />

        {/* Rotating groove shimmer */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `conic-gradient(
              from 45deg at 50% 50%,
              transparent            0deg,
              rgba(255,255,255,0.04) 12deg,
              rgba(255,255,255,0.16) 20deg,
              rgba(255,255,255,0.22) 25deg,
              rgba(255,255,255,0.16) 30deg,
              rgba(255,255,255,0.04) 42deg,
              transparent           55deg,
              transparent          215deg,
              rgba(255,255,255,0.03) 224deg,
              rgba(255,255,255,0.10) 230deg,
              rgba(255,255,255,0.03) 238deg,
              transparent          248deg,
              transparent          360deg
            )`,
            maskImage: "radial-gradient(circle at center, transparent 25%, black 27%)",
            WebkitMaskImage: "radial-gradient(circle at center, transparent 25%, black 27%)",
            mixBlendMode: "screen",
          }}
        />

        {/* Album art — center circle */}
        <AnimatePresence mode="wait">
          <motion.div
            key={track.id}
            className="absolute rounded-full overflow-hidden pointer-events-none"
            style={{ inset: "26%", boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <Image
              src={track.artwork}
              alt={track.title}
              fill
              className="object-cover"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>

        {/* Center spindle hole */}
        <div
          className="absolute rounded-full bg-[#0A0A0F] z-10 pointer-events-none"
          style={{
            width: 10, height: 10,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
          }}
        />
      </motion.div>

      {/* Right frequency visualizer */}
      <FrequencyVisualizer
        analyserNode={analyserNode}
        accentColor={track.accentColor}
        isPlaying={isPlaying}
        side="right"
      />

      {/* Fixed specular reflection — light from top-left, matches 135° card gradient */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 288, height: 288,
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(
            ellipse 55% 55% at 27% 27%,
            rgba(255,255,255,0.20) 0%,
            rgba(255,255,255,0.09) 28%,
            rgba(255,255,255,0.02) 48%,
            transparent 62%
          )`,
        }}
      />
    </div>
  );
}
