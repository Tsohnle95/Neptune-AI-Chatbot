const searchInput = document.querySelector("#historySearch");
const history = document.querySelector("#libraryHistory");
const olderThreads = document.querySelector("#olderThreads");
const olderToggle = document.querySelector("[data-toggle-older]");
const sidebar = document.querySelector("#librarySidebar");
const screen = document.querySelector(".t3-screen");
const historyToggle = document.querySelector("[data-toggle-history]");
const historyBackdrop = document.querySelector("[data-close-history]");
const mobileHistory = window.matchMedia("(max-width: 640px)");
let scope = "all";
let activeThread = "dark-spot";

function setHistoryOpen(open, { returnFocus = false } = {}) {
  const shouldOpen = mobileHistory.matches && open;
  sidebar.classList.toggle("is-open", shouldOpen);
  screen.classList.toggle("history-open", shouldOpen);
  sidebar.inert = mobileHistory.matches && !shouldOpen;
  document.querySelector("#chat").inert = shouldOpen;
  historyBackdrop.hidden = !shouldOpen;
  historyToggle.setAttribute("aria-expanded", String(shouldOpen));
  historyToggle.setAttribute("aria-label", shouldOpen ? "Close chat history" : "Open chat history");
  if (shouldOpen) searchInput.focus();
  else if (returnFocus) historyToggle.focus();
}

setHistoryOpen(false);
historyToggle.addEventListener("click", () => {
  setHistoryOpen(!sidebar.classList.contains("is-open"));
});
historyBackdrop.addEventListener("click", () => setHistoryOpen(false, { returnFocus: true }));
mobileHistory.addEventListener("change", () => setHistoryOpen(false));

function applyLibraryFilter() {
  const query = searchInput.value.trim().toLowerCase();
  if (query && olderThreads.hidden) {
    olderThreads.hidden = false;
    olderToggle.setAttribute("aria-expanded", "true");
  }
  history.querySelectorAll("[data-thread-id]").forEach((thread) => {
    const matchesQuery = !query || thread.dataset.search.includes(query);
    const matchesScope = scope === "all" || thread.dataset.pinned === "true";
    thread.hidden = !(matchesQuery && matchesScope);
  });
  history.querySelectorAll("[data-history-group]").forEach((group) => {
    const visibleThread = group.querySelector("[data-thread-id]:not([hidden])");
    group.hidden = !visibleThread;
  });
}

searchInput.addEventListener("input", applyLibraryFilter);
document.querySelectorAll("[data-scope]").forEach((tab) => {
  tab.addEventListener("click", () => {
    scope = tab.dataset.scope;
    document.querySelectorAll("[data-scope]").forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    applyLibraryFilter();
  });
});
olderToggle.addEventListener("click", () => {
  olderThreads.hidden = !olderThreads.hidden;
  olderToggle.setAttribute("aria-expanded", String(!olderThreads.hidden));
});
history.addEventListener("click", (event) => {
  const thread = event.target.closest("[data-thread-id]");
  if (!thread) return;
  activeThread = thread.dataset.threadId;
  history.querySelectorAll("[data-thread-id]").forEach((item) => {
    const selected = item.dataset.threadId === activeThread;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  setHistoryOpen(false, { returnFocus: true });
});
document.querySelector("[data-new-chat]").addEventListener("click", () => {
  activeThread = "dark-spot";
  history.querySelectorAll("[data-thread-id]").forEach((item) => {
    const selected = item.dataset.threadId === activeThread;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  searchInput.value = "";
  scope = "all";
  document.querySelectorAll("[data-scope]").forEach((item, index) => {
    item.classList.toggle("is-active", index === 0);
    item.setAttribute("aria-selected", String(index === 0));
  });
  applyLibraryFilter();
  setHistoryOpen(false);
  document.querySelector("#messageInput").focus();
});
document.querySelectorAll(".suggestion-list button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#messageInput").value = button.firstChild.textContent.trim();
    document.querySelector("#messageInput").focus();
  });
});
document.querySelector("#demoComposer").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#messageInput");
  const message = input.value.trim();
  if (!message) return;
  const log = document.querySelector("#conversationLog");
  const user = document.createElement("p");
  user.className = "demo-turn demo-user";
  user.textContent = message;
  const reply = document.createElement("p");
  reply.className = "demo-turn demo-reply";
  reply.textContent = "Sample preview reply — Neptune would continue the conversation here.";
  log.append(user, reply);
  input.value = "";
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
    setHistoryOpen(false, { returnFocus: true });
    return;
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (mobileHistory.matches) setHistoryOpen(true);
    else searchInput.focus();
  }
});
