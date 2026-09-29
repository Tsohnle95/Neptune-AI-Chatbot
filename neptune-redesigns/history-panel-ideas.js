const panels = [
  { name: "Quiet Orbit", descriptor: "A small orbital mark, one understated create action, and a light chronological stream." },
  { name: "Scuderia", descriptor: "Pitwall typography, a red telemetry line, and numbered sessions inspired by Ferrari’s restraint and precision." },
  { name: "Carbon Apex", descriptor: "An angular monogram and acid-lime guide borrow Lamborghini’s sharp, low-profile attitude." },
  { name: "Library", descriptor: "A familiar native-library structure, now with a text-only Neptune header and pinned stars rotating through the portfolio palette." },
  { name: "Spotlight", descriptor: "Search leads; the history becomes a short, keyboard-friendly result palette." },
  { name: "Spaces", descriptor: "A workspace switcher takes the place of a large brand header; conversations belong to small, clear spaces." },
  { name: "Orbit Calendar", descriptor: "A seven-day orbital marker anchors the conversation list without adding timestamp clutter." },
  { name: "Saved First", descriptor: "Reference threads stay near the top while recent conversations remain a plain, short list." },
  { name: "Topic Index", descriptor: "A lightweight taxonomy puts subjects first and lets each conversation group collapse." },
  { name: "Focus", descriptor: "Only the current thread is open by default; older history stays behind one quiet disclosure." },
  { name: "Day Rail", descriptor: "A narrow date spine creates a distinctly editorial two-column timeline." },
  { name: "Command K", descriptor: "A compact command palette adds keyboard order and search without turning every item into a card." },
  { name: "Constellation Map", descriptor: "A sparse star map groups a few conversations spatially; the rest stay beyond the visible orbit." },
  { name: "Collections", descriptor: "Collections become the primary navigation, with individual conversations one level below." },
  { name: "Bare", descriptor: "Brand mark, labels, footer, and permanent search chrome disappear into one very quiet index." },
];

