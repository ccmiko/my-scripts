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

再生成を忘れて push すると GitHub Actions(`.github/workflows/ci.yml`)が失敗して知らせてくれる。

## 共通処理

複数のブックマークレットで使う処理は `_lib/<名前>.js` に置く。
ソース中に `// @include <名前>` と1行で書くと、ビルド時にその行が `_lib/<名前>.js` の中身に置き換わる。

| ファイル                | 提供するもの                                                            |
| ----------------------- | ----------------------------------------------------------------------- |
| `_lib/floatingInput.js` | `FLOATING_STYLE`, `showFloatingInput({ placeholder, value, onSubmit })` |
| `_lib/toast.js`         | `showToast(msg)`, `copyWithToast(text, successMsg)`                     |
