// @include floatingInput

function main() {
  showFloatingInput({
    placeholder: "DLしたいリンクを入力してください",
    onSubmit: (link) => {
      // 入力値をHTMLとして解釈しないよう、DOM APIで要素を組み立てる
      const container = document.createElement("div");
      container.style.cssText = FLOATING_STYLE;
      const anchor = document.createElement("a");
      anchor.href = link;
      anchor.textContent = "右クリックから保存";
      const button = document.createElement("button");
      button.textContent = "消す";
      button.addEventListener("click", () => container.remove());
      container.append(anchor, button);
      document.body.prepend(container);
    },
  });
  window.scrollTo(0, 0);
}
main();