const threads = [
  { id: "dark-spot", title: "Neptune’s Great Dark Spot", preview: "Storms that appear and dissolve in Neptune’s atmosphere.", category: "Atmosphere", date: "Today", day: "29", time: "9:42", saved: true, number: "01", initial: "N" },
  { id: "rings", title: "The faint rings of Neptune", preview: "Dusty arcs shaped by small shepherd moons.", category: "Planet", date: "Today", day: "29", time: "8:16", saved: true, number: "02", initial: "T" },
  { id: "mission", title: "A future Neptune mission", preview: "Orbiter, probe, and the long cruise outward.", category: "Missions", date: "Today", day: "29", time: "4:08", saved: true, number: "03", initial: "A" },
  { id: "triton", title: "Life beneath Triton’s ice", preview: "Could a hidden ocean support chemistry for life?", category: "Moons", date: "Yesterday", day: "28", time: "Sun", saved: false, number: "04", initial: "L" },
  { id: "blue-color", title: "Why Neptune looks blue", preview: "How the atmosphere changes the light we see.", category: "Atmosphere", date: "Yesterday", day: "28", time: "Sun", saved: false, number: "05", initial: "W" },
  { id: "orbital", title: "Neptune’s orbital mechanics", preview: "Resonances and the edge of the solar system.", category: "Science", date: "Yesterday", day: "28", time: "Sun", saved: false, number: "06", initial: "N" },
  { id: "voyager", title: "Voyager 2 flyby notes", preview: "One close pass and a lasting scientific legacy.", category: "Missions", date: "Sep 27", day: "27", time: "Sat", saved: true, number: "07", initial: "V" },
  { id: "moon-ocean", title: "Could a moon hide an ocean?", preview: "How tidal heating may warm an icy world.", category: "Moons", date: "Sep 27", day: "27", time: "Sat", saved: false, number: "08", initial: "C" },
  { id: "ice-giants", title: "Comparing the ice giants", preview: "What Uranus and Neptune share—and where they differ.", category: "Science", date: "Sep 26", day: "26", time: "Fri", saved: false, number: "09", initial: "C" },
];
const byId = Object.fromEntries(threads.map((thread) => [thread.id, thread]));
const host = document.querySelector("#historySidebar");
const picker = document.querySelector("#historyPicker");
const pickerToggle = document.querySelector("#historyPickerToggle");
const nav = document.querySelector("#panelNav");
const panelTitle = document.querySelector("#historyPickerTitle");
const panelDescription = document.querySelector("#panelDescription");
const panelNumber = document.querySelector("#panelNumber");
const activePanelLabel = document.querySelector("#activePanelLabel");
let activePanel = 0;
let activeThread = "dark-spot";
let searchText = "";
let activeScope = "all";
let activeCategory = "";

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const items = (...ids) => ids.flat().map((id) => byId[id]).filter(Boolean);
const icon = (name) => {
  const paths = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/>',
    chevron: '<path d="m8 10 4 4 4-4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    sliders: '<path d="M4 7h5m4 0h7M4 17h9m4 0h3"/><circle cx="11" cy="7" r="2"/><circle cx="15" cy="17" r="2"/>',
    star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>',
  };
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
};
function brand(word = "Neptune", suffix = "", action = "new") {
  return `<div class="hd-brandline"><i class="hd-symbol" aria-hidden="true"></i><span class="hd-word">${word}${suffix ? `<small>${suffix}</small>` : ""}</span>${action === "new" ? `<button class="hd-action" type="button" data-new-chat aria-label="New chat">${icon("plus")}</button>` : action === "search" ? `<button class="hd-action" type="button" data-open-search aria-label="Search history">${icon("search")}</button>` : ""}</div>`;
}
function searchBox(placeholder = "Search history", options = {}) {
  return `<label class="hd-search" data-search-box${options.collapsed ? ' data-collapsed="true" data-open="false"' : ""}>${icon("search")}<input data-history-search aria-label="Search conversation history" placeholder="${esc(placeholder)}" value="${esc(searchText)}">${options.shortcut ? `<kbd>${options.shortcut}</kbd>` : ""}</label>`;
}
function newLink(text = "New chat") { return `<button type="button" class="hd-new" data-new-chat><span class="plus">+</span><span>${text}</span></button>`; }
function label(text, count = "") { return `<div class="hd-label"><span>${esc(text)}</span>${count ? `<small>${esc(count)}</small>` : ""}</div>`; }
function row(item, options = {}) {
  const active = item.id === activeThread;
  const saved = options.pinned || item.saved;
  const classes = ["hd-row", active ? "is-active" : "", options.className || ""].filter(Boolean).join(" ");
  const leading = options.index ? `<span class="hd-index">${esc(options.index)}</span>` : options.date ? `<span class="hd-date-mini">${esc(options.date)}</span>` : options.star ? `<span class="hd-star" style="--star-color:${esc(options.starColor || "#f2d67c")}" aria-hidden="true">✦</span>` : options.marker === false ? "" : `<i class="hd-dot" aria-hidden="true"></i>`;
  const subtitle = options.subtitle ? `<span class="hd-sub">${esc(options.subtitle === true ? item.preview : options.subtitle)}</span>` : "";
  const meta = options.meta ? `<span class="hd-meta">${esc(options.meta === true ? item.time : options.meta)}</span>` : "";
  return `<button type="button" class="${classes}" data-history-thread data-thread-id="${item.id}" data-category="${esc(item.category)}" data-saved="${saved}" data-search="${esc(`${item.title} ${item.preview} ${item.category}`.toLowerCase())}" aria-pressed="${active}">${leading}<span class="hd-row-copy"><span class="hd-title">${esc(item.title)}</span>${subtitle}</span>${meta}</button>`;
}
function group(name, rows, count = "") { return `<section class="hd-history-group" data-history-group>${label(name, count)}${rows}</section>`; }
function footer(left = "Personal workspace") { return `<div class="hd-footer"><span>${esc(left)}</span><button class="hd-action" type="button" aria-label="Account settings">···</button></div>`; }
function sidebar(inner, variant, footerText = "") { return `<div class="history-design history-v${String(variant).padStart(2, "0")}">${inner}${footerText ? footer(footerText) : ""}</div>`; }

