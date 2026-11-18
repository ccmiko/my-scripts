// @title URLの追跡パラメータ削除
// @description utm_* などを取り除いた URL をコピーする。Amazon は短い URL にする
// @include toast

/**
 * 表示中のURLから追跡用パラメータを取り除いてコピーし、アドレスバーの表示も置き換える(再読み込みはしない)。
 * Amazon の商品ページは /dp/<ASIN> だけの短いURLにする。
 */
function main() {
  /** 削除するクエリパラメータ(完全一致) */
  const TRACKING_PARAMS = new Set([
    "fbclid",
    "gclid",
    "gclsrc",
    "dclid",
    "gbraid",
    "wbraid",
    "msclkid",
    "yclid",
    "twclid",
    "ttclid",
    "igshid",
    "mc_cid",
    "mc_eid",
    "_ga",
    "_gl",
    "_hsenc",
    "_hsmi",
    "mkt_tok",
    "spm",
    "si",
    "ref",
    "ref_",
    "ref_src",
    "ref_url",
    "cmpid",
    "srsltid",
    "s_kwcid",
    "vero_id",
    "oly_enc_id",
    "oly_anon_id",
  ]);
  /** 削除するクエリパラメータ(前方一致) */
  const TRACKING_PREFIXES = ["utm_", "pk_", "mtm_", "hsa_", "pd_rd_", "pf_rd_"];

  const url = new URL(window.location.href);
  const before = url.href;

  const amazonAsin = /(^|\.)amazon\.(co\.jp|com|[a-z.]+)$/.test(url.hostname)
    ? url.pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/)?.[1]
    : null;
  if (amazonAsin) {
    url.pathname = `/dp/${amazonAsin}`;
    url.search = "";
    url.hash = "";
  } else {
    [...url.searchParams.keys()].forEach((key) => {
      const lower = key.toLowerCase();
      if (TRACKING_PARAMS.has(lower) || TRACKING_PREFIXES.some((prefix) => lower.startsWith(prefix))) {
        url.searchParams.delete(key);
      }
    });
  }

  const after = url.href;
  if (after !== before) {
    try {
      window.history.replaceState(window.history.state, "", after);
    } catch {
      // オリジンが変わる等で置き換えられない場合はコピーだけ行う
    }
  }
  const removed = before.length - after.length;
  copyWithToast(
    after,
    removed > 0
      ? `${removed}文字削って コピーしました\n${after}`
      : `削る部分はありませんでした。コピーしました\n${after}`,
  );
}
main();
