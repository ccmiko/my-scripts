#!/usr/bin/env node
/**
 * htmls/apps.js(アプリ一覧の定義元)から、manifest.webmanifest のショートカットを生成する。
 *
 *   node scripts/sync-apps.js          # manifest を更新
 *   node scripts/sync-apps.js --check  # 最新か・一覧のファイルが存在するかを確認だけする(CI用)
 */
const fs = require("fs");
const path = require("path");
const { loadApps } = require("./lib/load-apps");

const HTMLS_DIR = path.join(__dirname, "..", "htmls");
const MANIFEST_PATH = path.join(HTMLS_DIR, "manifest.webmanifest");

const apps = loadApps();
const problems = [];
const seen = new Set();
apps.forEach((app) => {
  if (!app.file || !app.title) problems.push(`file / title がない項目があります: ${JSON.stringify(app)}`);
  if (seen.has(app.file)) problems.push(`重複しています: ${app.file}`);
  seen.add(app.file);
  if (!fs.existsSync(path.join(HTMLS_DIR, app.file))) problems.push(`ファイルがありません: htmls/${app.file}`);
});

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
manifest.shortcuts = apps.filter((app) => app.shortcut).map((app) => ({ name: app.title, url: `./${app.file}` }));
const expected = `${JSON.stringify(manifest, null, 2)}\n`;

if (process.argv.includes("--check")) {
  if (fs.readFileSync(MANIFEST_PATH, "utf-8") !== expected) {
    problems.push(
      "manifest.webmanifest のショートカットが apps.js と一致しません。`node scripts/sync-apps.js` を実行してください",
    );
  }
  if (problems.length) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
  console.info("apps.js と manifest は一致しています");
} else {
  if (problems.length) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
  fs.writeFileSync(MANIFEST_PATH, expected);
  console.info(`updated: ${path.relative(process.cwd(), MANIFEST_PATH)}`);
}
