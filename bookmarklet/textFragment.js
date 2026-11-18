function main() {
  const currentUrl = window.location.href;
  const inputText = window.prompt("強調したい文字を入力してください", "");
  if (inputText) {
    const withTextFragmentUrl = `${currentUrl}#:~:text=${encodeURIComponent(inputText)}`;
    navigator.clipboard.writeText(withTextFragmentUrl);
    window.open(withTextFragmentUrl, "_blank");
  }
}
main();
