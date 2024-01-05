'use strict'
const AccessService = require('../services/access.service')
const { CREATED, SuccessResponse } = require('../core/success.response')
class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      message: '',
      metadata: await AccessService.login(req.body)
    }).send(res)
  }

  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Registered OK!',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res)
  }

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout success',
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  }

  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get token success',
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      })
    }).send(res)
  }

  test = async (req, res, next) => {
    new SuccessResponse({
      message: 'Passes authentication',
      metadata: {
        data: 'Here we go!'
      }
    }).send(res)
  }
}

module.exports = new AccessController()
