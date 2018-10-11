export default class Audio {
  constructor(
    src,
    { autoplay = false, loop = false, obeyMuteSwitch = false } = {}
  ) {
    this.audio = wx.createInnerAudioContext()
    this.audio.autoplay = autoplay
    this.audio.loop = loop
    this.obeyMuteSwitch = obeyMuteSwitch
    this.audio.src = src
  }

  play() {
    this.audio.play()
  }

  pause() {
    this.audio.pause()
  }

  stop() {
    this.audio.stop()
  }

  seek(pos) {
    this.audio.seek(pos)
  }

  destroy() {
    this.audio.destroy()
  }
}
