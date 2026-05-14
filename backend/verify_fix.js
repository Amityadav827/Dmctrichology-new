const mongoose = require('mongoose');
require('dotenv').config();
const AboutUs = require('./models/AboutUs');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const data = await AboutUs.findOne();
    
    if (data) {
      console.log('Data Found using AboutUs Model:');
      console.log('Collection:', data.constructor.collection.name);
      console.log('Title:', data.hero?.title);
    } else {
      console.log('No Data Found using AboutUs Model');
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkData();
