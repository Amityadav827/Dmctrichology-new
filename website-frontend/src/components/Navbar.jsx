"use client";
import { useEffect, useState, useRef } from 'react';
import { fetchMenu } from '../services/api';
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react';

export default function Navbar({ cmsMenu, logoUrl }) {
  const [defaultMenuItems] = useState([
    { label: 'Home', link: '/' },
    { label: 'About Us', link: '/about', dropdown: [{label: 'Dr. Nandini Dadu', link: '/about/dr-nandani'}] },
    { label: 'Services', link: '/service', dropdown: [{label: 'Hair Transplant', link: '/fue-hair-transplant'}] },
    { label: 'Results', link: '/results' },
    { label: 'Testimonials', link: '/testimonials' },
    { label: 'Blog', link: '/blog' },
    { label: 'Contact Us', link: '/contact-us' }
  ]);
  
  const menuItems = cmsMenu && cmsMenu.length > 0 ? cmsMenu : defaultMenuItems;
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);

  // Helper to ensure absolute links (starts with '/') and maps legacy '/services' to '/service'
  const ensureAbsoluteLink = (link) => {
    if (!link) return '/';
    let clean = link.trim();
    if (clean === 'services') clean = 'service';
    if (clean === '/services') clean = '/service';
    if (clean === 'contact') clean = 'contact-us';
    if (clean === '/contact') clean = '/contact-us';
    
    if (
      clean.startsWith('/') || 
      clean.startsWith('#') || 
      clean.startsWith('http://') || 
      clean.startsWith('https://') || 
      clean.startsWith('mailto:') || 
      clean.startsWith('tel:')
    ) {
      return clean;
    }
    return `/${clean}`;
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setOpenDropdown(null);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div ref={navRef} className={`mobile-nav ${isOpen ? 'is-open' : ''}`} style={{ display: 'flex', alignItems: 'center' }}>
      {/* Hamburger Toggle Button */}
      <button
        className="mobile-toggle"
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setOpenDropdown(null);
        }}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Desktop + Mobile Nav */}
      <nav className={`navbar ${isOpen ? 'open' : ''}`}>
        {/* Mobile menu top bar: logo + close (hidden on desktop) */}
        <div className="mobile-menu-header">
          {logoUrl && <img className="mobile-menu-logo" src={logoUrl} alt="Logo" />}
          <button
            className="mobile-menu-close"
            type="button"
            onClick={() => {
              setIsOpen(false);
              setOpenDropdown(null);
            }}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        {menuItems.map((item, i) => (
          <div key={i} className={`nav-item ${openDropdown === i ? 'dropdown-open' : ''}`} style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
            <a
              href={ensureAbsoluteLink(item.link)}
              onClick={() => {
                setIsOpen(false);
                setOpenDropdown(null);
              }}
            >
              {item.label}
            </a>
            {((item.dropdown && item.dropdown.length > 0) || (item.submenu && item.submenu.length > 0)) && (
              <button
                className="nav-chevron-btn"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === i ? null : i);
                }}
                aria-label={`${openDropdown === i ? 'Close' : 'Open'} ${item.label} menu`}
                aria-expanded={openDropdown === i}
              >
                <ChevronDown size={14} className="nav-chevron" />
              </button>
            )}
            {((item.dropdown && item.dropdown.length > 0) || (item.submenu && item.submenu.length > 0)) && (
              <div className="dropdown-menu">
                {(item.dropdown || item.submenu).map((sub, j) => (
                  <a
                    key={j}
                    href={ensureAbsoluteLink(sub.link)}
                    className="dropdown-item"
                    onClick={() => {
                      setIsOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    {sub.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

