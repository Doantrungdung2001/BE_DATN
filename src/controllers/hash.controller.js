const HashService = require('../services/hash.service')
const { SuccessResponse } = require('../core/success.response')

class HashController {
    // hash images
    hashImages = async (req, res, next) => {
        new SuccessResponse({
        message: 'Hash images success!',
        metadata: await HashService.hashImages({ images: req.body.images })
        }).send(res)
    }
    }

module.exports = new HashController()