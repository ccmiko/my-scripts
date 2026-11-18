# my-scripts

個人的に作成したスクリプト群を置いておくリポジトリ

## 公開版(GitHub Pages)

`htmls/` のミニアプリは、main に push すると GitHub Actions(`.github/workflows/pages.yml`)で GitHub Pages に公開される。

- URL: https://ccmiko.github.io/my-scripts/
- アカウント一覧は公開版でも使える。データ(`account.enc.json`)はサーバーに置かず、端末内のファイルを選んで開く。`account.json` / `account.enc.json` は置いてあっても公開されない
- 公開用のファイルは `node scripts/build-pages.js` で作る。行末に `// @local-only` を付けた行は公開版から削除され、Service Worker のキャッシュ版は自動で更新される
- 公開版の各ページには CSP(読み込めるスクリプトを自サイトと jsDelivr に限定)が入る。インラインスクリプトはビルド時にハッシュで許可されるので手作業は不要。jsDelivr 以外の CDN を使う場合は `scripts/build-pages.js` の CSP を変更する
- アプリの一覧は `htmls/apps.js` だけで管理する(一覧ページ・Service Worker が読み込む)。ショートカット(`shortcut: true`)を変えたら `node scripts/sync-apps.js` で manifest を更新する
- 公開しないアプリは `apps.js` で `localOnly: true` にする

## 開発

```shell
npm install          # 初回のみ(Prettier を入れる)
npm run format       # 書式をそろえる(CI では npm run format:check 相当を実行)
```
