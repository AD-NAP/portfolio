// Shafik's room: picks the view (3D room or plain list), opens one thing at a time, and runs the mini game.
// Three.js is only loaded when the 3D room is shown (room.js), so phones and the list view never download it.

const $ = (s, r = document) => r.querySelector(s);
const body = document.body;
const panel = $(".panel");
const closeBtn = $(".panel__close");
const dockBtns = [...document.querySelectorAll(".dock button")];
const things = [...document.querySelectorAll(".thing")];
const toggle = $(".view-toggle");
const note = $(".note");
const noteText = $(".note__text");
const noteOpen = $(".note__open");
const canvas = $(".stage__canvas");
const tag = $(".stage__tag");
const pct = $(".stage__pct");
const menuBtn = $(".menu-btn");

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isPhone = matchMedia("(max-width: 820px), (hover: none) and (pointer: coarse)").matches;
const hasWebGL = (() => {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); }
  catch (e) { return false; }
})();

let room = null;        // the 3D room, once loaded
let roomLoading = null;
let current = null;     // the open thing
const LABELS = { ...Object.fromEntries(dockBtns.map(b => [b.dataset.thing, b.textContent])), exit: "Back to the portfolio" };

/* ---------- Hidden UI: in the room only "Menu" shows; Menu, Esc or Tab bring the rest back ---------- */
let keyboard = false;   // was the last input a key? Then focus follows; after a click it doesn't
document.addEventListener("keydown", () => { keyboard = true; }, true);
document.addEventListener("pointerdown", () => { keyboard = false; }, true);
function setUi(open) {
  body.classList.toggle("ui-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.textContent = open ? "Close menu" : "Menu";
}
menuBtn.addEventListener("click", () => setUi(!body.classList.contains("ui-open")));
// Tabbing into anything that's hidden shows it, so a focused control is never invisible.
document.addEventListener("focusin", e => {
  if (body.classList.contains("mode-room") && e.target !== menuBtn && e.target.closest(".top, .dock, .credits")) setUi(true);
});

/* ---------- One thing at a time ---------- */
function open(thing, { from = "dock" } = {}) {
  if (!body.classList.contains("mode-room")) return;
  setUi(false);
  hideHint();
  current = thing;
  things.forEach(t => t.classList.toggle("is-active", t.dataset.thing === thing));
  dockBtns.forEach(b => b.setAttribute("aria-expanded", String(b.dataset.thing === thing)));
  panel.classList.add("is-open");
  panel.scrollTop = 0;
  room?.focus(thing);
  if (thing === "panda") room?.hop();
  const h = $(`#thing-${thing} h2`);
  h.tabIndex = -1;
  if (from === "dock") h.focus({ preventScroll: true });
}

function close() {
  if (!current) return;
  const was = current;
  current = null;
  panel.classList.remove("is-open");
  dockBtns.forEach(b => b.setAttribute("aria-expanded", "false"));
  stopGame();
  room?.reset();
  if (!panel.contains(document.activeElement)) return;
  if (keyboard) dockBtns.find(b => b.dataset.thing === was)?.focus();
  else document.activeElement.blur();
}

dockBtns.forEach(b => b.addEventListener("click", () => {
  if (current === b.dataset.thing) close(); else open(b.dataset.thing);
}));
closeBtn.addEventListener("click", close);
// Esc closes a thing first; in the room itself it opens and closes the menu.
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (current) close();
    else if (body.classList.contains("mode-room")) setUi(!body.classList.contains("ui-open"));
    return;
  }
  // Arrow keys look around, unless a control or the panel has the keyboard.
  const turns = { ArrowLeft: [-0.25, 0], ArrowRight: [0.25, 0], ArrowUp: [0, 0.25], ArrowDown: [0, -0.25] };
  if (turns[e.key] && room && body.classList.contains("mode-room") && !e.target.closest("button, a, input, .panel")) {
    e.preventDefault();
    room.look(...turns[e.key]);
  }
});

/* ---------- Arrival hint ---------- */
let hintTimer = 0;
function hideHint() { clearTimeout(hintTimer); body.classList.remove("show-hint"); }
function showHint() {
  try {                                                 // once per visit
    if (sessionStorage.getItem("fun-hint") === "seen") return;
    sessionStorage.setItem("fun-hint", "seen");
  } catch (e) {}
  body.classList.add("show-hint");
  hintTimer = setTimeout(hideHint, 4500);
}

