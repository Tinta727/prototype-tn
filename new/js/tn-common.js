/* update_102: 共通JS。旧 #company URL転送、モバイルメニュー、ページ遷移ディゾルブ制御（残像防止オーバーレイ版） */
(() => {
  const TRANSITION_MS = 250;
  const root = document.documentElement;

  const installPageTransitionStyle = () => {
    if (document.getElementById("tn-page-transition-style")) return;
    const style = document.createElement("style");
    style.id = "tn-page-transition-style";
    style.textContent = `
      html {
        background: #030303;
      }
      #tn-page-transition-overlay {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        pointer-events: none;
        background: #030303;
        opacity: 1;
        visibility: visible;
        transition: opacity ${TRANSITION_MS}ms ease, visibility 0s linear ${TRANSITION_MS}ms;
      }
      html.tn-page-ready #tn-page-transition-overlay {
        opacity: 0;
        visibility: hidden;
      }
      html.tn-page-exit #tn-page-transition-overlay {
        opacity: 1;
        visibility: visible;
        transition: opacity ${TRANSITION_MS}ms ease;
      }
      @media (prefers-reduced-motion: reduce) {
        #tn-page-transition-overlay {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const ensureOverlay = () => {
    let overlay = document.getElementById("tn-page-transition-overlay");
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "tn-page-transition-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.documentElement.appendChild(overlay);
    return overlay;
  };

  installPageTransitionStyle();

  const showPage = () => {
    ensureOverlay();
    requestAnimationFrame(() => {
      root.classList.remove("tn-page-exit");
      root.classList.add("tn-page-ready");
      if (document.body) {
        document.body.classList.remove("tn-page-exit");
        document.body.classList.add("tn-page-ready");
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showPage, { once: true });
  } else {
    showPage();
  }

  window.addEventListener("pageshow", () => {
    root.classList.remove("tn-page-exit");
    if (document.body) document.body.classList.remove("tn-page-exit");
    showPage();
  });

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

  const isModifiedClick = (event) => event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || isModifiedClick(event)) return;
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

    if (url.origin !== window.location.origin) return;

    const samePath = url.pathname === window.location.pathname;
    const sameSearch = url.search === window.location.search;
    const currentHash = window.location.hash || "";
    const nextHash = url.hash || "";

    if (samePath && sameSearch && nextHash && nextHash !== currentHash && nextHash !== "#company") {
      return;
    }
    if (samePath && sameSearch && nextHash === currentHash) return;

    event.preventDefault();
    closeMobileMenu();
    ensureOverlay();

    root.classList.remove("tn-page-ready");
    root.classList.add("tn-page-exit");
    if (document.body) {
      document.body.classList.remove("tn-page-ready");
      document.body.classList.add("tn-page-exit");
    }

    window.setTimeout(() => {
      window.location.href = url.href;
    }, TRANSITION_MS);
  });
})();
