const Slot = require('./slot')
const {HEIGHT, WIDTH, BLACK, YELLOW, NUMBERS} = require('./constants')
const Player = require('./player')

module.exports = class ConnectFour {
  constructor (firstPlayerId, secondPlayerId) {
    this.board = []
    for (let i = 0; i < HEIGHT; i++) {
      const row = []
      for (let j = 0; j < WIDTH; j++) {
        row.push(new Slot(i, j))
      }
      this.board.push(row)
    }

    this.firstPlayer = new Player(firstPlayerId, YELLOW)
    this.secondPlayer = new Player(secondPlayerId, BLACK)
    this.lastPlayer = this.currentPlayer = this.firstPlayer
  }

  printBoard () {
    let output = ''
    for (let i = HEIGHT - 1; i >= 0; i--) {
      for (let j = 0; j < WIDTH; j++) {
        output += this.board[i][j].getEmoji()
      }
      output += '\n'
    }
    for (let i = 0; i < WIDTH; i++) {
      output += NUMBERS[i + 1]
    }

    return output
  }

  makeMove (col, color = '') {
    let row = 0
    for (row = 0; row < HEIGHT; row++) {
      if (this.board[row][col].isEmpty()) {
        if (color) {
          this.board[row][col].setColor(color)
        } else {
          const player = this.getCurrentPlayer()
          this.board[row][col].setColor(player.getColor())
        }
        this.lastSlot = this.board[row][col]
        break
      }
    }

    if (!color) {
      this.lastPlayer = this.currentPlayer
      this.currentPlayer = this.currentPlayer === this.firstPlayer ? this.secondPlayer : this.firstPlayer
    }

    return row
  }

  isColumnFull (col) {
    return !this.board[this.board.length - 1][col].isEmpty()
  }

  isDraw () {
    for (let i = 0; i < WIDTH; i++) {
      if (!this.isColumnFull(i)) {
        return false
      }
    }

    return true
  }

  isPlayersMove (id) {
    return this.currentPlayer.getId() === id
  }

  getCurrentPlayer () {
    return this.currentPlayer
  }

  checkHorizontalLine () {
    const row = this.lastSlot.getRow()

    let line = ''
    for (let deltaX = 0; deltaX < WIDTH; deltaX++) {
      line += this.board[row][deltaX].getEmoji()
    }

    const winnerString = this.lastPlayer.getEmoji().repeat(4)
    return line.indexOf(winnerString) > -1
  }

  checkVerticalLine () {
    const col = this.lastSlot.getCol()

    let line = ''
    for (let deltaY = 0; deltaY < HEIGHT; deltaY++) {
      line += this.board[deltaY][col].getEmoji()
    }

    const winnerString = this.lastPlayer.getEmoji().repeat(4)
    return line.indexOf(winnerString) > -1
  }

  checkRightDiagonal () {
    let row = this.lastSlot.getRow()
    let col = this.lastSlot.getCol()

    let line = ''
    while (row > 0 && col > 0) {
      row--
      col--
    }

    while (row < HEIGHT && col < WIDTH) {
      line += this.board[row][col].getEmoji()
      row++
      col++
    }

    const winnerString = this.lastPlayer.getEmoji().repeat(4)
    return line.indexOf(winnerString) > -1
  }

  checkLeftDiagonal () {
    let row = this.lastSlot.getRow()
    let col = this.lastSlot.getCol()

    let line = ''
    while (row > 0 && col < WIDTH - 1) {
      row--
      col++
    }

    while (row < HEIGHT && col >= 0) {
      line += this.board[row][col].getEmoji()
      row++
      col--
    }

    const winnerString = this.lastPlayer.getEmoji().repeat(4)
    return line.indexOf(winnerString) > -1
  }

  hasWinner () {
    return this.checkHorizontalLine() ||
      this.checkVerticalLine() ||
      this.checkRightDiagonal() ||
      this.checkLeftDiagonal()
  }

  static isValidColumn (column) {
    return column >= 0 && column < WIDTH
  }
}
