const concepts = [
  { id: "blue-current", layout: "classic", name: "Blue Current", short: "Neptune blue", descriptor: "The closest match to T3’s home screen, recolored with a calm Neptune-blue accent and a banded planet mark.", prompt: "Why does Neptune appear blue?" },
  { id: "triton-ice", layout: "classic", name: "Triton Ice", short: "Glacial night", descriptor: "Glacial cyan accents and an ink-blue atmosphere give the shared chat layout Triton’s frozen-horizon feel.", prompt: "What might Triton’s surface be like?" },
  { id: "great-dark-spot", layout: "classic", name: "Great Dark Spot", short: "Storm palette", descriptor: "Near-black storm tones, a shaded planet mark, and a quiet distant storm keep the same left-aligned chat rhythm.", prompt: "How do storms form on Neptune?" },
  { id: "ringed-horizon", layout: "classic", name: "Ringed Horizon", short: "Orbital indigo", descriptor: "Cool indigo surfaces and fine orbital ellipses bring Neptune’s faint rings into the shared T3 composition.", prompt: "How were Neptune’s rings discovered?" },
  { id: "methane-blue", layout: "classic", name: "Methane Blue", short: "Atmospheric bands", descriptor: "Blue atmospheric bands and a striped planet mark add subtle planetary texture without shifting the chat layout.", prompt: "What gives Neptune its color?" },
  { id: "aurora-drift", layout: "classic", name: "Aurora Drift", short: "Blue-green aurora", descriptor: "A restrained blue-green polar glow and cool ocean tones shape this atmospheric take on the same screen.", prompt: "Does Neptune have auroras?" },
  { id: "moonlit-neptune", layout: "classic", name: "Moonlit Neptune", short: "Silver moonlight", descriptor: "Graphite surfaces, silver-blue controls, and a softly lit planet mark suggest Triton beneath moonlight.", prompt: "Tell me about Neptune’s largest moon." },
  { id: "voyager-signal", layout: "classic", name: "Voyager Signal", short: "Probe telemetry", descriptor: "Sparse star points and a small Voyager 2 coordinate label add a restrained mission feel to the common layout.", prompt: "What did Voyager 2 discover at Neptune?" },
  { id: "deep-orbit", layout: "classic", name: "Deep Orbit", short: "Indigo halo", descriptor: "A saturated indigo palette and soft planetary halo bring a deeper-space mood to the familiar chat screen.", prompt: "How far away is Neptune?" },
  { id: "ice-giant", layout: "classic", name: "Ice Giant", short: "Frosted light", descriptor: "The T3 screen in a frosted light palette, using Blue Current’s Neptune blue for its accents and planet mark.", prompt: "Why are Uranus and Neptune called ice giants?" },
  { id: "studio-mint", layout: "classic", name: "Studio Mint", short: "Portfolio charcoal + mint", descriptor: "Portfolio direction 04 translated into chat: graphite surfaces, mint focus, lilac orbit details, and a gold primary action.", prompt: "How do Neptune’s atmospheric bands form?" },
  { id: "lilac-orbit", layout: "classic", name: "Lilac Orbit", short: "Lilac on deep ink", descriptor: "The portfolio’s lilac note becomes Neptune’s signal color on a graphite-indigo shell, with a mint orbital glint.", prompt: "What are Neptune’s rings made from?" },
  { id: "peach-comet", layout: "classic", name: "Peach Comet", short: "Warm orbit", descriptor: "Portfolio peach and gold accents cut through a deep-space blue shell; the planet carries a restrained warm edge.", prompt: "How cold is Neptune’s atmosphere?" },
  { id: "portfolio-spectrum", layout: "classic", name: "Portfolio Spectrum", short: "Four portfolio accents", descriptor: "Mint, lilac, gold, and peach form a quiet four-color system across the modes and orbital details.", prompt: "How many moons orbit Neptune?" },
];

const nav = document.querySelector("#conceptNav");
const previewRoot = document.querySelector("#previewRoot");
const activeNumber = document.querySelector("#activeNumber");
const activeCount = document.querySelector("#activeCount");
const activeTitle = document.querySelector("#activeTitle");
const activeDescription = document.querySelector("#activeDescription");
let activeIndex = 0;

