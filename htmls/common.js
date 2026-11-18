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

  /**
   * 「ピロピロ」と音階を順に鳴らす(火継・ポモドーロの通知音)。
   * @param {number} volume 0〜1
   * @param {number[]} freqs 鳴らす周波数(Hz)の並び
   */
  const playChime = (volume, freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51], stepSeconds = 0.2) => {
    if (!(volume > 0)) {
      return;
    }
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // 全体の音量。各音のエンベロープ(0→1→0)の後段に掛ける
    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);
    const now = ctx.currentTime;
    freqs.forEach((freq, i) => {
      const startTime = now + i * stepSeconds;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(masterGain);
      // 20ms のフェードイン・アウトでクリックノイズを防ぐ
      const fadeTime = 0.02;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(1, startTime + fadeTime);
      gain.gain.setValueAtTime(1, startTime + stepSeconds - fadeTime);
      gain.gain.linearRampToValueAtTime(0, startTime + stepSeconds);
      osc.start(startTime);
      osc.stop(startTime + stepSeconds);
    });
    // 再生し終わったら AudioContext を解放する
    setTimeout(() => ctx.close(), (freqs.length * stepSeconds + 0.5) * 1000);
  };

  /**
   * 画面のスリープを防ぐ(Wake Lock API)。タブ非表示でブラウザに解除された場合は、表示復帰時に取り直す。
   *   const keeper = MiniApps.createWakeLockKeeper({ onChange: (active) => ... });
   *   await keeper.enable(); await keeper.disable();
   * onChange には「実際にロックできているか」が渡される。
   */
  const createWakeLockKeeper = ({ onChange = () => {} } = {}) => {
    let wanted = false;
    let sentinel = null;
    const acquire = async () => {
      const current = await navigator.wakeLock.request("screen");
      if (!wanted) {
        await current.release();
        return;
      }
      sentinel = current;
      onChange(true);
      current.addEventListener("release", () => {
        if (sentinel === current) sentinel = null;
        onChange(false);
      });
    };
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && wanted && !sentinel) {
        acquire().catch((error) => console.error(error));
      }
    });
    return {
      isSupported: () => "wakeLock" in navigator,
      enable: async () => {
        wanted = true;
        if (!sentinel) await acquire();
      },
      disable: async () => {
        wanted = false;
        const current = sentinel;
        sentinel = null;
        await current?.release();
      },
    };
  };

  window.MiniApps = { showSnackBar, copyText, toHttpUrl, createQrResultElem, playChime, createWakeLockKeeper };
})();
