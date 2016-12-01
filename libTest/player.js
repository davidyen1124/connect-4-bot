const {expect} = require('chai')
const Player = require('../lib/player')
const {YELLOW, EMOJIS} = require('../lib/constants')

let player
const id = '404'
const color = YELLOW

beforeEach(() => {
  player = new Player(id, color)
})

describe('Player', () => {
  it('should return correct properties', () => {
    expect(player.getId()).to.equal(id)
    expect(player.getColor()).to.equal(color)
    expect(player.getEmoji()).to.equal(EMOJIS[color])
  })
})
