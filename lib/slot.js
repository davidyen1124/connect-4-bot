const {WHITE, EMOJIS} = require('./constants')

module.exports = class Slot {
  constructor (row, col) {
    this.row = row
    this.col = col

    this.empty = true
    this.color = WHITE
  }

  getRow () {
    return this.row
  }

  getCol () {
    return this.col
  }

  isEmpty () {
    return this.empty
  }

  setColor (color) {
    if (!this.empty) return

    this.empty = false
    this.color = color
  }

  getColor () {
    return this.color
  }

  getEmoji () {
    return EMOJIS[this.color]
  }
}
