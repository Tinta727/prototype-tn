/* update_94: 共通JS化 + 企業情報ページ #company 自動表示
   - モバイルメニュー外クリック／タップで格納
   - TOP / 背景B案 / 下層ページで共通利用
   - /new/#company と /new/bg-pulse-b.html#company で企業情報ページを表示
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

/* update_94: Company page hash route (#company)
   - index.html / bg-pulse-b.html のHTML編集不要
   - 既存HTMLが読み込んでいる tn-common.js に企業情報ページ表示処理を統合
*/
(() => {
  'use strict';

  const CSS_HREF = 'css/tn-company-page.css';
  const PAGE_ID = 'tn-company-page';
  const COMPANY_HASH = '#company';

  function injectCss() {
    if (document.querySelector('link[data-tn-company-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CSS_HREF;
    link.setAttribute('data-tn-company-css', 'true');
    document.head.appendChild(link);
  }

  function isCompanyRoute() {
    return window.location.hash === COMPANY_HASH;
  }

  function getMainRoot() {
    return document.querySelector('main') || document.querySelector('.site-main') || null;
  }

  function rememberAndHide(el) {
    if (!el || el.id === PAGE_ID || el.closest('#' + PAGE_ID)) return;
    if (!el.hasAttribute('data-tn-company-prev-display')) {
      el.setAttribute('data-tn-company-prev-display', el.style.display || '');
    }
    el.style.display = 'none';
  }

  function restoreHidden() {
    document.querySelectorAll('[data-tn-company-prev-display]').forEach((el) => {
      el.style.display = el.getAttribute('data-tn-company-prev-display') || '';
      el.removeAttribute('data-tn-company-prev-display');
    });
  }

  function makeCompanyPage() {
    const page = document.createElement('main');
    page.id = PAGE_ID;
    page.className = 'tn-company-page';
    page.innerHTML = `
      <div class="tn-company-breadcrumb">HOME &gt; 企業情報</div>

      <section class="tn-company-hero" aria-labelledby="tn-company-title">
        <p class="tn-kicker">ABOUT US</p>
        <h1 id="tn-company-title">企業情報</h1>
        <p class="tn-company-lead">変化するメディア環境に対応した、技術サービスを創り、提供する</p>
        <p class="tn-company-copy">テクノネットは、映像技術システム、リアルタイムCGシステム、<br>運用支援サービスを通じて、スポーツをはじめ多様な映像・放送表現を提供し、<br>メディアの可能性を広げていきます。</p>
      </section>

      <section class="tn-panel tn-message" aria-labelledby="tn-message-title">
        <h2 id="tn-message-title">代表メッセージ</h2>
        <div class="tn-message-grid">
          <div class="tn-president-visual" aria-hidden="true"></div>
          <div class="tn-message-body">
            <h3>技術の力で、メディアの未来と<br>スポーツの感動をつなぐ。</h3>
            <p>テクノネットは創業以来、リアルタイム映像処理やグラフィックス技術を軸に、スポーツと映像の現場を支えてきました。変化し続けるメディア環境の中で、私たちは「正確さ」と「美しさ」を追求し、スポーツやエンターテインメントを裏側から支えています。</p>
            <p>これからも、挑戦の精神を忘れず、より高度で価値のある技術、映像表現を提供することで、皆さまとともに新しい未来を創ってまいります。</p>
            <p class="tn-signature"><span>代表取締役</span>　渡辺田 哲史</p>
          </div>
        </div>
      </section>

      <section class="tn-panel" aria-labelledby="tn-outline-title">
        <h2 id="tn-outline-title">会社概要</h2>
        <div class="tn-outline-grid">
          <dl class="tn-outline-list">
            <div><dt>会社名</dt><dd>株式会社テクノネット</dd></div>
            <div><dt>住所</dt><dd>〒164-0011　東京都中野区中央4-7-17</dd></div>
            <div><dt>電話</dt><dd>03-6746-0600</dd></div>
            <div><dt>FAX</dt><dd>03-6746-0609</dd></div>
            <div><dt>事業内容</dt><dd>リアルタイム映像制作システムの開発・設計・運用支援、スポーツ中継、放送、バラエティ向けグラフィックス制作、CGアニメーション制作、システムインテグレーション、ソフトウェア開発</dd></div>
            <div><dt>主要株主</dt><dd>株式会社テクノメディア 他</dd></div>
            <div><dt>関連会社</dt><dd>株式会社テクノメディア、日本デジタル・プロセシング・システム株式会社（DPS）、株式会社クロスワーク、株式会社ディスカバー、株式会社アクイメージ</dd></div>
          </dl>
          <dl class="tn-outline-list">
            <div><dt>設立</dt><dd>1984年11月</dd></div>
            <div><dt>代表者</dt><dd>代表取締役　渡辺田 哲史</dd></div>
            <div><dt>資本金</dt><dd>1億円</dd></div>
            <div><dt>従業員数</dt><dd>180名（2024年4月現在）</dd></div>
            <div><dt>取引銀行</dt><dd>三菱UFJ銀行 中野支店<br>みずほ銀行 中野支店</dd></div>
            <div><dt>適格請求書<br>発行事業者登録番号</dt><dd>T9011201013137</dd></div>
          </dl>
        </div>
      </section>

      <section class="tn-panel" aria-labelledby="tn-security-title">
        <h2 id="tn-security-title">情報セキュリティへの取り組み</h2>
        <div class="tn-security-cards">
          <a class="tn-security-card" href="JQA-certified.html"><span class="tn-security-icon">◇</span><strong>ISO27001認証取得</strong><small>情報セキュリティマネジメントシステムの国際規格 ISO27001の認証を取得しています。</small></a>
          <a class="tn-security-card" href="ISO27001.html"><span class="tn-security-icon">▤</span><strong>情報セキュリティ基本方針</strong><small>情報保護の促進に関する基本方針を定め、全社で情報セキュリティの維持・向上に取り組んでいます。</small></a>
          <a class="tn-security-card" href="privacy.html"><span class="tn-security-icon">♙</span><strong>個人情報保護ポリシー</strong><small>個人情報の適切な取り扱いを徹底し、お客様の信頼に応えます。</small></a>
        </div>
      </section>

      <section class="tn-panel tn-access" aria-labelledby="tn-access-title">
        <h2 id="tn-access-title">アクセスマップ</h2>
        <div class="tn-access-grid">
          <div class="tn-map-mock" aria-label="中野駅北口周辺のアクセスマップ概略図">
            <span class="tn-map-logo">TECHNONET</span>
            <span class="tn-map-pin pin-1">中野坂上</span>
            <span class="tn-map-pin pin-2">中野駅</span>
            <span class="tn-map-pin pin-3">中野区役所</span>
          </div>
          <div class="tn-access-info">
            <div><span>▣</span><p><strong>東京メトロ丸ノ内線</strong><br>「中野坂上駅（4番出口）」徒歩1分</p></div>
            <div><span>▣</span><p><strong>JR中央・総武線、東京メトロ東西線</strong><br>「中野駅（北口）」徒歩10分</p></div>
          </div>
        </div>
      </section>

      <section class="tn-panel tn-history" aria-labelledby="tn-history-title">
        <h2 id="tn-history-title">沿革</h2>
        <ol class="tn-timeline">
          <li><time>1984</time><span>株式会社テクノネット設立</span></li>
          <li><time>1989</time><span>放送・映像機器ベンチャーリンク事業を拡大</span></li>
          <li><time>1990</time><span>大型リアルタイム放送システム データロボシステム導入</span></li>
          <li><time>1993</time><span>リアルタイムCGシステム（VME-101）販売開始</span></li>
          <li><time>1998</time><span>新形式スコアボード ダイレクトグラフィックスを技術協力</span></li>
          <li><time>2000</time><span>ソニーオリンピックに技術協力</span></li>
          <li><time>2002</time><span>ソルトレイク五輪・日韓W杯に技術協力</span></li>
          <li><time>2008</time><span>北京オリンピック・NHK五輪に設定</span></li>
          <li><time>2010</time><span>バンクーバーオリンピックに技術協力</span></li>
          <li><time>2016</time><span>4K対応スポーツアーカイブを発表</span></li>
          <li><time>2016</time><span>リオ五輪・スーパーカップルに技術協力</span></li>
          <li><time>2019</time><span>小売実態検証、ISO27001取得</span></li>
          <li><time>2021</time><span>東京オリンピック・各種競技に協力</span></li>
          <li><time>2022</time><span>BIRD SCORE始動、福岡とゴルフコースセパートナー契約</span></li>
          <li><time>2024</time><span>パリオリンピック・中継業務に協力</span></li>
        </ol>
      </section>
    `;
    return page;
  }

  function updateActiveNav() {
    document.querySelectorAll('a[href$="#company"], a[href="#company"]').forEach((a) => {
      a.classList.toggle('is-active', isCompanyRoute());
      if (isCompanyRoute()) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function showCompanyPage() {
    injectCss();
    document.documentElement.classList.add('tn-company-active');
    document.body.classList.add('tn-company-active');

    let page = document.getElementById(PAGE_ID);
    if (!page) {
      page = makeCompanyPage();
      const mainRoot = getMainRoot();
      if (mainRoot) {
        Array.prototype.slice.call(mainRoot.children).forEach(rememberAndHide);
        mainRoot.appendChild(page);
      } else {
        const footer = document.querySelector('footer, .site-footer');
        document.body.insertBefore(page, footer || null);
        document.querySelectorAll('.hero, .section, section, .recruit-cta').forEach(rememberAndHide);
      }
    } else {
      page.style.display = '';
    }

    const headerOffset = document.querySelector('.site-header, header') ? 72 : 0;
    window.scrollTo({ top: Math.max(0, page.getBoundingClientRect().top + window.pageYOffset - headerOffset), behavior: 'auto' });
    updateActiveNav();
  }

  function hideCompanyPage() {
    document.documentElement.classList.remove('tn-company-active');
    document.body.classList.remove('tn-company-active');
    const page = document.getElementById(PAGE_ID);
    if (page) page.style.display = 'none';
    restoreHidden();
    updateActiveNav();
  }

  function route() {
    if (isCompanyRoute()) showCompanyPage();
    else hideCompanyPage();
  }

  function init() {
    injectCss();
    route();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('hashchange', route);
})();
