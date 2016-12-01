const Promise = require('bluebird')
const slack = require('slack')

const chat = Promise.promisifyAll(slack.chat)
const mpim = Promise.promisifyAll(slack.mpim)

const sendMessage = async (token, channel, message) => {
  return chat.postMessageAsync({
    token,
    channel,
    link_names: 1,
    text: message
  })
}

module.exports = {
  rtm: slack.rtm,
  openMpim: async (token, users) => {
    const result = await mpim.openAsync({
      token,
      users: users.join(',')
    })
    return result.group.id
  },
  sendSuggestedUsersMessage: async (token, channel, userIdList) => {
    const message = `Please specify a user to play connect :four:.\n\n${userIdList.join(' ')}`
    await sendMessage(token, channel, message)
  },
  sendInvalidColumnMessage: async (token, channel, playerId) => {
    const message = `<@${playerId}>, Please choose a :1234: between :one: ~ :seven:.`
    await sendMessage(token, channel, message)
  },
  sendColumnFullMessage: async (token, channel, playerId, column) => {
    const message = `<@${playerId}>, \`column ${column + 1}\` is :u6e80:, please choose another one.`
    await sendMessage(token, channel, message)
  },
  sendNotPlayersTurnMessage: async (token, channel, waitPlayerId, currentPlayerId) => {
    const message = `:no_good: <@${waitPlayerId}>, wait for <@${currentPlayerId}>'s move.`
    await sendMessage(token, channel, message)
  },
  sendPlayersTurnMessage: async (token, channel, playerEmoji, playerId) => {
    const message = `${playerEmoji} <@${playerId}>, it's your turn.`
    await sendMessage(token, channel, message)
  },
  sendWonMessage: async (token, channel, playerId) => {
    const message = `:tada: <@${playerId}>, you WIN!`
    await sendMessage(token, channel, message)
  },
  sendTieMessage: async (token, channel, playerId) => {
    const message = `:frowning: It's a tie game.`
    await sendMessage(token, channel, message)
  },
  sendMessage
}
