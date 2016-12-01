const {expect} = require('chai')
const Game = require('../lib/game')
const Slot = require('../lib/slot')
const {HEIGHT, WIDTH, WHITE, YELLOW, BLACK, EMOJIS, NUMBERS} = require('../lib/constants')

let game
const column = 2
beforeEach(() => {
  game = new Game('0', '1')
})

describe('Game', () => {
  describe('initialize', () => {
    it('should be 6x7', () => {
      expect(game.board.length).to.equal(HEIGHT)
      for (let i = 0; i < game.board.length; i++) {
        expect(game.board[i].length).to.equal(WIDTH)
      }
    })

    it('should be empty', () => {
      for (let i = 0; i < game.board.length; i++) {
        for (let j = 0; j < game.board[i].length; j++) {
          expect(game.board[i][j]).deep.to.equal(new Slot(i, j))
        }
      }
    })

    it('should print empty board', () => {
      const board = game.printBoard().trim()
      const rows = board.split('\n')
      expect(rows.length).to.equal(HEIGHT + 1)

      for (let i = 0; i < rows.length; i++) {
        let line = ''
        if (i < rows.length - 1) {
          line = EMOJIS[WHITE].repeat(WIDTH)
        } else {
          for (let j = 0; j < WIDTH; j++) {
            line += NUMBERS[j + 1]
          }
        }
        expect(rows[i]).to.equal(line)
      }
    })
  })

  describe('make one move', () => {
    describe('on valid column', () => {
      it('should be true', () => {
        expect(Game.isValidColumn(5)).to.be.true
      })

      it('should not be full', () => {
        game.makeMove(column, YELLOW)

        expect(game.isColumnFull(column)).to.be.false
      })
    })

    describe('on invalid column', () => {
      it('should be false', () => {
        expect(Game.isValidColumn(-1)).to.be.false
        expect(Game.isValidColumn(90)).to.be.false
      })
    })

    describe('on column without slot', () => {
      it('should stay on first row', () => {
        game.makeMove(column, YELLOW)

        for (let i = 0; i < HEIGHT; i++) {
          expect(game.board[i][column].getColor()).to.equal(i === 0 ? YELLOW : WHITE)
        }
      })
    })

    describe('on column with full slots', () => {
      it('should stay the same', () => {
        for (let i = 0; i < HEIGHT + 1; i++) {
          game.makeMove(column, YELLOW)
        }

        for (let i = 0; i < HEIGHT; i++) {
          expect(game.board[i][column].getColor()).to.equal(YELLOW)
        }
      })
    })
  })

  describe('make multiple moves', () => {
    describe('on column', () => {
      it('should stack up', () => {
        game.makeMove(column, YELLOW)
        game.makeMove(column, YELLOW)

        for (let i = 0; i < HEIGHT; i++) {
          expect(game.board[i][column].getColor()).to.equal((i === 0 || i === 1) ? YELLOW : WHITE)
        }
      })
    })

    describe('on column until full', () => {
      it('should be full', () => {
        for (let i = 0; i < HEIGHT; i++) {
          game.makeMove(column, YELLOW)
        }

        expect(game.isColumnFull(column)).to.be.true
      })
    })
  })

  describe('change player', () => {
    it('should be first player at first', () => {
      expect(game.getCurrentPlayer()).to.deep.equal(game.firstPlayer)
    })

    it('should change current player after one successful move', () => {
      game.makeMove(column)
      expect(game.getCurrentPlayer()).to.deep.equal(game.secondPlayer)
    })
  })

  describe('is player\'s move', () => {
    it('should return true for current player', () => {
      expect(game.isPlayersMove(game.firstPlayer.getId())).to.be.true
      expect(game.isPlayersMove(game.secondPlayer.getId())).to.be.false
    })
  })

  describe('check winner', () => {
    it('vertically', () => {
      game.makeMove(column, YELLOW)
      expect(game.hasWinner()).to.be.false

      game.makeMove(column, YELLOW)
      expect(game.hasWinner()).to.be.false

      game.makeMove(column, YELLOW)
      expect(game.hasWinner()).to.be.false

      game.makeMove(column, YELLOW)
      expect(game.hasWinner()).to.be.true
    })

    it('horizontally', () => {
      game.makeMove(0, YELLOW)
      expect(game.hasWinner()).to.be.false

      game.makeMove(1, YELLOW)
      expect(game.hasWinner()).to.be.false

      game.makeMove(2, YELLOW)
      expect(game.hasWinner()).to.be.false

      game.makeMove(3, YELLOW)
      expect(game.hasWinner()).to.be.true
    })

    it('right diagonal', () => {
      game.makeMove(0, YELLOW)
      expect(game.hasWinner()).to.be.false

      game.makeMove(1, BLACK)
      expect(game.hasWinner()).to.be.false
      game.makeMove(1, YELLOW)
      expect(game.hasWinner()).to.be.false

      game.makeMove(2, BLACK)
      expect(game.hasWinner()).to.be.false
      game.makeMove(2, BLACK)
      expect(game.hasWinner()).to.be.false
      game.makeMove(2, YELLOW)
      expect(game.hasWinner()).to.be.false

      game.makeMove(3, BLACK)
      expect(game.hasWinner()).to.be.false
      game.makeMove(3, BLACK)
      expect(game.hasWinner()).to.be.false
      game.makeMove(3, BLACK)
      expect(game.hasWinner()).to.be.false
      game.makeMove(3, YELLOW)
      expect(game.hasWinner()).to.be.true
    })

    it('left diagonal', () => {
      game.makeMove(3, YELLOW)
      expect(game.hasWinner()).to.be.false

      game.makeMove(2, BLACK)
      expect(game.hasWinner()).to.be.false
      game.makeMove(2, YELLOW)
      expect(game.hasWinner()).to.be.false

      game.makeMove(1, BLACK)
      expect(game.hasWinner()).to.be.false
      game.makeMove(1, BLACK)
      expect(game.hasWinner()).to.be.false
      game.makeMove(1, YELLOW)
      expect(game.hasWinner()).to.be.false

      game.makeMove(0, BLACK)
      expect(game.hasWinner()).to.be.false
      game.makeMove(0, BLACK)
      expect(game.hasWinner()).to.be.false
      game.makeMove(0, BLACK)
      expect(game.hasWinner()).to.be.false
      game.makeMove(0, YELLOW)
      expect(game.hasWinner()).to.be.true
    })
  })

  describe('check tie', () => {
    it('on nonfull board', () => {
      game.makeMove(0, YELLOW)
      expect(game.isTie()).to.be.false
    })

    it('on full board', () => {
      for (let i = 0; i < HEIGHT; i++) {
        for (let j = 0; j < WIDTH; j++) {
          game.makeMove(j, (j + i) % 2 ? YELLOW : BLACK)
        }
      }

      expect(game.isTie()).to.be.true
    })
  })
})
