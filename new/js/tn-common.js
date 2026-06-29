/* update_106: 共通JS。旧 #company URL転送、モバイルメニュー、白パカ防止の0.5秒iframeオーバーラップ遷移。ブラウザ標準View Transitionは白パカ原因になり得るため使用しない。 */
(() => {
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

  const injectTransitionStyle = () => {
    if (document.getElementById("tn-overlap-transition-runtime-style")) return;
    const style = document.createElement("style");
    style.id = "tn-overlap-transition-runtime-style";
    style.textContent = `
      html, body { background: #030303 !important; }
      .tn-overlap-frame-wrap {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        background: #030303;
        opacity: 0;
        pointer-events: none;
        transition: opacity 500ms ease-in-out;
        overflow: hidden;
      }
      .tn-overlap-frame-wrap.is-visible { opacity: 1; }
      .tn-overlap-frame-wrap iframe {
        width: 100vw;
        height: 100vh;
        border: 0;
        display: block;
        background: #030303;
      }
      body.tn-transition-locked { overflow: hidden !important; }
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

  let isTransitioning = false;

  const overlapNavigate = (targetUrl) => {
    if (isTransitioning) return;
    isTransitioning = true;
    closeMobileMenu();
    injectTransitionStyle();

    const wrap = document.createElement("div");
    wrap.className = "tn-overlap-frame-wrap";

    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.src = targetUrl.href;
    wrap.appendChild(iframe);
    document.body.appendChild(wrap);
    document.body.classList.add("tn-transition-locked");

    let navigated = false;
    const go = () => {
      if (navigated) return;
      navigated = true;
      window.location.href = targetUrl.href;
    };

    const startFade = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          wrap.classList.add("is-visible");
          window.setTimeout(go, 560);
        });
      });
    };

    iframe.addEventListener("load", startFade, { once: true });
    window.setTimeout(startFade, 900);
    window.setTimeout(go, 1800);
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
    overlapNavigate(url);
  });
})();
