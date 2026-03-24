"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { tracks, Track } from "@/lib/tracks";

export interface PlayerState {
  tracks: Track[];
  currentTrack: Track;
  currentIndex: number;
  isPlaying: boolean;
  progress: number; // 0–100
  volume: number;   // 0–1
  isQueueOpen: boolean;
  currentTime: number;
  analyserNode: AnalyserNode | null;
  handleTogglePlay: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleSeek: (value: number) => void;
  handleSelectTrack: (index: number) => void;
  setVolume: (v: number) => void;
  toggleQueue: () => void;
  scratch: (delta: number) => void;
  endScratch: () => void;
}

export function usePlayer(): PlayerState {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.75);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentIndexRef = useRef(0);
  const isPlayingRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // Create audio element once on the client
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = 0.75;
    audio.crossOrigin = "anonymous"; // required for Web Audio API analyser on cross-origin streams
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      if (!audio.duration) return;
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    });

    audio.addEventListener("ended", () => {
      const next = (currentIndexRef.current + 1) % tracks.length;
      setCurrentIndex(next);
      // isPlaying stays true — the track-change effect will play the next one
    });

    audio.src = tracks[0].src;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Load new track whenever currentIndex changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = tracks[currentIndex].src;
    setProgress(0);
    setCurrentTime(0);

    if (isPlayingRef.current) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex]);

  const ensureAudioContext = useCallback(() => {
    if (audioContextRef.current) {
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
      return;
    }
    if (!audioRef.current) return;
    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioContextRef.current = ctx;
      setAnalyserNode(analyser);
    } catch (e) {
      console.warn("AudioContext setup failed:", e);
    }
  }, []);

  // Sync play / pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (isPlaying) {
      ensureAudioContext();
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, ensureAudioContext]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleTogglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % tracks.length);
    setIsPlaying(true);
  }, []);

  const handlePrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setProgress(0);
      setCurrentTime(0);
    } else {
      setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length);
      setIsPlaying(true);
    }
  }, []);

  const handleSeek = useCallback((value: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = (value / 100) * audio.duration;
    setProgress(value);
  }, []);

  const handleSelectTrack = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  }, []);

  const setVolume = useCallback((v: number) => setVolumeState(v), []);
  const toggleQueue = useCallback(() => setIsQueueOpen((p) => !p), []);

  // Scratch: directly set playbackRate. Works when playing; silent when paused.
  const scratchStartedPlay = useRef(false);

  const scratch = useCallback((delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Start playback if not already playing (so scratch is audible)
    if (audio.paused && !scratchStartedPlay.current) {
      audio.play().catch(() => {});
      scratchStartedPlay.current = true;
    }

    if (delta >= 0) {
      // Forward scratch — proportional speed-up
      audio.playbackRate = Math.max(0.25, Math.min(4, delta * 0.3));
    } else {
      // Backward scratch — stutter effect:
      // Play at 2× forward speed while seeking the position back each frame.
      // The rapid tiny-snippet playback creates the characteristic scratch sound.
      audio.playbackRate = 2;
      audio.currentTime = Math.max(0, audio.currentTime - Math.abs(delta) * 0.008);
    }
  }, []);

  const endScratch = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = 1;
    // If we started playback just for the scratch, stop again
    if (scratchStartedPlay.current) {
      audio.pause();
      scratchStartedPlay.current = false;
    }
  }, []);

  return {
    tracks,
    currentTrack: tracks[currentIndex],
    currentIndex,
    isPlaying,
    progress,
    volume,
    isQueueOpen,
    currentTime,
    analyserNode,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleSeek,
    handleSelectTrack,
    setVolume,
    toggleQueue,
    scratch,
    endScratch,
  };
}
