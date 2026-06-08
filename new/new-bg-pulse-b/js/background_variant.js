(() => {
  const MODE = "sports"; // "data" or "sports"
  const canvas = document.getElementById("dataWave");
  const ctx = canvas.getContext("2d", { alpha: true });

  let width = 0;
  let height = 0;
  let dpr = 1;
  let time = 0;
  let particles = [];

  const red = "rgba(237, 28, 36, ";
  const white = "rgba(255, 255, 255, ";

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = Math.max(window.innerHeight, document.documentElement.scrollHeight, document.body.scrollHeight);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function initParticles() {
    const count = width < 700 ? 24 : 44;
    const dataGlyphs = ["0", "1", "7", "9", "10", "21", "24", "45", "90", "99"];
    const sportsGlyphs = ["⚾", "🏀", "⚽", "🏐", "🏸", "🎾", "🏓", "⌚", "21", "99"];

    particles = Array.from({ length: count }, (_, i) => ({
      x: rand(-width, width),
      y: rand(40, height - 40),
      speed: rand(0.08, 0.32) * (MODE === "sports" ? 0.85 : 1),
      size: rand(12, 26),
      alpha: rand(0.08, 0.22),
      phase: rand(0, Math.PI * 2),
      glyph: (MODE === "sports" ? sportsGlyphs : dataGlyphs)[i % (MODE === "sports" ? sportsGlyphs.length : dataGlyphs.length)],
      kind: i % 4
    }));
  }

  function drawPulseLine(baseY, amp, speed, alpha, offset, angular) {
    const segment = 72;
    const step = 18;
    ctx.beginPath();

    for (let x = -80; x <= width + 80; x += step) {
      const shifted = x + time * speed + offset;
      const wave = Math.sin(shifted * 0.006 + angular) * amp;
      const saw = ((Math.floor((shifted + 400) / segment) % 6) - 2.5) * 2.2;
      const pulse = (Math.floor((shifted + 300) / segment) % 7 === 0) ? -amp * 0.75 : 0;
      const y = baseY + wave + saw + pulse;

      if (x === -80) ctx.moveTo(x, y);
      else {
        const prevX = x - step;
        const prevShift = prevX + time * speed + offset;
        const jump = Math.floor(prevShift / segment) !== Math.floor(shifted / segment);
        if (jump && Math.random() > 0.15) {
          ctx.lineTo(prevX + step * 0.45, y);
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    }

    ctx.strokeStyle = red + alpha + ")";
    ctx.lineWidth = 1.15;
    ctx.stroke();

    // short vertical pulse ticks
    ctx.strokeStyle = red + (alpha * 1.35) + ")";
    ctx.lineWidth = 1;
    for (let x = -80; x <= width + 80; x += segment * 2) {
      const sx = (x + (time * speed * 0.9 + offset) % (segment * 2));
      const y = baseY + Math.sin((sx + offset) * 0.006 + angular) * amp;
      if (sx > -20 && sx < width + 20) {
        ctx.beginPath();
        ctx.moveTo(sx, y - 7);
        ctx.lineTo(sx, y + 7);
        ctx.stroke();
      }
    }
  }

  function drawIconParticle(p) {
    const x = p.x;
    const y = p.y + Math.sin(time * 0.015 + p.phase) * 12;
    const a = p.alpha * (0.75 + Math.sin(time * 0.012 + p.phase) * 0.25);

    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = Math.max(0.03, a);
    ctx.strokeStyle = red + "1)";
    ctx.fillStyle = red + "1)";
    ctx.lineWidth = 1.4;
    ctx.font = `${p.size}px "Hiragino Sans", "Yu Gothic", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (MODE === "data") {
      if (p.kind === 0) {
        ctx.fillText(p.glyph, 0, 0);
      } else if (p.kind === 1) {
        ctx.beginPath();
        ctx.rect(-p.size * .42, -p.size * .28, p.size * .84, p.size * .56);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-p.size * .58, 0);
        ctx.lineTo(-p.size * .88, 0);
        ctx.moveTo(p.size * .58, 0);
        ctx.lineTo(p.size * .88, 0);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * .34, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillText(p.glyph, 0, p.size * .02);
      }
    } else {
      // Sports mode: show glyphs when available, plus simple line icons for a technical look.
      if (p.glyph.length <= 2 && /[0-9]/.test(p.glyph)) {
        ctx.fillText(p.glyph, 0, 0);
      } else if (p.kind === 0) {
        ctx.fillText(p.glyph, 0, 0);
      } else if (p.kind === 1) {
        // ball
        ctx.beginPath();
        ctx.arc(0, 0, p.size * .38, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-p.size * .28, -p.size * .18);
        ctx.quadraticCurveTo(0, 0, p.size * .28, p.size * .18);
        ctx.stroke();
      } else if (p.kind === 2) {
        // shuttle / racket-like
        ctx.beginPath();
        ctx.moveTo(-p.size * .25, -p.size * .35);
        ctx.lineTo(p.size * .3, p.size * .35);
        ctx.moveTo(p.size * .02, -p.size * .32);
        ctx.lineTo(p.size * .45, p.size * .1);
        ctx.stroke();
      } else {
        ctx.fillText(p.glyph, 0, 0);
      }
    }
    ctx.restore();
  }

  function drawBackground() {
    ctx.clearRect(0, 0, width, height);

    // Deep red translucent base glow
    const grad = ctx.createRadialGradient(width * 0.5, height * 0.25, 0, width * 0.5, height * 0.35, Math.max(width, height) * 0.8);
    grad.addColorStop(0, "rgba(237,28,36,0.030)");
    grad.addColorStop(0.55, "rgba(80,0,0,0.015)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const lineCount = MODE === "data" ? 8 : 6;
    for (let i = 0; i < lineCount; i++) {
      const y = (height / (lineCount + 1)) * (i + 1);
      drawPulseLine(
        y + Math.sin(i * 2.1) * 18,
        MODE === "data" ? 22 + i * 1.8 : 28 + i * 2.5,
        MODE === "data" ? 0.26 + i * 0.02 : 0.20 + i * 0.015,
        MODE === "data" ? 0.17 : 0.14,
        i * 137,
        i * 0.7
      );
    }

    // A few straight data lanes
    ctx.strokeStyle = red + (MODE === "data" ? "0.16)" : "0.10)");
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (height * (0.18 + i * 0.16)) + Math.sin(time * 0.006 + i) * 10;
      ctx.beginPath();
      ctx.moveTo(-60, y);
      for (let x = -60; x < width + 80; x += 96) {
        const notch = ((x + time * 0.18 + i * 90) % 384 < 96) ? 10 : 0;
        ctx.lineTo(x + 58, y);
        ctx.lineTo(x + 70, y - notch);
        ctx.lineTo(x + 92, y - notch);
      }
      ctx.stroke();
    }

    for (const p of particles) {
      p.x += p.speed;
      if (p.x > width + 60) {
        p.x = rand(-360, -60);
        p.y = rand(40, height - 40);
      }
      drawIconParticle(p);
    }
  }

  function tick() {
    time += 1;
    drawBackground();
    requestAnimationFrame(tick);
  }

  function initHeaderNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("globalNav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        nav.classList.toggle("is-open", !expanded);
      });
    }

    const year = document.getElementById("currentYear");
    if (year) year.textContent = new Date().getFullYear();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.08 });

    document.querySelectorAll(".section-observe").forEach((el) => observer.observe(el));
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  initHeaderNav();
  requestAnimationFrame(tick);
})();
