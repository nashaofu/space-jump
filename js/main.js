import Land from './land'
import Player from './player'
import Audio from './base/audio'
import Platform from './platform'
import BackGround from './background'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0
    this.length = parseInt(((screenWidth / 422 + screenHeight / 552) / 2) * 10)
    this.gravity = 0.2
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.restart()
  }

  restart() {
    this.initAudio()
    this.initEvent()
    this.score = 0
    this.isOver = 0
    this.platforms = []
    this.bg = new BackGround()
    this.player = new Player()
    this.land = new Land()
    for (let i = 0; i < this.length; i++) {
      this.platforms.push(
        new Platform({
          score: this.score,
          y: (screenHeight / this.length) * i + 10 + Math.random() * 10
        })
      )
    }

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId)
    this.aniId = window.requestAnimationFrame(() => this.loop(), this.canvas)
  }

  initAudio() {
    this.bgm = new Audio('audio/bgm.mp3', {
      autoplay: true,
      loop: true
    })
    this.bgm.play()
    this.overAudio = new Audio('audio/gameover.mp3')
  }

  initEvent() {
    const touchStartHandler = this.touchStartHandler.bind(this)
    this.canvas.removeEventListener('touchstart', touchStartHandler)
    this.canvas.addEventListener('touchstart', touchStartHandler)
    const touchEndHandler = this.touchEndHandler.bind(this)
    this.canvas.removeEventListener('touchstart', touchEndHandler)
    this.canvas.addEventListener('touchend', touchEndHandler)
  }

  touchStartHandler(e) {
    e.preventDefault()
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    if (this.isOver === 3) {
      if (
        x >= screenWidth / 2 - 80 &&
        x <= screenWidth / 2 + 80 &&
        y >= screenHeight / 2 + 40 &&
        y <= screenHeight / 2 + 120
      ) {
        this.destroy()
        this.restart()
      }
    } else {
      if (y > screenHeight * 0.5) {
        if (x < screenWidth / 2) {
          this.player.setDir('left')
          this.player.isMovingLeft = true
        } else {
          this.player.setDir('right')
          this.player.isMovingRight = true
        }
      }
    }
  }

  touchEndHandler(e) {
    e.preventDefault()
    this.player.isMovingLeft = false
    this.player.isMovingRight = false
  }

  update() {
    const player = this.player
    if (this.isOver) return
    player.update()
    this.bg.update()
    // 到底之后自动向上跳跃
    if (player.y + player.height > this.land.y) {
      player.jump()
    }

    // 游戏结束
    if (player.y + player.height >= screenHeight && !this.land.visible) {
      this.isOver = 1
      this.bgm.stop()
      this.overAudio.play()
    }

    if (player.y >= screenHeight / 2 - player.height / 2) {
      player.y += player.vy
    } else {
      if (player.vy < 0) {
        this.bg.y -= player.vy
      }
      if (this.land.y > screenHeight) {
        this.land.visible = false
      }
      if (player.vy < 0 && this.land.visible) {
        this.land.y -= player.vy
      }

      // 平台往下移动，角色也往下掉
      // 不能让角色一直越调越高
      // 所以要让角色快点往下面掉落
      if (player.vy >= 0) {
        player.y += player.vy
        player.vy += this.gravity
      }
    }
    // 角色被重力拉回来
    player.vy += this.gravity
    this.upadtePlatforms()
  }

  upadtePlatforms() {
    // 判断是否落在平台上
    const player = this.player
    this.platforms.forEach((item, index) => {
      // 先变化平台位置，再执行update
      if (player.y < screenHeight / 2 - player.height / 2) {
        // 当角色跳跃高度超过屏幕一半高时移动平台位置
        if (player.vy < 0) {
          item.y -= player.vy
        }
        // 移动到屏幕外的平台回收重新绘制
        if (item.y > screenHeight) {
          // 回收一个就记下一个分数
          this.score += item.score
          item.destroy()
          this.platforms[index] = new Platform({
            score: this.score,
            y: item.y - screenHeight
          })
        }
      }
      item.update()
      // 向上跳的过程不判断，平台消失后不判断
      if (!item.visible || player.vy < 0) return
      // 判断角色是否落在平台上
      if (
        player.x + 15 < item.x + item.width &&
        player.x + player.width - 15 > item.x &&
        player.y + player.height > item.y &&
        player.y + player.height < item.y + item.height
      ) {
        if (item.type === 1) {
          player.jump()
        } else if (item.type === 2) {
          player.jump()
        } else if (item.type === 3) {
          item.visible = false
        } else if (item.type === 4) {
          item.visible = false
          player.jump()
        }
      }
      const spring = item.spring
      if (spring) {
        // Springs
        if (
          !spring.shoot &&
          player.x + 15 < spring.x + spring.width &&
          player.x + player.width - 15 > spring.x &&
          player.y + player.height > spring.y &&
          player.y + player.height < spring.y + spring.height
        ) {
          spring.setShoot()
          player.jumpHigh()
        }
      }
    })
  }

  renderScore() {
    if (this.isOver > 2) return
    //设置文本的水平对齐方式
    this.ctx.textAlign = 'left'
    //设置文本的垂直对齐方式
    this.ctx.textBaseline = 'middle'
    this.ctx.fillStyle = '#fff'
    this.ctx.font = '20px Arial'
    this.ctx.fillText(this.score, 10, 30)
  }

  renderGameOver() {
    if (!this.isOver) return
    this.player.update()
    this.platforms.forEach(item => {
      if (item.y + item.height < 0) {
        item.visible = false
        return
      }
      item.y -= 12
      item.update()
    })
    if (this.isOver === 2) {
      this.player.vy += this.gravity
      this.player.y += this.player.vy
    }

    if (this.player.y > screenHeight / 2 && this.isOver === 1) {
      this.player.y -= 8
      this.player.vy = 0
    } else if (this.player.y < screenHeight / 2) {
      this.isOver = 2
    } else if (this.player.y + this.player.height > screenHeight) {
      this.isOver = 3
      this.player.visible = false
      this.drawGrid()
      this.ctx.fillStyle = '#fff'
      //设置文本的水平对齐方式
      this.ctx.textAlign = 'center'
      //设置文本的垂直对齐方式
      this.ctx.textBaseline = 'middle'

      this.ctx.font = '40px Arial'
      this.ctx.fillText('游戏结束', screenWidth / 2, screenHeight / 2 - 100)

      this.ctx.font = '30px Arial'
      this.ctx.fillText(
        `得分: ${this.score}`,
        screenWidth / 2,
        screenHeight / 2
      )

      this.ctx.font = '20px Arial'
      this.ctx.fillText('再玩一次', screenWidth / 2, screenHeight / 2 + 80)
    }
  }

  drawGrid() {
    this.ctx.save()
    this.ctx.strokeStyle = 'rgba(0,136,255,0.7)'
    this.ctx.lineWidth = 0.5
    let step = 5
    //画竖线
    for (let i = step + 0.5; i < screenWidth; i += step) {
      this.ctx.beginPath()
      this.ctx.moveTo(i, 0)
      this.ctx.lineTo(i, screenHeight)
      this.ctx.stroke()
    }
    //画横线
    for (let i = step + 0.5; i < screenHeight; i += step) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, i)
      this.ctx.lineTo(screenWidth, i)
      this.ctx.stroke()
    }
    this.ctx.restore()
  }

  destroy() {
    this.bgm.destroy()
    this.overAudio.destroy()
    this.player.destroy()
    this.platforms.forEach(item => item.destroy())
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    this.update()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.bg.render(this.ctx)
    this.land.drawToCanvas(this.ctx)
    this.platforms.forEach(item => item.render(this.ctx))
    this.player.drawToCanvas(this.ctx)
    this.renderScore()
    this.renderGameOver()
  }

  // 实现游戏帧循环
  loop() {
    this.render()
    this.aniId = window.requestAnimationFrame(() => this.loop(), this.canvas)
  }
}
