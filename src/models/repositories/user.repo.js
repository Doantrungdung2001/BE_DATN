const { user } = require('../user.model')
const { Types } = require('mongoose')

const findUserByEmail = async ({
  email,
  select = {
    email: 1,
    password: 2,
    roles: 1
  }
}) => {
  return await user.findOne({ email }).select(select).lean().exec()
}

const getUser = async ({ userId }) => {
  const foundUser = await user
    .findOne({
      _id: new Types.ObjectId(userId)
    })
    .exec()

  return {
    _id: foundUser._id,
    email: foundUser.email,
    roles: foundUser.roles
  }
}

const addUser = async ({ email, password, roles }) => {
  return await user.create({ email, password, roles })
}

module.exports = {
  findUserByEmail,
  getUser,
  addUser
}
