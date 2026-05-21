const mongoose = require('mongoose');

const AboutDrNandaniLeadSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  mobile: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true,
    trim: true,
    lowercase: true
  },
  service: { 
    type: String, 
    default: 'Clinical Consultation' 
  },
  appointmentDate: { 
    type: Date, 
    required: true 
  },
  message: { 
    type: String, 
    default: '' 
  },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'scheduled', 'converted'], 
    default: 'new' 
  },
  notes: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true, collection: 'aboutdrnandanileads' });

module.exports = mongoose.model('AboutDrNandaniLead', AboutDrNandaniLeadSchema);
