/* update_95: 共通JS化 + 固定HTML企業情報ページ #company ルート制御
   - モバイルメニュー外クリック／タップで格納
   - /new/#company と /new/bg-pulse-b.html#company で固定HTMLの企業情報ページを表示
   - 企業情報ページはHTMLに実体を持たせ、JSは表示切替だけを行う
*/
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
})();

(() => {
  'use strict';

  const COMPANY_HASH = '#company';
  const DETAIL_ID = 'tn-company-detail';

  function isCompanyRoute() {
    return window.location.hash === COMPANY_HASH;
  }

  function getTopLevelMainChildren() {
    const main = document.querySelector('main');
    if (!main) return [];
    return Array.prototype.slice.call(main.children);
  }

  function setVisible(el, visible) {
    if (!el) return;
    el.hidden = !visible;
    el.setAttribute('aria-hidden', visible ? 'false' : 'true');
  }

  function updateActiveNav() {
    document.querySelectorAll('a[href$="#company"], a[href="#company"]').forEach((a) => {
      const active = isCompanyRoute();
      a.classList.toggle('is-active', active);
      if (active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function showCompanyPage() {
    const detail = document.getElementById(DETAIL_ID);
    if (!detail) return;

    document.documentElement.classList.add('tn-company-route');
    document.body.classList.add('tn-company-route');

    getTopLevelMainChildren().forEach((child) => {
      setVisible(child, child.id === DETAIL_ID);
    });

    updateActiveNav();

    const header = document.querySelector('.site-header');
    const headerOffset = header ? Math.ceil(header.getBoundingClientRect().height) + 12 : 0;
    const y = Math.max(0, detail.getBoundingClientRect().top + window.pageYOffset - headerOffset);
    window.scrollTo({ top: y, behavior: 'auto' });
  }

  function showTopPage() {
    document.documentElement.classList.remove('tn-company-route');
    document.body.classList.remove('tn-company-route');

    getTopLevelMainChildren().forEach((child) => {
      setVisible(child, child.id !== DETAIL_ID);
    });

    updateActiveNav();
  }

  function route() {
    if (isCompanyRoute()) showCompanyPage();
    else showTopPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', route);
  } else {
    route();
  }

  window.addEventListener('hashchange', route);
})();
