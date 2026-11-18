"use strict";
const $ = (s, root = document) => root.querySelector(s);
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const icons = {
  home: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  learn:
    '<path d="M12 6c-3-3-7-3-10-2v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 2Z"/><path d="M12 6v15"/>',
  dictionary:
    '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3v18m4-12h5m-5 4h5"/>',
  quiz: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>',
  voice:
    '<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>',
  speech:
    '<path d="m11 4-6 5H2v6h3l6 5Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  camera:
    '<rect x="2" y="6" width="14" height="14" rx="3"/><path d="m16 10 6-4v14l-6-4M5 6l2-3h4l2 3"/>',
  progress: '<path d="M4 20V10m7 10V4m7 16v-7M2 22h20"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4Z"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.home}</svg>`;
const emoji = value => `<img class="emoji" src="/assets/emoji/${[...value].filter(c=>c.codePointAt(0)!==0xfe0f).map(c=>c.codePointAt(0).toString(16)).join('-')}.svg" alt="" aria-hidden="true">`;
const signs = [
  {
    id: "hello",
    word: "Hello",
    category: "Greetings",
    emoji: "👋",
    guide:
      "Begin with your open, flat dominant hand near your forehead, palm facing out. Move it outward, away from your forehead, like a small salute.",
  },
  {
    id: "thanks",
    word: "Thank you",
    category: "Greetings",
    emoji: "🤲",
    guide:
      "Place the fingertips of your flat dominant hand at your chin, palm facing you. Move the hand forward and slightly down toward the person you are thanking.",
  },
  {
    id: "please",
    word: "Please",
    category: "Everyday",
    emoji: "✋",
    guide:
      "Place your open, flat dominant hand on your chest, palm inward. Move it in a small circular motion.",
  },
  {
    id: "sorry",
    word: "Sorry",
    category: "Greetings",
    emoji: "✊",
    guide:
      "Make a fist with your dominant hand, place it on your chest, and move it in a small circle.",
  },
  {
    id: "yes",
    word: "Yes",
    category: "Everyday",
    emoji: "✊",
    guide:
      "Make a fist with your dominant hand and hold it up. Bend your wrist up and down, like a head nodding yes.",
  },
  {
    id: "no",
    word: "No",
    category: "Everyday",
    emoji: "🤏",
    guide:
      "Extend your index and middle fingers with your thumb out. Bring both fingertips down to meet your thumb, like a small closing beak.",
  },
  {
    id: "love",
    word: "I love you",
    category: "Greetings",
    emoji: "🤟",
    guide:
      "Extend your thumb, index finger, and little finger. Keep your middle and ring fingers folded down, with your palm facing the person.",
  },
  {
    id: "help",
    word: "Help",
    category: "Everyday",
    emoji: "🤝",
    guide:
      "Make a fist with your dominant hand, thumb pointing up. Rest it on your other open palm and lift both hands together.",
  },
  {
    id: "a",
    word: "A",
    category: "Alphabet",
    emoji: "✊",
    guide:
      "Make a fist with all four fingers folded into your palm. Keep your thumb straight along the side of your index finger, not across the front.",
  },
  {
    id: "b",
    word: "B",
    category: "Alphabet",
    emoji: "🖐",
    guide:
      "Hold your hand upright, palm forward, four fingers straight and together. Fold your thumb across your palm.",
  },
  {
    id: "c",
    word: "C",
    category: "Alphabet",
    emoji: "🤏",
    guide:
      "Curve your four fingers and thumb into a rounded C shape. Keep the fingers together and the thumb opposite them.",
  },
  {
    id: "d",
    word: "D",
    category: "Alphabet",
    emoji: "☝️",
    guide:
      "Point your index finger straight up. Curve your other three fingers to touch your thumb, forming a circle.",
  },
  {
    id: "one",
    word: "One",
    category: "Numbers",
    emoji: "☝️",
    guide:
      "Hold up only your index finger. For counting one through five in isolation, the palm typically faces you.",
  },
  {
    id: "two",
    word: "Two",
    category: "Numbers",
    emoji: "✌️",
    guide:
      "Extend your index and middle fingers in a V, with your other fingers folded into your palm. In isolated counting, face your palm toward you.",
  },
  {
    id: "three",
    word: "Three",
    category: "Numbers",
    emoji: "🤟",
    guide:
      "Extend your thumb, index finger, and middle finger. Fold your ring and little fingers into your palm. This is different from the I-love-you handshape.",
  },
  {
    id: "five",
    word: "Five",
    category: "Numbers",
    emoji: "🖐",
    guide:
      "Extend your thumb and all four fingers and spread them apart. In isolated counting, your palm typically faces you.",
  },
];
const lessons = [
  {
    id: "alphabet",
    title: "The ABCs of connection",
    subtitle: "Get to know the building blocks of ASL.",
    category: "The essentials",
    level: "Beginner",
    time: 8,
    emoji: "🤟",
    color: "",
    signs: ["a", "b", "c", "d"],
  },
  {
    id: "greetings",
    title: "A hello goes a long way",
    subtitle: "Start a conversation. Make someone’s day.",
    category: "Everyday conversations",
    level: "Beginner",
    time: 6,
    emoji: "👋",
    color: "lilac",
    signs: ["hello", "thanks", "sorry", "love"],
  },
  {
    id: "numbers",
    title: "Make every number count",
    subtitle: "Learn to count, one sign at a time.",
    category: "Numbers & counting",
    level: "Beginner",
    time: 5,
    emoji: "✌️",
    color: "peach",
    signs: ["one", "two", "three", "five"],
  },
  {
    id: "everyday",
    title: "Little signs, everyday moments",
    subtitle: "Useful expressions for your daily life.",
    category: "Daily essentials",
    level: "Beginner",
    time: 7,
    emoji: "✋",
    color: "green",
    signs: ["please", "yes", "no", "help"],
  },
];
let state = { completed: [], saved: [], quizScores: [], activity: [] },
  user = null,
  route = "home",
  search = "",
  category = "All signs",
  savedOnly = false,
  quiz = null,
  recognition = null,
  stream = null,
  lessonIndex = 0,
  activeLesson = null;
const today = () => new Date().toLocaleDateString("en-CA");
function loadLocal() {
  try {
    state = {
      ...state,
      ...JSON.parse(localStorage.getItem("signbridge-progress") || "{}"),
    };
  } catch {}
}
function persist() {
  localStorage.setItem("signbridge-progress", JSON.stringify(state));
  if (user)
    api("/api/progress", { method: "PUT", body: state }).catch(() =>
      toast("Sync unavailable. Your progress is saved on this device."),
    );
}
function activity() {
  if (!state.activity.includes(today())) state.activity.push(today());
}
function toast(text) {
  $("#toast").textContent = text;
  $("#toast").classList.add("visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => $("#toast").classList.remove("visible"), 3500);
}
async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}
function nav() {
  const links = [
    ["home", "Overview", "home"],
    ["learn", "Learn sign language", "learn"],
    ["dictionary", "Sign dictionary", "dictionary"],
    ["quiz", "Quizzes & practice", "quiz"],
    ["divider"],
    ["voice", "Voice to sign", "voice"],
    ["speech", "Text to speech", "speech"],
    ["camera", "Camera practice", "camera"],
    ["divider"],
    ["progress", "My progress", "progress"],
  ];
  $("#navigation").innerHTML = links
    .map(([id, label, ic]) =>
      id === "divider"
        ? '<div class="nav-divider"></div>'
        : `<a class="nav-link ${route === id ? "active" : ""}" href="#${id}" ${route === id ? 'aria-current="page"' : ""}>${icon(ic)}<span>${label}</span>${id === "voice" ? '<span class="nav-tag">TRY IT</span>' : ""}</a>`,
    )
    .join("");
  $("#profile-button").textContent = user
    ? user.name.charAt(0).toUpperCase()
    : "S";
  $("#profile-button").setAttribute(
    "aria-label",
    user ? `Account: ${user.name}` : "Sign in or create an account",
  );
}
function heading(title, sub, extra = "") {
  return `<div class="page-heading"><div><h1>${title}</h1><p>${sub}</p></div>${extra}</div>`;
}
function streak() {
  let n = 0;
  const d = new Date();
  if (!state.activity.includes(today())) d.setDate(d.getDate() - 1);
  while (state.activity.includes(d.toLocaleDateString("en-CA"))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
function stats() {
  const learned = new Set(
    lessons
      .filter((l) => state.completed.includes(l.id))
      .flatMap((l) => l.signs),
  ).size;
  return `<div class="stats"><div class="stat"><span class="stat-icon">${icon("learn")}</span><div><div class="stat-value">${learned} <small>/ ${signs.length}</small></div><div class="stat-label">Signs in completed lessons</div></div></div><div class="stat"><span class="stat-icon">${icon("check")}</span><div><div class="stat-value">${state.completed.length} <small>/ ${lessons.length}</small></div><div class="stat-label">Lessons completed</div></div></div><div class="stat"><span class="stat-icon">${icon("quiz")}</span><div><div class="stat-value">${state.quizScores.length ? Math.max(...state.quizScores.map((s) => Math.round((s.score / s.total) * 100))) + "%" : "—"}</div><div class="stat-label">Personal best quiz score</div></div></div></div>`;
}
function lessonCard(l) {
  return `<button class="lesson-card" data-lesson="${l.id}"><div class="lesson-cover ${l.color}"><span class="lesson-badge">${state.completed.includes(l.id) ? "✓ Completed" : l.level}</span><span class="hand" aria-hidden="true">${emoji(l.emoji)}</span></div><div class="lesson-body"><div class="eyebrow">${l.category}</div><h3>${l.title}</h3><p>${l.subtitle}</p><div class="lesson-meta"><span>◷ &nbsp;${l.time} min <span> · </span> ${l.signs.length} signs</span><span>↗</span></div><div class="mini-progress"><i style="width:${state.completed.includes(l.id) ? 100 : 0}%"></i></div></div></button>`;
}
const handArt = `<svg class="hand-art" viewBox="0 0 250 270" aria-hidden="true"><defs><linearGradient id="skin" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e9b78f"/><stop offset="1" stop-color="#c78d69"/></linearGradient><linearGradient id="sleeve" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4e6955"/><stop offset="1" stop-color="#2e4d3e"/></linearGradient></defs><path d="m88 205-4-50-40-52q-11-16 1-22 10-5 20 8l24 24-13-77q-2-18 10-20 12-2 15 17l13 69 10-13 18 2 12 16 17-56q5-17 16-12 10 4 5 21l-15 66q-3 18-2 33l-2 42-24 24Z" fill="url(#skin)" stroke="#b27b59" stroke-width="1.6"/><path d="m111 105-5-23q-2-12 8-14 10-2 13 10l8 29m-5-6-2-29q-1-11 9-12 10 0 12 11l4 33" fill="url(#skin)" stroke="#b27b59" stroke-width="1.6"/><path d="m116 105 27-5q13-3 15 9 0 9-12 12l-22 4q23 9 26 29m-56-9q13-12 29-11m-23 26q20-8 34 4m-25 21 25 1" fill="none" stroke="#b37c59" stroke-width="2" stroke-linecap="round"/><path d="m81 202 98-1 15 65H73Z" fill="url(#sleeve)"/><path d="m81 202 98-1 2 15-103 2Z" fill="#729077"/><path d="m88 224-3 42m16-42-2 42m64-44 7 44m-20-44 5 44" stroke="#ffffff16" stroke-width="2"/></svg>`;
function home() {
  const next =
    lessons.find((l) => !state.completed.includes(l.id)) || lessons[0];
  return (
    heading(
      `A little practice. A world of connection<span class="coral">.</span>`,
      `Welcome${user ? " back, " + esc(user.name.split(" ")[0]) : " to SignBridge"}. Let’s make meaningful connections, one sign at a time.`,
      `<div class="streak">${emoji("☀️")} <b>${streak()}-day streak</b></div>`,
    ) +
    `<section class="hero"><div class="hero-copy"><div class="eyebrow">A language that brings us closer</div><h2>Some conversations<br>start with a <em>sign.</em></h2><p>Discover the beauty of sign language. Learn at your own pace and open the door to a more inclusive world.</p><div class="hero-actions"><button class="button dark" data-lesson="${next.id}">${state.completed.length ? "Continue learning" : "Start your journey"} <span>↗</span></button><span class="hero-note">◉ &nbsp; Free to learn. For everyone.</span></div></div><div class="hero-art"><div class="orbit"></div><div class="orbit two"></div><div class="orbit three"></div>${handArt}<div class="art-label top">${emoji("🤟")} &nbsp; A small gesture. A big meaning.</div><div class="art-label bottom"><span style="color:#a8b58a">✦</span> Connection needs no sound.</div><span class="spark">✧</span><span class="spark s2">✦</span></div></section>` +
    stats() +
    `<div class="learning-layout"><section><div class="section-heading"><h2>Your next little step</h2><a href="#learn" class="text-link">View all lessons <span>↗</span></a></div><div class="lesson-grid">${lessons.slice(0, 3).map(lessonCard).join("")}</div></section><aside class="daily-card"><div class="eyebrow">✦ &nbsp; Sign of the day <span>↗</span></div><div class="daily-sign" aria-hidden="true">${emoji("🤲")}</div><h3>Thank you</h3><p>Two simple words.<br>A whole lot of appreciation.</p><button class="button" data-sign="thanks">Learn this sign <span>↗</span></button></aside></div><div class="bottom-banner"><span class="banner-icon">✧</span><div><h3>Ready to put your signs to the test?</h3><p>A little challenge is a great way to grow. Try a quick practice quiz.</p></div><button class="button outline" data-route="quiz">Let’s practice <span>↗</span></button></div>`
  );
}
function learn() {
  return (
    heading(
      "Every sign is a new beginning.",
      "Short, thoughtful lessons to help you build confidence in ASL.",
    ) +
    `<div class="notice">New here? Start with the alphabet, then explore greetings. These are written beginner guides, not a substitute for instruction from fluent Deaf signers.</div><div class="lesson-full-grid">${lessons.map(lessonCard).join("")}</div><div class="bottom-banner"><span class="banner-icon">♡</span><div><h3>Connection starts with respect.</h3><p>Get someone’s attention with a gentle wave. Keep eye contact, and never grab a person’s hands while they sign.</p></div><a href="#about" class="button outline">Learn more ↗</a></div>`
  );
}
function dictionary() {
  return (
    heading(
      "A world of signs, at your fingertips.",
      "Find a sign, learn its movement, and make it your own.",
    ) +
    `<div class="toolbar"><label class="sr-only" for="sign-search">Search signs</label><input class="search" id="sign-search" type="search" placeholder="Search for a word or expression…" value="${esc(search)}"><button class="button ${savedOnly ? "dark" : "outline"}" id="saved-toggle">${savedOnly ? "♥ Saved signs" : "♡ Show saved"}</button></div><div class="chips">${["All signs", "Alphabet", "Greetings", "Numbers", "Everyday"].map((c) => `<button class="chip ${category === c ? "active" : ""}" data-category="${c}">${c}</button>`).join("")}</div><div class="dictionary-grid" id="sign-grid">${dictionaryCards()}</div><p style="font-size:10px;margin-top:23px">Hand emojis are decorative memory cues, not accurate sign demonstrations. Open a guide for handshape and movement instructions. ASL has regional variations.</p>`
  );
}
function dictionaryCards() {
  const filtered = signs.filter(
    (s) =>
      (category === "All signs" || s.category === category) &&
      (!savedOnly || state.saved.includes(s.id)) &&
      (s.word + " " + s.guide).toLowerCase().includes(search.toLowerCase()),
  );
  return filtered.length
    ? filtered
        .map(
          (s) =>
            `<article class="sign-card"><button class="save-button ${state.saved.includes(s.id) ? "saved" : ""}" data-save="${s.id}" aria-label="${state.saved.includes(s.id) ? "Unsave" : "Save"} ${s.word}" aria-pressed="${state.saved.includes(s.id)}">${state.saved.includes(s.id) ? "♥" : "♡"}</button><div class="sign-glyph" aria-hidden="true">${emoji(s.emoji)}</div><span class="sign-category">${s.category}</span><h3>${s.word}</h3><p>${s.guide.slice(0, 89)}…</p><button class="text-link" data-sign="${s.id}">Open sign guide <span>↗</span></button></article>`,
        )
        .join("")
    : '<div class="empty">No signs found. Try a different word or category.</div>';
}
function speech() {
  return (
    heading(
      "Let your words be heard.",
      "A simple, accessible way to turn written words into spoken ones.",
    ) +
    `<div class="tool-layout"><section class="panel"><h3>What would you like to say?</h3><label for="speak-text" class="sr-only">Text to speak</label><textarea id="speak-text" maxlength="3000" placeholder="Type your message here…"></textarea><div class="tool-actions"><label class="range-label">Speed <input type="range" id="speech-rate" min="0.5" max="1.5" step="0.1" value="1"></label><label class="sr-only" for="voice-select">Voice</label><select id="voice-select"><option value="">Default voice</option></select></div><div class="tool-actions"><button class="button dark" id="speak">${icon("speech")} Speak message</button><button class="button outline" id="stop-speech">Stop</button></div><p id="speech-status" role="status" style="margin-top:18px">Your browser’s built-in speech voice is used.</p></section><aside class="panel"><div class="intro-icon">“</div><h2>Every voice matters.</h2><p>Use this tool to say a quick hello, ask a question, or share what’s on your mind.</p><p>Tip: adjust the speed to make your message easier to follow. Available voices depend on your browser and device.</p><div class="chips"><button class="chip" data-phrase="Hello! My name is…">Say hello</button><button class="chip" data-phrase="Could you please help me?">Ask for help</button><button class="chip" data-phrase="Thank you. Have a lovely day!">Say thank you</button></div></aside></div>`
  );
}
function voice() {
  return (
    heading(
      "Say a word. Discover a sign.",
      "Speak or type a supported word to find its written ASL guide.",
    ) +
    `<div class="notice">This is a word-to-guide lookup, not a sign-language sentence translator. ASL has its own grammar. Microphone recognition requires a supported browser and may use your browser provider’s online service.</div><div class="tool-layout"><section class="panel"><h3>Your words</h3><label class="sr-only" for="voice-text">Word to look up</label><input id="voice-text" style="width:100%" placeholder="Try “hello”, “please”, or “thank you”"><div class="tool-actions"><button class="button dark" id="find-sign">Find a sign ↗</button><button class="button outline" id="listen">◉ Use microphone</button></div><p id="voice-status" role="status" style="margin-top:20px">You can always type if a microphone isn’t available.</p></section><section class="panel"><h3>Your sign guide</h3><div id="voice-output" class="tool-output"><p>Search a word to see its handshape and movement instructions here.</p><div class="chips">${["hello", "please", "thank you"].map((s) => `<button class="chip" data-lookup="${s}">${s}</button>`).join("")}</div></div></section></div>`
  );
}
function camera() {
  return (
    heading(
      "Your own little practice studio.",
      "Use your camera as a mirror while you follow a sign guide.",
    ) +
    `<div class="notice">Camera practice only — no automatic recognition or translation. Your video stays on your device and is never recorded or uploaded. Camera access starts only when you choose it.</div><div class="tool-layout"><section class="panel"><div id="camera-preview" style="background:#eeefe5;border-radius:12px;min-height:260px;display:grid;place-items:center;overflow:hidden"><video id="camera-video" autoplay muted playsinline style="display:none;width:100%;transform:scaleX(-1)"></video><p id="camera-placeholder" style="text-align:center">Your space to practice<br><span style="font-size:42px">◉</span></p></div><div class="tool-actions"><button class="button dark" id="start-camera">Turn on camera</button><button class="button outline" id="stop-camera" disabled>Turn off</button></div><p id="camera-status" role="status" style="margin-top:15px">Camera is off.</p></section><section class="panel"><h3>Pick a sign to practice</h3><label class="sr-only" for="practice-sign">Practice sign</label><select id="practice-sign" style="width:100%">${signs.map((s) => `<option value="${s.id}">${s.word}</option>`).join("")}</select><div id="practice-guide" class="tool-output">${practiceGuide(signs[0])}</div><p>Practice slowly. Check your handshape, palm orientation, position, and movement.</p></section></div>`
  );
}
function practiceGuide(s) {
  return `<div class="sign-glyph" aria-hidden="true">${emoji(s.emoji)}</div><h3>${s.word}</h3><p>${s.guide}</p>`;
}
function progress() {
  return (
    heading(
      "Look how far you can go.",
      "Every little step counts. Here’s your learning story so far.",
    ) +
    stats() +
    `<div class="progress-grid"><section class="panel"><h2>Your learning path</h2>${lessons.map((l) => `<div class="progress-row"><span>${emoji(l.emoji)} &nbsp; ${l.title}</span><button class="text-link" data-lesson="${l.id}">${state.completed.includes(l.id) ? "✓ Review" : "Start →"}</button></div>`).join("")}<p style="font-size:11px;margin-top:20px">${user ? "Your progress is synced to your account." : "Your progress is saved in this browser. Sign in to keep it in an account."}</p>${!user ? '<button class="button dark" id="progress-signin">Save my journey ↗</button>' : ""}</section><section class="panel"><h2>Your practice sessions</h2>${
      state.quizScores.length
        ? state.quizScores
            .slice()
            .reverse()
            .slice(0, 8)
            .map(
              (q) =>
                `<div class="progress-row"><span>${esc(q.date)} · ASL foundations</span><b>${q.score} / ${q.total}</b></div>`,
            )
            .join("")
        : '<p>No quizzes yet. A little practice is all it takes to get started.</p><a href="#quiz" class="button outline">Try your first quiz ↗</a>'
    }<h3 style="margin-top:28px">${state.saved.length} saved signs</h3><p style="font-size:12px">Keep the signs you love close at hand.</p><button class="text-link" id="view-saved">Open your collection ↗</button></section></div>`
  );
}
function about() {
  return (
    heading(
      "Built for connection. Open to everyone.",
      "A beginner-friendly place to explore American Sign Language.",
    ) +
    `<article class="panel about-copy"><h2>A bridge, not a replacement.</h2><p>SignBridge offers introductory written ASL guides, practice quizzes, browser speech tools, and a private camera mirror. It is not an interpreter, a certified course, or an automated sign recognizer. For important medical, legal, or professional conversations, use a qualified interpreter.</p><h2>Language is more than handshapes.</h2><p>ASL is a full language with its own grammar, facial expressions, and cultural context. It is not universal: Indian Sign Language, British Sign Language, and other signed languages are distinct. Our hand emojis are visual decoration, not instructional illustrations.</p><h2>Learn with the Deaf community.</h2><p>Seek out Deaf teachers, local classes, and fluent signers. For further study, explore <a href="https://www.lifeprint.com/" target="_blank" rel="noopener noreferrer">ASL University (Lifeprint) ↗</a> and <a href="https://www.handspeak.com/" target="_blank" rel="noopener noreferrer">HandSpeak ↗</a>. These are external resources, not affiliated with SignBridge.</p><h2>A little respect goes a long way.</h2><p>Get someone’s attention with a gentle wave or, when appropriate, a light tap on the shoulder. Face the person, keep your hands visible, and ask about their communication preferences. Never assume that everyone lip-reads or uses the same signed language.</p><h2>Your privacy, in plain words.</h2><p>Guest progress is stored in this browser. If you create an account, your name, email, password hash, and progress are stored on this app’s server. Camera footage is never saved or sent to the server. Speech recognition, if you opt in, may use your browser’s speech service.</p></article>`
  );
}
function newQuiz() {
  const pool = [...signs].sort(() => Math.random() - 0.5).slice(0, 5);
  quiz = {
    questions: pool.map((s) => ({
      sign: s,
      options: [
        s,
        ...signs
          .filter((x) => x.id !== s.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3),
      ].sort(() => Math.random() - 0.5),
    })),
    index: 0,
    score: 0,
    answered: false,
    finished: false,
  };
}
function quizPage() {
  if (!quiz) newQuiz();
  if (quiz.finished)
    return (
      heading(
        "Practice makes connection.",
        "Celebrate what you know. Keep growing what you don’t.",
      ) +
      `<div class="panel quiz-panel quiz-result"><div class="eyebrow">Session complete</div><div class="result-number">${quiz.score} / ${quiz.questions.length}</div><h2>${quiz.score === 5 ? "Beautifully done!" : "Another step forward."}</h2><p>Every attempt builds your understanding. Keep going!</p><button class="button dark" id="restart-quiz">Practice again ↗</button> <a class="button outline" href="#progress">View progress</a></div>`
    );
  const q = quiz.questions[quiz.index];
  return (
    heading(
      "A little challenge. A little growth.",
      "Read the movement description and choose the matching sign.",
    ) +
    `<section class="panel quiz-panel"><div class="quiz-top"><span>ASL FOUNDATIONS</span><span>Question ${quiz.index + 1} of ${quiz.questions.length}</span></div><div class="mini-progress" style="margin-bottom:25px"><i style="width:${(quiz.index / quiz.questions.length) * 100}%"></i></div><div class="quiz-prompt">${q.sign.guide}</div><div class="quiz-options">${q.options.map((s) => `<button class="quiz-option" data-answer="${s.id}">${s.word}</button>`).join("")}</div><div class="quiz-feedback" id="quiz-feedback" role="status"></div><button class="button dark" id="next-question" disabled>${quiz.index === 4 ? "See my results" : "Next question"} →</button></section>`
  );
}
function render() {
  stopMedia();
  nav();
  const pages = {
    home,
    learn,
    dictionary,
    quiz: quizPage,
    voice,
    speech,
    camera,
    progress,
    about,
  };
  $("#main").innerHTML = (pages[route] || home)();
  document.title = `${{ home: "Overview", learn: "Learn", dictionary: "Sign dictionary", quiz: "Practice", voice: "Voice to sign", speech: "Text to speech", camera: "Camera practice", progress: "My progress", about: "About" }[route] || "Overview"} · SignBridge`;
  if (route === "speech") loadVoices();
}
function navigate() {
  const requested = location.hash.slice(1) || "home";
  route = [
    "home",
    "learn",
    "dictionary",
    "quiz",
    "voice",
    "speech",
    "camera",
    "progress",
    "about",
  ].includes(requested)
    ? requested
    : "home";
  $("#sidebar").classList.remove("open");
  $("#menu-toggle").setAttribute("aria-expanded", "false");
  render();
  window.scrollTo(0, 0);
}
function openModal(html) {
  $("#modal-content").innerHTML =
    `<div class="modal-inner"><button class="modal-close" aria-label="Close dialog">×</button>${html}</div>`;
  const title = $("#modal-content h2");
  if (title) { title.id = "dialog-title"; $("#modal").setAttribute("aria-labelledby", "dialog-title"); }
  $("#modal").showModal();
}
function signModal(id) {
  const s = signs.find((s) => s.id === id);
  openModal(
    `<div class="eyebrow">${s.category} · ASL sign guide</div><h2 style="margin-top:12px">${s.word}</h2><div class="sign-large" aria-hidden="true">${emoji(s.emoji)}</div><h3>Handshape & movement</h3><p>${s.guide}</p><p style="font-size:10px">The emoji is a memory cue, not an accurate demonstration. Learn movement and expression with a fluent signer.</p><button class="button ${state.saved.includes(id) ? "outline" : "dark"}" data-modal-save="${id}">${state.saved.includes(id) ? "♥ Saved to your collection" : "♡ Save this sign"}</button>`,
  );
}
function lessonModal(id, index = 0) {
  activeLesson = lessons.find((l) => l.id === id);
  lessonIndex = index;
  const s = signs.find((s) => s.id === activeLesson.signs[index]);
  if ($("#modal").open) $("#modal").close();
  openModal(
    `<div class="eyebrow">${activeLesson.category} · ${index + 1} of ${activeLesson.signs.length}</div><h2 style="margin-top:12px">${s.word}</h2><div class="sign-large" aria-hidden="true">${emoji(s.emoji)}</div><h3>Let’s try it together.</h3><p>${s.guide}</p><div class="notice">Practice the handshape and movement slowly. Written guides and decorative emojis cannot convey all the details of ASL.</div><div class="lesson-nav"><button class="button outline" id="lesson-prev" ${index === 0 ? "disabled" : ""}>← Back</button><button class="button dark" id="lesson-next">${index === activeLesson.signs.length - 1 ? "Complete lesson ✓" : "Next sign →"}</button></div>`,
  );
}
function toggleSave(id) {
  if (state.saved.includes(id))
    state.saved = state.saved.filter((x) => x !== id);
  else state.saved.push(id);
  persist();
}
function authModal(mode = "login") {
  if (user) {
    openModal(
      `<div class="eyebrow">YOUR ACCOUNT</div><h2 style="margin-top:15px">Hello, ${esc(user.name)}.</h2><p>${esc(user.email)}</p><p>Your learning progress is saved to this account.</p><button class="button outline" id="logout">Sign out</button>`,
    );
    return;
  }
  openModal(
    `<div class="eyebrow">YOUR LEARNING JOURNEY</div><h2 style="margin-top:15px">${mode === "register" ? "A new connection starts here." : "Lovely to see you again."}</h2><p>${mode === "register" ? "Create your free account to save your progress." : "Sign in to pick up where you left off."}</p><form id="auth-form" data-mode="${mode}">${mode === "register" ? '<label for="auth-name">Your name</label><input id="auth-name" name="name" required maxlength="70" autocomplete="name">' : ""}<label for="auth-email">Email address</label><input id="auth-email" name="email" type="email" required maxlength="254" autocomplete="email"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" required minlength="8" maxlength="128" autocomplete="${mode === "register" ? "new-password" : "current-password"}"><div class="auth-actions"><button type="submit" class="button dark">${mode === "register" ? "Create account" : "Sign in"} ↗</button><button type="button" class="text-link" data-auth="${mode === "register" ? "login" : "register"}">${mode === "register" ? "Already a member?" : "New here? Join us"}</button></div><div class="form-message" id="auth-message" role="alert"></div></form><p class="auth-note">You can also close this window and explore as a guest. No account needed.</p>`,
  );
}
function findSign() {
  const input = $("#voice-text")
    .value.trim()
    .toLowerCase()
    .replace(/[.!?]/g, "");
  const aliases = { thanks: "thank you", hi: "hello", bye: "hello" };
  const s = signs.find(
    (s) => s.word.toLowerCase() === (aliases[input] || input),
  );
  $("#voice-output").innerHTML = s
    ? `<div class="sign-result">${practiceGuide(s)}<button class="text-link" style="margin-top:15px" data-sign="${s.id}">Open full guide ↗</button></div>`
    : `<p>${input ? "We don’t have that word yet." : "Enter a word to get started."} Try hello, please, thank you, sorry, yes, no, help, or a word from the dictionary.</p>`;
}
function loadVoices() {
  if (!window.speechSynthesis) {
    $("#speech-status").textContent =
      "Speech isn’t supported in this browser. Try a current version of Chrome, Edge, or Safari.";
    $("#speak").disabled = true;
    return;
  }
  const select = $("#voice-select");
  if (!select) return;
  select.innerHTML =
    '<option value="">Default voice</option>' +
    speechSynthesis
      .getVoices()
      .map(
        (v, i) =>
          `<option value="${i}">${esc(v.name)} (${esc(v.lang)})</option>`,
      )
      .join("");
}
function stopMedia() {
  if (recognition) {
    recognition.abort();
    recognition = null;
  }
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }
  if (window.speechSynthesis) speechSynthesis.cancel();
}
document.addEventListener("click", async (e) => {
  const b = e.target.closest("button, a[data-route]");
  if (!b) return;
  if (b.dataset.route) {
    location.hash = b.dataset.route;
    return;
  }
  if (b.classList.contains("modal-close")) {
    $("#modal").close();
    return;
  }
  if (b.dataset.lesson) {
    lessonModal(b.dataset.lesson);
    return;
  }
  if (b.dataset.sign) {
    signModal(b.dataset.sign);
    return;
  }
  if (b.dataset.auth) {
    $("#modal").close();
    authModal(b.dataset.auth);
    return;
  }
  if (b.dataset.save) {
    toggleSave(b.dataset.save);
    $("#sign-grid").innerHTML = dictionaryCards();
    return;
  }
  if (b.dataset.modalSave) {
    toggleSave(b.dataset.modalSave);
    b.textContent = state.saved.includes(b.dataset.modalSave)
      ? "♥ Saved to your collection"
      : "♡ Save this sign";
    toast(
      state.saved.includes(b.dataset.modalSave)
        ? "A little sign, saved for later."
        : "Sign removed from your collection.",
    );
    return;
  }
  if (b.dataset.category) {
    category = b.dataset.category;
    render();
    return;
  }
  if (b.dataset.phrase) {
    $("#speak-text").value = b.dataset.phrase;
    $("#speak-text").focus();
    return;
  }
  if (b.dataset.lookup) {
    $("#voice-text").value = b.dataset.lookup;
    findSign();
    return;
  }
  if (b.dataset.answer && !quiz.answered) {
    quiz.answered = true;
    const right = quiz.questions[quiz.index].sign;
    const correct = b.dataset.answer === right.id;
    if (correct) quiz.score++;
    document.querySelectorAll("[data-answer]").forEach((el) => {
      el.disabled = true;
      if (el.dataset.answer === right.id) el.classList.add("correct");
      else if (el === b) el.classList.add("wrong");
    });
    $("#quiz-feedback").textContent = correct
      ? "That’s right! Another sign to connect with."
      : `Good practice! The correct answer is “${right.word}”.`;
    $("#next-question").disabled = false;
    return;
  }
  switch (b.id) {
    case "menu-toggle": {
      const open = $("#sidebar").classList.toggle("open");
      b.setAttribute("aria-expanded", String(open));
      break;
    }
    case "profile-button":
    case "progress-signin":
      authModal();
      break;
    case "help-button":
      location.hash = "about";
      break;
    case "saved-toggle":
      savedOnly = !savedOnly;
      render();
      break;
    case "view-saved":
      savedOnly = true;
      category = "All signs";
      search = "";
      location.hash = "dictionary";
      break;
    case "lesson-prev":
      lessonModal(activeLesson.id, lessonIndex - 1);
      break;
    case "lesson-next":
      if (lessonIndex < activeLesson.signs.length - 1)
        lessonModal(activeLesson.id, lessonIndex + 1);
      else {
        if (!state.completed.includes(activeLesson.id))
          state.completed.push(activeLesson.id);
        activity();
        persist();
        $("#modal").close();
        render();
        toast("A little more connected. Lesson complete!");
      }
      break;
    case "restart-quiz":
      newQuiz();
      render();
      break;
    case "next-question":
      if (!quiz.answered) return;
      if (quiz.index < quiz.questions.length - 1) {
        quiz.index++;
        quiz.answered = false;
      } else {
        quiz.finished = true;
        state.quizScores.push({
          score: quiz.score,
          total: quiz.questions.length,
          date: today(),
        });
        state.quizScores = state.quizScores.slice(-100);
        activity();
        persist();
      }
      render();
      break;
    case "find-sign":
      findSign();
      break;
    case "listen": {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        $("#voice-status").textContent =
          "Speech recognition isn’t available here. Please type your word, or try Chrome.";
        break;
      }
      if (recognition) {
        recognition.stop();
        break;
      }
      recognition = new SR();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.onstart = () => {
        if ($("#voice-status")) {
          $("#voice-status").textContent =
            "Listening… Say one word or expression.";
          $("#listen").textContent = "Stop listening";
        }
      };
      recognition.onresult = (event) => {
        if ($("#voice-text")) {
          $("#voice-text").value = event.results[0][0].transcript;
          findSign();
          $("#voice-status").textContent = "Word captured. Check your guide.";
        }
      };
      recognition.onerror = (event) => {
        if ($("#voice-status"))
          $("#voice-status").textContent =
            `Microphone unavailable (${event.error}). You can type instead.`;
      };
      recognition.onend = () => {
        recognition = null;
        if ($("#listen")) $("#listen").textContent = "◉ Use microphone";
      };
      try {
        recognition.start();
      } catch {
        recognition = null;
        $("#voice-status").textContent =
          "Could not start the microphone. Please type instead.";
      }
      break;
    }
    case "speak": {
      const text = $("#speak-text").value.trim();
      if (!text) {
        toast("Add a few words first.");
        break;
      }
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Number($("#speech-rate").value);
      const v = $("#voice-select").value;
      if (v !== "") utterance.voice = speechSynthesis.getVoices()[Number(v)];
      utterance.onstart = () => {
        if ($("#speech-status"))
          $("#speech-status").textContent = "Speaking your message…";
      };
      utterance.onend = () => {
        if ($("#speech-status"))
          $("#speech-status").textContent = "Message complete.";
      };
      utterance.onerror = () => {
        if ($("#speech-status"))
          $("#speech-status").textContent =
            "Speech stopped or unavailable. Check your device’s voices and audio settings.";
      };
      speechSynthesis.speak(utterance);
      break;
    }
    case "stop-speech":
      speechSynthesis.cancel();
      $("#speech-status").textContent = "Speech stopped.";
      break;
    case "start-camera":
      try {
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error("Camera access is not supported here.");
        b.disabled = true;
        const media = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (route !== "camera") {
          media.getTracks().forEach((t) => t.stop());
          break;
        }
        stream = media;
        $("#camera-video").srcObject = stream;
        $("#camera-video").style.display = "block";
        $("#camera-placeholder").style.display = "none";
        $("#stop-camera").disabled = false;
        $("#camera-status").textContent =
          "Your private practice mirror is on. Nothing is recorded.";
      } catch (err) {
        if ($("#camera-status")) {
          $("#camera-status").textContent =
            "Camera unavailable. Please allow camera access or use the written guide.";
          b.disabled = false;
        }
      }
      break;
    case "stop-camera":
      stopMedia();
      $("#camera-video").srcObject = null;
      $("#camera-video").style.display = "none";
      $("#camera-placeholder").style.display = "block";
      $("#start-camera").disabled = false;
      b.disabled = true;
      $("#camera-status").textContent = "Camera is off.";
      break;
    case "logout":
      try {
        await api("/api/logout", { method: "POST", body: {} });
        user = null;
        state = { completed: [], saved: [], quizScores: [], activity: [] };
        localStorage.removeItem("signbridge-progress");
        $("#modal").close();
        render();
        toast("You’re signed out. Your account progress is saved.");
      } catch (err) {
        toast(err.message);
      }
      break;
  }
});
document.addEventListener("input", (e) => {
  if (e.target.id === "sign-search") {
    search = e.target.value;
    $("#sign-grid").innerHTML = dictionaryCards();
  }
});
document.addEventListener("change", (e) => {
  if (e.target.id === "practice-sign")
    $("#practice-guide").innerHTML = practiceGuide(
      signs.find((s) => s.id === e.target.value),
    );
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.id === "voice-text") findSign();
});
document.addEventListener("submit", async (e) => {
  if (e.target.id !== "auth-form") return;
  e.preventDefault();
  const form = e.target,
    button = $("button[type=submit]", form);
  button.disabled = true;
  $("#auth-message").textContent = "";
  try {
    const data = await api("/api/" + form.dataset.mode, {
      method: "POST",
      body: Object.fromEntries(new FormData(form)),
    });
    user = data.user;
    const remote = data.progress;
    state = {
      completed: [...new Set([...remote.completed, ...state.completed])],
      saved: [...new Set([...remote.saved, ...state.saved])],
      activity: [...new Set([...remote.activity, ...state.activity])],
      quizScores: [
        ...new Map(
          [...remote.quizScores, ...state.quizScores].map((q) => [
            JSON.stringify(q),
            q,
          ]),
        ).values(),
      ].slice(-100),
    };
    persist();
    $("#modal").close();
    render();
    toast("Welcome in. Your journey is saved.");
  } catch (err) {
    $("#auth-message").textContent = err.message;
    button.disabled = false;
  }
});
$("#modal").addEventListener("click", (e) => {
  if (e.target === $("#modal")) {
    const r = e.target.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      e.target.close();
  }
});
if (window.speechSynthesis) speechSynthesis.onvoiceschanged = loadVoices;
window.addEventListener("hashchange", navigate);
window.addEventListener("pagehide", stopMedia);
loadLocal();
navigate();
api("/api/me")
  .then((data) => {
    if (data.user) {
      user = data.user;
      state = data.progress;
      localStorage.setItem("signbridge-progress", JSON.stringify(state));
      render();
    }
  })
  .catch(() => {});
