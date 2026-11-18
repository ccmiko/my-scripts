/**
 * ミニアプリ用の Service Worker。オフラインでも開けるよう、アプリのファイルと CDN のライブラリをキャッシュする。
 *
 * - HTML: ネットワーク優先(更新をすぐ反映)。オフライン時はキャッシュを返す
 * - その他の同一オリジンのファイル: キャッシュを返しつつ裏で更新(stale-while-revalidate)
 * - CDN(cdn.jsdelivr.net)のライブラリ: バージョン固定なのでキャッシュ優先
 * - アカウント情報(NEVER_CACHE)は絶対にキャッシュしない
 *
 * アプリを追加・削除したら APP_FILES と CACHE_VERSION を更新すること。
 * 行末に local-only のマーカーを付けた行は、GitHub Pages 用のビルド(scripts/build-pages.js)で削除される。
 */
const CACHE_VERSION = "v3";
const CACHE_NAME = `mini-apps-${CACHE_VERSION}`;

const APP_FILES = [
  "./",
  "./index.html",
  "./app.css",
  "./common.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/apple-touch-icon.png",
  "./account.html", // @local-only (公開版では削除される)
  "./char_counter.html",
  "./date_calc.html",
  "./dev_tools.html",
  "./exif_cleaner.html",
  "./fire_keeper.html",
  "./medicine_management.html",
  "./mic.html",
  "./ocr.html",
  "./pomodoro.html",
  "./qr_generator.html",
  "./qr_reader_camera.html",
  "./qr_reader_image.html",
  "./style_slayer.html",
];

/** キャッシュしてはいけないファイル(機密情報) */
const NEVER_CACHE = /\/account(\.enc)?\.json$/;
/** キャッシュ優先で保存する CDN */
const CDN_HOSTS = ["cdn.jsdelivr.net"];
/** OCR の言語データは大きく、tesseract.js 自身が IndexedDB にキャッシュするため対象外 */
const CDN_EXCLUDE = /@tesseract\.js-data\//;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES.map((url) => new Request(url, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("mini-apps-") && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

const putIfOk = async (request, response) => {
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
};

const networkFirst = async (request) => {
  try {
    return await putIfOk(request, await fetch(request));
  } catch (error) {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    throw error;
  }
};

const staleWhileRevalidate = async (request, event) => {
  const cached = await caches.match(request);
  const update = fetch(request).then((response) => putIfOk(request, response));
  if (cached) {
    event.waitUntil(update.catch(() => {}));
    return cached;
  }
  return update;
};

const cacheFirst = async (request) => (await caches.match(request)) ?? putIfOk(request, await fetch(request));

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    if (NEVER_CACHE.test(url.pathname)) return;
    if (request.mode === "navigate" || request.destination === "document") {
      event.respondWith(networkFirst(request));
    } else {
      event.respondWith(staleWhileRevalidate(request, event));
    }
    return;
  }

  if (CDN_HOSTS.includes(url.hostname) && !CDN_EXCLUDE.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
  }
});
