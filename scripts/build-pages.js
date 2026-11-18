#!/usr/bin/env node
/**
 * GitHub Pages で公開するファイル一式を htmls/ から作る。
 *
 *   node scripts/build-pages.js [出力先]   # 既定: _site
 *
 * - アカウント情報の実データ(account.json / account.enc.json)は、置いてあっても絶対に公開しない
 * - apps.js で localOnly: true のアプリ(と relatedFiles)は公開せず、出力の apps.js からも除く
 * - `@local-only` を含む行は削除する
 * - sw.js の CACHE_VERSION を出力内容のハッシュに置き換え、更新時に古いキャッシュが入れ替わるようにする
 * - 出力に除外したファイルや、それを参照する記述が残っていたら失敗する(誤って公開しないための確認)
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { loadApps } = require("./lib/load-apps");

const SRC_DIR = path.join(__dirname, "..", "htmls");
const OUT_DIR = path.resolve(process.argv[2] ?? path.join(__dirname, "..", "_site"));

/** どんな場合も公開しないファイル(アカウント情報の実データ) */
const ALWAYS_EXCLUDED = ["account.json", "account.enc.json"];
/** この文字列を含む行は公開版では削除する */
const LOCAL_ONLY_MARKER = "@local-only";
/** 行の削除・参照の確認を行うファイルの拡張子 */
const TEXT_EXTENSIONS = new Set([".html", ".js", ".css", ".webmanifest", ".json"]);

const apps = loadApps();
const localOnlyApps = apps.filter((app) => app.localOnly);
const publicApps = apps.filter((app) => !app.localOnly);
const excludedFiles = new Set([
  ...ALWAYS_EXCLUDED,
  ...localOnlyApps.flatMap((app) => [app.file, ...(app.relatedFiles ?? [])]),
]);

const copyDir = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.name.startsWith(".") || excludedFiles.has(entry.name)) {
      console.info(`skip: ${path.relative(SRC_DIR, srcPath)}`);
      continue;
    }
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (TEXT_EXTENSIONS.has(path.extname(entry.name))) {
      const lines = fs.readFileSync(srcPath, "utf-8").split("\n");
      const kept = lines.filter((line) => !line.includes(LOCAL_ONLY_MARKER));
      if (kept.length !== lines.length) {
        console.info(`strip: ${path.relative(SRC_DIR, srcPath)} (${lines.length - kept.length} 行)`);
      }
      fs.writeFileSync(destPath, kept.join("\n"));
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

const listFiles = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(dir, entry.name);
      return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
    })
    .sort();

/** 出力の中に、除外したファイルそのものや参照が残っていないか確認する */
const verify = (dir) => {
  const problems = [];
  for (const file of listFiles(dir)) {
    const name = path.basename(file);
    if (excludedFiles.has(name)) problems.push(`除外対象のファイルが出力されています: ${file}`);
    if (TEXT_EXTENSIONS.has(path.extname(name))) {
      const text = fs.readFileSync(file, "utf-8");
      for (const excluded of excludedFiles) {
        if (text.includes(excluded)) problems.push(`${path.relative(dir, file)} に ${excluded} への参照が残っています`);
      }
    }
  }
  return problems;
};

fs.rmSync(OUT_DIR, { recursive: true, force: true });
copyDir(SRC_DIR, OUT_DIR);

// 公開版の apps.js は、公開するアプリだけにする
const appsHeader = "/** ミニアプリの一覧(scripts/build-pages.js が htmls/apps.js から生成した公開版) */\n";
fs.writeFileSync(
  path.join(OUT_DIR, "apps.js"),
  `${appsHeader}globalThis.MINI_APPS = ${JSON.stringify(
    publicApps.map(({ localOnly, relatedFiles, ...app }) => app),
    null,
    2,
  )};\n`,
);

// Service Worker のキャッシュ版を、出力内容のハッシュにする
const swPath = path.join(OUT_DIR, "sw.js");
const hash = crypto.createHash("sha256");
for (const file of listFiles(OUT_DIR).filter((file) => file !== swPath)) {
  hash.update(path.relative(OUT_DIR, file));
  hash.update(fs.readFileSync(file));
}
const version = hash.digest("hex").slice(0, 12);
const sw = fs.readFileSync(swPath, "utf-8");
const versionPattern = /const CACHE_VERSION = "[^"]*";/;
if (!versionPattern.test(sw)) {
  console.error("sw.js に CACHE_VERSION の定義が見つかりません");
  process.exit(1);
}
fs.writeFileSync(swPath, sw.replace(versionPattern, `const CACHE_VERSION = "${version}";`));
console.info(`cache version: ${version}`);

const problems = verify(OUT_DIR);
if (problems.length) {
  console.error(problems.join("\n"));
  console.error(
    "\n公開してはいけないファイル・参照が残っています。apps.js の localOnly / relatedFiles や `// @local-only` を確認してください",
  );
  process.exit(1);
}
console.info(`built: ${path.relative(process.cwd(), OUT_DIR) || OUT_DIR}`);
