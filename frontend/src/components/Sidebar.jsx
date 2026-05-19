import React from "react";
import { NavLink } from "react-router-dom";
import { hasPermission } from "../utils/auth";
import {
  LayoutDashboard, Search, Star, PhoneCall, Mail, CalendarCheck,
  FileText, Scissors, Layers, HelpCircle, Activity, List,
  Video, PlayCircle, Image as ImageIcon, Users, Shield,
  Key, Menu as MenuIcon, Settings, Wrench, Globe, Link as LinkIcon, Bot,
  ChevronDown, ChevronRight, Home, Eye
} from "lucide-react";

const getNavClass = ({ isActive }) =>
  isActive ? "nav-item active" : "nav-item";

const SectionLabel = ({ children }) => (
  <p
    style={{
      padding: "0.875rem 0.75rem 0.375rem",
      fontSize: "0.65rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      color: "#94A3B8",
    }}
  >
    {children}
  </p>
);

function Sidebar() {
  const [isHomeOpen, setIsHomeOpen] = React.useState(true);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Brand Header */}
      <div
        style={{
          padding: "1.25rem 1rem",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
          }}
        >
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "1rem" }}>D</span>
        </div>
        <div>
          <h1
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "#0F172A",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            DMC Admin
          </h1>
          <p
            style={{
              fontSize: "0.65rem",
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: 0,
              marginTop: "2px",
            }}
          >
            Trichology
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0.75rem 1.5rem" }}
        className="scrollbar-hide"
      >
        {/* 1. MAIN */}
        {hasPermission("dashboard") && (
          <>
            <SectionLabel>Main</SectionLabel>
            <NavLink to="/dashboard" className={getNavClass}>
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>
          </>
        )}

        {/* 2. CONTENT */}
        {(hasPermission("blog") || hasPermission("cms") || hasPermission("gallery") || hasPermission("video") || hasPermission("users")) && (
          <>
            <SectionLabel>Content</SectionLabel>
            {hasPermission("cms") && (
              <NavLink to="/pages" className={getNavClass}>
                <Layers size={16} /> Pages
              </NavLink>
            )}
            {hasPermission("blog") && (
              <>
                <NavLink to="/blogs" className={getNavClass}>
                  <FileText size={16} /> Blogs
                </NavLink>
                <NavLink to="/blogs/categories" className={getNavClass}>
                  <List size={16} /> Blog Categories
                </NavLink>
                <NavLink to="/comments" className={getNavClass}>
                  <Star size={16} /> Comments
                </NavLink>
              </>
            )}

            {/* Media */}
            {hasPermission("gallery") && (
              <>
                <SectionLabel>Media</SectionLabel>
                <NavLink to="/gallery" className={getNavClass}>
                  <ImageIcon size={16} /> Gallery
                </NavLink>
              </>
            )}

            {/* Videos */}
            {hasPermission("video") && (
              <>
                <SectionLabel>Videos</SectionLabel>
                <NavLink to="/videos/categories" className={getNavClass}>
                  <Video size={16} /> Video Category
                </NavLink>
                <NavLink to="/videos/list" className={getNavClass}>
                  <PlayCircle size={16} /> Video List
                </NavLink>
              </>
            )}

            {/* Leads & Contact */}
            {hasPermission("users") && (
              <>
                <SectionLabel>Leads & Contact</SectionLabel>
                <NavLink to="/leads/callback" className={getNavClass}>
                  <PhoneCall size={16} /> Request Callback
                </NavLink>
                <NavLink to="/leads/appointment" className={getNavClass}>
                  <CalendarCheck size={16} /> Consultation Requests
                </NavLink>
                <NavLink to="/leads/contact" className={getNavClass}>
                  <Mail size={16} /> Contact Leads
                </NavLink>
              </>
            )}
          </>
        )}

        {/* 3. SERVICES */}
        {hasPermission("services") && (
          <>
            <SectionLabel>Services</SectionLabel>
            <NavLink to="/services/categories" className={getNavClass}>
              <Scissors size={16} /> View Category
            </NavLink>
            <NavLink to="/services/second-categories" className={getNavClass}>
              <Layers size={16} /> Second Category
            </NavLink>
            <NavLink to="/services/faqs" className={getNavClass}>
              <HelpCircle size={16} /> Service FAQ
            </NavLink>
            
            {/* New Service Page CMS Links */}
            <SectionLabel>Service Page CMS</SectionLabel>
            <NavLink to="/cms/service-hero" className={getNavClass}>
              <Home size={16} /> Hero Banner
            </NavLink>
            <NavLink to="/cms/service-listing" className={getNavClass}>
              <List size={16} /> Service Grid
            </NavLink>
            <NavLink to="/cms/service-categories" className={getNavClass}>
              <Layers size={16} /> Categories
            </NavLink>
            <NavLink to="/cms/visual-builder/service" className={getNavClass}>
              <Eye size={16} /> Visual Builder
            </NavLink>
            <NavLink to="/cms/service-details" className={getNavClass}>
              <Layers size={16} /> Service Details CMS
            </NavLink>

            {/* Details Page CMS */}
            <SectionLabel>Details Page CMS</SectionLabel>
            <NavLink to="/cms/details-banner" className={getNavClass}>
              <Home size={16} /> Details Banner
            </NavLink>
            <NavLink to="/cms/service-intro" className={getNavClass}>
              <List size={16} /> Service Intro
            </NavLink>
            <NavLink to="/cms/process-slider" className={getNavClass}>
              <Activity size={16} /> Process Slider
            </NavLink>
            <NavLink to="/cms/before-after" className={getNavClass}>
              <Layers size={16} /> Before / After
            </NavLink>
            <NavLink to="/cms/faq-enquiry" className={getNavClass}>
              <HelpCircle size={16} /> FAQ & Enquiry
            </NavLink>
            <NavLink to="/cms/ideal-frequency" className={getNavClass}>
              <List size={16} /> Ideal Frequency
            </NavLink>
            <NavLink to="/cms/visual-builder/details" className={getNavClass}>
              <Eye size={16} /> Visual Builder
            </NavLink>
          </>
        )}

        {/* 4. RESULTS */}
        {hasPermission("result") && (
          <>
            <SectionLabel>Results</SectionLabel>
            <NavLink to="/results/categories" className={getNavClass}>
              <Activity size={16} /> Result Category
            </NavLink>
            <NavLink to="/results/list" className={getNavClass}>
              <List size={16} /> Result List
            </NavLink>
          </>
        )}

        {/* 5. SEO & LEADS */}
        {(hasPermission("seo") || hasPermission("testimonial")) && (
          <>
            <SectionLabel>SEO & Leads</SectionLabel>

            {hasPermission("seo") && (
              <NavLink to="/seo/redirects" className={getNavClass}>
                <LinkIcon size={16} /> Redirects
              </NavLink>
            )}
            {hasPermission("seo") && (
              <NavLink to="/seo/sitemap" className={getNavClass}>
                <Globe size={16} /> Sitemap XML
              </NavLink>
            )}
            {hasPermission("seo") && (
              <NavLink to="/seo/robots" className={getNavClass}>
                <Bot size={16} /> Robots.txt
              </NavLink>
            )}
            {hasPermission("testimonial") && (
              <NavLink to="/testimonials" className={getNavClass}>
                <Star size={16} /> Testimonials
              </NavLink>
            )}
          </>
        )}

        {/* 6. SYSTEM & USERS */}
        {hasPermission("users") && (
          <>
            <SectionLabel>System & Users</SectionLabel>
            <NavLink to="/users/list" className={getNavClass}>
              <Users size={16} /> User List
            </NavLink>
            <NavLink to="/users/roles" className={getNavClass}>
              <Shield size={16} /> Role List
            </NavLink>
            <NavLink to="/users/permissions" className={getNavClass}>
              <Key size={16} /> Permissions
            </NavLink>
            <NavLink to="/users/menus" className={getNavClass}>
              <MenuIcon size={16} /> Menu List
            </NavLink>
            <NavLink to="/users/operations" className={getNavClass}>
              <Wrench size={16} /> Operations
            </NavLink>
            <NavLink to="/users/menu-operations" className={getNavClass}>
              <Settings size={16} /> Menu Operations
            </NavLink>
          </>
        )}
      </nav>

    </div>
  );
}

export default Sidebar;
