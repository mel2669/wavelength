"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { tracks, Track } from "@/lib/tracks";

export interface PlayerState {
  tracks: Track[];
  currentTrack: Track;
  currentIndex: number;
  isPlaying: boolean;
  progress: number; // 0–100
  volume: number; // 0–1
  isQueueOpen: boolean;
  currentTime: number; // seconds
  handleTogglePlay: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleSeek: (value: number) => void;
  handleSelectTrack: (index: number) => void;
  setVolume: (v: number) => void;
  toggleQueue: () => void;
}

export function usePlayer(): PlayerState {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const currentTrack = tracks[currentIndex];
  const isPlayingRef = useRef(isPlaying);
  const currentIndexRef = useRef(currentIndex);
  const durationRef = useRef(currentTrack.duration);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
    durationRef.current = tracks[currentIndex].duration;
  }, [currentIndex]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = (0.1 / durationRef.current) * 100;
        const next = prev + increment;
        if (next >= 100) {
          // Advance to next track
          setTimeout(() => {
            setCurrentIndex((i) => (i + 1) % tracks.length);
            setProgress(0);
            setIsPlaying(true);
          }, 0);
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentIndex]);

  const handleTogglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % tracks.length);
    setProgress(0);
    setIsPlaying(true);
  }, []);

  const handlePrev = useCallback(() => {
    setProgress((prev) => {
      // If more than 3 seconds in, restart track instead of going to prev
      const currentSecs = (prev / 100) * durationRef.current;
      if (currentSecs > 3) {
        return 0;
      }
      setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length);
      return 0;
    });
    setIsPlaying(true);
  }, []);

  const handleSeek = useCallback((value: number) => {
    setProgress(Math.max(0, Math.min(100, value)));
  }, []);

  const handleSelectTrack = useCallback((index: number) => {
    setCurrentIndex(index);
    setProgress(0);
    setIsPlaying(true);
  }, []);

  const toggleQueue = useCallback(() => setIsQueueOpen((p) => !p), []);

  const currentTime = (progress / 100) * currentTrack.duration;

  return {
    tracks,
    currentTrack,
    currentIndex,
    isPlaying,
    progress,
    volume,
    isQueueOpen,
    currentTime,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleSeek,
    handleSelectTrack,
    setVolume,
    toggleQueue,
  };
}
