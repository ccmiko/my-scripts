// @include toast

/**
 * 表示中のページを Markdown のリンク形式 `[タイトル](URL)` でコピーする。
 * テキストを選択している場合は、選択中の文字列をリンクの表示名にする。
 */
function main() {
  const selected = window.getSelection()?.toString().trim().replace(/\s+/g, " ");
  const label = (selected || document.title || window.location.href)
    // Markdown のリンク表示名を壊す記号をエスケープする
    .replace(/([\\\[\]])/g, "\\$1");
  // URL 中の括弧はリンクの終端と誤認されるためエンコードする
  const url = window.location.href.replace(/\(/g, "%28").replace(/\)/g, "%29");
  const markdown = `[${label}](${url})`;
  copyWithToast(markdown, `コピーしました\n${markdown}`);
}
main();
