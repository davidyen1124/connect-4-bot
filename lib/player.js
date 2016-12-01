const {EMOJIS} = require('./constants')

module.exports = class Player {
  constructor (id, color) {
    this.id = id
    this.color = color
  }

  getId () {
    return this.id
  }

  getColor () {
    return this.color
  }

  getEmoji () {
    return EMOJIS[this.color]
  }
}
