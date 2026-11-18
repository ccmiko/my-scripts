# コマンドメモ

```shell
# 初回のみ: アカウント一覧用のデータを見本から作成する(account.json は git 管理外)
cp ../htmls/account.sample.json ../htmls/account.json

docker compose up -d
docker container exec -it miniApps ash
```

起動後は http://localhost:4444/ にアクセスする。
