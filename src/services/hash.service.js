const { BadRequestError, MethodFailureError } = require('../core/error.response')
const { imageHash } = require('image-hash')

class HashService {
  static async hashImages({ images }) {
    if (!images) throw new BadRequestError('Images is required')
    if (!Array.isArray(images)) throw new BadRequestError('Images must be an array')
    if (images.length === 0) throw new BadRequestError('Images is empty')
    const hashImages = []
   await Promise.all(images.map((imageUrl) => {
    return new Promise((resolve, reject) => {
      imageHash(imageUrl, 16, true, (error, data) => {
        if (error) {
          reject(error);
          throw new MethodFailureError('Hash images failed')
        } else {
          hashImages.push(data);
          resolve();
        }
      });
    });
  }));

  return hashImages;
  }
}

module.exports = HashService
