"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/hooks/usePlayer";
import VinylDisc from "./VinylDisc";
import TrackControls from "./TrackControls";
import QueueDrawer from "./QueueDrawer";

function IconQueue() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18A3 3 0 1 0 19 17V8h3V6h-5z" />
    </svg>
  );
}

export default function PlayerCard() {
  const player = usePlayer();
  const { currentTrack, isQueueOpen, toggleQueue, tracks, currentIndex, handleSelectTrack } =
    player;

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#0A0A0F] overflow-hidden">
      {/* ── Ambient background gradient ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(ellipse 70% 60% at 50% 45%, ${currentTrack.accentColor}18 0%, transparent 70%)`,
        }}
        transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* ── Subtle noise texture overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── Player card ── */}
      <motion.div
        className="relative z-10 w-[440px] max-w-[calc(100vw-2rem)] rounded-3xl"
        style={{
          background: "rgba(255,255,255,0.035)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.04) inset",
        }}
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 28, delay: 0.1 }}
      >
        <div className="p-7">
          {/* ── Vinyl disc ── */}
          <VinylDisc track={currentTrack} isPlaying={player.isPlaying} />

          {/* ── Track info ── */}
          <div className="mt-5 text-center min-h-[72px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrack.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              >
                <h1 className="text-white text-xl font-semibold tracking-tight leading-tight">
                  {currentTrack.title}
                </h1>
                <p className="text-white/55 text-sm mt-1.5 font-medium">
                  {currentTrack.artist}
                </p>
                <p className="text-white/30 text-xs mt-0.5">
                  {currentTrack.album}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Controls ── */}
          <TrackControls player={player} />

          {/* ── Queue toggle ── */}
          <div className="flex justify-center mt-5">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              onClick={toggleQueue}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors"
              style={{
                color: isQueueOpen
                  ? currentTrack.accentColor
                  : "rgba(255,255,255,0.4)",
                background: isQueueOpen
                  ? `${currentTrack.accentColor}14`
                  : "transparent",
              }}
              aria-label="Toggle queue"
            >
              <IconQueue />
              <span>Queue</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Footer wordmark ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/15 text-xs tracking-[0.25em] font-light uppercase select-none pointer-events-none">
        Wavelength
      </div>

      {/* ── Queue drawer ── */}
      <QueueDrawer
        tracks={tracks}
        currentIndex={currentIndex}
        isOpen={isQueueOpen}
        onClose={toggleQueue}
        onSelectTrack={handleSelectTrack}
      />
    </div>
  );
}
