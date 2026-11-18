/** 画面上部に短時間メッセージを表示する */
const showToast = (msg, durationMs = 2000) => {
  const elem = document.createElement("div");
  elem.style.cssText =
    "position: fixed; top: 10px; left: 50%; transform: translateX(-50%); z-index: 2147483647; " +
    "padding: 8px 14px; border-radius: 8px; background: #1b1b1b; color: #fff; " +
    "font: 14px/1.4 sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,.3); white-space: pre-wrap;";
  elem.textContent = msg;
  document.body.appendChild(elem);
  setTimeout(() => elem.remove(), durationMs);
};

/** クリップボードにコピーし、結果をトーストで通知する */
const copyWithToast = async (text, successMsg = "コピーしました") => {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMsg);
  } catch (error) {
    console.error(error);
    // クリップボードAPIが使えないページ向けに、手動でコピーできるよう表示する
    window.prompt("コピーできませんでした。以下を手動でコピーしてください", text);
  }
};
