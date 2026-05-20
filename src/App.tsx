/**
 * App.tsx — UPDATED (Batch B)
 * ────────────────────────────
 * Added in this version:
 *  - AmbientPlayer component wired in below StatusBar
 *  - repeatMode prop passed through to Controls
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import PassageCard from "./components/PassageCard";
import TextEditor from "./components/TextEditor";
import Controls from "./components/Controls";
import StatusBar from "./components/StatusBar";
import AmbientPlayer from "./components/AmbientPlayer";
import { useSpeech } from "./hooks/useSpeech";
import passages, { Passage } from "./data/passage";

export type Theme = "light" | "dark";

const App: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [activePassageId, setActivePassageId] = useState<string | null>(null);
  const [activeTips, setActiveTips] = useState<string[]>([]);

  // ── Theme ──
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("vs-theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("vs-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // ── Speech ──
  const speech = useSpeech(text);

  // ── Load passage ──
  const handleLoadPassage = (passage: Passage) => {
    setText(passage.text);
    setActivePassageId(passage.id);
    setActiveTips(passage.tips);
    speech.stop();
  };

  // ── Clear ──
  const handleClear = () => {
    setText("");
    setActivePassageId(null);
    setActiveTips([]);
    speech.stop();
  };

  return (
    <div className="app-root">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="main-content">
        {/* 4 passage cards */}
        <PassageCard
          passages={passages}
          activeId={activePassageId}
          onLoad={handleLoadPassage}
        />

        {/* Pronunciation tips for active passage */}
        {activeTips.length > 0 && (
          <div className="active-tips-bar" aria-label="Pronunciation tips">
            <p className="section-label" style={{ marginBottom: "0.6rem" }}>
              ✦ RP Focus Points for this passage
            </p>
            <ul className="active-tips-list">
              {activeTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Text editor */}
        <TextEditor
          text={text}
          onChange={setText}
          onClear={handleClear}
          highlightIndex={speech.highlightIndex}
          words={speech.words}
        />

        {/* Playback controls — now includes repeat mode */}
        <Controls
          voices={speech.voices}
          selectedVoice={speech.selectedVoice}
          onVoiceChange={speech.setSelectedVoice}
          speed={speech.speed}
          onSpeedChange={speech.setSpeed}
          pitch={speech.pitch}
          onPitchChange={speech.setPitch}
          status={speech.status}
          progress={speech.progress}
          onSkipBackward={speech.skipBackward}
          onSkipForward={speech.skipForward}
          onPlay={speech.play}
          onPause={speech.pause}
          onStop={speech.stop}
          repeatMode={speech.repeatMode}
          onRepeatChange={speech.setRepeatMode}
        />

        <StatusBar status={speech.status} />

        {/* Ambient music player — knows when speech is active for ducking */}
        <AmbientPlayer speechActive={speech.status === "playing"} />
      </main>

      <footer className="site-footer">
        <p>
          VoiceScribe · Free forever · No data collected · Runs entirely in your
          browser
        </p>
      </footer>
    </div>
  );
};

export default App;
