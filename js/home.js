/* global PORTFOLIO_PROJECTS */

function createCard(project, index) {
  const isExternal =
    project.external === true || /^https?:\/\//i.test(String(project.href || ""));
  const card = document.createElement("article");
  card.className =
    "project-card" +
    (project.placeholder ? " placeholder" : "") +
    (isExternal ? " project-card--external" : "");
  card.dataset.theme = String(index + 1);

  const thumb = document.createElement("div");
  thumb.className = "project-thumb";
  thumb.setAttribute("aria-hidden", project.placeholder ? "true" : "false");

  if (project.placeholder) {
    thumb.textContent = String(index + 1).padStart(2, "0");
  } else {
    thumb.id = "thumb-host-" + project.id;
  }

  const body = document.createElement("div");
  body.className = "project-body";
  body.innerHTML =
    "<h2>" +
    escapeHtml(project.title) +
    "</h2>" +
    "<p>" +
    escapeHtml(project.description) +
    "</p>";

  const link = document.createElement("a");
  link.className = "project-link";
  link.href = project.href;
  if (isExternal) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open in Web Editor →";
  } else {
    link.textContent = "Open sketch →";
  }

  body.appendChild(link);
  card.appendChild(thumb);
  card.appendChild(body);

  return { card, thumbId: project.placeholder ? null : thumb.id };
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* RGB bases aligned with CSS [data-theme] accents (1–11). */
const THUMB_PALETTES = [
  [110, 231, 183],
  [125, 211, 252],
  [196, 181, 253],
  [251, 164, 182],
  [252, 211, 77],
  [190, 242, 100],
  [251, 146, 60],
  [34, 211, 238],
  [244, 114, 182],
  [96, 165, 250],
  [74, 222, 128],
];

function runThumbSketch(containerId, seed, themeIndex) {
  const el = document.getElementById(containerId);
  if (!el || typeof p5 === "undefined") return;

  const w = el.clientWidth || 280;
  const h = Math.round((w * 10) / 16);
  const ti = Math.max(1, Math.min(11, themeIndex || 1)) - 1;
  const base = THUMB_PALETTES[ti];

  new p5((p) => {
    let t = seed * 1000;
    p.setup = function () {
      p.createCanvas(w, h);
      p.noStroke();
    };
    p.draw = function () {
      t += 0.015;
      p.background(22, 26, 34);
      const cols = 12;
      const rows = 8;
      const cw = p.width / cols;
      const ch = p.height / rows;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const n = p.noise(i * 0.2 + seed, j * 0.2 + t);
          const g = p.map(n, 0, 1, 35, 115);
          p.fill(
            base[0] - g * 0.28,
            base[1] - g * 0.22,
            base[2] - g * 0.18,
            165 + n * 80
          );
          p.rect(i * cw, j * ch, cw - 1, ch - 1, 3);
        }
      }
    };
    p.windowResized = function () {
      const nw = el.clientWidth;
      if (nw > 0) p.resizeCanvas(nw, Math.round((nw * 10) / 16));
    };
  }, el);
}

document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("project-grid");
  if (!grid || !window.PORTFOLIO_PROJECTS) return;

  window.PORTFOLIO_PROJECTS.forEach(function (project, index) {
    const { card, thumbId } = createCard(project, index);
    grid.appendChild(card);
    if (thumbId) {
      requestAnimationFrame(function () {
        runThumbSketch(thumbId, index * 0.17, index + 1);
      });
    }
  });
});
