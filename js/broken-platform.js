import Sprite from './base/sprite'

const screenHeight = window.innerHeight

const BROKENPLATFORM_IMG_SRC = 'images/sprite.png'
const BROKENPLATFORM_WIDTH = 105
const BROKENPLATFORM_HEIGHT = 60

export default class BrokenPlatform extends Sprite {
  static vy = 8
  constructor({ x = 0, y = 0 }) {
    super(BROKENPLATFORM_IMG_SRC, {
      sx: 0,
      sy: 554,
      sw: BROKENPLATFORM_WIDTH,
      sh: BROKENPLATFORM_HEIGHT,
      x,
      y,
      width: 70,
      height: 30
    })
  }

  update() {
    if (this.y <= screenHeight) {
      this.y += BrokenPlatform.vy
    } else {
      this.visible = false
    }
  }
}
