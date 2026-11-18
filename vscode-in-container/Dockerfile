# latest だと意図せずメジャーバージョンが上がるため LTS を固定する
FROM ubuntu:24.04

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git \
    && rm -rf /var/lib/apt/lists/*

# VS Code CLI をダウンロードし、更新APIが返す sha256 で改ざん・破損がないか検証する
RUN if [ "$(dpkg --print-architecture)" = "amd64" ]; then \
        vscode_cli_arch=x64; \
    elif [ "$(dpkg --print-architecture)" = "arm64" ]; then \
        vscode_cli_arch=arm64; \
    else \
        echo "Unsupported architecture: $(dpkg --print-architecture)" >&2; \
        exit 1; \
    fi \
    && meta="$(curl -fsSL "https://update.code.visualstudio.com/api/update/cli-alpine-${vscode_cli_arch}/stable/latest")" \
    && url="$(echo "${meta}" | sed -n 's/.*"url":"\([^"]*\)".*/\1/p')" \
    && sha256="$(echo "${meta}" | sed -n 's/.*"sha256hash":"\([0-9a-f]*\)".*/\1/p')" \
    && test -n "${url}" && test -n "${sha256}" \
    && curl -fsSL "${url}" -o /tmp/vscode_cli.tar.gz \
    && echo "${sha256}  /tmp/vscode_cli.tar.gz" | sha256sum -c - \
    && tar -xzf /tmp/vscode_cli.tar.gz -C /usr/local/bin code \
    && rm /tmp/vscode_cli.tar.gz

# root ではなく一般ユーザーで実行する
# (ubuntu:24.04 には UID 1000 の ubuntu ユーザーが既に存在するため、それを使う)
USER ubuntu
# マウント先が存在しないと root 所有で作成され書き込めないため、先に作っておく
RUN mkdir -p /home/ubuntu/.vscode /home/ubuntu/workspace
WORKDIR /home/ubuntu/workspace

# 認証情報(~/.vscode)と作業データ(~/workspace)はコンテナ破棄後も残るよう、
# 起動時にボリュームをマウントすること(README参照)。
# なお code tunnel は外向き接続のみで動作し、コンテナ内アプリへのアクセスもトンネルの
# ポートフォワード機能を使うため、ポートの EXPOSE は不要。

CMD ["code", "tunnel"]