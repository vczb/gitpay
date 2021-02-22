const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function userUpdate (userParameters) {
  let condition = {}
  if (userParameters.id) {
    condition = {
      where: {
        id: userParameters.id
      }
    }
  }
  else {
    condition = {
      where: {
        email: userParameters.email
      }
    }
  }
  return models.User
    .update(userParameters, { ...condition,
      returning: true,
      plain: true
    }).then(async user => {
      const currentUser = user[1]
      if (userParameters.Types) {
        await currentUser.setTypes([])
        const types = userParameters.Types.map(async t => {
          const type = await models.Type.findById(t.id)
          await currentUser.addType(type)
          return t
        })
        return { ...currentUser.dataValues, Types: await Promise.all(types) }
      }
      return await models.User.findById(currentUser.dataValues.id, {
        include: [models.Type]
      })
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
