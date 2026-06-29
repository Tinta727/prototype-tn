/* update_103: 共通JS。旧 #company URL転送、モバイルメニュー、ページ遷移はブラウザ標準のクロスドキュメントView Transitionでオーバーラップ表示 */
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

    if (url.origin !== window.location.origin) return;
    closeMobileMenu();
  });
})();
