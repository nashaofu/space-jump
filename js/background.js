import Sprite from './base/sprite'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC = 'images/bg.png'
const BG_WIDTH = 512
const BG_HEIGHT = 512

/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class BackGround extends Sprite {
  constructor() {
    super(BG_IMG_SRC, {
      sw: BG_WIDTH,
      sh: BG_HEIGHT,
      width: screenWidth,
      height: (screenWidth / BG_WIDTH) * BG_HEIGHT
    })
  }

  drawRow(ctx, dy = 0) {
    let length = Math.ceil(screenWidth / this.width)
    for (let i = 0; i < length; i++) {
      ctx.drawImage(
        this.sprite,
        this.sx,
        this.sy,
        this.sw,
        this.sh,
        i * this.width,
        dy,
        this.width,
        this.height
      )
    }
  }

  update() {
    let length = Math.ceil(screenHeight / this.height)
    // 让画面连续滚动
    if (this.y > screenHeight) {
      this.y = this.y - length * this.height
    }
  }

  /**
   * 背景图重绘函数
   * 绘制两张图片，两张图片大小和屏幕一致
   * 第一张漏出高度为top部分，其余的隐藏在屏幕上面
   * 第二张补全除了top高度之外的部分，其余的隐藏在屏幕下面
   * @param {*} ctx canvas对象
   */
  render(ctx) {
    let length = Math.ceil(screenHeight / this.height)
    for (let i = -length; i < length; i++) {
      this.drawRow(ctx, this.y + i * this.height)
    }
  }
}
