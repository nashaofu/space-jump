import Spring from './spring'
import Sprite from './base/sprite'
import BrokenPlatform from './broken-platform'

const screenWidth = window.innerWidth

const PLATFORM_IMG_SRC = 'images/sprite.png'
const PLATFORM_WIDTH = 105
const PLATFORM_HEIGHT = 31

export default class Platform extends Sprite {
  static broken = 0
  static spring = 0
  constructor({ score, y }) {
    super(PLATFORM_IMG_SRC, {
      sx: 0,
      sy: 0,
      sw: PLATFORM_WIDTH,
      sh: PLATFORM_HEIGHT,
      width: 70,
      height: 17
    })
    this.x = Math.random() * (screenWidth - this.width)
    this.y = y
    // Platform types
    // 1: 正常的
    // 2: 移动的
    // 3: 断的
    // 4: 会消失的
    // 5: 会消切会移动的
    // Setting the probability of which type of platforms should be shown at what score
    let types = [1]
    if (score >= 5000) {
      types = [2, 3, 3, 3, 4, 4, 4, 4]
    } else if (score >= 2000 && score < 5000) {
      types = [2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4]
    } else if (score >= 1000 && score < 2000) {
      types = [2, 2, 2, 3, 3, 3, 3, 3]
    } else if (score >= 500 && score < 1000) {
      types = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3]
    } else if (score >= 100 && score < 500) {
      types = [1, 1, 1, 1, 2, 2]
    }
    this.type = types[Math.floor(Math.random() * types.length)]
    // 不能连续有两个断的平台
    // 否则会永远跳不过
    if (this.type == 3 && Platform.broken < 1) {
      Platform.broken++
    } else if (this.type == 3 && Platform.broken >= 1) {
      this.type = 1
      Platform.broken = 0
    }

    if (this.type === 1) {
      this.sy = 0
      this.score = 10
    } else if (this.type === 2) {
      this.sy = 61
      this.score = 20
      const random = Math.random()
      this.vx = random > 0.5 ? -random * 0.2 - 0.8 : random * 0.2 + 0.8
    } else if (this.type === 3) {
      this.sy = 31
      this.score = 30
      this.brokenPlatform = null
    } else if (this.type === 4) {
      this.sy = 90
      this.score = 30
    }

    if (
      (this.type === 1 || this.type === 2) &&
      Platform.spring < 2 &&
      Math.random() < 0.05
    ) {
      Platform.spring++
      this.spring = new Spring()
      const x = this.x + (this.width - this.spring.width) / 2
      const y = this.y - this.spring.height
      this.spring.setXy(x, y)
    }
  }

  update() {
    if (this.x <= 0 || this.x + this.width >= screenWidth) {
      this.vx = -this.vx
    }
    if (this.type === 2) {
      this.x += this.vx
    }
    if (!this.visible && this.type === 3) {
      if (!this.brokenPlatform) {
        this.brokenPlatform = new BrokenPlatform({ x: this.x, y: this.y })
      } else {
        this.brokenPlatform.update()
      }
    }
    if (this.spring) {
      const x = this.x + (this.width - this.spring.width) / 2
      const y = this.y - this.spring.height + 5
      this.spring.update(x, y)
    }
  }

  destroy() {
    if (this.spring) {
      Platform.spring--
    }
    this.brokenPlatform = null
    this.spring = null
  }

  render(ctx) {
    this.drawToCanvas(ctx)
    if (this.brokenPlatform) {
      this.brokenPlatform.drawToCanvas(ctx)
    }
    if (this.spring) {
      this.spring.drawToCanvas(ctx)
    }
  }
}
