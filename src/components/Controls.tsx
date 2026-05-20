<<<<<<< HEAD
/**
 * Controls.tsx — UPDATED (Skip feature)
 * ───────────────────────────────────────
 * Added in this version:
 *  - Skip backward 10s button (◀◀)
 *  - Skip forward 10s button  (▶▶)
 *
 * Button layout:
 *  ◀◀ 10s  |  ▶ Play  |  ⏸ Pause  |  ⏹ Stop  |  ▶▶ 10s  |  🔁 Repeat
 */

import React from "react";
import { SpeechStatus } from "../hooks/useSpeech";

interface ControlsProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  onVoiceChange: (uri: string) => void;
  speed: number;
  onSpeedChange: (v: number) => void;
  pitch: number;
  onPitchChange: (v: number) => void;
  status: SpeechStatus;
  progress: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  repeatMode: boolean;
  onRepeatChange: (v: boolean) => void;
}

const SPEED_PRESETS = [
  { label: "Slow", value: 0.7 },
  { label: "Normal", value: 1.0 },
  { label: "Fast", value: 1.4 },
];

const Controls: React.FC<ControlsProps> = ({
  voices,
  selectedVoice,
  onVoiceChange,
  speed,
  onSpeedChange,
  pitch,
  onPitchChange,
  status,
  progress,
  onPlay,
  onPause,
  onStop,
  onSkipForward,
  onSkipBackward,
  repeatMode,
  onRepeatChange,
}) => {
  const isPlaying = status === "playing";
  const isPaused = status === "paused";
  const isIdle = status === "idle" || status === "stopped";
  const canSkip = isPlaying || isPaused;

  return (
    <section className="controls-panel" aria-label="Playback controls">
      {/* ── Voice Selector ── */}
      <div className="control-group">
        <label htmlFor="voice-select" className="control-label">
          Voice
        </label>
        <div className="select-wrapper">
          <select
            id="voice-select"
            className="voice-select"
            value={selectedVoice}
            onChange={(e) => onVoiceChange(e.target.value)}
          >
            {voices.length === 0 && <option value="">Loading voices…</option>}
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Speed Slider + Presets ── */}
      <div className="control-group">
        <label htmlFor="speed-slider" className="control-label">
          Speed <span className="slider-value">{speed.toFixed(1)}×</span>
        </label>
        <div className="speed-presets">
          {SPEED_PRESETS.map((p) => (
            <button
              key={p.label}
              className={`preset-btn ${
                speed === p.value ? "preset-btn--active" : ""
              }`}
              onClick={() => onSpeedChange(p.value)}
              aria-pressed={speed === p.value}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="slider-track">
          <span className="slider-hint">0.5×</span>
          <input
            type="range"
            id="speed-slider"
            className="range-slider"
            min={0.5}
            max={2}
            step={0.1}
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            aria-label="Speech speed"
          />
          <span className="slider-hint">2×</span>
        </div>
      </div>

      {/* ── Pitch Slider ── */}
      <div className="control-group">
        <label htmlFor="pitch-slider" className="control-label">
          Pitch <span className="slider-value">{pitch.toFixed(1)}</span>
        </label>
        <div className="slider-track">
          <span className="slider-hint">Low</span>
          <input
            type="range"
            id="pitch-slider"
            className="range-slider"
            min={0.5}
            max={2}
            step={0.1}
            value={pitch}
            onChange={(e) => onPitchChange(parseFloat(e.target.value))}
            aria-label="Speech pitch"
          />
          <span className="slider-hint">High</span>
        </div>
      </div>

      {/* ── Playback Buttons ── */}
      <div className="playback-row">
        <div
          className="playback-buttons"
          role="group"
          aria-label="Playback buttons"
        >
          {/* Skip backward */}
          <button
            className="btn btn--skip"
            onClick={onSkipBackward}
            disabled={!canSkip}
            title="Skip back 10s  [←]"
            aria-label="Skip backward 10 seconds"
          >
            <span className="btn-icon" aria-hidden="true">
              ◀◀
            </span>
            <span className="btn-label">10s</span>
          </button>

          {/* Play / Resume */}
          <button
            className="btn btn--play"
            onClick={onPlay}
            disabled={isPlaying}
            title="Play  [Space]"
          >
            <span className="btn-icon" aria-hidden="true">
              ▶
            </span>
            <span className="btn-label">{isPaused ? "Resume" : "Play"}</span>
          </button>

          {/* Pause */}
          <button
            className="btn btn--pause"
            onClick={onPause}
            disabled={!isPlaying}
            title="Pause  [Space]"
          >
            <span className="btn-icon" aria-hidden="true">
              ⏸
            </span>
            <span className="btn-label">Pause</span>
          </button>

          {/* Stop */}
          <button
            className="btn btn--stop"
            onClick={onStop}
            disabled={isIdle}
            title="Stop  [Esc]"
          >
            <span className="btn-icon" aria-hidden="true">
              ⏹
            </span>
            <span className="btn-label">Stop</span>
          </button>

          {/* Skip forward */}
          <button
            className="btn btn--skip"
            onClick={onSkipForward}
            disabled={!canSkip}
            title="Skip forward 10s  [→]"
            aria-label="Skip forward 10 seconds"
          >
            <span className="btn-icon" aria-hidden="true">
              ▶▶
            </span>
            <span className="btn-label">10s</span>
          </button>
        </div>

        {/* Repeat toggle */}
        <button
          className={`repeat-btn ${repeatMode ? "repeat-btn--active" : ""}`}
          onClick={() => onRepeatChange(!repeatMode)}
          aria-pressed={repeatMode}
          title="Loop passage continuously"
        >
          <span aria-hidden="true">{repeatMode ? "↺" : "↺"}</span>
          <span>{repeatMode ? "On" : "Repeat"}</span>
        </button>
      </div>

      {/* Keyboard hint for skip */}
      <p className="skip-hint">← → arrow keys also skip while playing</p>

      {/* ── Progress Bar ── */}
      <div
        className="progress-container"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
};

export default Controls;
=======
/**
 * Controls.tsx — UPDATED (Skip feature)
 * ───────────────────────────────────────
 * Added in this version:
 *  - Skip backward 10s button (◀◀)
 *  - Skip forward 10s button  (▶▶)
 *
 * Button layout:
 *  ◀◀ 10s  |  ▶ Play  |  ⏸ Pause  |  ⏹ Stop  |  ▶▶ 10s  |  🔁 Repeat
 */

import React from "react";
import { SpeechStatus } from "../hooks/useSpeech";

interface ControlsProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  onVoiceChange: (uri: string) => void;
  speed: number;
  onSpeedChange: (v: number) => void;
  pitch: number;
  onPitchChange: (v: number) => void;
  status: SpeechStatus;
  progress: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  repeatMode: boolean;
  onRepeatChange: (v: boolean) => void;
}

const SPEED_PRESETS = [
  { label: "Slow", value: 0.7 },
  { label: "Normal", value: 1.0 },
  { label: "Fast", value: 1.4 },
];

const Controls: React.FC<ControlsProps> = ({
  voices,
  selectedVoice,
  onVoiceChange,
  speed,
  onSpeedChange,
  pitch,
  onPitchChange,
  status,
  progress,
  onPlay,
  onPause,
  onStop,
  onSkipForward,
  onSkipBackward,
  repeatMode,
  onRepeatChange,
}) => {
  const isPlaying = status === "playing";
  const isPaused = status === "paused";
  const isIdle = status === "idle" || status === "stopped";
  const canSkip = isPlaying || isPaused;

  return (
    <section className="controls-panel" aria-label="Playback controls">
      {/* ── Voice Selector ── */}
      <div className="control-group">
        <label htmlFor="voice-select" className="control-label">
          Voice
        </label>
        <div className="select-wrapper">
          <select
            id="voice-select"
            className="voice-select"
            value={selectedVoice}
            onChange={(e) => onVoiceChange(e.target.value)}
          >
            {voices.length === 0 && <option value="">Loading voices…</option>}
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Speed Slider + Presets ── */}
      <div className="control-group">
        <label htmlFor="speed-slider" className="control-label">
          Speed <span className="slider-value">{speed.toFixed(1)}×</span>
        </label>
        <div className="speed-presets">
          {SPEED_PRESETS.map((p) => (
            <button
              key={p.label}
              className={`preset-btn ${
                speed === p.value ? "preset-btn--active" : ""
              }`}
              onClick={() => onSpeedChange(p.value)}
              aria-pressed={speed === p.value}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="slider-track">
          <span className="slider-hint">0.5×</span>
          <input
            type="range"
            id="speed-slider"
            className="range-slider"
            min={0.5}
            max={2}
            step={0.1}
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            aria-label="Speech speed"
          />
          <span className="slider-hint">2×</span>
        </div>
      </div>

      {/* ── Pitch Slider ── */}
      <div className="control-group">
        <label htmlFor="pitch-slider" className="control-label">
          Pitch <span className="slider-value">{pitch.toFixed(1)}</span>
        </label>
        <div className="slider-track">
          <span className="slider-hint">Low</span>
          <input
            type="range"
            id="pitch-slider"
            className="range-slider"
            min={0.5}
            max={2}
            step={0.1}
            value={pitch}
            onChange={(e) => onPitchChange(parseFloat(e.target.value))}
            aria-label="Speech pitch"
          />
          <span className="slider-hint">High</span>
        </div>
      </div>

      {/* ── Playback Buttons ── */}
      <div className="playback-row">
        <div
          className="playback-buttons"
          role="group"
          aria-label="Playback buttons"
        >
          {/* Skip backward */}
          <button
            className="btn btn--skip"
            onClick={onSkipBackward}
            disabled={!canSkip}
            title="Skip back 10s  [←]"
            aria-label="Skip backward 10 seconds"
          >
            <span className="btn-icon" aria-hidden="true">
              ◀◀
            </span>
            <span className="btn-label">10s</span>
          </button>

          {/* Play / Resume */}
          <button
            className="btn btn--play"
            onClick={onPlay}
            disabled={isPlaying}
            title="Play  [Space]"
          >
            <span className="btn-icon" aria-hidden="true">
              ▶
            </span>
            <span className="btn-label">{isPaused ? "Resume" : "Play"}</span>
          </button>

          {/* Pause */}
          <button
            className="btn btn--pause"
            onClick={onPause}
            disabled={!isPlaying}
            title="Pause  [Space]"
          >
            <span className="btn-icon" aria-hidden="true">
              ⏸
            </span>
            <span className="btn-label">Pause</span>
          </button>

          {/* Stop */}
          <button
            className="btn btn--stop"
            onClick={onStop}
            disabled={isIdle}
            title="Stop  [Esc]"
          >
            <span className="btn-icon" aria-hidden="true">
              ⏹
            </span>
            <span className="btn-label">Stop</span>
          </button>

          {/* Skip forward */}
          <button
            className="btn btn--skip"
            onClick={onSkipForward}
            disabled={!canSkip}
            title="Skip forward 10s  [→]"
            aria-label="Skip forward 10 seconds"
          >
            <span className="btn-icon" aria-hidden="true">
              ▶▶
            </span>
            <span className="btn-label">10s</span>
          </button>
        </div>

        {/* Repeat toggle */}
        <button
          className={`repeat-btn ${repeatMode ? "repeat-btn--active" : ""}`}
          onClick={() => onRepeatChange(!repeatMode)}
          aria-pressed={repeatMode}
          title="Loop passage continuously"
        >
          <span aria-hidden="true">{repeatMode ? "↺" : "↺"}</span>
          <span>{repeatMode ? "On" : "Repeat"}</span>
        </button>
      </div>

      {/* Keyboard hint for skip */}
      <p className="skip-hint">← → arrow keys also skip while playing</p>

      {/* ── Progress Bar ── */}
      <div
        className="progress-container"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
};

export default Controls;
>>>>>>> 6c8297358e3854cdff1b01f24ef0d9562659fa06
