"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  analyserNode: AnalyserNode | null;
  accentColor: string;
  isPlaying: boolean;
  side: "left" | "right";
}

// Frequency band ratios per bar index — valley: high → mid → LOW → mid → high
// Bar 2 (center) tracks sub-bass; bars 0 & 4 track highs
const BAND_RATIOS = [0.65, 0.20, 0.05, 0.15, 0.72];

export default function FrequencyVisualizer({ analyserNode, accentColor, isPlaying, side }: Props) {
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);

    if (!isPlaying || !analyserNode) {
      barRefs.current.forEach((el) => {
        if (el) el.style.height = "3px";
      });
      return;
    }

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
      analyserNode.getByteFrequencyData(dataArray);
      BAND_RATIOS.forEach((ratio, i) => {
        const binIndex = Math.floor(ratio * bufferLength);
        const value = dataArray[binIndex] / 255;
        const height = 3 + value * 31; // 3px min → 34px max
        const el = barRefs.current[i];
        if (el) el.style.height = `${height}px`;
      });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, analyserNode]);

  // Mirror bar order on right side for visual symmetry
  const barOrder = side === "right" ? [4, 3, 2, 1, 0] : [0, 1, 2, 3, 4];

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          className="flex items-center gap-[3px] mx-3 self-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {barOrder.map((barIndex) => (
            <div
              key={barIndex}
              ref={(el) => { barRefs.current[barIndex] = el; }}
              style={{
                width: 3,
                height: 3,
                backgroundColor: accentColor,
                borderRadius: 2,
                opacity: 0.4,
                transition: "height 0.06s ease",
                flexShrink: 0,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
