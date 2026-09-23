function main() {
  const inputText = window.prompt("検索ワードを入力してください", "");
  if (!inputText) return;
  window.open(
    `https://www.amazon.co.jp/s?k=${encodeURIComponent(
      inputText,
    )}&emi=AN1VRQENFRJN5`,
    "_blank",
  );
}
main();

javascript: function main() {const inputText = window.prompt("検索ワードを入力してください", "");if (!inputText) return;window.open(`https://www.amazon.co.jp/s?k=${encodeURIComponent(inputText,)}&emi=AN1VRQENFRJN5`,"_blank",);}main();
