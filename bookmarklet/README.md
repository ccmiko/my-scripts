# bookmarklet

ソースは `*.js`、ブックマーク登録用の URL は `dist/*.txt`。

## 使い方

1. `dist/<名前>.txt` の中身(`javascript:` から始まる1行)をコピーする
2. ブラウザで新しいブックマークを作成し、URL 欄に貼り付ける

## 編集したとき

`*.js` を編集したら、リポジトリのルートで以下を実行して `dist/` を再生成する。

```shell
node scripts/build-bookmarklets.js
```
