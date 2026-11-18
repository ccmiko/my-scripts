// @include floatingInput

function main() {
  showFloatingInput({
    placeholder: "上書きしたいタブ名を入力",
    value: document.title,
    onSubmit: (value) => {
      document.title = value;
    },
  });
  window.scrollTo(0, 0);
}
main();
