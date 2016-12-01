require('dotenv').config()
const {rtm, openMpim, sendSuggestedUsersMessage, sendInvalidColumnMessage, sendColumnFullMessage, sendNotPlayersTurnMessage, sendPlayersTurnMessage, sendMessage, sendWonMessage} = require('./lib/utils/slack')
const {getUserIds, getInvitedUserId, isInvitedUserValid} = require('./lib/utils/users')
const Game = require('./lib/game')

const token = process.env.SLACK_TOKEN
const bot = rtm.client()

let botName
let botId
let users
const groups = {}
const games = {}

bot.started((payload) => {
  if (!payload.ok) {
    throw new Error('Payload is not OK')
  }

  botName = payload.self.name
  botId = payload.self.id
  users = payload.users

  for (let i = 0; i < payload.groups.length; i++) {
    const group = payload.groups[i]
    groups[group.id] = group
  }

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

    if (/show.*/i.test(text)) {
      await sendMessage(token, channel, game.printBoard())
      const currentPlayer = game.getCurrentPlayer()
      await sendPlayersTurnMessage(token, channel, currentPlayer.getEmoji(), currentPlayer.getId())
      return
    }

    let column = parseInt(text) - 1
    if (isNaN(column)) {
      return
    }

    if (!game.isPlayersMove(userId)) {
      const currentPlayer = game.getCurrentPlayer()
      await sendNotPlayersTurnMessage(token, channel, userId, currentPlayer.getId())
      return
    }

    if (!Game.isValidColumn(column)) {
      await sendInvalidColumnMessage(token, channel, userId)
      return
    }

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
    if (!/play.*/i.test(text)) {
      return
    }

    let mpimChannel
    let game
    if (channel in groups) {
      mpimChannel = channel

      const members = groups[channel].members
      if (members.length !== 3) {
        await sendSuggestedUsersMessage(token, channel, userIdList)
        return
      }
      members.splice(members.indexOf(botId), 1)

      game = new Game(members[0], members[1])
      games[channel] = game
    } else {
      const invitedUserId = getInvitedUserId(text)
      if (!invitedUserId || !isInvitedUserValid(invitedUserId, userIdList)) {
        await sendSuggestedUsersMessage(token, channel, userIdList)
        return
      }

      mpimChannel = await openMpim(token, [userId, invitedUserId])
      game = new Game(userId, invitedUserId)
      games[mpimChannel] = game
    }

    await sendMessage(token, mpimChannel, game.printBoard())
    const currentPlayer = game.getCurrentPlayer()
    await sendPlayersTurnMessage(token, mpimChannel, currentPlayer.getEmoji(), currentPlayer.getId())
  }
})

bot.listen({token})