/* ---------- Room or list ---------- */
async function showRoom() {
  body.classList.replace("mode-list", "mode-room");
  things.forEach(t => t.classList.remove("is-active"));
  note.hidden = true;
  toggle.hidden = false;
  menuBtn.hidden = false;
  setUi(false);
  toggle.textContent = "Show as a list";
  if (!roomLoading) {
    roomLoading = import(body.dataset.engine || "./room.js")   // explore/fun-side: a prototype can swap the engine
      .then(m => m.startRoom({
        canvas, tag, labels: LABELS, reduceMotion,
        onPick: thing => {
          if (thing === "exit") { location.href = "../#bonus"; return; }
          if (!thing) { setUi(false); return; }                       // a click on the room itself
          if (current === thing) close(); else open(thing, { from: "room" });
        },
        onProgress: p => { pct.textContent = `${Math.round(p * 100)}%`; },
      }))
      .then(r => { room = r; body.classList.add("is-ready"); body.dataset.room = "ready"; showHint(); })
      .catch(err => {
        console.warn("The 3D room could not load:", err);
        body.dataset.room = "failed";
        showList("The 3D room could not load in this browser, so here is everything as a list.", false);
      });
  }
  room?.resume();
  return roomLoading;
}

function showList(message, canOpen) {
  close();
  room?.pause();
  body.classList.remove("mode-room", "ui-open");
  body.classList.add("mode-list");
  menuBtn.hidden = true;
  hideHint();
  things.forEach(t => t.classList.remove("is-active"));
  toggle.hidden = !hasWebGL || body.dataset.room === "failed" || !!canOpen;   // the note has its own button
  toggle.textContent = "Show the 3D room";
  if (message) {
    noteText.textContent = message;
    noteOpen.hidden = !canOpen;
    note.hidden = false;
  } else note.hidden = true;
}

toggle.addEventListener("click", () => {
  if (body.classList.contains("mode-room")) showList();
  else showRoom();
});
noteOpen.addEventListener("click", () => showRoom());

const asked = new URLSearchParams(location.search).get("view");
if (!hasWebGL) showList("Your browser can't show 3D here, so here is everything in the room as a list.", false);
else if (asked === "list") showList();
else if (asked === "room") showRoom();
else if (isPhone) showList("The 3D room is built for a computer. Here is everything in it as a list.", true);
else if (reduceMotion) showList("You've asked for less motion, so here is everything in the room as a list.", true);
else showRoom();

/* ---------- Squash the bugs ---------- */
const grid = $(".game__grid");
const score = $(".game__score");
const start = $(".game__start");
for (let i = 0; i < 9; i++) {
  const b = document.createElement("button");
  b.type = "button";
  b.setAttribute("aria-label", "Empty");
  grid.appendChild(b);
}
const cells = [...grid.children];
let points = 0, tick = null, spawn = null, running = false;

const clearCells = () => cells.forEach(c => { c.textContent = ""; c.dataset.kind = ""; c.setAttribute("aria-label", "Empty"); });
cells.forEach(c => c.addEventListener("click", () => {
  if (!running || !c.dataset.kind) return;
  points += c.dataset.kind === "bug" ? 1 : -2;
  clearCells();
  score.textContent = `Score: ${points}`;
}));

function stopGame() {
  clearInterval(tick); clearInterval(spawn);
  if (running) { running = false; clearCells(); score.textContent = "Press Start when you're ready."; }
  start.disabled = false;
  start.textContent = "Start";
}

start.addEventListener("click", () => {
  if (running) return;
  running = true; points = 0;
  let left = 10;
  start.disabled = true;
  start.textContent = "Playing";
  score.textContent = "Score: 0, 10 seconds left";
  spawn = setInterval(() => {
    clearCells();
    const n = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      const c = cells[Math.floor(Math.random() * 9)];
      const kind = Math.random() < .75 ? "bug" : "panda";
      c.dataset.kind = kind;
      c.textContent = kind === "bug" ? "🐞" : "🐼";
      c.setAttribute("aria-label", kind === "bug" ? "Bug" : "Panda");
    }
  }, 750);
  tick = setInterval(() => {
    left -= 1;
    score.textContent = `Score: ${points}, ${left} seconds left`;
    if (left <= 0) {
      clearInterval(tick); clearInterval(spawn); clearCells();
      running = false;
      score.textContent = `Final score: ${points}. ${points >= 8 ? "Nice work." : "Try for 8."}`;
      start.disabled = false;
      start.textContent = "Play again";
      start.focus();
    }
  }, 1000);
});

// For the design checker.
window.__fun = { open, close, showList, showRoom, get room() { return room; } };
