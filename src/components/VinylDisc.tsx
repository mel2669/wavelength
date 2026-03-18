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

interface Props {
  track: Track;
  isPlaying: boolean;
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

export default function VinylDisc({ track, isPlaying }: Props) {
  const rotation = useMotionValue(0);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useAnimationFrame((_, delta) => {
    if (isPlayingRef.current) {
      // One full rotation every ~8 seconds
      rotation.set(rotation.get() + (delta / 8000) * 360);
    }
  });

  return (
    <div className="relative flex justify-center items-center py-2">
      {/* Ambient glow that matches accent color */}
      <motion.div
        className="absolute rounded-full blur-3xl pointer-events-none"
        animate={{
          backgroundColor: track.accentColor,
          opacity: isPlaying ? 0.28 : 0.12,
          scale: isPlaying ? 1 : 0.85,
        }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ width: "60%", height: "60%", top: "20%", left: "20%" }}
      />

      {/* Vinyl disc */}
      <motion.div
        className="relative w-72 h-72 rounded-full"
        style={{
          rotate: rotation,
          background: VINYL_GROOVES,
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Outer label edge ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, transparent 24%, rgba(0,0,0,0.4) 24.5%, transparent 25%)",
          }}
        />

        {/* Album art — center circle */}
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            inset: "26%",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={track.id}
              className="absolute inset-0"
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
        </div>

        {/* Center spindle hole */}
        <div
          className="absolute rounded-full bg-[#0A0A0F] z-10"
          style={{
            width: 10,
            height: 10,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
          }}
        />
      </motion.div>
    </div>
  );
}
