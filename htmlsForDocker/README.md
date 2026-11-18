# コマンドメモ

```shell
# アカウント一覧(account.html)のデータについて
# - おすすめ: 画面の「暗号化ファイルを作る」で account.enc.json を作る。画面の「暗号化ファイルを開く」で選ぶか、htmls/ に置く
# - 平文で試す場合: 見本をコピーして account.json を作る
# どちらも git 管理外。両方ある場合は account.enc.json が優先される
cp ../htmls/account.sample.json ../htmls/account.json

docker compose up -d
docker container exec -it miniApps ash
```

起動後は http://localhost:4444/ にアクセスする。

## ホーム画面に追加(PWA)

http://localhost:4444/ を Chrome / Edge で開き、アドレスバーの「インストール」から追加するとアプリとして起動できる。
一度開いたページはオフラインでも使える(アカウント情報はオフライン用に保存しない)。

- スマホから使う場合は HTTPS が必要(Service Worker は localhost 以外では HTTPS でしか動かない)
- アプリを追加・削除するときは `htmls/apps.js` に1行足す・消すだけでよい
