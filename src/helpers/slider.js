export const calculateChange = (e, skip, props, container) => {
  e.preventDefault()
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight
  let x = typeof e.pageX === 'number'
    ? e.pageX
    : e.touches[0].pageX
  let y = typeof e.pageY === 'number'
    ? e.pageY
    : e.touches[0].pageY

  let currentX = container.getBoundingClientRect().left + window.pageXOffset
  let currentY = container.getBoundingClientRect().top + window.pageYOffset

  //logarithmic scale
  if (props.logarithmicScale) {
    x = Math.log(x) / Math.log(10)
    x = Math.log(y) / Math.log(10)
    currentX = Math.log(currentX) / Math.log(10)
    currentY = Math.log(currentY) / Math.log(10)
  }

  const left = x - currentX
  const top = y - currentY

  if (props.direction === 'vertical') {
    let offset;
    if (top < 0) {
      offset =100
    } else if (top > containerHeight) {
      offset = 0
    } else {
      offset = Math.round(100 - (top * 100) / containerHeight)
    }
    return offset;
  }else{
    let offset;
    if (left < 0) {
      offset =0
    } else if (left > containerWidth) {
      offset = 100
    } else {
      offset = Math.round((left * 100) / containerWidth)
    }
    return offset;
  }
}
