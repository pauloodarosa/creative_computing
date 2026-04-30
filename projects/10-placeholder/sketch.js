/**
 * Placeholder sketch — replace with your assignment code.
 */
new p5((p) => {
  p.setup = function () {
    const el = document.getElementById("sketch-container");
    const w = Math.min(900, (el && el.clientWidth) || 800);
    const h = Math.min(480, Math.round(w * 0.55));
    p.createCanvas(w, h);
  };

  p.draw = function () {
    p.background(26, 31, 42);
    p.fill(139, 148, 168);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(Math.min(18, p.width / 28));
    p.text("Replace this sketch with your p5.js project", p.width / 2, p.height / 2 - 12);
    p.textSize(Math.min(14, p.width / 36));
    p.fill(110, 231, 183, 180);
    p.text("Edit sketch.js in this folder", p.width / 2, p.height / 2 + 18);
  };

  p.windowResized = function () {
    const el = document.getElementById("sketch-container");
    if (!el) return;
    const w = Math.min(900, el.clientWidth);
    const h = Math.min(480, Math.round(w * 0.55));
    p.resizeCanvas(w, h);
  };
}, document.getElementById("sketch-container"));
