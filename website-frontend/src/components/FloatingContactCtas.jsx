"use client";

const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=917428500885&text=Hi%2C%20I%E2%80%99d%20like%20to%20book%20a%20consultation%20with%20DMC%20Trichology.%20Please%20find%20my%20details%20below%3A%0AName%3A%0AConcern%3A";
const CALL_URL = "tel:+919810939319";

const buttons = [
  {
    id: "whatsapp",
    href: WHATSAPP_URL,
    label: "Chat on WhatsApp",
    icon: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1781843125513-838406967.png",
    external: true,
  },
  {
    id: "call",
    href: CALL_URL,
    label: "Call DMC Trichology",
    icon: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1781843137866-347606793.png",
    external: false,
  },
];

export default function FloatingContactCtas() {
  return (
    <>
      <div className="floating-cta-stack" aria-label="Quick contact actions">
        {buttons.map((button) => (
          <a
            key={button.id}
            href={button.href}
            aria-label={button.label}
            className="floating-cta-button"
            {...(button.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <img src={button.icon} alt="" aria-hidden="true" className="floating-cta-icon" />
          </a>
        ))}
      </div>

      <div className="floating-cta-mobile-bar" aria-label="Quick contact bar">
        <a href={CALL_URL} aria-label="Call Now" className="floating-cta-mobile-button">
          <img
            src="https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1781843137866-347606793.png"
            alt=""
            aria-hidden="true"
            className="floating-cta-mobile-icon"
          />
          <span>Call Now</span>
        </a>
        <a
          href={WHATSAPP_URL}
          aria-label="WhatsApp"
          className="floating-cta-mobile-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1781843125513-838406967.png"
            alt=""
            aria-hidden="true"
            className="floating-cta-mobile-icon"
          />
          <span>WhatsApp</span>
        </a>
      </div>

      <style jsx>{`
        .floating-cta-stack {
          position: fixed;
          left: 20px;
          bottom: 20px;
          z-index: 1100;
          display: flex;
          flex-direction: column;
          gap: 12px;
          pointer-events: none;
        }

        .floating-cta-button {
          width: 58px;
          height: 58px;
          border-radius: 999px;
          background: #3b5998;
          border: 2px solid #ffffff;
          box-shadow: 0 14px 28px rgba(59, 89, 152, 0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.22s ease, filter 0.22s ease, box-shadow 0.22s ease;
          pointer-events: auto;
        }

        .floating-cta-button:hover {
          transform: translateY(-2px) scale(1.02);
          filter: drop-shadow(0 12px 22px rgba(59, 89, 152, 0.22));
          box-shadow: 0 18px 32px rgba(59, 89, 152, 0.28);
        }

        .floating-cta-icon {
          width: 30px;
          height: 30px;
          object-fit: contain;
          display: block;
        }

        .floating-cta-mobile-bar {
          display: none;
        }

        @media (max-width: 768px) {
          .floating-cta-stack {
            display: none;
          }

          .floating-cta-mobile-bar {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1200;
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: stretch;
            background: #3b5998;
            box-shadow: 0 -10px 28px rgba(20, 33, 61, 0.2);
            padding-bottom: env(safe-area-inset-bottom);
          }

          .floating-cta-mobile-button {
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            color: #ffffff;
            text-decoration: none;
            font-family: 'Marcellus', serif;
            font-size: 17px;
            line-height: 1;
            background: #3b5998;
            border-top: 1px solid rgba(255, 255, 255, 0.18);
            transition: background-color 0.2s ease, transform 0.2s ease;
          }

          .floating-cta-mobile-button + .floating-cta-mobile-button {
            border-left: 1px solid rgba(255, 255, 255, 0.18);
          }

          .floating-cta-mobile-button:active {
            transform: translateY(1px);
          }

          .floating-cta-mobile-button:hover {
            background: #344f89;
          }

          .floating-cta-mobile-icon {
            width: 22px;
            height: 22px;
            object-fit: contain;
            display: block;
          }

          :global(body) {
            padding-bottom: calc(60px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </>
  );
}
