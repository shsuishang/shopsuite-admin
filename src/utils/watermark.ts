const watermark = {}

const setWatermark = (str: string) => {
  const id = '1.23452384164.123412416'

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id) as HTMLElement)
  }

  const can = document.createElement('canvas')
  can.width = 200
  can.height = 200

  const canvas = can.getContext('2d')
  if (canvas) {
    canvas.rotate((-15 * Math.PI) / 180)
    canvas.font = '15px Vedana'
    canvas.fillStyle = 'rgba(200, 200, 200, 0.60)'
    canvas.textAlign = 'left'
    canvas.textBaseline = 'middle'
    canvas.fillText(str, can.width / 8, can.height / 2)
  }
  const div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '30px'
  div.style.left = '0px'
  div.style.position = 'fixed'
  div.style.zIndex = '100000'
  div.style.width = document.documentElement.clientWidth + 'px'
  div.style.height = document.documentElement.clientHeight + 'px'
  div.style.background =
    'url(' + can.toDataURL('image/png') + ') left top repeat'
  document.body.appendChild(div)
  return id
}
//@ts-ignore
watermark.set = (str: any) => {
  let id = setWatermark(str)
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str)
    }
  }, 500)
  window.onresize = () => {
    setWatermark(str)
  }
}

export default watermark
