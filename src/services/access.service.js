'use strict'

const farmModel = require('../models/farm.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('../services/keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const { findByEmail } = require('./farm.service')

const RoleFarm = {
  FARM: 'FARM',
  WRITE: 'WRITE',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // step 1: check email exists?
    const holderFarm = await farmModel.findOne({ email }).lean().exec()
    if (holderFarm) {
      throw new BadRequestError('Error: Farm already registered!')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const newFarm = await farmModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleFarm.SHOP]
    })

    if (newFarm) {
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

      console.log({ privateKey, publicKey }) //save collection KeyStore
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newFarm._id,
        publicKey
      })

      if (!keyStore) {
        return {
          code: 'xxxx',
          message: 'keyStore error'
        }
      }

      // created token pair
      const tokens = await createTokenPair({ userId: newFarm._id, email }, publicKey, privateKey)
      console.log(`Created Token Success::`, tokens)
      return {
        code: 201,
        metadata: {
          farm: getInfoData({ fields: ['_id', 'name', 'email'], object: newFarm }),
          tokens
        }
      }
    }

    return {
      code: 201,
      metadata: null
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
    const foundFarm = await findByEmail({ email })
    if (!foundFarm) throw new BadRequestError('Farm not registered')

    const match = await bcrypt.compare(password, foundFarm.password)
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

    const { _id: userId } = foundFarm
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey
    })

    return {
      metadata: {
        farm: getInfoData({ fields: ['_id', 'name', 'email'], object: foundFarm }),
        tokens
      }
    }
  }

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    console.log({ delKey })
    return delKey
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

    if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Farm not registered')

    const foundFarm = await findByEmail({ email })
    if (!foundFarm) throw new AuthFailureError('Farm not registered')

    // create 1 cap moi
    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)
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
