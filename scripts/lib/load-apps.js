/** htmls/apps.js(ブラウザ用のスクリプト)を Node から読み込み、アプリの一覧を返す */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const APPS_PATH = path.join(__dirname, "..", "..", "htmls", "apps.js");

const loadApps = () => {
  const sandbox = { globalThis: {} };
  vm.runInNewContext(fs.readFileSync(APPS_PATH, "utf-8"), sandbox, { filename: APPS_PATH });
  const apps = sandbox.globalThis.MINI_APPS;
  if (!Array.isArray(apps)) throw new Error(`${APPS_PATH} に MINI_APPS の配列がありません`);
  return apps;
};

module.exports = { loadApps, APPS_PATH };
