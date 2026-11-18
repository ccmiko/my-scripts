// @title Amazon検索
// @description 入力した言葉で Amazon を検索する(新しいタブで開く)
function main() {
  const inputText = window.prompt("検索ワードを入力してください", "");
  if (!inputText) return;
  window.open(`https://www.amazon.co.jp/s?k=${encodeURIComponent(inputText)}&emi=AN1VRQENFRJN5`, "_blank");
}
main();
