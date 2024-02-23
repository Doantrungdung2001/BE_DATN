const cron = require('node-cron')
const axios = require('axios')
const mongoose = require('mongoose')
const { weather } = require('../models/weather.model')
require('../dbs/init.mongodb')

const districts = [
  'an giang',
  'bà rịa - vũng tàu',
  'bắc giang',
  'bắc kạn',
  'bạc liêu',
  'bắc ninh',
  'bến tre',
  'bình định',
  'bình dương',
  'bình phước',
  'bình thuận',
  'cà mau',
  'cần thơ',
  'cao bằng',
  'đà nẵng',
  'đắk lắk',
  'đắk nông',
  'điện biên',
  'đồng nai',
  'đồng tháp',
  'gia lai',
  'hà giang',
  'hà nam',
  'hà nội',
  'hà tĩnh',
  'hải dương',
  'hải phòng',
  'hậu giang',
  'hòa bình',
  'hưng yên',
  'khánh hòa',
  'kiên giang',
  'kon tum',
  'lai châu',
  'lâm đồng',
  'lạng sơn',
  'lào cai',
  'long an',
  'nam định',
  'nghệ an',
  'ninh bình',
  'ninh thuận',
  'phú thọ',
  'phú yên',
  'quảng bình',
  'quảng nam',
  'quảng ngãi',
  'quảng ninh',
  'quảng trị',
  'sóc trăng',
  'sơn la',
  'tây ninh',
  'thái bình',
  'thái nguyên',
  'thanh hóa',
  'thừa thiên huế',
  'tiền giang',
  'hồ chí minh',
  'trà vinh',
  'tuyên quang',
  'vĩnh long',
  'vĩnh phúc',
  'yên bái'
]

// Hàm gọi API và lưu dữ liệu vào MongoDB
async function fetchWeatherData(district) {
  const WEATHER_API_KEY = process.env.WEATHER_API_KEY
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${district}&appid=${WEATHER_API_KEY}&units=metric&lang=vi`

  try {
    axios
      .get(url)
      .then(async (res) => {
        const data = res.data
        const newWeatherData = new weather({
          district: district,
          time: new Date(),
          description: data.weather[0].description,
          temp: data.main.temp,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed
        })
    
        await newWeatherData.save()
        console.log(`Data for ${district} saved successfully.`)
      })
      .catch((err) => {
        console.log(`Error with : ${district}`, err.message)
      })
  } catch (error) {
    console.error(`Error fetching or saving data for ${district}:`, error.message)
  }
}

// Schedule cron job
cron.schedule(
  '00 06 * * * *',
  () => {
    districts.forEach((district) => {
      fetchWeatherData(district)
    })
  },
  {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh' // Thiết lập múi giờ cho cron job
  }
)
