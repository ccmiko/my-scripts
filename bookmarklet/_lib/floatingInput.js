/** 画面左上に浮かせて表示する要素のスタイル */
const FLOATING_STYLE =
  "position: fixed; top: 0; left: 0; margin: 20px; min-width: 300px; max-width: 1000px; " +
  "z-index: 2147483647; background-color: #E7F1ED; color: #1b1b1b; font-size: 16px;";

/**
 * 画面左上に入力欄を表示し、確定(change)されたら onSubmit(入力値) を呼んで入力欄を消す。
 * Esc キーで何もせずに閉じる。
 */
const showFloatingInput = ({ placeholder, value = "", onSubmit }) => {
  const inputElem = document.createElement("input");
  inputElem.type = "text";
  inputElem.style.cssText = FLOATING_STYLE;
  inputElem.placeholder = placeholder;
  inputElem.value = value;
  inputElem.addEventListener(
    "change",
    () => {
      inputElem.remove();
      onSubmit(inputElem.value);
    },
    { once: true },
  );
  inputElem.addEventListener("keydown", (event) => {
    if (event.key === "Escape") inputElem.remove();
  });
  document.body.prepend(inputElem);
  inputElem.focus();
  inputElem.select();
};
