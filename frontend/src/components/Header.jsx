import { useLocation, useNavigate } from "react-router-dom";
import { clearAuth, getAuthUser } from "../utils/auth";
import { LogOut, User } from "lucide-react";

const titles = {
  "/dashboard": "Dashboard",
  "/seo": "SEO",
  "/blogs": "Blogs",
  "/gallery": "Gallery",
  "/testimonials": "Testimonials",
  "/services/categories": "Service Categories",
  "/services/second-categories": "Second Category",
  "/services/faqs": "Service FAQ",
  "/results/categories": "Result Category",
  "/results/list": "Result List",
  "/videos/categories": "Video Category",
  "/videos/list": "Video List",
  "/users/list": "User List",
  "/users/roles": "Role List",
  "/users/permissions": "Permissions",
  "/users/menus": "Menu List",
  "/users/operations": "Operations",
  "/users/menu-operations": "Menu Operations",
  "/leads/callback": "Request Callback",
  "/leads/contact": "Contact Leads",
  "/leads/treatment-enquiries": "Treatment Enquiries",
  "/leads/appointment": "Appointments",
};

function Header() {

  const location = useLocation();
  const navigate = useNavigate();
  const user = getAuthUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const pageTitle = titles[location.pathname] || "Dashboard";

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.875rem 1.5rem",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        position: "sticky",
        top: 0,
        zIndex: 20,
        gap: "1rem",
      }}
    >
      {/* Page title */}
      <div>
        <p
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#2563EB",
            margin: 0,
          }}
        >
          Admin Panel
        </p>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#0F172A",
            margin: 0,
            marginTop: "2px",
            lineHeight: 1.25,
          }}
        >
          {pageTitle}
        </h2>
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>


        {/* User info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            padding: "0.375rem 0.75rem",
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User size={14} color="#fff" />
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <p
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#0F172A",
                margin: 0,
              }}
            >
              {user?.name || "Admin User"}
            </p>
            <p
              style={{
                fontSize: "0.7rem",
                color: "#94A3B8",
                margin: 0,
              }}
            >
              {user?.email || "admin@dmc.com"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.5rem 0.875rem",
            borderRadius: "8px",
            border: "1px solid #E2E8F0",
            background: "#FFFFFF",
            color: "#475569",
            fontSize: "0.8rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
