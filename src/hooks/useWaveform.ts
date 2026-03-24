"use client";

import { useState, useEffect } from "react";

const BAR_COUNT = 72;

// Module-level cache — survives re-renders and track switches within a session
const cache = new Map<string, number[]>();

async function fetchWaveform(src: string): Promise<number[]> {
  const response = await fetch(src, { mode: "cors" });
  const arrayBuffer = await response.arrayBuffer();

  // OfflineAudioContext works for decoding without requiring a user gesture
  const ctx = new OfflineAudioContext(1, 44100, 44100);
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

  const channelData = audioBuffer.getChannelData(0);
  const blockSize = Math.floor(channelData.length / BAR_COUNT);

  const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
    const start = i * blockSize;
    const end = Math.min(start + blockSize, channelData.length);
    let sum = 0;
    for (let j = start; j < end; j++) {
      sum += channelData[j] * channelData[j]; // RMS
    }
    return Math.sqrt(sum / (end - start));
  });

  // Normalize to 0.05–1.0 so even quiet passages have a visible bar
  const max = Math.max(...bars);
  return max > 0 ? bars.map((v) => Math.max(0.05, v / max)) : bars;
}

/**
 * Returns real RMS-amplitude waveform data for the given track.
 * Returns `null` while the audio is still being fetched/decoded.
 * Results are cached per trackId so each track decodes at most once.
 */
export function useWaveform(trackId: string, src: string): number[] | null {
  const [waveform, setWaveform] = useState<number[] | null>(
    () => cache.get(trackId) ?? null
  );

  useEffect(() => {
    if (cache.has(trackId)) {
      setWaveform(cache.get(trackId)!);
      return;
    }

    let cancelled = false;

    fetchWaveform(src)
      .then((bars) => {
        cache.set(trackId, bars);
        if (!cancelled) setWaveform(bars);
      })
      .catch((err) => {
        console.warn("Waveform decode failed for", trackId, err);
      });

    return () => {
      cancelled = true;
    };
  }, [trackId, src]);

  return waveform;
}
