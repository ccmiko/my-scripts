function main() {
  const body = document.getElementsByTagName('body')[0]
  const style = 'position: fixed; margin: 20px; min-width: 300px; max-width: 1000px; z-index: 999; background-color: #E7F1ED'

  const inputUniqueId = 'A'
  const input = `<input type="text" id="${inputUniqueId}" style="${style}" placeholder="DLしたいリンクを入力してください"/>`
  body.insertAdjacentHTML('afterbegin', input)
  const inputElem = document.getElementById(inputUniqueId)
  const createLink = (event) => {
    const link = String(event.target.value)
    const aUniqueId = 'AA'
    window.deleteElem = () => {
      document.getElementById(aUniqueId).remove()
    }
    const element = `<div id="${aUniqueId}" style="${style}"><a href="${link}">右クリックから保存</a><button onClick="deleteElem()">消す</button></div>`
    body.insertAdjacentHTML('afterbegin', element)
  }

  inputElem.addEventListener('change', (event) => {
    createLink(event)
    inputElem.remove()
    inputElem.removeEventListener('change', createLink, false)
  })
  window.scrollTo(0,0)
}
main()
