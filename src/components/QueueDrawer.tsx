"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Track } from "@/lib/tracks";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

function IconNowPlaying() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    </svg>
  );
}

interface Props {
  tracks: Track[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectTrack: (index: number) => void;
}

export default function QueueDrawer({
  tracks,
  currentIndex,
  isOpen,
  onClose,
  onSelectTrack,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30, mass: 0.9 }}
            className="fixed right-0 top-0 bottom-0 z-30 w-80 flex flex-col"
            style={{
              background: "rgba(12, 12, 18, 0.92)",
              backdropFilter: "blur(32px)",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
              <div>
                <h2 className="text-white font-semibold tracking-tight">Up Next</h2>
                <p className="text-white/40 text-xs mt-0.5">
                  {tracks.length} tracks
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-white/40 hover:text-white/80 transition-colors p-1.5 rounded-lg hover:bg-white/5"
              >
                <IconClose />
              </motion.button>
            </div>

            {/* Track list */}
            <div className="flex-1 overflow-y-auto queue-scroll py-2">
              {tracks.map((track, index) => {
                const isActive = index === currentIndex;
                return (
                  <motion.button
                    key={track.id}
                    onClick={() => {
                      onSelectTrack(index);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors relative"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.06)"
                        : "transparent",
                    }}
                  >
                    {/* Active accent bar */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="activeBar"
                          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                          style={{ backgroundColor: track.accentColor }}
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          exit={{ opacity: 0, scaleY: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Artwork */}
                    <div
                      className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0"
                      style={{
                        boxShadow: isActive
                          ? `0 0 12px ${track.accentColor}55`
                          : "none",
                      }}
                    >
                      <Image
                        src={track.artwork}
                        alt={track.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{
                          color: isActive ? "#ffffff" : "rgba(255,255,255,0.75)",
                        }}
                      >
                        {track.title}
                      </p>
                      <p className="text-xs text-white/40 truncate mt-0.5">
                        {track.artist}
                      </p>
                    </div>

                    {/* Duration or playing indicator */}
                    <div className="flex-shrink-0 flex items-center gap-1">
                      {isActive ? (
                        <motion.div
                          animate={{ color: track.accentColor }}
                          transition={{ duration: 0.3 }}
                        >
                          <IconNowPlaying />
                        </motion.div>
                      ) : (
                        <span className="text-xs text-white/30 tabular-nums">
                          {formatTime(track.duration)}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
