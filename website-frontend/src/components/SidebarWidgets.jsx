"use client";
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const SidebarSearch = ({ placeholder }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      router.push(`/blog?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="search-box">
      <input 
        type="text" 
        placeholder={placeholder || "Enter Key Word"} 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearch}
      />
      <Search size={20} className="search-icon" onClick={handleSearch} style={{ cursor: 'pointer' }} />
    </div>
  );
};

export const SidebarCategories = ({ title, categories, totalCount }) => {
  const router = useRouter();

  const handleCategoryClick = (catName) => {
    const url = catName === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(catName)}`;
    router.push(url);
  };

  return (
    <div className="sidebar-widget">
      <h4 className="sidebar-title">{title}</h4>
      <ul className="category-list">
        <li onClick={() => handleCategoryClick('All')} style={{ cursor: 'pointer' }}>
          <span className="category-name">All Categories</span>
          <span className="count">({totalCount || 0})</span>
        </li>
        {(Array.isArray(categories) ? categories : []).map((cat, idx) => (
          <li key={idx} onClick={() => handleCategoryClick(cat.name)} style={{ cursor: 'pointer' }}>
            <span className="category-name">{cat.name}</span>
            <span className="count">({cat.count})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
