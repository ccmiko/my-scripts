function main() {
  const body = document.getElementsByTagName("body")[0];
  const style =
    "position: fixed; margin: 20px; min-width: 300px; max-width: 1000px; z-index: 999; background-color: #E7F1ED";

  const inputUniqueId = "A";
  const input = `<input type="text" id="${inputUniqueId}" style="${style}" placeholder="DLしたいリンクを入力してください"/>`;
  body.insertAdjacentHTML("afterbegin", input);
  const inputElem = document.getElementById(inputUniqueId);
  const createLink = (event) => {
    const link = String(event.target.value);
    const aUniqueId = "AA";
    window.deleteElem = () => {
      document.getElementById(aUniqueId).remove();
    };
    const element = `<div id="${aUniqueId}" style="${style}"><a href="${link}">右クリックから保存</a><button onClick="deleteElem()">消す</button></div>`;
    body.insertAdjacentHTML("afterbegin", element);
  };

  inputElem.addEventListener("change", (event) => {
    createLink(event);
    inputElem.remove();
    inputElem.removeEventListener("change", createLink, false);
  });
  window.scrollTo(0, 0);
}
main();

javascript: var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.createTemplateTagFirstArg=function(a){return a.raw=a};$jscomp.createTemplateTagFirstArgWithRaw=function(a,b){a.raw=b;return a};function main(){var a=document.getElementsByTagName("body")[0];a.insertAdjacentHTML("afterbegin",'<input type="text" id="A" style="position: fixed; margin: 20px; min-width: 300px; max-width: 1000px; z-index: 999; background-color: #E7F1ED" placeholder="DL\u3057\u305f\u3044\u30ea\u30f3\u30af\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044"/>');var b=document.getElementById("A"),d=function(c){c=String(c.target.value);window.deleteElem=function(){document.getElementById("AA").remove()};a.insertAdjacentHTML("afterbegin",'<div id="AA" style="position: fixed; margin: 20px; min-width: 300px; max-width: 1000px; z-index: 999; background-color: #E7F1ED"><a href="'+c+'">\u53f3\u30af\u30ea\u30c3\u30af\u304b\u3089\u4fdd\u5b58</a><button onClick="deleteElem()">\u6d88\u3059</button></div>')};b.addEventListener("change",function(c){d(c);b.remove();b.removeEventListener("change",d,!1)});window.scrollTo(0,0)}main();
