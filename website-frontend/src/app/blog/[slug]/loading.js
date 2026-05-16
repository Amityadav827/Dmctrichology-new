import React from 'react';

export default function Loading() {
  return (
    <div className="bg-white min-h-screen">
      {/* Skeleton Hero */}
      <div className="skeleton skeleton-banner"></div>

      {/* Main Content Skeleton */}
      <div className="blog-detail-container">
        <div className="blog-detail-grid">
          
          {/* Left Column: Blog Content Skeleton */}
          <div className="blog-main-content">
            <div className="skeleton skeleton-img"></div>

            <div className="skeleton skeleton-meta"></div>

            <div className="skeleton skeleton-title"></div>

            <div className="space-y-4">
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '95%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '85%' }}></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text" style={{ width: '92%' }}></div>
            </div>

            <div className="skeleton" style={{ height: '200px', borderRadius: '20px', marginTop: '40px', width: '100%' }}></div>
          </div>

          {/* Right Column: Sidebar Skeleton */}
          <aside className="blog-sidebar">
            <div className="skeleton skeleton-sidebar-card"></div>
          </aside>

        </div>
      </div>
    </div>
  );
}
