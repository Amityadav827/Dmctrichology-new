const mongoose = require('mongoose');
const ServiceCard = require('./models/ServiceCard');
const ServiceCategory = require('./models/ServiceCategory');
require('dotenv').config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // 1. Clear existing
        await ServiceCategory.deleteMany({});
        await ServiceCard.deleteMany({});

        const categoriesData = [
            'Full Body', 'Arms', 'Legs', 'Face', 'Back', 'Bikini', 'Front', 
            'Hair Transplant', 'Hair Treatments', 'PRP', 'GFC', 'Beard', 'Repair', 'Women Hair'
        ];

        const categoryDocs = await ServiceCategory.insertMany(
            categoriesData.map((name, i) => ({
                categoryName: name,
                slug: name.toLowerCase().replace(/\s+/g, '-'),
                isActive: true,
                sortOrder: i
            }))
        );

        console.log(`Inserted ${categoryDocs.length} categories`);

        const servicesData = [
            { title: "Soprano Titanium Laser", category: "full-body", rating: 4.9, duration: "60 mins", shortDescription: "World's most advanced laser hair removal system for all skin types." },
            { title: "FUE Hair Transplant", category: "hair-transplant", rating: 5.0, duration: "6-8 hours", shortDescription: "High-density hair transplant using advanced Follicular Unit Extraction." },
            { title: "Advanced GFC Therapy", category: "gfc", rating: 4.8, duration: "45 mins", shortDescription: "Growth Factor Concentrate therapy for natural hair regrowth." },
            { title: "PRP Plus+", category: "prp", rating: 4.7, duration: "30 mins", shortDescription: "Platelet Rich Plasma treatment enhanced with nutrients." },
            { title: "DMC Signature Facial", category: "face", rating: 4.9, duration: "90 mins", shortDescription: "Medical-grade facial for deep rejuvenation and glow." },
            { title: "Beard Shaping Laser", category: "beard", rating: 4.8, duration: "20 mins", shortDescription: "Permanent beard line definition for a sharp look." },
            { title: "Underarms Smoothness", category: "arms", rating: 4.9, duration: "15 mins", shortDescription: "Quick and painless laser for silky smooth underarms." },
            { title: "Full Legs Silk", category: "legs", rating: 4.8, duration: "45 mins", shortDescription: "Complete leg hair removal with cooling technology." },
            { title: "Bikini Line Precision", category: "bikini", rating: 4.7, duration: "30 mins", shortDescription: "Sensitive area hair removal with maximum comfort." },
            { title: "Back Hair Removal", category: "back", rating: 4.6, duration: "40 mins", shortDescription: "Clean and smooth back for men and women." },
            { title: "Hair Repair Mask", category: "repair", rating: 4.9, duration: "60 mins", shortDescription: "Intensive treatment for chemically damaged hair." },
            { title: "Women's Thinning Fix", category: "women-hair", rating: 4.8, duration: "45 mins", shortDescription: "Specialized care for female pattern hair loss." },
            { title: "DHT Blocker Therapy", category: "hair-treatments", rating: 4.7, duration: "20 mins", shortDescription: "Medical treatment to stop hair fall at its root." },
            { title: "Full Face Rejuvenation", category: "face", rating: 5.0, duration: "75 mins", shortDescription: "Combination therapy for acne marks and fine lines." },
            { title: "Arm & Forearm Smooth", category: "arms", rating: 4.8, duration: "30 mins", shortDescription: "Get rid of unwanted arm hair permanently." },
            { title: "Chest & Front Laser", category: "front", rating: 4.7, duration: "45 mins", shortDescription: "Smooth chest and abdomen for a groomed appearance." },
            { title: "Scalp Micro-Pigmentation", category: "hair-transplant", rating: 4.9, duration: "120 mins", shortDescription: "Non-surgical solution for the appearance of dense hair." }
        ];

        await ServiceCard.insertMany(
            servicesData.map((s, i) => ({
                ...s,
                slug: s.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
                image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png",
                buttonText: "VIEW DETAILS",
                buttonLink: "/contact",
                status: "Published",
                sortOrder: i
            }))
        );

        console.log(`Inserted ${servicesData.length} service cards`);
        mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

seed();
