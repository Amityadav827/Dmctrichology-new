const mongoose = require('mongoose');
require('dotenv').config();

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const AboutUs = mongoose.model('AboutUs', new mongoose.Schema({}, { strict: false }), 'aboutuses');
    const data = await AboutUs.findOne();
    
    if (data) {
      console.log('About Us Data Found:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('No About Us Data Found in Collection');
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkData();
