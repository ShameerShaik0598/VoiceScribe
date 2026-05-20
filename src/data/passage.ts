export interface Passage {
  id: string;
  genre: string;
  icon: string;
  title: string;
  preview: string;
  text: string;
  tips: string[];
}

const passages: Passage[] = [
  // ── 1. BBC News Broadcast ────────────────────────────────
  {
    id: "news",
    genre: "BBC News",
    icon: "📰",
    title: "The Evening Bulletin",
    preview:
      '"Good evening. The Prime Minister has confirmed that a full parliamentary inquiry will be established…"',
    text: `The Evening Bulletin
  
  Good evening. The Prime Minister has confirmed that a full parliamentary inquiry will be established following this week's developments in the capital. A statement issued this afternoon indicated that the inquiry will be independent, and that its findings are expected to be presented to parliament no later than the spring.
  
  In other news, transport authorities have announced a series of planned improvements to the rail network across the north of England. The works, which are scheduled to begin in January, are expected to cause some disruption to services between Manchester and Leeds. Passengers are advised to check their journey times in advance.
  
  Turning to the economy, the Bank of England has held interest rates steady for the third consecutive month. Speaking at a press conference this morning, the Governor acknowledged that inflation remains above target, but expressed confidence that the measures already in place would bring it within acceptable limits by the end of the financial year.
  
  And finally, a brief note on the weather. A band of rain is expected to move eastward across the country overnight, clearing by morning to leave a dry and rather bright Thursday across most of England and Wales. Temperatures will remain below average for the time of year.
  
  That is the end of the bulletin. Good night.`,
    tips: [
      "Schwa reduction: unstressed syllables collapse to a short 'uh' — 'parliament' sounds like 'PAR-luh-munt'.",
      "Sentence stress: each sentence has one key stressed word — find it and land on it clearly.",
      "Falling intonation: BBC English ends statements with a firm downward fall — avoid rising at sentence ends.",
    ],
  },

  // ── 2. Nature & Countryside ──────────────────────────────
  {
    id: "nature",
    genre: "Nature & Countryside",
    icon: "🌿",
    title: "A Morning on the Downs",
    preview:
      '"The path wound gently through the long grass, past a cluster of ancient oaks whose branches arched overhead…"',
    text: `A Morning on the Downs
  
  The path wound gently through the long grass, past a cluster of ancient oaks whose branches arched overhead like the vaulted ceiling of a cathedral. It was half past seven in the morning, and the air was calm and rather cool, carrying the faint scent of grass and damp earth after the night's rain.
  
  Margaret paused at the crest of the hill and looked out across the valley. The farmhouses below were pale and still, their stone walls catching the last of the autumn light. A solitary rook called out from somewhere in the trees, its voice sharp against the quiet.
  
  "Glorious," she said softly, to no one in particular.
  
  She had walked this path every morning since her father's time. She knew where the ground grew soft after rain, where the blackberry brambles stretched across the track in late August, and where, in spring, the cowslips gathered in such numbers that the whole bank turned a gentle gold.
  
  There was something in this landscape that asked nothing of her — no answer, no hurry, no particular purpose. It simply lay there, patient and vast, breathing slowly beneath the wide grey sky.
  
  She fastened her coat, picked up her walking stick, and carried on down the far side of the hill towards the village, where a pot of tea and a warm fire were waiting.
  
  Some things, she thought, do not change. And that, on balance, is rather a comfort.`,
    tips: [
      "Long 'a' sounds: open your mouth wider for 'path', 'calm', 'grass', 'vast' — hold the vowel longer than you think.",
      "Smooth diphthongs: glide gently in 'glorious', 'stone', 'morning' — no sharp breaks between the two vowel sounds.",
      "Sentence rhythm: RP has a calm, measured pace — avoid rushing. Pause slightly at each comma.",
    ],
  },

  // ── 3. Crime / 1950s ────────────────────────────────────
  {
    id: "crime",
    genre: "1950s Crime",
    icon: "🔍",
    title: "The Affair at Dunmore Street",
    preview:
      '"It was a bitter Thursday evening when Inspector Holt arrived at the narrow townhouse on Dunmore Street…"',
    text: `The Affair at Dunmore Street
  
  It was a bitter Thursday evening when Inspector Holt arrived at the narrow townhouse on Dunmore Street. The fog had gathered thickly over the city, and the gas lamps cast a rather pale, ghostly light across the pavement.
  
  "Dreadful business," muttered Sergeant Barlow, who was standing by the front door with his collar turned up against the cold. "The housekeeper found him just after half past seven. Hadn't come down for his supper, apparently."
  
  Inspector Holt stepped inside, drawing off his gloves. The hallway was dark and smelled of cedar and old paper. He glanced at the grandfather clock on the landing — its hands had stopped at a quarter past six.
  
  "Particularly strange," said Holt, examining the clock face. "Someone stopped it deliberately, I should think. A rather theatrical touch."
  
  The study was at the back of the house, overlooking a narrow garden. The victim, a Mr. Clarence Ashby, was seated at his writing desk, a half-finished glass of brandy beside him. There was no sign of a struggle — everything was in its proper place, rather too proper, as if the room had been tidied after the fact.
  
  "Chance would be a fine thing," Barlow remarked, nodding at the empty fireplace. "It's been burning recently. Someone destroyed something before they left."
  
  Holt crouched beside the hearth and examined the ash. Among the grey flakes, a small corner of paper had survived — three words in a careful hand: ...cannot allow this.
  
  "I fancy," said Holt, rising slowly, "that Mr. Ashby knew rather more than was comfortable. And someone, somewhere in this city, was determined that he should take that knowledge to his grave."
  
  He pulled on his gloves once more and looked out at the darkened garden.
  
  "We shall have the answer by morning. One way or another."`,
    tips: [
      "Trap-bath split: stretch the vowel in 'past', 'glass', 'rather', 'chance' — say 'rahther', not 'ratter'.",
      "Non-rhotic: never pronounce the 'r' at the end of 'Inspector', 'answer', 'rather' — let it disappear.",
      "Clear /t/: tap the tip of your tongue sharply for every 't' — 'particular', 'theatrical', 'certainly'.",
    ],
  },

  // ── 4. Everyday Conversation ────────────────────────────
  {
    id: "conversation",
    genre: "Everyday Conversation",
    icon: "☕",
    title: "Sunday Morning at the Bakery",
    preview:
      "\"Oh, I didn't realise you'd be here so early — have you been waiting long? I couldn't find parking anywhere on the high street...\"",
    text: `Sunday Morning at the Bakery
      
      "Oh, I didn't realise you'd be here so early — have you been waiting long? I couldn't find parking anywhere on the high street."
      
      "Not at all, I've only just arrived myself. I thought I'd pick up something for breakfast while I was passing. Have you tried the almond croissants here? They're rather good, actually."
      
      "I haven't, no. I usually just get a loaf and a couple of the cheese rolls, but I might give one a try. Are you heading back straight after, or have you got time for a coffee?"
      
      "I've got a little time, yes. I'm not due anywhere until half eleven. There's that place round the corner — it's not fancy, but the coffee's decent and it's never too crowded on a Sunday morning."
      
      "That sounds perfect. Let me just grab what I need and I'll meet you outside in a moment."
      
      The queue moved slowly, as it always did on Sunday mornings. Outside, the street was still quiet. A few people walked dogs along the pavement, and a child on a bicycle wobbled past the cafe window with great concentration and very little apparent steering.
      
      It was, all things considered, a perfectly ordinary Sunday — which is to say, rather a good one.`,
    tips: [
      "Weak forms: 'have', 'been', 'was', 'of', 'and' all reduce to near-whispers — don't give them full vowels.",
      "Contractions: 'didn't', 'I've', 'you'd', 'it's' — merge them smoothly. RP contractions are crisp, not slurred.",
      "Natural rhythm: stress the content words; let the grammar words float past quietly.",
    ],
  },
];

export default passages;
