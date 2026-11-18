#!/usr/bin/env node
/**
 * GitHub Pages で公開するファイル一式を htmls/ から作る。
 *
 *   node scripts/build-pages.js [出力先]   # 既定: _site
 *
 * - アカウント一覧(account.html と関連する JSON)は公開しない。ローカルの Docker(htmlsForDocker)だけで使う
 * - `@local-only` を含む行(一覧のアカウント一覧の項目、Service Worker のキャッシュ対象など)を削除する
 * - 出力に除外したファイルや、それを参照する記述が残っていたら失敗する(誤って公開しないための確認)
 */
const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "..", "htmls");
const OUT_DIR = path.resolve(process.argv[2] ?? path.join(__dirname, "..", "_site"));

/** 公開しないファイル */
const EXCLUDED_FILES = new Set(["account.html", "account.json", "account.enc.json", "account.sample.json"]);
/** この文字列を含む行は公開版では削除する */
const LOCAL_ONLY_MARKER = "@local-only";
/** 行の削除を行うファイルの拡張子 */
const TEXT_EXTENSIONS = new Set([".html", ".js", ".css", ".webmanifest", ".json"]);

const copyDir = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.name.startsWith(".") || EXCLUDED_FILES.has(entry.name)) {
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

/** 出力の中に、除外したファイルそのものや参照が残っていないか確認する */
const verify = (dir) => {
  const problems = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (EXCLUDED_FILES.has(entry.name)) problems.push(`除外対象のファイルが出力されています: ${fullPath}`);
      if (TEXT_EXTENSIONS.has(path.extname(entry.name))) {
        const text = fs.readFileSync(fullPath, "utf-8");
        for (const name of EXCLUDED_FILES) {
          if (text.includes(name)) problems.push(`${path.relative(dir, fullPath)} に ${name} への参照が残っています`);
        }
      }
    }
  };
  walk(dir);
  return problems;
};

fs.rmSync(OUT_DIR, { recursive: true, force: true });
copyDir(SRC_DIR, OUT_DIR);
const problems = verify(OUT_DIR);
if (problems.length) {
  console.error(problems.join("\n"));
  console.error("\n公開してはいけないファイル・参照が残っています。`// @local-only` の付け忘れがないか確認してください");
  process.exit(1);
}
console.info(`built: ${path.relative(process.cwd(), OUT_DIR) || OUT_DIR}`);
