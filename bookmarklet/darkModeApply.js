/**
 * ページ全体の色を反転させて簡易ダークモードにする。
 * - 要素ごとに色を上書きする方式だと display: contents 要素や独自配色のサイトで崩れるため、
 *   html 要素ごと filter で反転し、色相を180度戻して色味をなるべく保つ
 * - 画像・動画・canvas 等は二重に反転させて元の見た目に戻す
 * - 背景色が未指定(透明)のページでも暗くなるよう、html に白背景を指定してから反転する
 * 解除は darkModeDelete を使う。
 */
function main() {
  const id = "my-scripts-dark-mode";
  const styles = `
    html {
      background-color: #fff !important;
      filter: invert(0.9) hue-rotate(180deg) !important;
    }
    img, video, picture, canvas, iframe, svg image,
    [style*="background-image"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }
  `;
  document.getElementById(id)?.remove();
  const styleSheet = document.createElement("style");
  styleSheet.id = id;
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
main();
