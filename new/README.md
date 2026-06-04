# TECHNONET 新サイトTOPページ モックアップ

GitHub Pages などにそのままアップして確認できる、静的HTML/CSS/JS一式です。

## ファイル構成

- `index.html`
- `css/style.css`
- `js/main.js`
- `assets/`
  - ロゴ画像
  - 仮ビジュアルSVG

## 反映済みの指定

1. ページ全体に、Canvasで動く「スポーツデータをイメージした赤黒の波」を実装
2. フォントは後から FOT-UD角ゴ系に差し替え可能なCSS変数指定
3. クリック可能なボタン・カードに、淡い黄色のホバー効果を実装
4. 黒・赤・白のトンマナ
5. 白塗りカードではなく、白枠のみのカード表現
6. GitHub Pages向けに相対パスで構成

## フォント差し替え

`css/style.css` の冒頭にある以下を変更してください。

```css
:root {
  --font-main:
    "FOT-UDKakugo",
    "FOT-UD角ゴ Pro",
    "Yu Gothic",
    "YuGothic",
    "Hiragino Kaku Gothic ProN",
    "Noto Sans JP",
    sans-serif;
}
```

Webフォントファイルを後日用意する場合は、`@font-face` を追加するだけで差し替えられます。
