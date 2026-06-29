/* update_109: 共通JS。旧 #company URL転送、モバイルメニュー、白パカ防止＋文字点滅防止＋本文の横ズレ防止＋縦方向スクロール暴れ防止の0.5秒オーバーラップ遷移。View Transitionは使用しない。 */
(() => {
  const TRANSITION_MS = 500;
  const CLEANUP_DELAY_MS = 90;

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  const forceTopWithoutAnimation = (targetWindow = window) => {
    try {
      const doc = targetWindow.document;
      if (doc?.documentElement) {
        doc.documentElement.style.scrollBehavior = "auto";
        doc.documentElement.style.overflowAnchor = "none";
        doc.documentElement.scrollTop = 0;
      }
      if (doc?.body) {
        doc.body.style.scrollBehavior = "auto";
        doc.body.style.overflowAnchor = "none";
        doc.body.scrollTop = 0;
      }
      targetWindow.scrollTo(0, 0);
    } catch (_) {}
  };

  const injectNoScrollMotionStyle = (targetDoc = document) => {
    if (!targetDoc || targetDoc.getElementById("tn-no-scroll-motion-style")) return;
    const style = targetDoc.createElement("style");
    style.id = "tn-no-scroll-motion-style";
    style.textContent = `
      html, body {
        scroll-behavior: auto !important;
        overflow-anchor: none !important;
      }
      .section-observe {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    `;
    targetDoc.head.appendChild(style);
  };

  injectNoScrollMotionStyle(document);
  forceTopWithoutAnimation(window);

  const closeMobileMenu = () => {
    const nav = document.getElementById("globalNav");
    const toggle = document.querySelector(".nav-toggle");
    if (!nav || !toggle || !nav.classList.contains("is-open")) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  document.addEventListener("pointerdown", (event) => {
    const nav = document.getElementById("globalNav");
    const toggle = document.querySelector(".nav-toggle");
    if (!nav || !toggle || !nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    closeMobileMenu();
  }, { passive: true });

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest(".nav-toggle");
    if (!toggle) return;
    const nav = document.getElementById("globalNav");
    if (!nav) return;
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  const redirectOldCompanyHash = () => {
    if (window.location.hash !== "#company") return;
    const path = window.location.pathname;
    const target = path.endsWith("/bg-pulse-b.html") ? "company-bg-pulse-b.html" : "company.html";
    window.location.replace(target);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", redirectOldCompanyHash, { once: true });
  } else {
    redirectOldCompanyHash();
  }
  window.addEventListener("hashchange", redirectOldCompanyHash);

  const injectTransitionStyle = () => {
    if (document.getElementById("tn-overlap-transition-runtime-style")) return;
    const style = document.createElement("style");
    style.id = "tn-overlap-transition-runtime-style";
    style.textContent = `
      html, body {
        background: #030303 !important;
        scroll-behavior: auto !important;
        overflow-anchor: none !important;
      }
      .section-observe {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
      .tn-overlap-frame-wrap {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        background: #030303;
        opacity: 0;
        pointer-events: auto;
        transition: opacity ${TRANSITION_MS}ms ease-in-out;
        overflow: hidden;
        transform: translateZ(0);
        backface-visibility: hidden;
        will-change: opacity;
      }
      .tn-overlap-frame-wrap.is-visible { opacity: 1; }
      .tn-overlap-frame-wrap iframe {
        width: 100vw;
        height: 100vh;
        border: 0;
        display: block;
        background: #030303;
      }
    `;
    document.head.appendChild(style);
  };

  const isPlainInternalPageLink = (url, rawHref) => {
    if (url.origin !== window.location.origin) return false;
    if (url.pathname === window.location.pathname && url.hash) return false;
    if (rawHref.startsWith("#")) return false;
    const pathname = url.pathname;
    return pathname.endsWith("/") || pathname.endsWith(".html") || pathname.endsWith("/new");
  };

  const refreshCommonState = () => {
    injectNoScrollMotionStyle(document);

    const currentYear = document.getElementById("currentYear");
    if (currentYear) currentYear.textContent = String(new Date().getFullYear());

    document.querySelectorAll(".section-observe").forEach((el) => {
      el.classList.add("is-visible");
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refreshCommonState, { once: true });
  } else {
    refreshCommonState();
  }

  const ensureTargetStyles = (targetDoc) => {
    targetDoc.querySelectorAll('link[rel="stylesheet"][href]').forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const absolute = new URL(href, window.location.href).href;
      const exists = Array.from(document.querySelectorAll('link[rel="stylesheet"][href]')).some((current) => {
        return new URL(current.getAttribute("href"), window.location.href).href === absolute;
      });
      if (!exists) {
        const clone = link.cloneNode(true);
        document.head.appendChild(clone);
      }
    });
  };

  const applyFetchedPage = (htmlText, targetUrl, pushHistory) => {
    const parser = new DOMParser();
    const targetDoc = parser.parseFromString(htmlText, "text/html");

    ensureTargetStyles(targetDoc);

    const title = targetDoc.querySelector("title");
    if (title) document.title = title.textContent;

    const targetDescription = targetDoc.querySelector('meta[name="description"]');
    const currentDescription = document.querySelector('meta[name="description"]');
    if (targetDescription && currentDescription) {
      currentDescription.setAttribute("content", targetDescription.getAttribute("content") || "");
    }

    injectNoScrollMotionStyle(targetDoc);

    const targetBody = targetDoc.body;
    if (!targetBody) return false;

    targetBody.querySelectorAll(".section-observe").forEach((el) => el.classList.add("is-visible"));
    targetBody.querySelector("#dataWave")?.remove();
    targetBody.querySelector(".site-noise")?.remove();
    targetBody.querySelectorAll("script").forEach((script) => script.remove());

    const preservedCanvas = document.getElementById("dataWave");
    const preservedNoise = document.querySelector(".site-noise");
    const preservedNodes = [];
    if (preservedCanvas) preservedNodes.push(preservedCanvas);
    if (preservedNoise) preservedNodes.push(preservedNoise);

    forceTopWithoutAnimation(window);
    document.body.className = targetBody.className;
    document.body.innerHTML = "";
    preservedNodes.forEach((node) => document.body.appendChild(node));
    Array.from(targetBody.childNodes).forEach((node) => document.body.appendChild(document.importNode(node, true)));

    if (pushHistory) {
      window.history.pushState({ tnSpa: true }, "", targetUrl.href);
    }

    forceTopWithoutAnimation(window);
    if (targetUrl.hash) {
      const hashTarget = document.getElementById(decodeURIComponent(targetUrl.hash.slice(1)));
      if (hashTarget) {
        hashTarget.scrollIntoView({ block: "start", behavior: "auto" });
      } else {
        forceTopWithoutAnimation(window);
      }
    } else {
      forceTopWithoutAnimation(window);
    }
    requestAnimationFrame(() => forceTopWithoutAnimation(window));

    closeMobileMenu();
    refreshCommonState();
    return true;
  };

  let isTransitioning = false;

  const waitForIframe = (iframe) => new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      try {
        injectNoScrollMotionStyle(iframe.contentDocument);
        iframe.contentDocument?.querySelectorAll(".section-observe").forEach((el) => el.classList.add("is-visible"));
        forceTopWithoutAnimation(iframe.contentWindow);
        requestAnimationFrame(() => forceTopWithoutAnimation(iframe.contentWindow));
      } catch (_) {}
      done = true;
      resolve();
    };
    iframe.addEventListener("load", finish, { once: true });
    window.setTimeout(finish, 1200);
  });

  const fetchPage = async (targetUrl) => {
    const response = await fetch(targetUrl.href, { credentials: "same-origin", cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  };

  const overlapNavigate = async (targetUrl, options = {}) => {
    if (isTransitioning) return;
    isTransitioning = true;
    const pushHistory = options.pushHistory !== false;
    closeMobileMenu();
    injectTransitionStyle();

    const wrap = document.createElement("div");
    wrap.className = "tn-overlap-frame-wrap";

    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.src = targetUrl.href;
    wrap.appendChild(iframe);
    document.documentElement.appendChild(wrap);

    try {
      const [htmlText] = await Promise.all([fetchPage(targetUrl), waitForIframe(iframe)]);

      try {
        injectNoScrollMotionStyle(iframe.contentDocument);
        iframe.contentDocument?.querySelectorAll(".section-observe").forEach((el) => el.classList.add("is-visible"));
        forceTopWithoutAnimation(iframe.contentWindow);
      } catch (_) {}

      requestAnimationFrame(() => {
        forceTopWithoutAnimation(iframe.contentWindow);
        requestAnimationFrame(() => {
          forceTopWithoutAnimation(iframe.contentWindow);
          wrap.classList.add("is-visible");
        });
      });

      await new Promise((resolve) => window.setTimeout(resolve, TRANSITION_MS + 40));

      const ok = applyFetchedPage(htmlText, targetUrl, pushHistory);
      if (!ok) throw new Error("Failed to apply fetched page");

      window.setTimeout(() => {
        wrap.remove();
        isTransitioning = false;
      }, CLEANUP_DELAY_MS);
    } catch (_) {
      window.location.href = targetUrl.href;
    }
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;

    const rawHref = link.getAttribute("href");
    if (!rawHref || rawHref === "#" || rawHref.startsWith("javascript:")) return;

    let url;
    try {
      url = new URL(rawHref, window.location.href);
    } catch (_) {
      return;
    }

    closeMobileMenu();
    if (!isPlainInternalPageLink(url, rawHref)) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

    event.preventDefault();
    overlapNavigate(url, { pushHistory: true });
  });

  window.addEventListener("popstate", () => {
    const url = new URL(window.location.href);
    if (!isPlainInternalPageLink(url, url.pathname)) return;
    overlapNavigate(url, { pushHistory: false });
  });
})();
