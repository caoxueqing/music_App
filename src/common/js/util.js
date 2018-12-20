export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = _arr.length - 1; i >= 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1))
    let itemAtIndex = _arr[randomIndex]
    _arr[randomIndex] = _arr[i]
    _arr[i] = itemAtIndex
  }
  return _arr
}

export function debounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
