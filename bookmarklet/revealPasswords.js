// @title パスワード欄を表示
// @description パスワード入力欄の中身を表示する。もう一度実行すると伏せ字に戻す
// @include toast

/**
 * パスワード入力欄の中身を表示する。もう一度実行すると元(伏せ字)に戻す。
 * 同一オリジンの iframe 内の入力欄も対象にする。
 */
function main() {
  const MARK = "data-my-scripts-revealed";
  const docs = [document];
  document.querySelectorAll("iframe").forEach((frame) => {
    try {
      if (frame.contentDocument) docs.push(frame.contentDocument);
    } catch {
      // 別オリジンの iframe は触れないので無視する
    }
  });

  const revealed = docs.flatMap((doc) => [...doc.querySelectorAll(`input[${MARK}]`)]);
  if (revealed.length > 0) {
    revealed.forEach((input) => {
      input.type = "password";
      input.removeAttribute(MARK);
    });
    showToast(`${revealed.length}個の入力欄を伏せ字に戻しました`);
    return;
  }

  const targets = docs.flatMap((doc) => [...doc.querySelectorAll('input[type="password"]')]);
  targets.forEach((input) => {
    input.type = "text";
    input.setAttribute(MARK, "");
  });
  showToast(
    targets.length > 0
      ? `${targets.length}個の入力欄を表示しました(もう一度実行で戻す)`
      : "パスワード入力欄が見つかりませんでした",
  );
}
main();
