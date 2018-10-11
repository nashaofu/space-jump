/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(
    src,
    {
      sx = 0, // 当前精灵图在原图片中的位置
      sy = 0,
      sw = 0,
      sh = 0,
      x = 0, // 要绘制到canvas中的位置
      y = 0,
      width,
      height
    } = {}
  ) {
    this.sprite = wx.createImage()
    this.sprite.src = src
    this.sx = sx
    this.sy = sy
    this.sw = sw
    this.sh = sh

    this.x = x
    this.y = y
    this.width = width === undefined ? sw : width
    this.height = height === undefined ? sh : height

    this.visible = true
  }

  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    if (!this.visible) return
    ctx.drawImage(
      this.sprite,
      this.sx,
      this.sy,
      this.sw,
      this.sh,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }
}
