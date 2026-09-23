function main() {
  const currentUrl = window.location.href;
  const inputText = window.prompt("強調したい文字を入力してください", "");
  if (inputText) {
    const withTextFlagmentUrl = `${currentUrl}#:~:text=${encodeURIComponent(inputText)}`;
    navigator.clipboard.writeText(withTextFlagmentUrl);
    window.open(withTextFlagmentUrl, "_blank");
  }
}
main();

javascript: function main() {const currentUrl = window.location.href;const inputText = window.prompt("強調したい文字を入力してください", "");if (inputText) {const withTextFlagmentUrl = `${currentUrl}#:~:text=${encodeURIComponent(inputText)}`;navigator.clipboard.writeText(withTextFlagmentUrl);window.open(withTextFlagmentUrl, "_blank");}}main();
