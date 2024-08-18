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

javascript:var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.createTemplateTagFirstArg=function(a){return a.raw=a};$jscomp.createTemplateTagFirstArgWithRaw=function(a,b){a.raw=b;return a};function main(){var a=function(d){var c;return parseInt(null==(c=document)?void 0:c.getElementById(d).textContent.match(/\d/g).join(""))},b=a("js-rd-billInfo-amount_show"),e=a("js-bill-available-amount");a=a("js-bill-available");window.alert("\u4eca\u6708\u306e\u5229\u7528\u984d: "+(e-b-a))}main();
