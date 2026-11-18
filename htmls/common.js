/**
 * ミニアプリ共通の処理。
 * file:// で直接開いても動くよう、ES Module ではなく通常のスクリプトとして読み込む。
 *   <script src="./common.js"></script>
 */
(() => {
  const SNACK_BAR_STYLE =
    "z-index: 1000; position: fixed; top: 0; left: 10px; " +
    "width: fit-content; margin: 10px auto; padding: 6px; " +
    "background-color: #E7F1ED; border-radius: 10px;";

  /** 画面上部に短時間メッセージを表示する */
  const showSnackBar = (msg, durationMs = 1000) => {
    const elem = document.createElement("div");
    elem.style.cssText = SNACK_BAR_STYLE;
    elem.textContent = msg;
    document.body.appendChild(elem);
    setTimeout(() => elem.remove(), durationMs);
  };

  /** クリップボードにコピーし、結果をスナックバーで通知する */
  const copyText = async (text, successMsg = "コピーしました！") => {
    try {
      await navigator.clipboard.writeText(text);
      showSnackBar(successMsg);
    } catch (error) {
      console.error(error);
      showSnackBar("コピーに失敗しました");
    }
  };

  window.MiniApps = { showSnackBar, copyText };
})();
