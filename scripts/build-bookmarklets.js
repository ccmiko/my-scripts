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
 */
const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "..", "bookmarklet");
const LIB_DIR = path.join(SRC_DIR, "_lib");
const DIST_DIR = path.join(SRC_DIR, "dist");
const INCLUDE_PATTERN = /^[ \t]*\/\/[ \t]*@include[ \t]+([\w-]+)[ \t]*$/gm;

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
const files = fs.readdirSync(SRC_DIR).filter((file) => file.endsWith(".js")).sort();
const expected = new Map(
  files.map((file) => {
    const source = resolveIncludes(fs.readFileSync(path.join(SRC_DIR, file), "utf-8"), file);
    return [file.replace(/\.js$/, ".txt"), `${toBookmarklet(source)}\n`];
  })
);

if (checkOnly) {
  const actualFiles = fs.existsSync(DIST_DIR) ? fs.readdirSync(DIST_DIR).filter((f) => f.endsWith(".txt")) : [];
  const problems = [];
  for (const [name, content] of expected) {
    const distPath = path.join(DIST_DIR, name);
    if (!fs.existsSync(distPath)) problems.push(`missing: ${name}`);
    else if (fs.readFileSync(distPath, "utf-8") !== content) problems.push(`outdated: ${name}`);
  }
  actualFiles.filter((name) => !expected.has(name)).forEach((name) => problems.push(`orphan: ${name}`));
  if (problems.length) {
    console.error(problems.join("\n"));
    console.error("\nbookmarklet/dist が最新ではありません。`node scripts/build-bookmarklets.js` を実行してコミットしてください");
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
  // ソースが消えた生成物は削除する
  fs.readdirSync(DIST_DIR)
    .filter((name) => name.endsWith(".txt") && !expected.has(name))
    .forEach((name) => {
      fs.rmSync(path.join(DIST_DIR, name));
      console.info(`removed: ${name}`);
    });
}
