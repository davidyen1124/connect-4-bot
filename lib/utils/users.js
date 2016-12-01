module.exports = {
  getUserIds: (users, excludeUserNames = [], excludeUserIds = []) => {
    return users
    .filter((user) => {
      return excludeUserNames.indexOf(user.name) === -1 && excludeUserIds.indexOf(user.id) === -1
    }).map((user) => {
      return `<@${user.id}>`
    })
  },
  getInvitedUserId: (message) => {
    const triggerWord = /play\s+<@(.*?)>/i
    const triggerMatch = message.match(triggerWord)

    return triggerMatch ? triggerMatch[1] : null
  },
  isInvitedUserValid: (invitedUserId, userIdList) => {
    return userIdList.indexOf(`<@${invitedUserId}>`) > -1
  }
}
