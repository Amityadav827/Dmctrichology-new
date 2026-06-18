import AboutUsClient from '@/components/AboutUsClient';
import SchemaMarkup from '@/components/SchemaMarkup';
import { fetchAboutUs } from '@/services/api';

// Static fallback data for production safety (SSR Level)
const staticFallback = {
  hero: {
    badge: "ESTABLISHED 2008",
    title: "Crafting The Art Of Natural Hair Restoration",
    subtitle: "India's premier luxury trichology center combining advanced medical science with artistic precision.",
    stats: [
      { value: "15+", label: "Years Experience" },
      { value: "25k+", label: "Happy Patients" },
      { value: "12+", label: "Expert Board" }
    ],
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png"
  },
  story: {
    badge: "OUR HERITAGE",
    heading: "A Legacy Of Clinical Excellence",
    description: "Founded in 2008 by Dr. Gaurav Garg, DMC Trichology has pioneered the field of hair restoration in India.",
    points: [{ text: "US-FDA Approved Technologies" }, { text: "Award-winning Surgeons" }, { text: "Gold Standard Protocols" }],
    mainImage: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/cloudinary-recovery/ulx0crddeqpeygupa13q.png",
    secondaryImage: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962108233-jkidxsr5nbpwq7y7x0x0.png"
  },
  vision: {
    visionText: "To be the global benchmark in hair restoration, merging advanced science with artistic excellence.",
    missionText: "To restore confidence through personalized care and the highest medical standards."
  },
  journey: {
    milestones: [
      { year: "2008", title: "The Inception", description: "First clinic opened in Delhi." },
      { year: "2015", title: "Global Recognition", description: "Excellence award in Trichology." }
    ]
  },
  experts: {
    team: [
      { name: "Dr. Gaurav Garg", designation: "Chief Surgeon", specialization: "FUE Specialist", bio: "Expert in hair restoration with 15+ years experience." }
    ]
  },
  testimonials: {
    reviews: [
      { patientName: "Rahul Sharma", reviewText: "Life changing experience. The density is amazing.", treatment: "FUE Transplant", rating: 5 }
    ]
  }
};

async function getAboutData() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';
    const response = await fetch(`${API_URL}/about-us?t=${Date.now()}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) return staticFallback;
    const result = await response.json();
    return result.success ? result.data : staticFallback;
  } catch (error) {
    console.error('SSR Fetch Error:', error);
    return staticFallback;
  }
}

export default async function AboutUsPage() {
  const data = await getAboutData();

  return (<><SchemaMarkup seo={data?.seo} /><AboutUsClient initialData={data} /></>);
}
