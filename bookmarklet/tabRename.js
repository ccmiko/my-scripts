// @title タブ名を変更
// @description 表示中のタブのタイトルを書き換える
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
