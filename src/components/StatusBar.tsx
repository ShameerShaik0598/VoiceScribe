/**
 * StatusBar.tsx
 * ─────────────
 * A slim bar at the bottom of the app that shows:
 *  - A coloured dot indicating the current speech state
 *  - A human-readable status message
 *  - A keyboard shortcut hint (hidden on small screens via CSS)
 *
 * The dot animates (pulses) while speech is playing.
 * All visual states are driven by the `status` prop —
 * no internal state needed.
 *
 * Props:
 *  - status : SpeechStatus from useSpeech hook
 */

import React from "react";
import { SpeechStatus } from "../hooks/useSpeech";

// ─── Props ────────────────────────────────────────────────
interface StatusBarProps {
  status: SpeechStatus;
}

// ─── Status → human-readable message map ─────────────────
const STATUS_MESSAGES: Record<SpeechStatus, string> = {
  idle: "Ready — press Play or Space to begin",
  // loading: "Downloading voice model — one moment…",
  // generating: "Generating audio…",
  playing: "Playing…",
  paused: "Paused — press Space or Resume to continue",
  stopped: "Stopped",
  error: "Something went wrong — please try again",
};

// ─── Component ────────────────────────────────────────────
const StatusBar: React.FC<StatusBarProps> = ({ status }) => {
  return (
    <div
      className="status-bar"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Coloured dot — CSS class drives the colour and pulse animation */}
      <span className={`status-dot status-dot--${status}`} aria-hidden="true" />

      {/* Status message */}
      <span className="status-text">{STATUS_MESSAGES[status]}</span>

      {/* Keyboard shortcut reminder — visible on wider screens only */}
      <span
        className="keyboard-hint"
        aria-label="Keyboard shortcuts: Space to play or pause, Escape to stop"
      >
        Space: Play / Pause · Esc: Stop
      </span>
    </div>
  );
};

export default StatusBar;
