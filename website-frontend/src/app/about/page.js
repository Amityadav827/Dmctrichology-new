"use client";

import React, { useState, useEffect } from 'react';
import AboutUsHero from '@/components/AboutUsHero';
import AboutUsStory from '@/components/AboutUsStory';
import AboutUsJourney from '@/components/AboutUsJourney';
import AboutUsVision from '@/components/AboutUsVision';
import AboutUsExperts from '@/components/AboutUsExperts';
import AboutUsTestimonials from '@/components/AboutUsTestimonials';

export default function AboutUsPage() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about-us`);
        const result = await response.json();
        if (result.success) {
          setAboutData(result.data);
        }
      } catch (error) {
        console.error('Error fetching About Us data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!aboutData) return null;

  return (
    <main className="about-us-page-wrapper">
      <AboutUsHero data={aboutData.hero} />
      <AboutUsStory data={aboutData.story} />
      <AboutUsVision data={aboutData.vision} />
      <AboutUsJourney data={aboutData.journey} />
      <AboutUsExperts data={aboutData.experts} />
      <AboutUsTestimonials data={aboutData.testimonials} />
    </main>
  );
}
