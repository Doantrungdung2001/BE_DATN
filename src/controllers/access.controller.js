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

  getUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get farm success',
      metadata: await AccessService.getUser({
        userId: req.user.userId
      })
    }).send(res)
  }

  forgotPassword = async (req, res, next) => {
    new SuccessResponse({
      message: 'Send verify email success',
      metadata: await AccessService.forgotPassword({
        email: req.body.email
      })
    }).send(res)
  }

  resetPassword = async (req, res, next) => {
    new SuccessResponse({
      message: 'Reset password success',
      metadata: await AccessService.resetPassword({
        resetToken: req.body.resetToken,
        email: req.body.email,
        newPassword: req.body.newPassword
      })
    }).send(res)
  }

  updatePassword = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update password success',
      metadata: await AccessService.updatePassword({
        userId: req.user.userId,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword
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

  testSendEmail = async (req, res, next) => {
    new SuccessResponse({
      message: 'Send email success',
      metadata: await AccessService.testSendEmail()
    }).send(res)
  }
}

module.exports = new AccessController()
