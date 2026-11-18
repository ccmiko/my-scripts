# コマンドメモ

```shell
# アカウント一覧(account.html)のデータについて
# - おすすめ: 画面の「暗号化ファイルを作る」で account.enc.json を作り htmls/ に置く(マスターパスワードで解除)
# - 平文で試す場合: 見本をコピーして account.json を作る
# どちらも git 管理外。両方ある場合は account.enc.json が優先される
cp ../htmls/account.sample.json ../htmls/account.json

docker compose up -d
docker container exec -it miniApps ash
```

起動後は http://localhost:4444/ にアクセスする。
