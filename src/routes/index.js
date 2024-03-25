'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const router = express.Router()

// // check apiKey
// router.use(apiKey)
// // check permission
// router.use(permission('0000'))

router.use('/v1/api/plant', require('./plant'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api/seed', require('./seed'))
router.use('/v1/api/plantFarming', require('./plantFarming'))
router.use('/v1/api/project', require('./project'))
router.use('/v1/api/gardenServiceTemplate', require('./gardenServiceTemplate'))
router.use('/v1/api/gardenServiceRequest', require('./gardenServiceRequest'))
router.use('/v1/api/garden', require('./garden'))
router.use('/v1/api/distributer', require('./distributer'))
router.use('/v1/api/upload', require('./upload'))
router.use('/v1/api/qr', require('./qr'))
router.use('/v1/api/farm', require('./farm'))
router.use('/v1/api/hash', require('./hash'))
router.use('/v1/api/weather', require('./weather'))
router.use('/v1/api/camera', require('./camera'))
router.use('/v1/api/client', require('./client'))
router.use('/v1/api/event', require('./event'))
router.use('/v1/api/transfer', require('./transfer'))
router.use('/v1/api', require('./access'))

module.exports = router
