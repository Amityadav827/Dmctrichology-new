import ScienceHero from '@/components/ScienceHero';
import ScienceIntro from '@/components/ScienceIntro';
import ScienceDualFeatures from '@/components/ScienceDualFeatures';
import ScienceConsultation from '@/components/ScienceConsultation';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Advanced Hair Restoration Science | DMC Trichology',
  description: 'Explore the science behind DMC Trichology’s advanced hair restoration and skin care solutions. Rooted in research, powered by innovation.',
};

// Disable static generation because this is now a dynamic catch-all route for CMS pages
export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';

export default async function DynamicSlugPage({ params }) {
  const { slug } = await params;

  let pageData = null;
  
  try {
    // 1. Fetch dynamic page from CMS generic Pages
    const res = await fetch(`${API_BASE}/pages/slug/${slug}`, {
      cache: 'no-store'
    });
    
    if (res.ok) {
      const json = await res.json();
      pageData = json.data;
    } else if (res.status === 404 && (slug === 'science-at-dmc' || slug === 'science-at-dmc-trichology')) {
      // Fallback for hardcoded URL if not created in CMS
      pageData = { title: 'Science at DMC Trichology', slug };
    } else {
      notFound();
    }
    
    // 2. Check if the CMS page is our custom premium Science page
    // We check by slug or if the CMS page title matches
    const isSciencePage = 
      slug === 'science-at-dmc' || 
      slug === 'science-at-dmc-trichology' || 
      (pageData && (pageData.title === 'Science at DMC Trichology' || pageData.title === 'Science at DMC'));

    if (isSciencePage) {
      // Fetch Science specific modular content
      let scienceSections = {
        hero: {},
        intro: {},
        features: {},
        consultation: {}
      };

      try {
        const scienceRes = await fetch(`${API_BASE}/science-dmc`, {
          cache: 'no-store'
        });
        
        if (scienceRes.ok) {
          const scienceJson = await scienceRes.json();
          if (scienceJson.success && scienceJson.data) {
            const rawData = scienceJson.data;
            const config = rawData.config || rawData || {};
            scienceSections = {
              hero: config.hero || {},
              intro: config.introSection || config.intro || {},
              features: config.dualFeatureSection || config.features || {},
              consultation: config.consultationSection || config.consultation || {}
            };
          }
        }
      } catch (err) {
        console.error('Error fetching science specific content:', err);
      }

      // Add complete null safety and fallback structures
      const heroData = scienceSections.hero || {};
      const introData = scienceSections.intro || {};
      const featuresData = scienceSections.features || {};
      const consultationData = scienceSections.consultation || {};

      return (
        <main className="science-dmc-page">
          <ScienceHero data={heroData} />
          <ScienceIntro data={introData} />
          <ScienceDualFeatures data={featuresData} />
          <ScienceConsultation data={consultationData} />
        </main>
      );
    }
    
    // 3. Render a generic CMS page if it's not the science page
    return (
      <main className="generic-cms-page pt-32 pb-16 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-black text-slate-900 mb-8 font-marcellus">{pageData.title}</h1>
          {pageData.content && (
            <div 
              className="prose prose-lg max-w-none text-slate-600 prose-headings:font-marcellus prose-headings:text-slate-900 prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          )}
        </div>
      </main>
    );
    
  } catch (error) {
    console.error('Error fetching dynamic page:', error);
    notFound();
  }
}
