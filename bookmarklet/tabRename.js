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
