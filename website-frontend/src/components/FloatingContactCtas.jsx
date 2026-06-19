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
          width: 42px;
          height: 42px;
          object-fit: contain;
          display: block;
        }

        @media (max-width: 767px) {
          .floating-cta-stack {
            left: 16px;
            bottom: 16px;
            gap: 10px;
          }

          .floating-cta-button {
            width: 54px;
            height: 54px;
          }

          .floating-cta-icon {
            width: 38px;
            height: 38px;
          }
        }
      `}</style>
    </>
  );
}
