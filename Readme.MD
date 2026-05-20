# 🎙 VoiceScribe — British RP Accent Practice

A free, browser-native text-to-speech application built specifically for British Received Pronunciation (RP) accent practice. No sign-up, no API keys, no cost — runs entirely in your browser.

---

## ✨ Features

- **4 Built-in Practice Passages** — curated stories across different genres, each written to target specific RP phonetic patterns
- **Pronunciation Tips** — expandable RP focus points per passage (trap-bath split, non-rhotic vowels, clear /t/, and more)
- **Word Highlighting** — the current word being spoken is highlighted in real time as the audio plays
- **Voice Selector** — automatically detects and prioritises British English voices available in your browser
- **Speed Control** — fine-grained slider plus Slow / Normal / Fast preset buttons
- **Pitch Control** — adjust voice pitch to find the most natural sound
- **Skip Controls** — jump forward or backward 10 seconds at a time
- **Repeat / Loop Mode** — toggle to loop the passage continuously for shadowing practice
- **Ambient Background Music** — choose from Rainy Window, Fireplace, Café Murmur, or Forest Birds with auto-ducking during speech
- **Dark Mode** — toggle between light and dark themes, persisted across sessions
- **Keyboard Shortcuts** — hands-free control while practising
- **Fully Responsive** — works on mobile and desktop

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `Esc` | Stop |
| `→` | Skip forward 10 seconds |
| `←` | Skip backward 10 seconds |

---

## 📖 Practice Passages

| # | Genre | RP Focus |
|---|-------|----------|
| 🔍 | **1950s Crime** — *The Affair at Dunmore Street* | Trap-bath split, non-rhotic vowels, clear /t/ |
| 🌿 | **Nature & Countryside** — *A Morning on the Downs* | Long open vowels, smooth diphthongs, measured rhythm |
| 📰 | **BBC News** — *The Evening Bulletin* | Schwa reduction, sentence stress, falling intonation |
| ☕ | **Everyday Conversation** — *Sunday Morning at the Bakery* | Weak forms, contractions, natural connected speech |

---

## 🚀 Getting Started

### Run locally

```bash
# Clone the repository
git clone https://github.com/your-username/voicescribe.git (to be updated)
cd voicescribe

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Tip:** Use **Google Chrome** or **Microsoft Edge** for the best voice quality. Edge includes neural British voices (Microsoft Libby, Ryan, Sonia) that sound significantly more natural than other browsers.

### Build for production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy.

---

## 🌐 Deploy to Netlify (Free)

1. Push your repository to GitHub
2. Go to [netlify.com](https://netlify.com) and click **"Add new site"**
3. Connect your GitHub repository
4. Set the build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy** — Netlify handles everything else automatically

Every push to your main branch will trigger a new deploy.

---

## 🗂️ Project Structure

```
voicescribe/
├── src/
│   ├── components/
│   │   ├── AmbientPlayer.tsx   # Background music with auto-ducking
│   │   ├── Controls.tsx        # Voice, speed, pitch, playback buttons
│   │   ├── Header.tsx          # Brand + dark mode toggle
│   │   ├── PassageCard.tsx     # Passage grid with tips panels
│   │   ├── StatusBar.tsx       # Live playback status indicator
│   │   └── TextEditor.tsx      # Textarea + word highlight overlay
│   ├── data/
│   │   └── passage.ts          # All 4 practice passages + tips
│   ├── hooks/
│   │   └── useSpeech.ts        # All Web Speech API logic
│   ├── styles/
│   │   └── index.css           # Global styles + design tokens
│   ├── App.tsx                 # Root component
│   └── main.tsx                # React entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Web Speech API | Browser-native text-to-speech (free, no API key) |
| CSS Custom Properties | Theming and dark mode |
| localStorage | Theme preference persistence |

**Zero paid services. Zero external APIs. Zero tracking.**

---

## 🔒 Privacy

VoiceScribe collects no data whatsoever:

- No analytics
- No cookies (except `localStorage` for your theme preference)
- No user accounts
- No text is ever sent to any server
- All speech synthesis runs locally in your browser

---

## 🎯 Why VoiceScribe?

Most text-to-speech tools are designed for accessibility or productivity. VoiceScribe is designed specifically for **language learners** who want to train their ear and mouth to produce British Received Pronunciation — the accent associated with BBC broadcasting, classical theatre, and formal British speech.

Each passage is carefully written to include words and phrases that exercise the most distinctive features of RP, and the pronunciation tips explain *why* each feature matters and how to produce it correctly.

---

## 📄 License

MIT License — free to use, modify, and distribute with attribution.

---

## 🙋 Author

Built by Shameer Shaik (https://www.linkedin.com/in/shameersamuel/)

*Multilingual language enthusiast — Telugu, Urdu, Hindi, English — currently refining British RP pronunciation.*

---

> *"Paste. Listen. Improve."*