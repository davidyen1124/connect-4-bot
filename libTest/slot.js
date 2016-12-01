const {expect} = require('chai')
const Slot = require('../lib/slot')
const {WHITE, BLACK, YELLOW, EMOJIS} = require('../lib/constants')

const slotRow = 2
const slotCol = 3

let slot

describe('Slot', () => {
  beforeEach(() => {
    slot = new Slot(slotRow, slotCol)
  })

  describe('create an empty slot', () => {
    it('should be in correct position', () => {
      expect(slot.getRow()).equal(slotRow)
      expect(slot.getCol()).equal(slotCol)

      expect(slot.isEmpty()).equal(true)

      expect(slot.getColor()).equal(WHITE)
      expect(slot.getEmoji()).equal(EMOJIS[WHITE])
    })
  })

  describe('set color against an empty slot', () => {
    it('should change the color', () => {
      slot.setColor(BLACK)
      expect(slot.getRow()).equal(slotRow)
      expect(slot.getCol()).equal(slotCol)

      expect(slot.isEmpty()).equal(false)

      expect(slot.getColor()).equal(BLACK)
      expect(slot.getEmoji()).equal(EMOJIS[BLACK])
    })
  })

  describe('set color against an non-empty slot', () => {
    it('should not change the color', () => {
      slot.setColor(BLACK)
      slot.setColor(YELLOW)
      expect(slot.getRow()).equal(slotRow)
      expect(slot.getCol()).equal(slotCol)

      expect(slot.isEmpty()).equal(false)

      expect(slot.getColor()).equal(BLACK)
      expect(slot.getEmoji()).equal(EMOJIS[BLACK])
    })
  })
})
