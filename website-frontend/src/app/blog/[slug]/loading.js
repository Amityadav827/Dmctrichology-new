import React from 'react';

export default function Loading() {
  return (
    <div className="bg-white min-h-screen">
      {/* Skeleton Hero */}
      <div className="w-full h-[400px] bg-gray-100 animate-pulse" />
      
      <div className="max-w-[1400px] mx-auto px-[5%] py-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-[70px]">
          
          <div className="space-y-8">
            {/* Image Skeleton */}
            <div className="w-full aspect-video bg-gray-100 rounded-[40px] animate-pulse" />
            
            {/* Meta Skeleton */}
            <div className="flex gap-8">
              <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
              <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
            </div>
            
            {/* Title Skeleton */}
            <div className="w-3/4 h-12 bg-gray-100 rounded animate-pulse" />
            
            {/* Content Skeleton */}
            <div className="space-y-4">
              <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
              <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
              <div className="w-5/6 h-4 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block">
            <div className="w-full h-[600px] bg-gray-100 rounded-[40px] animate-pulse" />
          </div>
          
        </div>
      </div>
    </div>
  );
}
