function main() {
  const uniqueId = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
  const style = 'position: fixed; margin: 20px; min-width: 300px; max-width: 1000px; z-index: 999; background-color: #E7F1ED'
  const input = `<input type="text" id="${uniqueId}" style="${style}" placeholder="上書きしたいタブ名を入力"/>`
  const body = document.getElementsByTagName('body')[0]
  body.insertAdjacentHTML('afterbegin', input)
  const eventTargetTag = document.getElementById(uniqueId)
  const changeTitle = (event) => document.title = event.target.value
  eventTargetTag.addEventListener('change', (event) => {
    changeTitle(event)
    eventTargetTag.remove()
    eventTargetTag.removeEventListener('change',
      changeTitle,
      false
    )
  })
  window.scrollTo(0,0)
}
main()

javascript:var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.createTemplateTagFirstArg=function(a){return a.raw=a};$jscomp.createTemplateTagFirstArgWithRaw=function(a,b){a.raw=b;return a};function main(){document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin",'<input type="text" id="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" style="margin: 20px; min-width: 300px; max-width: 1000px; z-index: 999; background-color: #E7F1ED" placeholder="\u4e0a\u66f8\u304d\u3057\u305f\u3044\u30bf\u30d6\u540d\u3092\u5165\u529b"/>');var a=document.getElementById("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"),b=function(c){return document.title=c.target.value};a.addEventListener("change",function(c){b(c);a.remove();a.removeEventListener("change",b,!1)});window.scrollTo(0,0)}main();
