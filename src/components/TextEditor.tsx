/**
 * TextEditor.tsx
 * ──────────────
 * Text input area with three responsibilities:
 *  1. Textarea — where the user types or pastes text
 *  2. Highlight overlay — renders <mark> behind the textarea
 *     around the word currently being spoken
 *  3. Meta bar — live word count, char count, clear button
 *
 * Props:
 *  - text           : current textarea value
 *  - onChange       : update text in App state
 *  - onClear        : clear text and stop speech
 *  - highlightIndex : index of currently spoken word (-1 = none)
 *  - words          : text split into word tokens by useSpeech
 */

import React, { useMemo, useRef, useEffect } from "react";

interface TextEditorProps {
  text: string;
  onChange: (value: string) => void;
  onClear: () => void;
  highlightIndex: number;
  words: string[];
}

const TextEditor: React.FC<TextEditorProps> = ({
  text,
  onChange,
  onClear,
  highlightIndex,
  words,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // ── Word / char counts ──
  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [text]);

  const charCount = text.length;

  // ── Build highlight layer HTML ──
  const highlightHTML = useMemo(() => {
    if (words.length === 0 || highlightIndex < 0) {
      return escapeHtml(text);
    }
    return words
      .map((word, i) => {
        const escaped = escapeHtml(word);
        return i === highlightIndex ? `<mark>${escaped}</mark>` : escaped;
      })
      .join("");
  }, [highlightIndex, words, text]);

  // ── Sync highlight layer scroll with textarea ──
  useEffect(() => {
    const textarea = textareaRef.current;
    const layer = highlightRef.current;
    if (!textarea || !layer) return;
    const syncScroll = () => {
      layer.scrollTop = textarea.scrollTop;
      layer.scrollLeft = textarea.scrollLeft;
    };
    textarea.addEventListener("scroll", syncScroll);
    return () => textarea.removeEventListener("scroll", syncScroll);
  }, []);

  // ── Auto-scroll to highlighted word ──
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || highlightIndex < 0 || words.length === 0) return;
    const charOffset = words.slice(0, highlightIndex).join("").length;
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 28;
    const textUpToWord = text.substring(0, charOffset);
    const lineCount = (textUpToWord.match(/\n/g) || []).length;
    const approxScrollTop = lineCount * lineHeight - textarea.clientHeight / 2;
    if (approxScrollTop > 0) {
      textarea.scrollTop = approxScrollTop;
    }
  }, [highlightIndex, words, text]);

  return (
    <section aria-label="Text editor">
      <div className="editor-header">
        <p className="section-label">✦ Your Text</p>
        <div className="editor-meta">
          <span className="meta-chip" aria-live="polite">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
          <span className="meta-chip" aria-live="polite">
            {charCount} chars
          </span>
          <button
            className="clear-btn"
            onClick={onClear}
            aria-label="Clear all text"
            title="Clear text and stop playback"
            disabled={text.length === 0}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="editor-wrapper">
        <div
          ref={highlightRef}
          className="highlight-layer"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: highlightHTML }}
        />
        <textarea
          ref={textareaRef}
          className="text-input"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste or type your text here… or click the card above to load a sample passage."
          spellCheck={true}
          aria-label="Text to be read aloud"
          rows={10}
        />
      </div>
    </section>
  );
};

// Prevents XSS when injecting user text into dangerouslySetInnerHTML
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default TextEditor;
