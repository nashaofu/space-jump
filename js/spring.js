import Sprite from './base/sprite'

const screenHeight = window.innerHeight

const SPRING_IMG_SRC = 'images/sprite.png'
const SPRING_WIDTH = 45
const SPRING_HEIGHT = 53

export default class Spring extends Sprite {
  constructor() {
    super(SPRING_IMG_SRC, {
      sx: 0,
      sy: 445,
      sw: SPRING_WIDTH,
      sh: SPRING_HEIGHT,
      width: 26,
      height: 30
    })

    this.shoot = false
  }

  setShoot() {
    this.shoot = true
    this.sy = 501
  }

  setXy(x, y) {
    this.x = x
    this.y = y
  }

  update(x, y) {
    this.setXy(x, y)
    if (this.y > screenHeight) {
      this.visible = false
    }
  }
}
