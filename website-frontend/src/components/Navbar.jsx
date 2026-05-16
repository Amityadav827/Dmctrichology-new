"use client";
import { useEffect, useState, useRef } from 'react';
import { fetchMenu } from '../services/api';
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react';

export default function Navbar({ cmsMenu }) {
  const [defaultMenuItems] = useState([
    { label: 'Home', link: '/' },
    { label: 'About Us', link: '/about' },
    { label: 'Services', link: '/services', dropdown: [{label: 'Hair Transplant', link: '/services/hair-transplant'}] },
    { label: 'Results', link: '/results' },
    { label: 'Testimonials', link: '/testimonials' },
    { label: 'Blog', link: '/blog' },
    { label: 'Contact Us', link: '/contact' }
  ]);
  
  const menuItems = cmsMenu && cmsMenu.length > 0 ? cmsMenu : defaultMenuItems;
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);

  // Static items for now, dynamic fetch handled by Header parent

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div ref={navRef} style={{ display: 'flex', alignItems: 'center' }}>
      {/* Hamburger Toggle Button */}
      <button
        className="mobile-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Desktop + Mobile Nav */}
      <nav className={`navbar ${isOpen ? 'open' : ''}`}>
        {menuItems.map((item, i) => (
          <div key={i} className="nav-item" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
            <a
              href={item.link}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
            {((item.dropdown && item.dropdown.length > 0) || (item.submenu && item.submenu.length > 0)) && <ChevronDown size={14} className="nav-chevron" />}
            {((item.dropdown && item.dropdown.length > 0) || (item.submenu && item.submenu.length > 0)) && (
              <div className="dropdown-menu">
                {(item.dropdown || item.submenu).map((sub, j) => (
                  <a
                    key={j}
                    href={sub.link}
                    className="dropdown-item"
                    onClick={() => setIsOpen(false)}
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