const iconPaths = {
  sidebar: '<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M9 4v16"/>',
  compose: '<path d="M12 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10"/><path d="m15 5 4 4M11 13l7.5-7.5a2.1 2.1 0 0 1 3 3L14 16l-4 1z"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
  login: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.2 2"/>',
  sliders: '<path d="M4 7h5m4 0h7M4 17h9m4 0h3"/><circle cx="11" cy="7" r="2"/><circle cx="15" cy="17" r="2"/>',
  sparkle: '<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14ZM5 16l.7 1.8L7.5 18.5l-1.8.7L5 21l-.7-1.8-1.8-.7 1.8-.7L5 16Z"/>',
  explore: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/><path d="M7 4v16"/>',
  code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
  learn: '<path d="m2.5 9 9.5-5 9.5 5-9.5 5-9.5-5Z"/><path d="M6.5 11.2v4.2c3.4 2.6 7.6 2.6 11 0v-4.2M21.5 9v6"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  paperclip: '<path d="m8 12.5 6.8-6.8a3 3 0 0 1 4.2 4.2l-8.5 8.5a5 5 0 0 1-7.1-7.1l8.2-8.2"/>',
  send: '<path d="M12 19V5M6 11l6-6 6 6"/>',
};

function icon(name, size = 16) {
  return `<svg class="ui-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${iconPaths[name]}</svg>`;
}

function renderT3Concept(concept) {
  return `
    <div class="t3-screen theme-${concept.id} layout-${concept.layout}">
      <aside class="t3-sidebar">
        <div class="t3-sidebar-brand"><button type="button" class="collapse-sidebar" aria-label="Toggle sidebar">${icon("sidebar", 16)}</button><span class="neptune-logo"><i></i><b></b></span><span class="brand-name">NEPTUNE<span class="brand-ai">AI</span></span><button type="button" class="sidebar-new-chat" data-prompt="Start a new conversation about the solar system." aria-label="Start a new chat">${icon("compose", 18)}</button></div>
        <button type="button" class="new-chat" data-prompt="Start a new conversation about the solar system.">New Chat</button>
        <label class="thread-search"><span>${icon("search", 16)}</span><input aria-label="Search threads" placeholder="Search your threads..."></label>
        <p class="thread-day">Today</p>
        <a class="thread-item active" href="#chat">${concept.prompt}</a>
        <a class="thread-item" href="#chat">Notes from space</a>
        <div class="sidebar-account"><span class="account-symbol">${icon("login", 16)}</span><span>Login</span></div>
      </aside>
      <main class="t3-main" id="chat">
        <div class="t3-toolbar"><div class="toolbar-right"><button type="button" class="icon-button" aria-label="Recent activity">${icon("clock", 16)}</button><button id="themePickerToggle" type="button" class="icon-button" aria-label="Choose a Neptune theme" aria-haspopup="true" aria-expanded="false">${icon("sliders", 16)}</button></div></div>
        <div class="t3-content"><h1>How can I help you?</h1>
          <div class="mode-pills" aria-label="Prompt category"><button type="button" class="selected" data-prompt="Help me create something inspired by Neptune."><span>${icon("sparkle", 15)}</span> Create</button><button type="button" data-prompt="Explore an interesting fact about Neptune."><span>${icon("explore", 15)}</span> Explore</button><button type="button" data-prompt="Help me write a small program about the solar system."><span>${icon("code", 15)}</span> Code</button><button type="button" data-prompt="Teach me something about the planets."><span>${icon("learn", 15)}</span> Learn</button></div>
          <div class="suggestion-list"><button type="button" data-prompt="Why does Neptune appear blue?">${concept.prompt}<span>${icon("external", 14)}</span></button><button type="button" data-prompt="What would it take to send a new mission to Neptune?">What would a new mission to Neptune need?</button><button type="button" data-prompt="How is Neptune different from the other ice giant, Uranus?">How is Neptune different from Uranus?</button><button type="button" data-prompt="Could any of Neptune’s moons support an ocean?">Could one of Neptune’s moons have an ocean?</button></div>
          <div class="conversation-log" data-conversation aria-live="polite"></div>
        </div>
        <form class="t3-composer" data-demo-form><label class="sr-only" for="message-input">Message Neptune</label><textarea id="message-input" rows="1" placeholder="Type your message here..."></textarea><div class="composer-toolbar"><div class="composer-left"><button type="button" class="composer-model">Neptune Core <span class="model-cost">$$</span>${icon("chevron", 13)}</button><button type="button" class="composer-tool"><span>${icon("bolt", 14)}</span> Instant</button><button type="button" class="composer-tool"><span>${icon("globe", 14)}</span> Search</button><button type="button" class="composer-tool"><span>${icon("paperclip", 14)}</span> Attach</button></div><span class="composer-hint">Enter to send · Shift + Enter for new line</span><button type="submit" class="composer-send" aria-label="Send message">${icon("send", 17)}</button></div></form>
      </main>
    </div>`;
}

