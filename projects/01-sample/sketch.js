/**
 * Sample full-window sketch — swap for your course work.
 */
new p5((p) => {
  let t = 0;
  const particles = [];

  p.setup = function () {
    const parent = document.getElementById("sketch-container");
    const w = Math.min(900, (parent && parent.clientWidth) || 800);
    const h = Math.min(560, Math.round(w * 0.62));
    p.createCanvas(w, h);
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: p.random(p.width),
        y: p.random(p.height),
        vx: p.random(-0.8, 0.8),
        vy: p.random(-0.8, 0.8),
        r: p.random(2, 6),
      });
    }
  };

  p.draw = function () {
    t += 0.004;
    p.background(12, 14, 18);
    for (const q of particles) {
      q.x += q.vx + p.sin(t + q.y * 0.01) * 0.15;
      q.y += q.vy + p.cos(t * 0.8 + q.x * 0.01) * 0.15;
      if (q.x < 0) q.x = p.width;
      if (q.x > p.width) q.x = 0;
      if (q.y < 0) q.y = p.height;
      if (q.y > p.height) q.y = 0;
    }
    p.stroke(110, 231, 183, 40);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const d = p.dist(a.x, a.y, b.x, b.y);
        if (d < 90) {
          const alpha = p.map(d, 0, 90, 90, 0);
          p.stroke(110, 231, 183, alpha);
          p.line(a.x, a.y, b.x, b.y);
        }
      }
    }
    p.noStroke();
    for (const q of particles) {
      const pulse = 0.75 + 0.25 * p.sin(t * 2 + q.x * 0.02);
      p.fill(110, 231, 183, 220 * pulse);
      p.circle(q.x, q.y, q.r);
    }
  };

  p.windowResized = function () {
    const parent = document.getElementById("sketch-container");
    if (!parent) return;
    const w = Math.min(900, parent.clientWidth);
    const h = Math.min(560, Math.round(w * 0.62));
    p.resizeCanvas(w, h);
  };
}, document.getElementById("sketch-container"));
