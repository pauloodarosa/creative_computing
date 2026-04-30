/**
 * Interactive hero: spring-mass nodes + proximity edges, cursor applies force.
 * Respects prefers-reduced-motion (skips animation).
 */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const host = document.getElementById("hero-canvas-host");
  if (!host || typeof p5 === "undefined") return;

  let mx = 0;
  let my = 0;
  let hasPointer = false;

  function updatePointer(clientX, clientY) {
    const rect = host.getBoundingClientRect();
    mx = clientX - rect.left;
    my = clientY - rect.top;
    hasPointer = true;
  }

  window.addEventListener(
    "mousemove",
    function (e) {
      updatePointer(e.clientX, e.clientY);
    },
    { passive: true }
  );
  window.addEventListener(
    "touchmove",
    function (e) {
      if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );
  window.addEventListener(
    "touchend",
    function () {
      hasPointer = false;
    },
    { passive: true }
  );

  new p5((p) => {
    const count = 38;
    const nodes = [];

    function layoutHeight(width) {
      /* Slim strip: keeps the hero headline high without a tall canvas */
      return Math.max(96, Math.min(168, Math.round(width * 0.14)));
    }

    p.setup = function () {
      const w = host.clientWidth || host.parentElement.clientWidth || 800;
      const h = layoutHeight(w);
      host.style.height = h + "px";
      p.createCanvas(w, h);
      for (let i = 0; i < count; i++) {
        const hx = p.random(w);
        const hy = p.random(h);
        nodes.push({
          hx: hx,
          hy: hy,
          x: hx,
          y: hy,
          vx: 0,
          vy: 0,
        });
      }
      mx = w * 0.5;
      my = h * 0.5;
      hasPointer = false;
    };

    p.draw = function () {
      const w = p.width;
      const h = p.height;
      const linkDist = Math.min(78, Math.max(42, h * 0.95));
      const mouseR = Math.min(130, Math.max(56, h * 1.25));
      const mouseRSq = mouseR * mouseR;
      p.background(14, 17, 22);

      if (hasPointer) {
        for (const n of nodes) {
          let fx = (n.hx - n.x) * 0.045;
          let fy = (n.hy - n.y) * 0.045;

          const dx = n.x - mx;
          const dy = n.y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 > 4 && d2 < mouseRSq) {
            const d = Math.sqrt(d2);
            const push = (mouseR - d) / mouseR;
            fx += (dx / d) * push * 2.6;
            fy += (dy / d) * push * 2.6;
          }

          const t = p.frameCount * 0.0022;
          fx += (p.noise(n.hx * 0.01, t) - 0.5) * 0.35;
          fy += (p.noise(n.hy * 0.01, t + 10) - 0.5) * 0.35;

          n.vx = (n.vx + fx) * 0.84;
          n.vy = (n.vy + fy) * 0.84;
          n.x += n.vx;
          n.y += n.vy;
        }
      } else {
        for (const n of nodes) {
          const t = p.frameCount * 0.0018;
          n.x = n.hx + (p.noise(n.hy * 0.02, t) - 0.5) * 14;
          n.y = n.hy + (p.noise(n.hx * 0.02, t + 5) - 0.5) * 14;
          n.vx = 0;
          n.vy = 0;
        }
      }

      p.strokeWeight(1);
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dd = p.dist(a.x, a.y, b.x, b.y);
          if (dd < linkDist) {
            const alpha = p.map(dd, 0, linkDist, 78, 0);
            p.stroke(110, 231, 183, alpha);
            p.line(a.x, a.y, b.x, b.y);
          }
        }
      }

      p.noStroke();
      for (const n of nodes) {
        p.fill(110, 231, 183, 210);
        p.circle(n.x, n.y, 5);
        p.fill(230, 255, 248, 100);
        p.circle(n.x, n.y, 2);
      }
    };

    p.windowResized = function () {
      const w = host.clientWidth;
      if (w < 8) return;
      const h = layoutHeight(w);
      host.style.height = h + "px";
      p.resizeCanvas(w, h);
      for (const n of nodes) {
        n.hx = p.random(w);
        n.hy = p.random(h);
        n.x = n.hx;
        n.y = n.hy;
        n.vx = 0;
        n.vy = 0;
      }
    };
  }, host);
})();