function renderNav() {
  nav.innerHTML = concepts.map((concept, index) => `
    <button class="concept-link${index === activeIndex ? " is-active" : ""}" type="button" data-concept-index="${index}" aria-pressed="${index === activeIndex}">
      <span class="concept-index">${String(index + 1).padStart(2, "0")}</span>
      <span class="concept-link-text"><strong>${concept.name}</strong><small>${concept.short}</small></span>
      <span class="concept-chevron" aria-hidden="true">${icon("external", 14)}</span>
    </button>`).join("");
}

function showConcept(index) {
  activeIndex = (index + concepts.length) % concepts.length;
  const concept = concepts[activeIndex];
  activeNumber.textContent = String(activeIndex + 1).padStart(2, "0");
  activeCount.textContent = String(concepts.length).padStart(2, "0");
  activeTitle.textContent = concept.name;
  activeDescription.textContent = concept.descriptor;
  previewRoot.className = "preview-root";
  previewRoot.innerHTML = renderT3Concept(concept);
  document.body.dataset.theme = concept.id;
  renderNav();
}

function sendDemoMessage(rawMessage) {
  const message = rawMessage.trim();
  if (!message) return;
  const conversation = previewRoot.querySelector("[data-conversation]");
  if (!conversation) return;
  const userTurn = document.createElement("p");
  userTurn.className = "demo-turn demo-user";
  userTurn.textContent = message;
  const reply = document.createElement("p");
  reply.className = "demo-turn demo-reply";
  reply.textContent = "Sample preview reply — Neptune would continue the conversation here.";
  conversation.append(userTurn, reply);
  const input = previewRoot.querySelector("[data-demo-form] textarea");
  if (input) input.value = "";
  reply.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

nav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-concept-index]");
  if (button) {
    showConcept(Number(button.dataset.conceptIndex));
    document.querySelector("#themePicker").hidden = true;
  }
});
document.querySelector("#previousConcept").addEventListener("click", () => showConcept(activeIndex - 1));
document.querySelector("#nextConcept").addEventListener("click", () => showConcept(activeIndex + 1));
previewRoot.addEventListener("click", (event) => {
  const promptButton = event.target.closest("[data-prompt]");
  if (promptButton) sendDemoMessage(promptButton.dataset.prompt);
  const themeToggle = event.target.closest("#themePickerToggle");
  if (themeToggle) {
    const picker = document.querySelector("#themePicker");
    picker.hidden = !picker.hidden;
    themeToggle.setAttribute("aria-expanded", String(!picker.hidden));
  }
});
document.addEventListener("click", (event) => {
  const picker = document.querySelector("#themePicker");
  if (picker.hidden || picker.contains(event.target) || previewRoot.querySelector("#themePickerToggle")?.contains(event.target)) return;
  picker.hidden = true;
  previewRoot.querySelector("#themePickerToggle")?.setAttribute("aria-expanded", "false");
});
previewRoot.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-demo-form]");
  if (!form) return;
  event.preventDefault();
  sendDemoMessage(form.querySelector("textarea")?.value ?? "");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelector("#themePicker").hidden = true;
    previewRoot.querySelector("#themePickerToggle")?.setAttribute("aria-expanded", "false");
    return;
  }
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLButton || target instanceof HTMLAnchorElement) return;
  if (event.key === "ArrowDown" || event.key === "ArrowRight") showConcept(activeIndex + 1);
  if (event.key === "ArrowUp" || event.key === "ArrowLeft") showConcept(activeIndex - 1);
});

showConcept(0);
