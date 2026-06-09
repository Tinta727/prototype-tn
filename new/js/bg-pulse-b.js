/* update_81: 背景B案JSを外部ファイル化
   - bg-pulse-b.html 専用
   - 背景演出、ナビ開閉、年号更新、表示アニメーション初期化を保持
*/
(() => {
  const MODE = "sports";
  const canvas = document.getElementById("dataWave");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let width = 0, height = 0, dpr = 1, time = 0, particles = [];
  const red = "rgba(237, 28, 36, ";

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
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
    const count = width < 700 ? 26 : 50;
    const dataGlyphs = ["0", "1", "7", "9", "10", "21", "24", "45", "90", "99"];
    const sportsGlyphs = ["⚾", "🏀", "⚽", "🏐", "🏸", "🎾", "🏓", "21", "99"];
    const glyphs = MODE === "sports" ? sportsGlyphs : dataGlyphs;

    particles = Array.from({ length: count }, (_, i) => ({
      x: rand(-width, width),
      y: rand(30, height - 30),
      speed: rand(0.12, 0.38) * (MODE === "sports" ? 0.9 : 1),
      size: rand(13, 28),
      alpha: rand(0.16, 0.32), // update_64: 浮遊オブジェクトの赤みを抑制
      phase: rand(0, Math.PI * 2),
      glyph: glyphs[i % glyphs.length],
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
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = red + alpha + ")";
    ctx.lineWidth = 1.65; // update_57: パルス線を少し太く
    ctx.stroke();

    ctx.strokeStyle = red + (alpha * 1.55) + ")";
    ctx.lineWidth = 1.28; // update_57: 直線パルスを少し太く
    for (let x = -80; x <= width + 80; x += segment * 2) {
      const sx = x + (time * speed * 0.9 + offset) % (segment * 2);
      const y = baseY + Math.sin((sx + offset) * 0.006 + angular) * amp;
      if (sx > -20 && sx < width + 20) {
        ctx.beginPath();
        ctx.moveTo(sx, y - 8);
        ctx.lineTo(sx, y + 8);
        ctx.stroke();
      }
    }
  }

  function drawParticle(p) {
    const x = p.x;
    const y = p.y + Math.sin(time * 0.015 + p.phase) * 12;
    const a = Math.max(0.10, p.alpha * (0.88 + Math.sin(time * 0.012 + p.phase) * 0.12)); // update_64: 最低透明度を元背景寄りに抑制

    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = a;
    ctx.strokeStyle = red + "1)";
    ctx.fillStyle = red + "1)";
    ctx.lineWidth = 1.6;
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
      if (/[0-9]/.test(p.glyph)) {
        ctx.fillText(p.glyph, 0, 0);
      } else if (p.kind === 0) {
        ctx.fillText(p.glyph, 0, 0);
      } else if (p.kind === 1) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * .38, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-p.size * .28, -p.size * .18);
        ctx.quadraticCurveTo(0, 0, p.size * .28, p.size * .18);
        ctx.stroke();
      } else if (p.kind === 2) {
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

    // 全体を少し明るくする赤いベースグロー
    const grad = ctx.createRadialGradient(width * 0.5, height * 0.28, 0, width * 0.5, height * 0.35, Math.max(width, height) * 0.9);
    grad.addColorStop(0, "rgba(237,28,36,0.075)"); // update_64: 赤いグローを元背景寄りに抑制
    grad.addColorStop(0.50, "rgba(150,0,0,0.034)"); // update_64: 中間域の赤みを抑制
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 薄い赤いヴェールを重ねて、真っ黒感を抑える
    ctx.fillStyle = MODE === "data" ? "rgba(130, 0, 0, 0.055)" : "rgba(135, 0, 0, 0.060)"; // update_64: B案の赤いヴェールを元背景寄りに抑制
    ctx.fillRect(0, 0, width, height);

    const lineCount = MODE === "data" ? 8 : 6;
    for (let i = 0; i < lineCount; i++) {
      const y = (height / (lineCount + 1)) * (i + 1);
      drawPulseLine(
        y + Math.sin(i * 2.1) * 28, // update_57: 基準位置の上下変化幅を拡大
        MODE === "data" ? 22 + i * 1.8 : 44 + i * 4.0, // update_57: B案の上下変化幅を拡大
        MODE === "data" ? 0.28 + i * 0.02 : 0.44 + i * 0.03, // update_57: B案の線・パルス速度を2倍
        MODE === "data" ? 0.28 : 0.32, // update_64: B案パルス線の赤みを抑制
        i * 137,
        i * 0.7
      );
    }

    // 直線パルスをより明るく
    ctx.strokeStyle = red + (MODE === "data" ? "0.20)" : "0.23)"); // update_64: B案の直線パルスの赤みを抑制
    ctx.lineWidth = 1.28; // update_57: 直線パルスを少し太く
    for (let i = 0; i < 5; i++) {
      const y = (height * (0.18 + i * 0.16)) + Math.sin(time * 0.012 + i) * 18; // update_57: 直線パルスの上下変化幅を拡大、速度も2倍
      ctx.beginPath();
      ctx.moveTo(-60, y);
      for (let x = -60; x < width + 80; x += 96) {
        const notch = ((x + time * 0.36 + i * 90) % 384 < 96) ? 16 : 0; // update_57: ノッチ移動速度を2倍、段差も拡大
        ctx.lineTo(x + 58, y);
        ctx.lineTo(x + 70, y - notch);
        ctx.lineTo(x + 92, y - notch);
      }
      ctx.stroke();
    }

    for (const p of particles) {
      p.x += p.speed * 4; // update_57: 浮遊オブジェクトの横移動を4倍速（初期比）
      if (p.x > width + 60) {
        p.x = rand(-360, -60);
        p.y = rand(30, height - 30);
      }
      drawParticle(p);
    }
  }

  function initCommonSiteScript() {
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
  initCommonSiteScript();

  function tick() {
    time += 1;
    drawBackground();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
