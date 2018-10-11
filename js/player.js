import Audio from './base/audio'
import Sprite from './base/sprite'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 玩家相关常量设置
const PLAYER_IMG_SRC = 'images/sprite.png'
const PLAYER_WIDTH = 110
const PLAYER_HEIGHT = 80

export default class Player extends Sprite {
  constructor() {
    super(PLAYER_IMG_SRC, {
      sx: 0,
      sy: 201,
      sw: PLAYER_WIDTH,
      sh: PLAYER_HEIGHT,
      width: 55,
      height: 40
    })
    // 玩家默认处于屏幕底部居中位置
    this.x = screenWidth / 2 - this.width / 2
    this.y = screenHeight - this.height - 30

    this.vx = 0 // 水平移动速度
    this.vy = 11 // 垂直移动速度
    this.isMovingLeft = false
    this.isMovingRight = false
    // 玩家初始状态
    this.dir = 'left'
    this.jumpAudio = new Audio('audio/jump.mp3')
    this.jumpHighAudio = new Audio('audio/jump-high.mp3')
  }

  setDir(dir) {
    this.dir = dir
    if (this.dir == 'right') this.sy = 121
    else if (this.dir == 'left') this.sy = 201
    else if (this.dir == 'right_land') this.sy = 289
    else if (this.dir == 'left_land') this.sy = 371
  }

  jump() {
    this.jumpHighAudio.stop()
    this.jumpAudio.seek(0)
    this.jumpAudio.play()
    this.vy = -8
  }

  jumpHigh() {
    this.jumpAudio.stop()
    this.jumpHighAudio.seek(0)
    this.jumpHighAudio.play()
    this.vy = -16
  }

  update() {
    if (this.dir === 'left') {
      if (this.vy < -7 && this.vy > -15) this.setDir('left_land')
    } else if (this.dir === 'right') {
      if (this.vy < -7 && this.vy > -15) this.setDir('right_land')
    }

    // 左右移动角色
    if (this.isMovingLeft === true) {
      this.x += this.vx
      this.vx -= 0.15
    } else {
      this.x += this.vx
      if (this.vx < 0) this.vx += 0.1
    }

    if (this.isMovingRight === true) {
      this.x += this.vx
      this.vx += 0.15
    } else {
      this.x += this.vx
      if (this.vx > 0) this.vx -= 0.1
    }

    if (this.vx > 8) this.vx = 8
    else if (this.vx < -8) this.vx = -8
    if (this.x > screenWidth) this.x = -this.width
    else if (this.x < -this.width) this.x = screenWidth
  }

  destroy() {
    this.jumpAudio.destroy()
    this.jumpHighAudio.destroy()
  }
}
