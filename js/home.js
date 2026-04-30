/* global PORTFOLIO_PROJECTS */

function createCard(project, index) {
  const card = document.createElement("article");
  card.className = "project-card" + (project.placeholder ? " placeholder" : "");

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
  link.textContent = "Open sketch →";

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

function runThumbSketch(containerId, seed) {
  const el = document.getElementById(containerId);
  if (!el || typeof p5 === "undefined") return;

  const w = el.clientWidth || 280;
  const h = Math.round((w * 10) / 16);

  new p5((p) => {
    let t = seed * 1000;
    p.setup = function () {
      p.createCanvas(w, h);
      p.noStroke();
    };
    p.draw = function () {
      t += 0.015;
      p.background(26, 31, 42);
      const cols = 12;
      const rows = 8;
      const cw = p.width / cols;
      const ch = p.height / rows;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const n = p.noise(i * 0.2 + seed, j * 0.2 + t);
          const g = p.map(n, 0, 1, 40, 120);
          p.fill(110, 231 - g * 0.3, 183 - g * 0.2, 180 + n * 75);
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
        runThumbSketch(thumbId, index * 0.17);
      });
    }
  });
});
