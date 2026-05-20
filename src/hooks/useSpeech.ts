<<<<<<< HEAD
import { useState, useEffect, useRef, useCallback } from "react";

export type SpeechStatus = "idle" | "playing" | "paused" | "stopped" | "error";

export interface UseSpeechReturn {
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  setSelectedVoice: (uri: string) => void;
  speed: number;
  setSpeed: (v: number) => void;
  pitch: number;
  setPitch: (v: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  skipForward: () => void;
  skipBackward: () => void;
  status: SpeechStatus;
  progress: number;
  highlightIndex: number;
  words: string[];
  repeatMode: boolean;
  setRepeatMode: (v: boolean) => void;
}

const BRITISH_VOICE_PREFERENCES = [
  "Google UK English Female",
  "Google UK English Male",
  "Microsoft Libby",
  "Microsoft Sonia",
  "Microsoft Ryan",
  "Microsoft Hazel",
  "Microsoft George",
  "Daniel",
  "Kate",
  "Oliver",
];

// Average English speech characters per second at rate=1.0
// Used to estimate how far 10 seconds of audio is in characters
const CHARS_PER_SECOND_BASE = 14;

export function useSpeech(text: string): UseSpeechReturn {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [speed, setSpeed] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [words, setWords] = useState<string[]>([]);
  const [repeatMode, setRepeatMode] = useState<boolean>(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const repeatRef = useRef(repeatMode);
  const playRef = useRef<() => void>(() => {});

  // Track current character position during playback for skip logic
  const currentCharRef = useRef<number>(0);
  // Track the char offset the current utterance started from
  // (used when we restart from a mid-text position)
  const startOffsetRef = useRef<number>(0);

  useEffect(() => {
    repeatRef.current = repeatMode;
  }, [repeatMode]);

  // ── 1. Load voices ──
  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length === 0) return;
      setVoices(available);
      const preferred = BRITISH_VOICE_PREFERENCES.map((name) =>
        available.find((v) => v.name.includes(name))
      ).find(Boolean);
      const enGB = available.find((v) => v.lang === "en-GB");
      const auto = preferred || enGB || available[0];
      if (auto) setSelectedVoice(auto.voiceURI);
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  // ── 2. Tokenise text ──
  useEffect(() => {
    if (!text.trim()) {
      setWords([]);
      setHighlightIndex(-1);
      return;
    }
    const tokens = text.split(/(\s+)/).filter((t) => t.length > 0);
    setWords(tokens);
  }, [text]);

  // ── Internal: speak from a character offset ──
  // This is the core function used by both play() and the skip functions.
  // offset = character index in the FULL text to start from.
  const speakFrom = useCallback(
    (offset: number) => {
      if (!text.trim()) return;
      const synth = window.speechSynthesis;

      synth.cancel();
      setHighlightIndex(-1);

      // Clamp offset to valid range
      const safeOffset = Math.max(0, Math.min(offset, text.length - 1));

      // Find the nearest word boundary at or after safeOffset
      // so we don't start mid-word
      const wordBoundary = text.indexOf(" ", safeOffset);
      const startChar = wordBoundary === -1 ? safeOffset : wordBoundary + 1;

      startOffsetRef.current = startChar;
      currentCharRef.current = startChar;

      // Slice the text from startChar onwards
      const slicedText = text.slice(startChar);
      if (!slicedText.trim()) return;

      const utterance = new SpeechSynthesisUtterance(slicedText);
      utteranceRef.current = utterance;

      const voice = voices.find((v) => v.voiceURI === selectedVoice);
      if (voice) utterance.voice = voice;
      utterance.rate = speed;
      utterance.pitch = pitch;
      utterance.lang = "en-GB";

      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        if (event.name !== "word") return;

        // charIndex here is relative to slicedText — add startChar to get
        // the absolute position in the full text
        const absoluteChar = startChar + event.charIndex;
        currentCharRef.current = absoluteChar;

        // Find which word token this falls in
        let cursor = 0;
        for (let i = 0; i < words.length; i++) {
          cursor += words[i].length;
          if (cursor > absoluteChar) {
            if (words[i].trim().length > 0) setHighlightIndex(i);
            break;
          }
        }

        // Progress relative to full text
        const pct = Math.min(
          100,
          Math.round((absoluteChar / text.length) * 100)
        );
        setProgress(pct);
      };

      utterance.onend = () => {
        setHighlightIndex(-1);
        setProgress(100);
        if (repeatRef.current) {
          setTimeout(() => {
            setProgress(0);
            // Repeat always restarts from the beginning
            startOffsetRef.current = 0;
            currentCharRef.current = 0;
            playRef.current();
          }, 800);
        } else {
          setStatus("idle");
          setTimeout(() => setProgress(0), 800);
        }
      };

      utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
        if (e.error === "interrupted" || e.error === "canceled") return;
        console.warn("SpeechSynthesis error:", e.error);
        setStatus("error");
        setHighlightIndex(-1);
      };

      utterance.onstart = () => setStatus("playing");

      synth.speak(utterance);
      setStatus("playing");
    },
    [text, voices, selectedVoice, speed, pitch, words]
  );

  // ── 3. Play (starts from beginning) ──
  const play = useCallback(() => {
    if (!text.trim()) return;

    // Resume if paused — no restart needed
    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
      return;
    }

    // Reset position tracking and speak from start
    startOffsetRef.current = 0;
    currentCharRef.current = 0;
    setProgress(0);
    speakFrom(0);
  }, [text, status, speakFrom]);

  useEffect(() => {
    playRef.current = play;
  }, [play]);

  // ── 4. Pause ──
  const pause = useCallback(() => {
    if (status !== "playing") return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, [status]);

  // ── 5. Stop ──
  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    currentCharRef.current = 0;
    startOffsetRef.current = 0;
    setStatus("stopped");
    setHighlightIndex(-1);
    setProgress(0);
    setTimeout(() => setStatus("idle"), 1200);
  }, []);

  // ── 6. Skip forward 10 seconds ──
  const skipForward = useCallback(() => {
    if (status !== "playing" && status !== "paused") return;

    // Calculate how many characters 10 seconds represents at current speed
    const charsIn10s = Math.round(CHARS_PER_SECOND_BASE * speed * 10);
    const newOffset = currentCharRef.current + charsIn10s;

    // If skipping forward would go past the end, stop
    if (newOffset >= text.length) {
      stop();
      return;
    }

    speakFrom(newOffset);
  }, [status, speed, text, speakFrom, stop]);

  // ── 7. Skip backward 10 seconds ──
  const skipBackward = useCallback(() => {
    if (status !== "playing" && status !== "paused") return;

    const charsIn10s = Math.round(CHARS_PER_SECOND_BASE * speed * 10);
    const newOffset = currentCharRef.current - charsIn10s;

    // Clamp to start of text
    speakFrom(Math.max(0, newOffset));
  }, [status, speed, speakFrom]);

  // ── 8. Keyboard shortcuts ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;

      if (e.code === "Space") {
        e.preventDefault();
        if (status === "playing") pause();
        else play();
      }
      if (e.code === "Escape") {
        e.preventDefault();
        stop();
      }
      // Arrow keys for skipping
      if (e.code === "ArrowRight") {
        e.preventDefault();
        skipForward();
      }
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        skipBackward();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status, play, pause, stop, skipForward, skipBackward]);

  // ── 9. Cleanup ──
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // ── 10. Cancel if text changes mid-playback ──
  useEffect(() => {
    if (status === "playing" || status === "paused") {
      window.speechSynthesis.cancel();
      setStatus("idle");
      setHighlightIndex(-1);
      setProgress(0);
      currentCharRef.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return {
    voices,
    selectedVoice,
    setSelectedVoice,
    speed,
    setSpeed,
    pitch,
    setPitch,
    play,
    pause,
    stop,
    skipForward,
    skipBackward,
    status,
    progress,
    highlightIndex,
    words,
    repeatMode,
    setRepeatMode,
  };
}
=======
import { useState, useEffect, useRef, useCallback } from "react";

export type SpeechStatus = "idle" | "playing" | "paused" | "stopped" | "error";

export interface UseSpeechReturn {
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  setSelectedVoice: (uri: string) => void;
  speed: number;
  setSpeed: (v: number) => void;
  pitch: number;
  setPitch: (v: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  skipForward: () => void;
  skipBackward: () => void;
  status: SpeechStatus;
  progress: number;
  highlightIndex: number;
  words: string[];
  repeatMode: boolean;
  setRepeatMode: (v: boolean) => void;
}

const BRITISH_VOICE_PREFERENCES = [
  "Google UK English Female",
  "Google UK English Male",
  "Microsoft Libby",
  "Microsoft Sonia",
  "Microsoft Ryan",
  "Microsoft Hazel",
  "Microsoft George",
  "Daniel",
  "Kate",
  "Oliver",
];

// Average English speech characters per second at rate=1.0
// Used to estimate how far 10 seconds of audio is in characters
const CHARS_PER_SECOND_BASE = 14;

export function useSpeech(text: string): UseSpeechReturn {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [speed, setSpeed] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [words, setWords] = useState<string[]>([]);
  const [repeatMode, setRepeatMode] = useState<boolean>(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const repeatRef = useRef(repeatMode);
  const playRef = useRef<() => void>(() => {});

  // Track current character position during playback for skip logic
  const currentCharRef = useRef<number>(0);
  // Track the char offset the current utterance started from
  // (used when we restart from a mid-text position)
  const startOffsetRef = useRef<number>(0);

  useEffect(() => {
    repeatRef.current = repeatMode;
  }, [repeatMode]);

  // ── 1. Load voices ──
  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length === 0) return;
      setVoices(available);
      const preferred = BRITISH_VOICE_PREFERENCES.map((name) =>
        available.find((v) => v.name.includes(name))
      ).find(Boolean);
      const enGB = available.find((v) => v.lang === "en-GB");
      const auto = preferred || enGB || available[0];
      if (auto) setSelectedVoice(auto.voiceURI);
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  // ── 2. Tokenise text ──
  useEffect(() => {
    if (!text.trim()) {
      setWords([]);
      setHighlightIndex(-1);
      return;
    }
    const tokens = text.split(/(\s+)/).filter((t) => t.length > 0);
    setWords(tokens);
  }, [text]);

  // ── Internal: speak from a character offset ──
  // This is the core function used by both play() and the skip functions.
  // offset = character index in the FULL text to start from.
  const speakFrom = useCallback(
    (offset: number) => {
      if (!text.trim()) return;
      const synth = window.speechSynthesis;

      synth.cancel();
      setHighlightIndex(-1);

      // Clamp offset to valid range
      const safeOffset = Math.max(0, Math.min(offset, text.length - 1));

      // Find the nearest word boundary at or after safeOffset
      // so we don't start mid-word
      const wordBoundary = text.indexOf(" ", safeOffset);
      const startChar = wordBoundary === -1 ? safeOffset : wordBoundary + 1;

      startOffsetRef.current = startChar;
      currentCharRef.current = startChar;

      // Slice the text from startChar onwards
      const slicedText = text.slice(startChar);
      if (!slicedText.trim()) return;

      const utterance = new SpeechSynthesisUtterance(slicedText);
      utteranceRef.current = utterance;

      const voice = voices.find((v) => v.voiceURI === selectedVoice);
      if (voice) utterance.voice = voice;
      utterance.rate = speed;
      utterance.pitch = pitch;
      utterance.lang = "en-GB";

      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        if (event.name !== "word") return;

        // charIndex here is relative to slicedText — add startChar to get
        // the absolute position in the full text
        const absoluteChar = startChar + event.charIndex;
        currentCharRef.current = absoluteChar;

        // Find which word token this falls in
        let cursor = 0;
        for (let i = 0; i < words.length; i++) {
          cursor += words[i].length;
          if (cursor > absoluteChar) {
            if (words[i].trim().length > 0) setHighlightIndex(i);
            break;
          }
        }

        // Progress relative to full text
        const pct = Math.min(
          100,
          Math.round((absoluteChar / text.length) * 100)
        );
        setProgress(pct);
      };

      utterance.onend = () => {
        setHighlightIndex(-1);
        setProgress(100);
        if (repeatRef.current) {
          setTimeout(() => {
            setProgress(0);
            // Repeat always restarts from the beginning
            startOffsetRef.current = 0;
            currentCharRef.current = 0;
            playRef.current();
          }, 800);
        } else {
          setStatus("idle");
          setTimeout(() => setProgress(0), 800);
        }
      };

      utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
        if (e.error === "interrupted" || e.error === "canceled") return;
        console.warn("SpeechSynthesis error:", e.error);
        setStatus("error");
        setHighlightIndex(-1);
      };

      utterance.onstart = () => setStatus("playing");

      synth.speak(utterance);
      setStatus("playing");
    },
    [text, voices, selectedVoice, speed, pitch, words]
  );

  // ── 3. Play (starts from beginning) ──
  const play = useCallback(() => {
    if (!text.trim()) return;

    // Resume if paused — no restart needed
    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
      return;
    }

    // Reset position tracking and speak from start
    startOffsetRef.current = 0;
    currentCharRef.current = 0;
    setProgress(0);
    speakFrom(0);
  }, [text, status, speakFrom]);

  useEffect(() => {
    playRef.current = play;
  }, [play]);

  // ── 4. Pause ──
  const pause = useCallback(() => {
    if (status !== "playing") return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, [status]);

  // ── 5. Stop ──
  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    currentCharRef.current = 0;
    startOffsetRef.current = 0;
    setStatus("stopped");
    setHighlightIndex(-1);
    setProgress(0);
    setTimeout(() => setStatus("idle"), 1200);
  }, []);

  // ── 6. Skip forward 10 seconds ──
  const skipForward = useCallback(() => {
    if (status !== "playing" && status !== "paused") return;

    // Calculate how many characters 10 seconds represents at current speed
    const charsIn10s = Math.round(CHARS_PER_SECOND_BASE * speed * 10);
    const newOffset = currentCharRef.current + charsIn10s;

    // If skipping forward would go past the end, stop
    if (newOffset >= text.length) {
      stop();
      return;
    }

    speakFrom(newOffset);
  }, [status, speed, text, speakFrom, stop]);

  // ── 7. Skip backward 10 seconds ──
  const skipBackward = useCallback(() => {
    if (status !== "playing" && status !== "paused") return;

    const charsIn10s = Math.round(CHARS_PER_SECOND_BASE * speed * 10);
    const newOffset = currentCharRef.current - charsIn10s;

    // Clamp to start of text
    speakFrom(Math.max(0, newOffset));
  }, [status, speed, speakFrom]);

  // ── 8. Keyboard shortcuts ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;

      if (e.code === "Space") {
        e.preventDefault();
        if (status === "playing") pause();
        else play();
      }
      if (e.code === "Escape") {
        e.preventDefault();
        stop();
      }
      // Arrow keys for skipping
      if (e.code === "ArrowRight") {
        e.preventDefault();
        skipForward();
      }
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        skipBackward();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status, play, pause, stop, skipForward, skipBackward]);

  // ── 9. Cleanup ──
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // ── 10. Cancel if text changes mid-playback ──
  useEffect(() => {
    if (status === "playing" || status === "paused") {
      window.speechSynthesis.cancel();
      setStatus("idle");
      setHighlightIndex(-1);
      setProgress(0);
      currentCharRef.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return {
    voices,
    selectedVoice,
    setSelectedVoice,
    speed,
    setSpeed,
    pitch,
    setPitch,
    play,
    pause,
    stop,
    skipForward,
    skipBackward,
    status,
    progress,
    highlightIndex,
    words,
    repeatMode,
    setRepeatMode,
  };
}
>>>>>>> 6c8297358e3854cdff1b01f24ef0d9562659fa06
