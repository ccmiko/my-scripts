#!/usr/bin/env node
/**
 * bookmarklet/*.js からブックマーク登録用の `javascript:` URL を生成する。
 *
 *   node scripts/build-bookmarklets.js
 *
 * 生成物は bookmarklet/dist/<名前>.txt に出力される。中身をそのままブックマークのURL欄に貼り付ける。
 * 手作業で minify すると元コードとずれるため、ソースは bookmarklet/*.js だけを編集すること。
 */
const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "..", "bookmarklet");
const DIST_DIR = path.join(SRC_DIR, "dist");

const toBookmarklet = (source) => {
  // 即時関数で包み、ページのグローバルを汚さない & 戻り値でページ遷移しないようにする。
  // minify はせず、改行等も含めて encodeURIComponent する(文字列内の空白を壊さないため)。
  const wrapped = `(() => {\n${source.trim()}\n})();`;
  return `javascript:${encodeURIComponent(wrapped)}`;
};

fs.mkdirSync(DIST_DIR, { recursive: true });
const files = fs.readdirSync(SRC_DIR).filter((file) => file.endsWith(".js")).sort();
for (const file of files) {
  const source = fs.readFileSync(path.join(SRC_DIR, file), "utf-8");
  const outPath = path.join(DIST_DIR, file.replace(/\.js$/, ".txt"));
  fs.writeFileSync(outPath, `${toBookmarklet(source)}\n`);
  console.info(`generated: ${path.relative(process.cwd(), outPath)}`);
}
