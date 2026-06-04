(() => {
  const canvas = document.getElementById("dataWave");
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let dpr = 1;
  let t = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawWave(offset, amp, yBase, color, lineWidth) {
    ctx.beginPath();
    for (let x = -120; x <= width + 120; x += 14) {
      const y =
        yBase +
        Math.sin((x * 0.006) + t + offset) * amp +
        Math.sin((x * 0.017) - t * 1.6 + offset) * (amp * 0.36);
      if (x === -120) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = "rgba(230,0,18,.55)";
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createRadialGradient(width * .55, height * .45, 0, width * .55, height * .45, Math.max(width, height) * .7);
    gradient.addColorStop(0, "rgba(230,0,18,0.10)");
    gradient.addColorStop(1, "rgba(230,0,18,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 9; i++) {
      drawWave(i * 0.9, 30 + i * 6, height * (0.12 + i * 0.105), `rgba(230,0,18,${0.20 + i * 0.018})`, 1.2 + (i % 3));
    }

    // Red data particles moving along invisible flows.
    for (let i = 0; i < 90; i++) {
      const x = (i * 149 + t * 44) % (width + 160) - 80;
      const y = height * (0.12 + ((i * 37) % 76) / 100) + Math.sin(t + i) * 18;
      const r = 1.1 + ((i * 17) % 4);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = i % 5 === 0 ? "rgba(255,255,255,.35)" : "rgba(230,0,18,.42)";
      ctx.fill();
    }

    t += 0.012;
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);

  const navToggle = document.querySelector(".nav-toggle");
  const globalNav = document.querySelector(".global-nav");
  navToggle?.addEventListener("click", () => {
    const open = globalNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  globalNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      globalNav.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".section-observe").forEach((el) => observer.observe(el));
})();
