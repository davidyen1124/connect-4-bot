require('dotenv').config()
const {rtm, openMpim, sendSuggestedUsersMessage, sendInvalidColumnMessage, sendColumnFullMessage, sendNotPlayersTurnMessage, sendPlayersTurnMessage, sendMessage, sendWonMessage} = require('./lib/utils/slack')
const {getUserIds, getInvitedUserId, isInvitedUserValid} = require('./lib/utils/users')
const Game = require('./lib/game')

const token = process.env.SLACK_TOKEN
const bot = rtm.client()

let botName = ''
let users
const games = {}

bot.started((payload) => {
  if (!payload.ok) {
    throw new Error('Payload is not OK')
  }

  botName = payload.self.name
  users = payload.users

  console.log('botName:', botName)
})

bot.message(async (message) => {
  if (message.username && message.username === botName) return
  console.log(message)

  const userIdList = getUserIds(users, [botName, 'slackbot'], [message.user])
  const text = message.text
  const channel = message.channel
  const userId = message.user

  if (channel in games) {
    const game = games[channel]

    if (text === 'show') {
      await sendMessage(token, channel, game.printBoard())
      const currentPlayer = game.getCurrentPlayer()
      await sendPlayersTurnMessage(token, channel, currentPlayer.getEmoji(), currentPlayer.getId())
      return
    }

    let column = parseInt(text)

    if (!game.isPlayersMove(userId)) {
      await sendNotPlayersTurnMessage(token, channel, userId, game.getCurrentPlayer().getId())
      return
    }

    if (!Game.isValidColumn(column)) {
      await sendInvalidColumnMessage(token, channel, userId)
      return
    }
    column--

    if (game.isColumnFull(column)) {
      await sendColumnFullMessage(token, channel, userId, column)
      return
    }

    game.makeMove(column)
    await sendMessage(token, channel, game.printBoard())

    if (game.hasWinner()) {
      await sendWonMessage(token, channel, userId)
      delete games[channel]
    } else {
      const currentPlayer = game.getCurrentPlayer()
      await sendPlayersTurnMessage(token, channel, currentPlayer.getEmoji(), currentPlayer.getId())
    }
  } else {
    const invitedUserId = getInvitedUserId(text)
    if (!invitedUserId || !isInvitedUserValid(invitedUserId, userIdList)) {
      await sendSuggestedUsersMessage(token, channel, userIdList)
      return
    }

    const mpimChannel = await openMpim(token, [userId, invitedUserId])
    const game = new Game(userId, invitedUserId)
    games[mpimChannel] = game

    await sendMessage(token, mpimChannel, game.printBoard())
    const currentPlayer = game.getCurrentPlayer()
    await sendPlayersTurnMessage(token, mpimChannel, currentPlayer.getEmoji(), currentPlayer.getId())
  }
})

bot.listen({token})
