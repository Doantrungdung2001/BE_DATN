'use strict'

const farmModel = require('../models/farm.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('../services/keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailureError, ForbiddenError, MethodFailureError } = require('../core/error.response')
const { findUserByEmail, getUser, addUser } = require('./user.service')
const {client} = require('../models/client.model')

const Role = {
  FARM: 'FARM',
  CLIENT: 'CLIENT',
  WRITE: 'WRITE',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp = async ({ name, email, password, role }) => {
    if (!email || !password || !role || !name) {
      throw new BadRequestError('Email, password, role, name are required')
    }
    // step 1: check email exists?
    const holderUser = await findUserByEmail({ email })
    if (holderUser) {
      throw new BadRequestError('Error: User already registered!')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = await addUser({ email, password: passwordHash, roles: [role] })
    if (role === Role.FARM || role === Role.ADMIN) {
      const newFarm = await farmModel.create({
        _id: newUser._id,
        name: name
      })

      if(!newFarm) throw new MethodFailureError('Farm registration failed')
    }

    if (role === Role.CLIENT) {
      const newClient = await client.create({
        _id: newUser._id,
        name: name
      })
      if(!newClient) throw new MethodFailureError('User registration failed')
    }

      // created privateKey, publicKey
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1', //Public key CryptoGraphy Standards
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs1', //Public key CryptoGraphy Standards
          format: 'pem'
        }
      })


      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey
      })

      if (!keyStore) {
        return {
          code: 'xxxx',
          message: 'keyStore error'
        }
      }

      // created token pair
      const tokens = await createTokenPair({ userId: newUser._id, email, roles: newUser.roles }, publicKey, privateKey)
      console.log(`Created Token Success::`, tokens)
      return {
        code: 201,
        metadata: {
          user: getInfoData({ fields: ['_id', 'email'], object: newUser }),
          tokens
        }
      }
  }

  /**
   * 1. check email in db
   * 2. match password
   * 3. create AT & RT and save
   * 4. generate tokens
   * 5. get data return login
   */
  static login = async ({ email, password, refreshToken = null }) => {
    const foundUser = await findUserByEmail({ email })
    if (!foundUser) throw new BadRequestError('Farm not registered')

    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) throw new AuthFailureError('Authentication error')

    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1', //Public key CryptoGraphy Standards
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs1', //Public key CryptoGraphy Standards
        format: 'pem'
      }
    })

    const { _id: userId } = foundUser
    const tokens = await createTokenPair({ userId, email, roles: foundUser.roles }, publicKey, privateKey)

    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey
    })

    return {
      metadata: {
        farm: getInfoData({ fields: ['_id', 'email'], object: foundUser }),
        tokens
      }
    }
  }

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    console.log({ delKey })
    return delKey
  }

  static getUser = async ({ userId }) => {
    const foundUser = await getUser({ userId })
    if (!foundUser) throw new BadRequestError('User not registered')

    return foundUser
  }

  /**
   * Check this token used?
   */
  static handlerRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)

    //check xem token da duoc su dung chua?
    if (foundToken) {
      // decode xem may la thang nao?
      const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
      console.log({ userId, email })
      // xoa tat ca  token trong keyStore
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happened!! Pls re-login')
    }

    //
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if (!holderToken) throw new AuthFailureError('Farm not registered')

    // verify token
    const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
    console.log('[2]--', { userId, email })
    // check userId
    const foundFarm = await findByEmail({ email })
    if (!foundFarm) throw new AuthFailureError('Farm not registered')

    //create 1 cap moi
    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

    //update token
    await holderToken
      .update({
        $set: {
          refreshToken: tokens.refreshToken
        },
        $addToSet: {
          refreshTokensUsed: refreshToken // da duoc su dung de lay token moi roi
        }
      })
      .exec()

    return {
      user: { userId, email },
      tokens
    }
  }

  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happened || Pls re-login')
    }

    if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('User not registered')

    const foundUser = await findUserByEmail({ email })
    if (!foundUser) throw new AuthFailureError('User not registered')

    // create 1 cap moi
    const tokens = await createTokenPair(
      { userId, email, roles: foundUser.roles },
      keyStore.publicKey,
      keyStore.privateKey
    )
    //update token
    await keyStore
      .update({
        $set: {
          refreshToken: tokens.refreshToken
        },
        $addToSet: {
          refreshTokensUsed: refreshToken // da duoc su dung de lay token moi roi
        }
      })
      .exec()

    return {
      user,
      tokens
    }
  }
}

module.exports = AccessService