function render01() {
  return sidebar(`<div class="hd-head">${brand("Neptune", "AI", "none")}${searchBox("Find a conversation")}${newLink()}</div><div class="hd-body">${group("Today", items("dark-spot", "rings", "mission").map((item) => row(item)).join(""), "3")}${group("Yesterday", items("triton", "blue-color", "orbital").map((item) => row(item)).join(""), "3")}${group("Earlier", items("voyager", "moon-ocean", "ice-giants").map((item) => row(item)).join(""), "3")}</div>`, 1, "Neptune · Personal");
}
function render02() {
  const live = items("dark-spot", "rings", "mission");
  const archived = items("triton", "blue-color", "orbital", "voyager", "moon-ocean", "ice-giants");
  return sidebar(`<div class="hd-head hd-scuderia-head">${brand("Scuderia", "N · 01", "none")} ${newLink("New session")} ${searchBox("Find session")}</div><div class="hd-body">${label("Live garage", "03")}<div class="hd-pitwall" data-history-group>${live.map((item, i) => row(item, { index: `0${i + 1}`, meta: item.time, marker: false })).join("")}</div>${label("Telemetry archived", "06")}<button class="hd-archive-link" data-expand-toggle="pit-archive" aria-expanded="false">View previous sessions <span>06</span></button><div id="pit-archive" class="hd-archive-list" hidden>${archived.map((item) => row(item, { index: item.number, marker: false })).join("")}</div></div>`, 2, "ORBITAL DIVISION");
}
function render03() {
  const routes = threads.filter((item) => item.id !== activeThread);
  return sidebar(`<div class="hd-head">${brand("N", "ORBITAL", "new")} ${searchBox("Search archive")}</div><div class="hd-body"><div class="hd-apex-current">${label("In motion", "01")}${row(byId[activeThread], { subtitle: true, meta: false })}</div>${label("Coordinates", "04")}<div class="hd-apex-index" data-history-group>${routes.slice(0, 4).map((item, i) => row(item, { index: String(i + 2).padStart(2, "0"), marker: false })).join("")}</div><button class="hd-see-all" data-expand-toggle="apex-tail" aria-expanded="false">Earlier routes <span>04</span></button><div id="apex-tail" class="hd-archive-list" hidden>${routes.slice(4).map((item, i) => row(item, { index: String(i + 6).padStart(2, "0"), marker: false })).join("")}</div></div>`, 3, "CARBON SERIES");
}
function render04() {
  const all = items("dark-spot", "rings", "mission", "triton", "blue-color", "orbital", "voyager", "moon-ocean", "ice-giants");
  const pinned = [[byId["dark-spot"], "#a5f3de"], [byId.rings, "#c6b8ff"], [byId.mission, "#f2d67c"], [byId.voyager, "#ff9e83"]];
  const pinnedIds = new Set(pinned.map(([item]) => item.id));
  const recent = all.filter((item) => !pinnedIds.has(item.id));
  return sidebar(`<div class="hd-head"><div class="hd-brandline"><span class="hd-word">Neptune</span><button class="hd-action" type="button" data-new-chat aria-label="New chat">${icon("plus")}</button></div>${searchBox("Search library")}<div class="hd-inline-filter"><button class="hd-filter${activeScope === "all" ? " is-on" : ""}" data-scope="all">All</button><button class="hd-filter${activeScope === "saved" ? " is-on" : ""}" data-scope="saved">Saved</button></div></div><div class="hd-body"><section class="hd-library-pinned" data-history-group>${label("Pinned", "04")}${pinned.map(([item, color]) => row(item, { star: true, pinned: true, starColor: color, className: "hd-pinned-row" })).join("")}</section>${group("Recent", recent.slice(0, 3).map((item) => row(item, { marker: false })).join(""), "")}${recent.length > 3 ? `<button class="hd-archive-link" data-expand-toggle="library-older" aria-expanded="false">Earlier conversations <span>${String(recent.length - 3).padStart(2, "0")}</span></button><div id="library-older" class="hd-archive-list" hidden>${recent.slice(3).map((item) => row(item, { marker: false })).join("")}</div>` : ""}</div>`, 4, "iCloud · Neptune");
}
function render05() {
  const suggestions = items("dark-spot", "mission", "triton", "rings", "blue-color");
  return sidebar(`<div class="hd-head hd-spotlight">${searchBox("Jump to a conversation", { shortcut: "⌘ K" })}<div class="hd-brandline"><i class="hd-symbol" aria-hidden="true"></i><span class="hd-word">NEPTUNE</span>${newLink()}</div></div><div class="hd-body">${label("Suggested", "↵")}${suggestions.map((item, i) => row(item, { index: i === 0 ? "↵" : "", marker: false, meta: i === 0 ? "OPEN" : false })).join("")}</div>`, 5);
}
function render06() {
  const threadsView = `${group("Planet notes", items("dark-spot", "rings", "blue-color").map((item) => row(item, { marker: false })).join(""), "")}${group("Exploration", items("mission", "voyager", "orbital").map((item) => row(item, { marker: false })).join(""), "")}${group("Worlds", items("triton", "moon-ocean", "ice-giants").map((item) => row(item, { marker: false })).join(""), "")}`;
  const collectionsView = `<div class="hd-space-collection-list">${[["Atmosphere", "2"], ["Missions", "2"], ["Moons", "2"], ["Planetary science", "3"]].map(([name, count]) => `<button class="hd-space-collection" type="button" data-space-category="${name}"><span>${name}</span><small>${count}</small>${icon("arrow")}</button>`).join("")}</div>`;
  return sidebar(`<div class="hd-head"><div class="hd-brandline hd-space-picker"><i class="hd-symbol"></i><span class="hd-word">PERSONAL <small>⌄</small><small class="hd-space-name">Neptune research</small></span></div>${newLink("New conversation")}<div class="hd-inline-filter"><button class="hd-filter is-on" data-space-view="threads">Threads</button><button class="hd-filter" data-space-view="collections">Collections</button></div>${searchBox("Search this space")}</div><div class="hd-body"><div data-space-pane="threads">${threadsView}</div><div data-space-pane="collections" hidden>${collectionsView}</div></div>`, 6, "Switch workspace");
}
function render07() {
  const days = [["W", "23"], ["T", "24"], ["F", "25"], ["S", "26"], ["S", "27"], ["M", "28"], ["T", "29"]];
  return sidebar(`<div class="hd-head">${brand("Neptune", "", "new")}${searchBox("Search", { collapsed: true })}</div><div class="hd-body"><div class="hd-date-orbit">${days.map(([day, date]) => `<span class="hd-day${date === "29" ? " is-current" : ""}">${day}<strong>${date}</strong></span>`).join("")}</div>${group("29 September", items("dark-spot", "rings", "mission").map((item) => row(item, { marker: false, meta: item.time })).join(""), "")}${group("28 September", items("triton", "blue-color", "orbital").map((item) => row(item, { marker: false })).join(""), "")}${group("27 September", items("voyager", "moon-ocean", "ice-giants").map((item) => row(item, { marker: false })).join(""), "")}</div>`, 7, "7 day orbit");
}
function render08() {
  return sidebar(`<div class="hd-head">${brand("Neptune", "", "none")}${searchBox("Search history", { collapsed: true })}${newLink()}</div><div class="hd-body"><div class="hd-saved-zone" data-history-group>${label("Starred")}${items("mission", "voyager", "dark-spot", "rings").map((item, i) => row(item, { star: true, marker: false, starColor: ["#a5f3de", "#c6b8ff", "#f2d67c", "#ff9e83"][i] })).join("")}</div><div class="hd-recent-zone">${label("Recent")}${items("triton", "blue-color", "orbital", "moon-ocean", "ice-giants").map((item) => row(item, { marker: false })).join("")}</div></div>`, 8, "");
}
function render09() {
  const groups = [["Atmosphere", "#a5f3de", ["dark-spot", "blue-color"]], ["Moons", "#ff9e83", ["triton", "moon-ocean"]], ["Missions", "#f2d67c", ["mission", "voyager"]], ["Planet", "#c6b8ff", ["rings", "orbital", "ice-giants"]]];
  const topics = groups.map(([topic, color, ids]) => `<section class="hd-topic" data-history-group><button class="hd-topic-toggle" data-topic-toggle aria-expanded="true"><i style="--topic:${color}"></i><strong>${topic}</strong><small>${String(ids.length).padStart(2, "0")}</small>${icon("chevron")}</button><div class="hd-topic-threads">${items(...ids).map((item) => row(item, { marker: false })).join("")}</div></section>`).join("");
  const allThreads = items("dark-spot", "rings", "mission", "triton", "blue-color", "orbital", "voyager", "moon-ocean", "ice-giants");
  const savedThreads = threads.filter((item) => item.saved);
  return sidebar(`<div class="hd-head">${brand("Neptune", "", "new")}<div class="hd-top-tabs"><button class="is-on" data-topic-view="topics">Topics</button><button data-topic-view="recent">Recent</button><button data-topic-view="saved">Saved</button></div>${searchBox("Find a topic")}</div><div class="hd-body"><div data-topic-pane="topics">${topics}</div><div data-topic-pane="recent" hidden>${allThreads.map((item) => row(item, { marker: false })).join("")}</div><div data-topic-pane="saved" hidden>${savedThreads.map((item) => row(item, { marker: false, star: true })).join("")}</div></div>`, 9);
}
function render10() {
  const earlier = threads.filter((item) => item.id !== activeThread);
  return sidebar(`<div class="hd-head">${brand("Neptune", "", "none")}${searchBox("Search history", { collapsed: true })}</div><div class="hd-body"><div class="hd-focus-label">Current thread</div><div class="hd-focus-thread" data-history-group>${row(byId[activeThread], { subtitle: true, marker: false })}</div><button class="hd-older-toggle" data-expand-toggle="focus-older" aria-expanded="false">Earlier <span>· 08</span>${icon("chevron")}</button><div class="hd-older" id="focus-older" hidden>${earlier.map((item) => row(item, { marker: false })).join("")}</div></div>${newLink("Start a new thought")}`, 10, "Focus mode");
}
function render11() {
  const groups = [["MON", "29", ["dark-spot", "rings", "mission"]], ["SUN", "28", ["triton", "blue-color", "orbital"]], ["SAT", "27", ["voyager", "moon-ocean", "ice-giants"]]];
  return sidebar(`<div class="hd-head">${brand("Neptune", "", "new")}${searchBox("Search history")}</div><div class="hd-body">${groups.map(([day, date, ids]) => `<section class="hd-day-group" data-history-group><div class="hd-date-rail">${day}<strong>${date}</strong></div><div class="hd-day-items">${items(...ids).map((item) => row(item, { marker: false })).join("")}</div></section>`).join("")}</div>`, 11, "September 2026");
}
function render12() {
  const ordered = items("dark-spot", "rings", "mission", "triton", "blue-color", "orbital", "voyager", "moon-ocean", "ice-giants");
  return sidebar(`<div class="hd-head">${brand("N", "COMMAND", "new")}${searchBox("Search or jump to…", { shortcut: "⌘ K" })}</div><div class="hd-body">${label("Recent", "↑↓")}${ordered.map((item, i) => row(item, { index: String(i + 1).padStart(2, "0"), marker: false, meta: i === 0 ? "↵" : false })).join("")}</div>`, 12, "↑ ↓ navigate · ↵ open");
}
function render13() {
  const mapThreads = [byId[activeThread], ...threads.filter((item) => item.id !== activeThread)].slice(0, 5);
  const mapIds = new Set(mapThreads.map((item) => item.id));
  const distant = threads.filter((item) => !mapIds.has(item.id));
  return sidebar(`<div class="hd-head">${brand("Neptune", "", "new")}${searchBox("Find a conversation")}</div><div class="hd-body"><div class="hd-map-caption">${label("Conversation field", "5 near")}</div><div class="hd-star-map" data-history-group><svg class="hd-map-edges" viewBox="0 0 220 276" preserveAspectRatio="none" aria-hidden="true"><path d="M20 26 C52 32 52 63 106 66 S168 79 174 113 S127 147 62 154 S91 196 138 210 S173 239 99 254"/><circle cx="20" cy="26" r="2"/><circle cx="106" cy="66" r="2"/><circle cx="174" cy="113" r="2"/><circle cx="62" cy="154" r="2"/><circle cx="138" cy="210" r="2"/></svg>${mapThreads.map((item, i) => row(item, { marker: false, className: `hd-map-node node-${i + 1}` })).join("")}</div><button class="hd-see-all" data-expand-toggle="map-distant" aria-expanded="false">Further out <span>04</span></button><div id="map-distant" class="hd-archive-list" hidden>${distant.map((item) => row(item, { marker: false })).join("")}</div></div>`, 13);
}
function render14() {
  const collections = [["Atmosphere", "#a5f3de", ["dark-spot", "blue-color"]], ["Missions", "#f2d67c", ["mission", "voyager"]], ["Moons", "#ff9e83", ["triton", "moon-ocean"]], ["Outer system", "#c6b8ff", ["rings", "orbital", "ice-giants"]]];
  return sidebar(`<div class="hd-head">${brand("Collections", "", "new")}${searchBox("Search collections")}</div><div class="hd-body">${collections.map(([name, color, ids]) => `<section class="hd-collection" data-history-group><div class="hd-collection-head"><i style="--collection:${color}"></i><span>${name}</span><small>${ids.length}</small></div>${items(...ids).map((item) => row(item, { marker: false })).join("")}</section>`).join("")}</div>`, 14, "Manage collections");
}
function render15() {
  const recent = items("dark-spot", "rings", "mission");
  const rest = items("triton", "blue-color", "orbital", "voyager", "moon-ocean", "ice-giants");
  return sidebar(`<div class="hd-head">${brand("N", "", "none")}${searchBox("Search", { collapsed: true })}${newLink()}</div><div class="hd-body">${recent.map((item) => row(item, { marker: item.id === activeThread })).join("")}<button class="hd-show-all" type="button" data-expand-toggle="bare-all" aria-expanded="false">All conversations <span>09</span>${icon("arrow")}</button><div id="bare-all" class="hd-bare-all" hidden>${rest.map((item) => row(item, { marker: false })).join("")}</div></div>`, 15);
}
const renderers = [render01, render02, render03, render04, render05, render06, render07, render08, render09, render10, render11, render12, render13, render14, render15];
function renderNav() {
  nav.innerHTML = panels.map((panel, index) => `<button type="button" class="history-nav-item${index === activePanel ? " is-active" : ""}" data-panel-index="${index}" aria-pressed="${index === activePanel}"><span class="history-nav-number">${String(index + 1).padStart(2, "0")}</span><span class="history-nav-name">${esc(panel.name)}</span></button>`).join("");
}
function applyFilters() {
  if (searchText || activeScope === "saved") {
    host.querySelectorAll("[data-expand-toggle]").forEach((toggle) => {
      const target = host.querySelector(`#${toggle.dataset.expandToggle}`);
      if (target) { target.hidden = false; toggle.setAttribute("aria-expanded", "true"); }
    });
    host.querySelectorAll("[data-topic-toggle]").forEach((toggle) => {
      const list = toggle.nextElementSibling;
      if (list) { list.hidden = false; toggle.setAttribute("aria-expanded", "true"); }
    });
  }
  host.querySelectorAll("[data-history-search]").forEach((input) => { if (input.value !== searchText) input.value = searchText; });
  host.querySelectorAll("[data-history-thread]").forEach((element) => {
    const matchesText = !searchText || element.dataset.search.includes(searchText.toLowerCase());
    const matchesScope = activeScope !== "saved" || element.dataset.saved === "true";
    const matchesCategory = !activeCategory || element.dataset.category === activeCategory;
    const matches = matchesText && matchesScope && matchesCategory;
    element.hidden = !matches;
  });
  host.querySelectorAll("[data-history-group]").forEach((group) => {
    const rows = group.querySelectorAll("[data-history-thread]");
    if (rows.length) group.hidden = !Array.from(rows).some((element) => !element.hidden);
  });
}
function showPanel(index) {
  const nextIndex = (index + panels.length) % panels.length;
  if (nextIndex !== activePanel) { activeScope = "all"; activeCategory = ""; }
  activePanel = nextIndex;
  const panel = panels[activePanel];
  host.innerHTML = renderers[activePanel]();
  panelTitle.textContent = panel.name;
  panelDescription.textContent = panel.descriptor;
  panelNumber.textContent = String(activePanel + 1).padStart(2, "0");
  activePanelLabel.innerHTML = `${String(activePanel + 1).padStart(2, "0")} <i></i> ${esc(panel.name)}`;
  renderNav();
  applyFilters();
}
function openSearch() {
  const field = host.querySelector("[data-search-box]");
  if (!field) return;
  field.dataset.open = "true";
  const input = field.querySelector("input");
  input?.focus();
}

