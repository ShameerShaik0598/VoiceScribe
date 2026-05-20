import React, { useState } from "react";
import { Passage } from "../data/passage";

interface PassageCardProps {
  passages: Passage[];
  activeId: string | null;
  onLoad: (passage: Passage) => void;
}

const PassageCard: React.FC<PassageCardProps> = ({
  passages,
  activeId,
  onLoad,
}) => {
  // Track which card is showing its tips tooltip
  const [tipsOpenId, setTipsOpenId] = useState<string | null>(null);

  const toggleTips = (e: React.MouseEvent, id: string) => {
    // Prevent the card click (which loads the passage) from firing
    e.stopPropagation();
    setTipsOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section aria-label="Practice passages">
      <p className="section-label">✦ Practice Passages</p>

      {/* Responsive 2-column grid on wider screens */}
      <div className="passage-grid">
        {passages.map((passage) => {
          const isActive = passage.id === activeId;
          const tipsOpen = tipsOpenId === passage.id;

          return (
            <div
              key={passage.id}
              className={`passage-card ${
                isActive ? "passage-card--active" : ""
              }`}
              onClick={() => onLoad(passage)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onLoad(passage);
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              aria-label={`Load passage: ${passage.title}`}
            >
              {/* Active indicator badge */}
              {isActive && (
                <div className="passage-card__active-badge">✓ Loaded</div>
              )}

              {/* Genre badge */}
              <div className="passage-card__badge">
                <span>{passage.icon}</span>
                <span>{passage.genre}</span>
              </div>

              {/* Title */}
              <h2 className="passage-card__title">{passage.title}</h2>

              {/* Preview */}
              <p className="passage-card__preview">{passage.preview}</p>

              {/* Footer row: CTA + Tips toggle */}
              <div className="passage-card__footer">
                <span className="passage-card__cta" aria-hidden="true">
                  {isActive ? "Loaded ✓" : "Click to load ›"}
                </span>

                {/* Tips button */}
                <button
                  className="tips-btn"
                  onClick={(e) => toggleTips(e, passage.id)}
                  aria-label={`${
                    tipsOpen ? "Hide" : "Show"
                  } pronunciation tips for ${passage.title}`}
                  title="Pronunciation tips"
                >
                  💡 Tips
                </button>
              </div>

              {/* Tips panel — expands inline below the footer */}
              {tipsOpen && (
                <div
                  className="tips-panel"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="tips-panel__heading">RP Focus Points</p>
                  <ul className="tips-panel__list">
                    {passage.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PassageCard;
