/**
 * AmbientPlayer.tsx
 * ─────────────────
 * Background ambient music player.
 *
 * Features:
 *  - 4 ambient tracks (all free, sourced from public CDNs)
 *  - Play / stop toggle
 *  - Volume slider
 *  - Loops continuously while enabled
 *  - Automatically lowers volume when speech starts playing
 *    and restores it when speech stops (ducking effect)
 *
 * No external libraries — uses the browser's HTMLAudioElement.
 *
 * Props:
 *  - speechActive : true when TTS is playing — triggers audio ducking
 */

import React, { useState, useEffect, useRef } from "react";

// ─── Ambient track definitions ────────────────────────────
// All tracks are free-to-use ambient audio from public sources.
// Replace the url values with any freely hosted .mp3 if needed.
const AMBIENT_TRACKS = [
  {
    id: "rain",
    label: "Rainy Window",
    icon: "🌧️",
    url: "https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3",
  },
  {
    id: "fireplace",
    label: "Fireplace",
    icon: "🔥",
    url: "https://assets.mixkit.co/active_storage/sfx/1210/1210-preview.mp3",
  },
  {
    id: "cafe",
    label: "Café Murmur",
    icon: "☕",
    url: "https://assets.mixkit.co/active_storage/sfx/2583/2583-preview.mp3",
  },
  {
    id: "nature",
    label: "Forest Birds",
    icon: "🌿",
    url: "https://assets.mixkit.co/active_storage/sfx/2517/2517-preview.mp3",
  },
];

// ─── Props ────────────────────────────────────────────────
interface AmbientPlayerProps {
  speechActive: boolean; // passed from App — ducks volume during TTS
}

// ─── Component ────────────────────────────────────────────
const AmbientPlayer: React.FC<AmbientPlayerProps> = ({ speechActive }) => {
  const [isOpen, setIsOpen] = useState(true); // panel collapsed by default
  const [selectedTrack, setSelectedTrack] = useState(AMBIENT_TRACKS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4); // 0–1

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Create / switch audio element when track changes ──
  useEffect(() => {
    // Tear down any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!isPlaying) return;

    const track = AMBIENT_TRACKS.find((t) => t.id === selectedTrack);
    if (!track) return;

    const audio = new Audio(track.url);
    audio.loop = true;
    audio.volume = speechActive ? volume * 0.25 : volume; // duck if TTS playing
    audio.play().catch(() => {
      // Autoplay blocked — user will need to interact first
      setIsPlaying(false);
    });
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrack, isPlaying]);

  // ── Volume changes ──
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = speechActive ? volume * 0.25 : volume;
  }, [volume, speechActive]);

  // ── Audio ducking — lower volume when TTS is speaking ──
  useEffect(() => {
    if (!audioRef.current) return;
    // Smoothly duck to 25% when speech plays, restore when it stops
    audioRef.current.volume = speechActive ? volume * 0.25 : volume;
  }, [speechActive, volume]);

  // ── Stop audio on unmount ──
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // ── Toggle play/stop ──
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      audioRef.current = null;
      setIsPlaying(false);
    } else {
      setIsPlaying(true); // useEffect above handles creating the audio
    }
  };

  // ── Switch track ──
  const handleTrackChange = (id: string) => {
    setSelectedTrack(id);
    // If already playing, the useEffect will restart with new track
  };

  const activeTrack = AMBIENT_TRACKS.find((t) => t.id === selectedTrack)!;

  return (
    <div className="ambient-player">
      {/* ── Collapsed header row ── */}
      <button
        className="ambient-header"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Toggle ambient music panel"
      >
        <span className="ambient-header__left">
          <span className="ambient-icon" aria-hidden="true">
            🎵
          </span>
          <span className="ambient-title">Ambient Music</span>
          {isPlaying && (
            <span className="ambient-playing-badge">
              {activeTrack.icon} Playing
            </span>
          )}
        </span>
        <span className="ambient-chevron" aria-hidden="true">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* ── Expanded panel ── */}
      {isOpen && (
        <div className="ambient-body">
          {/* Track selector */}
          <div className="ambient-tracks">
            {AMBIENT_TRACKS.map((track) => (
              <button
                key={track.id}
                className={`ambient-track-btn ${
                  selectedTrack === track.id ? "ambient-track-btn--active" : ""
                }`}
                onClick={() => handleTrackChange(track.id)}
                aria-pressed={selectedTrack === track.id}
                title={track.label}
              >
                <span>{track.icon}</span>
                <span>{track.label}</span>
              </button>
            ))}
          </div>

          {/* Volume + play controls */}
          <div className="ambient-controls">
            {/* Play / Stop button */}
            <button
              className={`ambient-play-btn ${
                isPlaying ? "ambient-play-btn--playing" : ""
              }`}
              onClick={togglePlay}
              aria-label={
                isPlaying ? "Stop ambient music" : "Play ambient music"
              }
            >
              {isPlaying ? "⏹ Stop" : "▶ Play"}
            </button>

            {/* Volume slider */}
            <div className="ambient-volume">
              <span className="slider-hint" aria-hidden="true">
                🔈
              </span>
              <input
                type="range"
                className="range-slider"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                aria-label="Ambient music volume"
              />
              <span className="slider-hint" aria-hidden="true">
                🔊
              </span>
            </div>
          </div>

          {/* Ducking notice */}
          {isPlaying && (
            <p className="ambient-note">
              {speechActive
                ? "🔉 Volume lowered while speech plays"
                : "Volume restores when speech stops"}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AmbientPlayer;
