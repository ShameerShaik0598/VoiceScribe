/**
 * Header.tsx
 * ──────────
 * Top navigation bar.
 * Displays the app brand and the dark/light mode toggle button.
 *
 * Props:
 *  - theme         : current theme ("light" | "dark")
 *  - onToggleTheme : callback to flip the theme in App.tsx
 */

import React from "react";
import { Theme } from "../App";

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">
            🎙
          </span>
          <h1 className="brand-name">VoiceScribe</h1>
          <span className="brand-tag">British RP Practice</span>
        </div>

        <button
          className="theme-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title="Toggle dark / light mode"
        >
          <span className="theme-icon theme-icon--light" aria-hidden="true">
            ☀️
          </span>
          <span className="theme-icon theme-icon--dark" aria-hidden="true">
            🌙
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
