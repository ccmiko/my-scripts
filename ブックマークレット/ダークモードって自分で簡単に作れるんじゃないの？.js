/**
 * TODO: 課題がたくさん！
    - display: contents要素はcolorが機能しない？
    - 単純なテキストやリンクだけのサイトなら使えるが色々と不完全。。。。
    - ページ跨いだ後に勝手に適用されるようにしたい
 */

function main() {
  styles = `
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
  styleSheet = document.createElement("style");
  id = "AAAAAAAAAAA";
  styleSheet.id = id;
  styleSheet.textContent = styles;
  document.getElementById(id)?.remove();
  document.head.appendChild(styleSheet);
}
main();

javascript: function main(){styles="\n  * {\n  background-color: #202124%20!important;\n%20%20color:%20#A9ACAF%20!important;\n%20%20}\n%20%20a,%20a%20*%20{\n%20%20%20%20color:%20#00bbf0%20!important;\n%20%20%20%20text-decoration:underline%20%20!important;\n%20%20}\n%20%20button,%20button%20*%20{\n%20%20%20%20background-color:%20#cdcdcd%20!important;\n%20%20%20%20color:#1b1b1b%20!important;\n%20%20%20%20text-decoration:underline%20%20!important;\n%20%20%20%20border:%201px%20solid%20!important;\n%20%20}\n%20%20svg%20{\n%20%20%20%20fill:%20#f1b963%20!important;\n%20%20}\n%20%20";styleSheet=document.createElement("style");id="AAAAAAAAAAA";styleSheet.id=id;styleSheet.textContent=styles;document.getElementById(id)?.remove();document.head.appendChild(styleSheet)}main();
