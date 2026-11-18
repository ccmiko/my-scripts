// @include toast

function main() {
  const inputText = window.prompt("強調したい文字を入力してください", "");
  if (!inputText) return;
  // 既存のフラグメント(#...)を取り除いてから付与する
  const url = new URL(window.location.href);
  url.hash = "";
  const withTextFragmentUrl = `${url.href}#:~:text=${encodeURIComponent(inputText)}`;
  copyWithToast(withTextFragmentUrl, "強調リンクをコピーしました");
  window.open(withTextFragmentUrl, "_blank");
}
main();
