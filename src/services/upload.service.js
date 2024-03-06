'use strict'
const cloudinary = require('../configs/cloudinary.config')

class UploadService {
  // 1. upload from url image
  static async uploadImageFromUrl(url) {
    try {
      const result = await cloudinary.uploader.upload(url)
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }

  // 2. upload single from local image
  static async uploadImageFromLocal({ path, folderName = 'product/8469' }) {
    try {
      const result = await cloudinary.uploader.upload(path, {
        folder: folderName
      })
      return {
        image_url: result.secure_url,
        thumb_url: await cloudinary.url(result.public_id, {
          width: 500,
          height: 500,
          crop: 'fill',
          format: 'jpg'
        })
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  // 3. upload multiple from local file
  static async uploadImageFromFromLocalFiles({ files, folderName = 'product/8469' }) {
    try {
      if (!files || files.length === 0) {
        throw new Error('Please upload a file')
      }
      const result = await Promise.all(
        files.map(async (file) => {
          const image = await cloudinary.uploader.upload(file.path, {
            folder: folderName
          })
          return {
            image_url: image.secure_url,
            thumb_url: await cloudinary.url(image.public_id, {
              width: 500,
              height: 500,
              crop: 'fill',
              format: 'jpg'
            })
          }
        })
      )
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = UploadService
