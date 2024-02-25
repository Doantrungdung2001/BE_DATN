'use strict'
const WeatherService = require('../services/weather.service')
const { SuccessResponse } = require('../core/success.response')

class WeatherController {
  static async getWeatherDataByTime(req, res, next) {
    new SuccessResponse({
      message: 'Get weather data by time success!',
      metadata: await WeatherService.getWeatherDataByTime({
        time: req.query.time,
        farmId: req.user.userId
      })
    }).send(res)
  }
}

module.exports = WeatherController
