//  https://www.rakuten-card.co.jp/e-navi/members/index.xhtml で使用する
function main() {
  const getMount = (id) =>
    parseInt(document?.getElementById(id).textContent.match(/\d/g).join(""));
  const lastMonthUsedAmount = getMount("js-rd-billInfo-amount_show");
  const limitAmount = getMount("js-bill-available-amount");
  const nowUsedAmount = getMount("js-bill-available");
  window.alert(
    `今月の利用額: ${limitAmount - lastMonthUsedAmount - nowUsedAmount}`
  );
}
main()
