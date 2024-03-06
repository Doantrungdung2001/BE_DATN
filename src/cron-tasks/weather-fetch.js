const cron = require('node-cron')
const axios = require('axios')
const mongoose = require('mongoose')
const { farm } = require('../models/farm.model') // Import your farm model
const { weather } = require('../models/weather.model')
require('../dbs/init.mongodb')

// Function to retrieve the list of districts from farm documents
async function getDistrictsFromFarms() {
  try {
    const farms = await farm.find({}, { district: 1, _id: 0 }) // Retrieve only the district field from farms
    const districts = farms.map((farm) => farm.district)
    return districts
  } catch (error) {
    console.error('Error fetching districts from farms:', error.message)
    throw error
  }
}

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
  '00 25 * * * *',
  async () => {
    try {
      const districts = await getDistrictsFromFarms() // Retrieve districts from farms
      console.log('Fetched districts:', districts)
      districts.forEach((district) => {
        fetchWeatherData(district)
      })
    } catch (error) {
      console.error('Error scheduling cron job:', error.message)
    }
  },
  {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh' // Thiết lập múi giờ cho cron job
  }
)
