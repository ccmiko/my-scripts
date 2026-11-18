# my-scripts

個人的に作成したスクリプト群を置いておくリポジトリ

## 公開版(GitHub Pages)

`htmls/` のミニアプリは、main に push すると GitHub Actions(`.github/workflows/pages.yml`)で GitHub Pages に公開される。

- URL: https://ccmiko.github.io/my-scripts/
- アカウント一覧(`account.html`)は公開しない。ローカルの Docker(`htmlsForDocker/`)だけで使う
- 公開用のファイルは `node scripts/build-pages.js` で作る。行末に `// @local-only` を付けた行は公開版から削除され、Service Worker のキャッシュ版は自動で更新される
- アプリの一覧は `htmls/apps.js` だけで管理する(一覧ページ・Service Worker が読み込む)。ショートカット(`shortcut: true`)を変えたら `node scripts/sync-apps.js` で manifest を更新する
- 公開しないアプリは `apps.js` で `localOnly: true` にする

## 開発

```shell
npm install          # 初回のみ(Prettier を入れる)
npm run format       # 書式をそろえる(CI では npm run format:check 相当を実行)
```
