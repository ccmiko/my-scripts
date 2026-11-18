function main() {
  const inputElem = document.createElement("input");
  inputElem.type = "text";
  inputElem.style.cssText =
    "position: fixed; margin: 20px; min-width: 300px; max-width: 1000px; z-index: 999; background-color: #E7F1ED";
  inputElem.placeholder = "上書きしたいタブ名を入力";
  inputElem.value = document.title;
  inputElem.addEventListener(
    "change",
    () => {
      document.title = inputElem.value;
      inputElem.remove();
    },
    { once: true }
  );
  document.body.prepend(inputElem);
  inputElem.focus();
  inputElem.select();
  window.scrollTo(0, 0);
}
main();
