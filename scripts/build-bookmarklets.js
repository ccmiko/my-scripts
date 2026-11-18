#!/usr/bin/env node
/**
 * bookmarklet/*.js からブックマーク登録用の `javascript:` URL を生成する。
 *
 *   node scripts/build-bookmarklets.js          # dist/ を生成
 *   node scripts/build-bookmarklets.js --check  # dist/ が最新か確認だけする(CI用。差分があれば終了コード1)
 *
 * 生成物は bookmarklet/dist/<名前>.txt に出力される。中身をそのままブックマークのURL欄に貼り付ける。
 * 手作業で minify すると元コードとずれるため、ソースは bookmarklet/*.js だけを編集すること。
 *
 * 複数のブックマークレットで使う処理は bookmarklet/_lib/<名前>.js に置き、
 * ソース中に `// @include <名前>` と書くとビルド時にその行が中身に置き換わる。
 *
 * 各ソースの先頭には `// @title 名前` と `// @description 説明` を書く。
 * これらから、登録ページ(htmls/bookmarklets.html)用のデータ htmls/bookmarklets.data.js も生成する。
 */
const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "..", "bookmarklet");
const LIB_DIR = path.join(SRC_DIR, "_lib");
const DIST_DIR = path.join(SRC_DIR, "dist");
const INCLUDE_PATTERN = /^[ \t]*\/\/[ \t]*@include[ \t]+([\w-]+)[ \t]*$/gm;
const META_PATTERN = /^[ \t]*\/\/[ \t]*@(title|description)[ \t]+(.+?)[ \t]*$/gm;
const DATA_PATH = path.join(__dirname, "..", "htmls", "bookmarklets.data.js");

/** `// @title` / `// @description` を読み取り、コードからは取り除く */
const extractMeta = (source, file) => {
  const meta = {};
  const code = source.replace(META_PATTERN, (_, key, value) => {
    meta[key] = value;
    return "";
  });
  if (!meta.title) throw new Error(`${file}: 先頭に // @title を書いてください`);
  return { meta, code };
};

const resolveIncludes = (source, file) =>
  source.replace(INCLUDE_PATTERN, (_, name) => {
    const libPath = path.join(LIB_DIR, `${name}.js`);
    if (!fs.existsSync(libPath)) {
      throw new Error(`${file}: @include ${name} が見つかりません (${path.relative(process.cwd(), libPath)})`);
    }
    return fs.readFileSync(libPath, "utf-8").trim();
  });

const toBookmarklet = (source) => {
  // 即時関数で包み、ページのグローバルを汚さない & 戻り値でページ遷移しないようにする。
  // minify はせず、改行等も含めて encodeURIComponent する(文字列内の空白を壊さないため)。
  const wrapped = `(() => {\n${source.trim()}\n})();`;
  return `javascript:${encodeURIComponent(wrapped)}`;
};

const checkOnly = process.argv.includes("--check");
const files = fs
  .readdirSync(SRC_DIR)
  .filter((file) => file.endsWith(".js"))
  .sort();
const built = files.map((file) => {
  const { meta, code } = extractMeta(fs.readFileSync(path.join(SRC_DIR, file), "utf-8"), file);
  const href = toBookmarklet(resolveIncludes(code, file));
  return { name: file.replace(/\.js$/, ""), title: meta.title, description: meta.description ?? "", href };
});
const expected = new Map(built.map(({ name, href }) => [`${name}.txt`, `${href}\n`]));
const expectedData =
  "/** ブックマークレットの一覧(scripts/build-bookmarklets.js が生成。直接編集しないこと) */\n" +
  `globalThis.BOOKMARKLETS = ${JSON.stringify(built, null, 2)};\n`;

if (checkOnly) {
  const actualFiles = fs.existsSync(DIST_DIR) ? fs.readdirSync(DIST_DIR).filter((f) => f.endsWith(".txt")) : [];
  const problems = [];
  for (const [name, content] of expected) {
    const distPath = path.join(DIST_DIR, name);
    if (!fs.existsSync(distPath)) problems.push(`missing: ${name}`);
    else if (fs.readFileSync(distPath, "utf-8") !== content) problems.push(`outdated: ${name}`);
  }
  actualFiles.filter((name) => !expected.has(name)).forEach((name) => problems.push(`orphan: ${name}`));
  if (!fs.existsSync(DATA_PATH) || fs.readFileSync(DATA_PATH, "utf-8") !== expectedData) {
    problems.push(`outdated: ${path.relative(process.cwd(), DATA_PATH)}`);
  }
  if (problems.length) {
    console.error(problems.join("\n"));
    console.error(
      "\nbookmarklet/dist(または登録ページ用データ)が最新ではありません。`node scripts/build-bookmarklets.js` を実行してコミットしてください",
    );
    process.exit(1);
  }
  console.info("bookmarklet/dist is up to date");
} else {
  fs.mkdirSync(DIST_DIR, { recursive: true });
  for (const [name, content] of expected) {
    const outPath = path.join(DIST_DIR, name);
    fs.writeFileSync(outPath, content);
    console.info(`generated: ${path.relative(process.cwd(), outPath)}`);
  }
  fs.writeFileSync(DATA_PATH, expectedData);
  console.info(`generated: ${path.relative(process.cwd(), DATA_PATH)}`);
  // ソースが消えた生成物は削除する
  fs.readdirSync(DIST_DIR)
    .filter((name) => name.endsWith(".txt") && !expected.has(name))
    .forEach((name) => {
      fs.rmSync(path.join(DIST_DIR, name));
      console.info(`removed: ${name}`);
    });
}
