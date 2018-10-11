import Sprite from './base/sprite'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const LAND_IMG_SRC = 'images/land.png'
const LAND_WIDTH = 100
const LAND_HEIGHT = 5

export default class Land extends Sprite {
  constructor() {
    super(LAND_IMG_SRC, {
      sx: 0,
      sy: 0,
      sw: LAND_WIDTH,
      sh: LAND_HEIGHT
    })
    this.y = screenHeight - this.height
  }
  drawToCanvas(ctx) {
    if (!this.visible) return
    let length = (length = Math.ceil(screenWidth / this.width))
    for (let i = 0; i < length; i++) {
      ctx.drawImage(
        this.sprite,
        this.sx,
        this.sy,
        this.sw,
        this.sh,
        i * this.width,
        this.y,
        this.width,
        this.height
      )
    }
  }
}
