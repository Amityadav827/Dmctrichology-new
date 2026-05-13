import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-[5%]">
      <div className="max-w-2xl text-center">
        <h1 
          className="text-[120px] font-bold leading-none mb-4"
          style={{ 
            fontFamily: "'Marcellus', serif",
            background: 'linear-gradient(135deg, #2D4A8A 0%, #1a3266 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          404
        </h1>
        <h2 
          className="text-3xl font-medium mb-6"
          style={{ fontFamily: "'Marcellus', serif", color: '#111' }}
        >
          Blog Post Not Found
        </h2>
        <p 
          className="text-lg text-gray-600 mb-10 leading-relaxed"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          The article you are looking for might have been removed, had its name changed, or is temporarily unavailable. Browse our other latest insights below.
        </p>
        <Link 
          href="/blog"
          className="inline-flex items-center justify-center px-10 py-4 bg-[#2D4A8A] text-white rounded-full font-semibold transition-all hover:bg-[#1a3266] hover:scale-105"
          style={{ fontFamily: "'Marcellus', serif" }}
        >
          Back to All Blogs
        </Link>
      </div>
    </div>
  );
}
