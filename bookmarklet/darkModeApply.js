/**
 * TODO: 課題がたくさん！
    - display: contents要素はcolorが機能しない？
    - 単純なテキストやリンクだけのサイトなら使えるが色々と不完全。。。。
    - ページ跨いだ後に勝手に適用されるようにしたい
 */

function main() {
  const styles = `
  * {
  background-color: #202124 !important;
  color: #A9ACAF !important;
  }
  a, a * {
    color: #00bbf0 !important;
    text-decoration:underline  !important;
  }
  button, button * {
    background-color: #cdcdcd !important;
    color:#1b1b1b !important;
    text-decoration:underline  !important;
    border: 1px solid !important;
  }
  svg {
    fill: #f1b963 !important;
  }
  `;
  const styleSheet = document.createElement("style");
  const id = "AAAAAAAAAAA";
  styleSheet.id = id;
  styleSheet.textContent = styles;
  document.getElementById(id)?.remove();
  document.head.appendChild(styleSheet);
}
main();
