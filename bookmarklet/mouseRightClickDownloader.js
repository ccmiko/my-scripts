function main() {
  const style =
    "position: fixed; margin: 20px; min-width: 300px; max-width: 1000px; z-index: 999; background-color: #E7F1ED";

  const inputElem = document.createElement("input");
  inputElem.type = "text";
  inputElem.style.cssText = style;
  inputElem.placeholder = "DLしたいリンクを入力してください";

  inputElem.addEventListener(
    "change",
    () => {
      const link = inputElem.value;
      inputElem.remove();

      // 入力値をHTMLとして解釈しないよう、DOM APIで要素を組み立てる
      const container = document.createElement("div");
      container.style.cssText = style;
      const anchor = document.createElement("a");
      anchor.href = link;
      anchor.textContent = "右クリックから保存";
      const button = document.createElement("button");
      button.textContent = "消す";
      button.addEventListener("click", () => container.remove());
      container.append(anchor, button);
      document.body.prepend(container);
    },
    { once: true }
  );

  document.body.prepend(inputElem);
  inputElem.focus();
  window.scrollTo(0, 0);
}
main();
