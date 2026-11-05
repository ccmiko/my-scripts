# やりたいこと

1. VSCode を Container Image で配信できるらしい！？なにそれやってみよう
2. 外部からアクセスできるようにする
3. 配信基盤によるが、特定のローカルネットワーク内・認証機能付きが望ましい
   1. とりあえず個人利用のため `code tunnel` で構築することに。
4. 複数の端末からアクセスして開発できる
5. ipad等の端末からも作業できることが望ましい
   1. 追記：やってみたけど、めちゃ操作感悪い。Magic Keyboardあり13インチipadなら、まぁ、どうしてもそれしか環境がないなら、少しは・・・って感じ
6. 各自の作業データは保持される
   1. **ボリュームのマウントはコンテナ浮かべる基盤側で設定すること**

## やってみた

## その他

### ビルド〜起動

```shell
# ビルド
docker build -t my-vscode:1.0 .
# windows、macでビルドしてlinux環境でコンテナ起動するパターン用
docker build --platform linux/amd64 -t my-vscode-on-linux:1.0 .
```

```shell
docker build -t my-vscode:1.0 .

# インタラクティブターミナル起動
docker run --name my-vscode --rm -it my-vscode:1.0
# コンテナ起動
docker run --name my-vscode my-vscode:1.0
```

### 起動後にどう使う？

1. とりあえず、初回はコンテナのログ見て `code tunnel` の認証作業を手動で行う
   1. 必要に応じてコンテナに潜ってCUIの操作を行う
   2. なんか良いやり方ある気がするけど、そこまで調べてない
2. ログ出力されるリンクを開く
3. 自分だけのvscodeが起動する！

### エクスポート (リポジトリを介さない他所への配布用)

docker save -o $HOME/Desktop/my-vscode.tar my-vscode-on-linux:1.0

### 整形

お試しで `dockerfmt` というものを使ってみた

```shell
brew install dockerfmt
```

```shell
# チェック
dockerfmt -c Dockerfile
# 整形
dockerfmt -w Dockerfile
```