pickerToggle.addEventListener("click", () => {
  picker.hidden = !picker.hidden;
  pickerToggle.setAttribute("aria-expanded", String(!picker.hidden));
});
document.querySelector("#previousPanel").addEventListener("click", () => showPanel(activePanel - 1));
document.querySelector("#nextPanel").addEventListener("click", () => showPanel(activePanel + 1));
nav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-panel-index]");
  if (!button) return;
  showPanel(Number(button.dataset.panelIndex));
  picker.hidden = true;
  pickerToggle.setAttribute("aria-expanded", "false");
});
host.addEventListener("click", (event) => {
  const searchTrigger = event.target.closest("[data-open-search]");
  if (searchTrigger) { openSearch(); return; }
  const searchBoxElement = event.target.closest("[data-search-box][data-collapsed='true']");
  if (searchBoxElement && searchBoxElement.dataset.open !== "true") { searchBoxElement.dataset.open = "true"; searchBoxElement.querySelector("input")?.focus(); return; }
  const disclosure = event.target.closest("[data-expand-toggle]");
  if (disclosure) {
    const target = host.querySelector(`#${disclosure.dataset.expandToggle}`);
    if (target) { target.hidden = !target.hidden; disclosure.setAttribute("aria-expanded", String(!target.hidden)); }
    return;
  }
  const topic = event.target.closest("[data-topic-toggle]");
  if (topic) {
    const list = topic.nextElementSibling;
    list.hidden = !list.hidden;
    topic.setAttribute("aria-expanded", String(!list.hidden));
    return;
  }
  const topicView = event.target.closest("[data-topic-view]");
  if (topicView) {
    host.querySelectorAll("[data-topic-view]").forEach((button) => button.classList.toggle("is-on", button === topicView));
    host.querySelectorAll("[data-topic-pane]").forEach((pane) => { pane.hidden = pane.dataset.topicPane !== topicView.dataset.topicView; });
    return;
  }
  const spaceView = event.target.closest("[data-space-view]");
  if (spaceView) {
    host.querySelectorAll("[data-space-view]").forEach((button) => button.classList.toggle("is-on", button === spaceView));
    host.querySelectorAll("[data-space-pane]").forEach((pane) => { pane.hidden = pane.dataset.spacePane !== spaceView.dataset.spaceView; });
    activeCategory = "";
    applyFilters();
    return;
  }
  const spaceCategory = event.target.closest("[data-space-category]");
  if (spaceCategory) {
    const category = spaceCategory.dataset.spaceCategory;
    activeCategory = category;
    host.querySelectorAll("[data-space-view]").forEach((button) => button.classList.remove("is-on"));
    host.querySelectorAll("[data-space-pane]").forEach((pane) => { pane.hidden = pane.dataset.spacePane !== "threads"; });
    applyFilters();
    return;
  }
  const scope = event.target.closest("[data-scope]");
  if (scope) {
    const savedOnly = scope.dataset.scope === "saved";
    activeScope = savedOnly ? "saved" : "all";
    activeCategory = "";
    host.querySelectorAll("[data-scope]").forEach((button) => button.classList.toggle("is-on", button === scope));
    applyFilters();
    return;
  }
  const newChat = event.target.closest("[data-new-chat]");
  if (newChat) { activeThread = "dark-spot"; showPanel(activePanel); return; }
  const rowElement = event.target.closest("[data-history-thread]");
  if (!rowElement) return;
  activeThread = rowElement.dataset.threadId;
  if (activePanel === 2 || activePanel === 9 || activePanel === 12) { const top = host.querySelector(".hd-body")?.scrollTop || 0; showPanel(activePanel); const body = host.querySelector(".hd-body"); if (body) body.scrollTop = top; return; }
  host.querySelectorAll("[data-history-thread]").forEach((row) => {
    const selected = row.dataset.threadId === activeThread;
    row.classList.toggle("is-active", selected);
    row.setAttribute("aria-pressed", String(selected));
  });
});
host.addEventListener("input", (event) => {
  if (!event.target.matches("[data-history-search]")) return;
  searchText = event.target.value.trim();
  applyFilters();
});
document.querySelector("#demoComposer").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#messageInput");
  const value = input.value.trim();
  if (!value) return;
  const log = document.querySelector("#conversationLog");
  const user = document.createElement("p"); user.className = "demo-turn demo-user"; user.textContent = value;
  const reply = document.createElement("p"); reply.className = "demo-turn demo-reply"; reply.textContent = "Sample preview reply — Neptune would continue the conversation here.";
  log.append(user, reply);
  input.value = "";
});
document.addEventListener("keydown", (event) => {
  const target = event.target;
  if (event.key === "Escape" && !picker.hidden) { picker.hidden = true; pickerToggle.setAttribute("aria-expanded", "false"); pickerToggle.focus(); return; }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openSearch(); return; }
  if (target.matches("input, textarea, button, a, select")) return;
  if (event.key === "ArrowRight") showPanel(activePanel + 1);
  if (event.key === "ArrowLeft") showPanel(activePanel - 1);
});
showPanel(0);
