// seeder.js
const mongoose = require('mongoose')
const { faker } = require('@faker-js/faker')
const { seed } = require('./src/models/seed.model') // Update with your path to the seed model
const { plant } = require('./src/models/plant.model') // Update with your path to the plant model

require('./src/dbs/init.mongodb')

async function seedData() {
  for (let i = 0; i < 10; i++) {
    // This will create 100 fake seeds and plants
    let plantItem = new plant({
      plant_name: faker.commerce.productName(),
      plant_thumb: faker.image.url(),
      plant_description: faker.lorem.sentence(),
      plant_type: ['herb', 'leafy', 'root', 'fruit'].at(faker.number.int() % 4),
      timeCultivates: [{ start: (faker.number.int() % 12) + 1, end: (faker.number.int() % 12) + 1 }],
      bestTimeCultivate: { start: (faker.number.int() % 12) + 1, end: (faker.number.int() % 12) + 1 },
      farmingTime: (faker.number.int() % 200) + 1,
      harvestTime: (faker.number.int() % 100) + 1,
      farm: new mongoose.Types.ObjectId('6597b90a0730b4164d7f9c7a')

      // Add more fields as needed
    })
    await plantItem.save()

    for (let j = 0; j < 10; j++) {
      let seedItem = new seed({
        plant: plantItem._id,
        seed_name: faker.commerce.productName(),
        seed_description: faker.lorem.sentence(),
        seed_thumb: faker.image.url()
        // Add more fields as needed
      })
      await seedItem.save()
    }
  }
  console.log('seeds and plants seeded')
  process.exit()
}

seedData()
