const fs = require('fs')
const cron = require('node-cron')

// Đường dẫn đến thư mục tải lên
const uploadDir = '../uploads'

// Định nghĩa công việc cronjob
const deleteUploads = cron.schedule(
  '0 0 * * *',
  () => {
    // Đọc danh sách tệp trong thư mục tải lên
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        console.error('Không thể đọc thư mục tải lên:', err)
        return
      }

      // Xóa từng tệp trong thư mục tải lên
      files.forEach((file) => {
        fs.unlink(`${uploadDir}/${file}`, (err) => {
          if (err) {
            console.error(`Không thể xóa tệp ${file}:`, err)
          } else {
            console.log(`Đã xóa tệp ${file}`)
          }
        })
      })
    })
  },
  {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh' // Đặt múi giờ cho cronjob
  }
)

// // Bắt đầu cronjob
// task.start();

// // Ghi nhận khi bắt đầu cronjob
// console.log('Cronjob xóa tệp đã bắt đầu chạy.');
module.exports = deleteUploads
