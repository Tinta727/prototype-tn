/* update_100: 共通JS。旧 #company URL転送、モバイルメニュー、ページ遷移ディゾルブ制御 */
(() => {
  const TRANSITION_MS = 250;

  const installPageTransitionStyle = () => {
    if (document.getElementById("tn-page-transition-style")) return;
    const style = document.createElement("style");
    style.id = "tn-page-transition-style";
    style.textContent = `
      body {
        opacity: 0;
        transition: opacity ${TRANSITION_MS}ms ease;
      }
      body.tn-page-ready {
        opacity: 1;
      }
      body.tn-page-exit {
        opacity: 0;
      }
      @media (prefers-reduced-motion: reduce) {
        body {
          opacity: 1 !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  installPageTransitionStyle();

  const showPage = () => {
    requestAnimationFrame(() => {
      document.body.classList.remove("tn-page-exit");
      document.body.classList.add("tn-page-ready");
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showPage, { once: true });
  } else {
    showPage();
  }

  window.addEventListener("pageshow", showPage);

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

    document.body.classList.remove("tn-page-ready");
    document.body.classList.add("tn-page-exit");

    window.setTimeout(() => {
      window.location.href = url.href;
    }, TRANSITION_MS);
  });
})();
