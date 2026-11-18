//  https://www.rakuten-card.co.jp/e-navi/members/index.xhtml で使用する
function main() {
  const getAmount = (id) => {
    const digits = document.getElementById(id)?.textContent.match(/\d/g);
    if (!digits) {
      throw new Error(`金額を取得できません (id: ${id})。画面の構成が変わった可能性があります`);
    }
    return parseInt(digits.join(""), 10);
  };
  try {
    const lastMonthUsedAmount = getAmount("js-rd-billInfo-amount_show");
    const limitAmount = getAmount("js-bill-available-amount");
    const nowUsedAmount = getAmount("js-bill-available");
    const thisMonthUsedAmount = limitAmount - lastMonthUsedAmount - nowUsedAmount;
    window.alert(`今月の利用額: ${thisMonthUsedAmount.toLocaleString("ja-JP")}円`);
  } catch (error) {
    window.alert(error.message);
  }
}
main();
