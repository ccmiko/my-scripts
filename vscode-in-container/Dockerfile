FROM ubuntu:latest

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git \
    && rm -rf /var/lib/apt/lists/*

RUN if [ "$(dpkg --print-architecture)" = "amd64" ]; then \
        vscode_cli_arch=x64; \
    elif [ "$(dpkg --print-architecture)" = "arm64" ]; then \
        vscode_cli_arch=arm64; \
    else \
        echo "Unsupported architecture: $(dpkg --print-architecture)" >&2; \
        exit 1; \
    fi \
    && curl -fsSL "https://code.visualstudio.com/sha/download?build=stable&os=cli-alpine-${vscode_cli_arch}" -o /tmp/vscode_cli.tar.gz \
    && tar -xzf /tmp/vscode_cli.tar.gz -C /usr/local/bin code \
    && rm /tmp/vscode_cli.tar.gz

WORKDIR /root/workspace

# 開発作業でコンテナ内で起動する各アプリ用。とりあえず適当に開けておく。
EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
EXPOSE 4000
EXPOSE 4001
EXPOSE 4002

CMD ["code", "tunnel"]
