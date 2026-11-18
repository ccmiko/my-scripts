/**
 * ミニアプリ共通の処理。
 * file:// で直接開いても動くよう、ES Module ではなく通常のスクリプトとして読み込む。
 * テーマをちらつかせずに適用するため、<head> 内で defer を付けずに読み込むこと。
 *   <script src="./common.js"></script>
 */
(() => {
  // ---------------------------------------------------------------- テーマ(ダークモード)

  /**
   * テーマの設定。"auto"(OSの設定に合わせる) / "light" / "dark"。全ページ共通で localStorage に保存する。
   * 実際に適用するテーマは <html data-theme="light|dark"> に入れ、各ページの CSS は
   * :root[data-theme="dark"] { ... } でダークモード用の色を定義する。
   */
  const THEME_KEY = "MINI_APPS_THEME";
  const THEMES = {
    auto: { icon: "🌓", label: "自動(OSの設定)" },
    light: { icon: "☀️", label: "ライト" },
    dark: { icon: "🌙", label: "ダーク" },
  };
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  let themeButton = null;

  const getThemePreference = () => {
    try {
      const saved = window.localStorage.getItem(THEME_KEY);
      return saved in THEMES ? saved : "auto";
    } catch {
      return "auto";
    }
  };

  const applyTheme = () => {
    const preference = getThemePreference();
    const theme = preference === "auto" ? (darkQuery.matches ? "dark" : "light") : preference;
    document.documentElement.dataset.theme = theme;
    if (themeButton) {
      themeButton.textContent = THEMES[preference].icon;
      themeButton.title = `テーマ: ${THEMES[preference].label}(クリックで切り替え)`;
      themeButton.setAttribute("aria-label", themeButton.title);
    }
  };

  const setTheme = (preference) => {
    try {
      window.localStorage.setItem(THEME_KEY, preference);
    } catch (error) {
      console.error(error);
    }
    applyTheme();
  };

  // フォーム部品やスクロールバーの色もテーマに合わせる。ページ側の :root { color-scheme } より優先される
  const themeStyle = document.createElement("style");
  themeStyle.textContent = `
    :root[data-theme="light"] { color-scheme: light; }
    :root[data-theme="dark"] { color-scheme: dark; }
    .mini-apps-theme-button {
      position: fixed; left: 12px; bottom: calc(12px + env(safe-area-inset-bottom)); z-index: 1000;
      width: 36px; height: 36px; padding: 0; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; font-size: 18px; line-height: 1;
      border: 1px solid rgba(128, 128, 128, 0.4); background: Canvas; color: CanvasText;
      opacity: 0.7; cursor: pointer; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }
    .mini-apps-theme-button:hover, .mini-apps-theme-button:focus-visible { opacity: 1; }
    .mini-apps-theme-button--inline { position: static; width: 30px; height: 30px; font-size: 16px; box-shadow: none; }
    .mini-apps-snackbar {
      position: fixed; left: 50%; bottom: calc(24px + env(safe-area-inset-bottom)); z-index: 1001;
      max-width: min(560px, calc(100vw - 32px)); padding: 10px 18px; border-radius: 10px;
      background: #2b2d31; color: #ffffff; font: 500 15px/1.5 system-ui, -apple-system, "Hiragino Sans", sans-serif;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25); white-space: pre-wrap; text-align: center; pointer-events: none;
      opacity: 0; transform: translate(-50%, 8px); transition: opacity 0.2s, transform 0.2s;
    }
    :root[data-theme="dark"] .mini-apps-snackbar {
      background: #ececef; color: #16171a; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
    }
    .mini-apps-snackbar.is-visible { opacity: 1; transform: translate(-50%, 0); }
    @media (prefers-reduced-motion: reduce) { .mini-apps-snackbar { transition: none; } }
    @media print { .mini-apps-theme-button, .mini-apps-snackbar { display: none; } }
  `;
  document.head.appendChild(themeStyle);
  applyTheme();
  darkQuery.addEventListener("change", applyTheme);
  // 別タブで切り替えた場合も反映する
  window.addEventListener("storage", (event) => {
    if (event.key === THEME_KEY) applyTheme();
  });

  const addThemeButton = () => {
    themeButton = document.createElement("button");
    themeButton.type = "button";
    themeButton.className = "mini-apps-theme-button";
    themeButton.addEventListener("click", () => {
      const order = Object.keys(THEMES);
      const next = order[(order.indexOf(getThemePreference()) + 1) % order.length];
      setTheme(next);
      showSnackBar(`テーマ: ${THEMES[next].label}`);
    });
    // ページに [data-theme-button-slot] があればそこに置き、無ければ左下に浮かせて表示する
    const slot = document.querySelector("[data-theme-button-slot]");
    if (slot) {
      themeButton.classList.add("mini-apps-theme-button--inline");
      slot.appendChild(themeButton);
    } else {
      document.body.appendChild(themeButton);
    }
    applyTheme();
  };
  if (document.body) addThemeButton();
  else document.addEventListener("DOMContentLoaded", addThemeButton);

  /**
   * 画面下部の中央に短時間メッセージを表示する(スナックバー)。
   * 背景はページと逆の色(ライト時は濃い灰色に白文字、ダーク時は明るい灰色に黒文字)にして、どちらのテーマでも読めるようにする。
   * 連続で呼ばれた場合は前のメッセージを消して置き換える。
   */
  let currentSnackBar = null;
  const showSnackBar = (msg, durationMs = 1600) => {
    currentSnackBar?.remove();
    const elem = document.createElement("div");
    elem.className = "mini-apps-snackbar";
    elem.setAttribute("role", "status");
    elem.setAttribute("aria-live", "polite");
    elem.textContent = msg;
    document.body.appendChild(elem);
    currentSnackBar = elem;
    // 次のフレームで表示用のクラスを付けてフェードインさせる
    requestAnimationFrame(() => requestAnimationFrame(() => elem.classList.add("is-visible")));
    setTimeout(() => {
      elem.classList.remove("is-visible");
      setTimeout(() => {
        elem.remove();
        if (currentSnackBar === elem) currentSnackBar = null;
      }, 200);
    }, durationMs);
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

  window.MiniApps = {
    showSnackBar, copyText, toHttpUrl, createQrResultElem, playChime, createWakeLockKeeper, getThemePreference, setTheme,
  };

  // ---------------------------------------------------------------- PWA

  // オフラインでも開けるよう Service Worker を登録する(http(s) で開いた場合のみ。localhost 以外は HTTPS が必要)
  if ("serviceWorker" in navigator && window.isSecureContext && window.location.protocol.startsWith("http")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => console.warn("Service Worker の登録に失敗", error));
    });
  }

  // ホーム画面から起動(standalone)した場合はブラウザの戻るボタンが無いため、一覧へ戻るボタンを表示する
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const isIndexPage = /\/(index\.html)?$/.test(window.location.pathname);
  if (isStandalone && !isIndexPage) {
    const addHomeButton = () => {
      const anchor = document.createElement("a");
      anchor.href = "./index.html";
      anchor.textContent = "🏠";
      anchor.title = "一覧へ戻る";
      anchor.setAttribute("aria-label", "一覧へ戻る");
      anchor.style.cssText =
        "position: fixed; right: 12px; bottom: calc(12px + env(safe-area-inset-bottom)); z-index: 1000; " +
        "width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; " +
        "border-radius: 50%; background: #2f9e44; color: #fff; font-size: 22px; text-decoration: none; " +
        "box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);";
      document.body.appendChild(anchor);
    };
    if (document.body) addHomeButton();
    else document.addEventListener("DOMContentLoaded", addHomeButton);
  }
})();
