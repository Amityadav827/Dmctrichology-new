import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { hasPermission } from "../utils/auth";
import api from "../api/client";
import {
  LayoutDashboard, Star, PhoneCall, Mail, CalendarCheck,
  FileText, Tag, Layers, HelpCircle, Activity, List,
  Video, PlayCircle, Image as ImageIcon, Users, Shield,
  Key, Menu as MenuIcon, Settings, Globe, Link as LinkIcon, Bot,
  ChevronDown, ChevronRight, Home, Eye, FlaskConical, User, Scissors, PlusCircle, Navigation
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
  const [isPagesOpen, setIsPagesOpen] = React.useState(() =>
    window.location.pathname.startsWith("/pages") ||
    window.location.pathname.startsWith("/cms/about-dr")
  );
  const [isAboutUsOpen, setIsAboutUsOpen] = React.useState(() =>
    window.location.pathname.startsWith("/cms/about-dr-nandani") ||
    window.location.pathname.startsWith("/cms/about-dr-nivedita")
  );
  const [isServiceDetailsOpen, setIsServiceDetailsOpen] = React.useState(true);
  const [serviceDetailsItems, setServiceDetailsItems] = React.useState([]);
  const location = useLocation();
  const isServiceDetailsCms = location.pathname === "/cms/service-details";
  const selectedServiceSlug = React.useMemo(() => {
    return new URLSearchParams(location.search).get("service") || "";
  }, [location.search]);

  React.useEffect(() => {
    let isMounted = true;

    api.get("/service-listing-cards")
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setServiceDetailsItems(
          list
            .filter((service) => service?.slug)
            .sort((a, b) => (a.title || "").localeCompare(b.title || "", undefined, { sensitivity: "base" }))
        );
      })
      .catch(() => {
        if (isMounted) setServiceDetailsItems([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

        {/* PAGES — all editable pages in one section */}
        {hasPermission("cms") && (
          <>
            <SectionLabel>Pages</SectionLabel>
            <NavLink to="/cms/homepage" className={getNavClass}>
              <Home size={16} /> Homepage
            </NavLink>
            <NavLink to="/cms/about-us" className={getNavClass}>
              <Users size={16} /> About Page
            </NavLink>
            <NavLink to="/cms/contact-page" className={getNavClass}>
              <Mail size={16} /> Contact Page
            </NavLink>
            <NavLink to="/cms/blog-page" className={getNavClass}>
              <FileText size={16} /> Blog Page
            </NavLink>
            <NavLink to="/cms/science-at-dmc" className={getNavClass}>
              <FlaskConical size={16} /> Science at DMC
            </NavLink>
            <NavLink to="/cms/press-media" className={getNavClass}>
              <Globe size={16} /> Press & Media
            </NavLink>
            <NavLink to="/cms/virtual-tour" className={getNavClass}>
              <PlayCircle size={16} /> Virtual Tour
            </NavLink>
            <NavLink to="/cms/influencers" className={getNavClass}>
              <Star size={16} /> Influencers
            </NavLink>
            {/* Doctor profile pages — nested collapsible */}
            <div className="service-details-parent-row">
              <span className="nav-item" style={{ pointerEvents: "none", flex: 1 }}>
                <User size={16} /> Doctor Pages
              </span>
              <button
                type="button"
                className={`service-details-toggle${isAboutUsOpen ? " open" : ""}`}
                onClick={() => setIsAboutUsOpen(p => !p)}
                aria-label={isAboutUsOpen ? "Collapse" : "Expand"}
              >
                <ChevronRight size={15} />
              </button>
            </div>
            {isAboutUsOpen && (
              <div className="service-details-subnav">
                <NavLink to="/cms/about-dr-nandani" className={getNavClass}>
                  <User size={14} /> Dr Nandani
                </NavLink>
                <NavLink to="/cms/about-dr-nivedita" className={getNavClass}>
                  <User size={14} /> Dr Nivedita
                </NavLink>
              </div>
            )}
            <NavLink to="/pages" className={getNavClass}>
              <Layers size={16} /> Custom Pages
            </NavLink>
          </>
        )}

        {/* 2. CONTENT */}
        {(hasPermission("blog") || hasPermission("gallery") || hasPermission("video") || hasPermission("users")) && (
          <>
            <SectionLabel>Content</SectionLabel>
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
                <NavLink to="/leads/science-consultation" className={getNavClass}>
                  <FlaskConical size={16} /> Science Consultation Leads
                </NavLink>
                <NavLink to="/leads/dr-nandani" className={getNavClass}>
                  <User size={16} /> Dr Nandani Leads
                </NavLink>
                <NavLink to="/leads/newsletter" className={getNavClass}>
                  <Users size={16} /> Newsletter Subscribers
                </NavLink>
                <NavLink to="/leads/contact" className={getNavClass}>
                  <Mail size={16} /> Contact Leads
                </NavLink>
                <NavLink to="/leads/treatment-enquiries" className={getNavClass}>
                  <Activity size={16} /> Treatment Enquiries
                </NavLink>
              </>
            )}
          </>
        )}

        {/* 3. SERVICES */}
        {hasPermission("services") && (
          <>
            <SectionLabel>Services</SectionLabel>

            {/* All Services */}
            <NavLink to="/cms/service-listing" className={getNavClass}>
              <List size={16} /> All Services
            </NavLink>

            {/* Categories — single authoritative source */}
            <NavLink to="/cms/service-categories" className={getNavClass}>
              <Tag size={16} /> Categories
            </NavLink>

            {/* Per-service edit pages (like WordPress post list) */}
            <div className="service-details-parent-row">
              <NavLink to="/cms/service-details" className={getNavClass}>
                <FileText size={16} /> Service Pages
              </NavLink>
              <button
                type="button"
                className={`service-details-toggle${isServiceDetailsOpen ? " open" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsServiceDetailsOpen((prev) => !prev);
                }}
                aria-label={isServiceDetailsOpen ? "Collapse" : "Expand"}
                aria-expanded={isServiceDetailsOpen}
              >
                <ChevronRight size={15} />
              </button>
            </div>
            {isServiceDetailsOpen && (
              <div className="service-details-subnav">
                {serviceDetailsItems.length > 0 ? (
                  serviceDetailsItems.map((service) => (
                    <NavLink
                      key={service.slug}
                      to={`/cms/service-details?service=${encodeURIComponent(service.slug)}`}
                      className={() =>
                        isServiceDetailsCms && selectedServiceSlug === service.slug
                          ? "service-detail-subitem active"
                          : "service-detail-subitem"
                      }
                      title={service.title}
                    >
                      <span className="service-detail-subdot" />
                      <span className="service-detail-subtext">{service.title}</span>
                    </NavLink>
                  ))
                ) : (
                  <div className="service-detail-subitem muted">
                    <span className="service-detail-subdot" />
                    No services yet
                  </div>
                )}
              </div>
            )}

            {/* Services page settings */}
            <SectionLabel>Services Page</SectionLabel>
            <NavLink to="/cms/service-hero" className={getNavClass}>
              <ImageIcon size={16} /> Hero Banner
            </NavLink>
            <NavLink to="/cms/visual-builder/service" className={getNavClass}>
              <Eye size={16} /> Visual Builder
            </NavLink>
          </>
        )}

        {/* GLOBAL LAYOUT — header, topbar, footer */}
        {hasPermission("cms") && (
          <>
            <SectionLabel>Global Layout</SectionLabel>
            <NavLink to="/cms/header" className={getNavClass}>
              <MenuIcon size={16} /> Header
            </NavLink>
            <NavLink to="/cms/topbar" className={getNavClass}>
              <Activity size={16} /> Topbar
            </NavLink>
            <NavLink to="/cms/footer" className={getNavClass}>
              <Layers size={16} /> Footer
            </NavLink>
          </>
        )}

        {/* 4. NAVIGATION */}
        {hasPermission("cms") && (
          <>
            <SectionLabel>Navigation</SectionLabel>
            <NavLink to="/cms/navigation" className={getNavClass}>
              <Navigation size={16} /> Menu Builder
            </NavLink>
          </>
        )}

        {/* RESULTS */}
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

        {/* 6. SETTINGS */}
        {hasPermission("cms") && (
          <>
            <SectionLabel>Settings</SectionLabel>
            <NavLink to="/settings/website" className={getNavClass}>
              <Settings size={16} /> Website Settings
            </NavLink>
          </>
        )}

        {/* 7. SYSTEM & USERS */}
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
          </>
        )}
      </nav>

    </div>
  );
}

export default Sidebar;
