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

  /** http(s) の URL なら URL オブジェクトを、それ以外(javascript: 等を含む)は null を返す */
  const toHttpUrl = (text) => {
    try {
      const url = new URL(text);
      return ["http:", "https:"].includes(url.protocol) ? url : null;
    } catch {
      return null;
    }
  };

  const COPY_BUTTON_CLASS =
    "ml-2 px-2 text-base bg-green-400 text-white rounded-md hover:opacity-60 " +
    "active:border-green-600 active:border-2 active:scale-105 cursor-pointer";

  /**
   * QRコードの読み取り結果を表示する要素を作る(Tailwind のクラスを使用)。
   * http(s) の URL はリンクとして、それ以外はテキストとして表示し、どちらもコピーできる。
   */
  const createQrResultElem = (data) => {
    const containerElem = document.createElement("div");
    const url = toHttpUrl(data);

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = COPY_BUTTON_CLASS;

    if (url) {
      const anchorElem = document.createElement("a");
      anchorElem.className = "text-base text-blue-500 break-all";
      anchorElem.href = url.href;
      anchorElem.textContent = url.href;
      anchorElem.target = "_blank";
      anchorElem.rel = "noopener noreferrer";
      containerElem.appendChild(anchorElem);

      copyButton.textContent = "URLをコピーする！";
      copyButton.addEventListener("click", () => copyText(url.href, "URLをコピーしました"));
    } else {
      const textElem = document.createElement("p");
      textElem.className = "text-base whitespace-pre-wrap break-all";
      textElem.textContent = data;
      containerElem.appendChild(textElem);

      copyButton.textContent = "テキストをコピーする！";
      copyButton.addEventListener("click", () => copyText(data, "テキストをコピーしました"));
    }
    containerElem.appendChild(copyButton);
    return containerElem;
  };

  window.MiniApps = { showSnackBar, copyText, toHttpUrl, createQrResultElem };
})();
