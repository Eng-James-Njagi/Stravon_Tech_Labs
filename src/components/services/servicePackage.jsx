"use client";
import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const PACKAGES_DATA = {
  "Web Development": {
    description:
      "Responsive, fast-loading websites optimised for search engines, accessibility, and scale.",
    sections: {
      "Website Packages": [
        {
          title: "Landing Page",
          price: "KES 8,000",
          subtitle: "Simple business presence",
          features: [
            "Single-page responsive design",
            "Strategic CTA placement",
            "Contact form integration",
            "Social media connectivity",
            "Basic SEO optimisation",
            "Hosting: KES 3,000/month",
            "Domain: KES 1,500/year",
            "Delivery: 3–5 business days",
          ],
          wa: "Landing%20Page%20package%20(KES%208%2C000)",
        },
        {
          title: "Entry Package",
          price: "KES 12,000",
          subtitle: "Great for small businesses",
          features: [
            "1–3 professional pages",
            "Mobile-responsive design",
            "Social media integration",
            "SEO foundation setup",
            "Contact information section",
            "Hosting: KES 4,000/month",
            "Domain: KES 1,500/year",
            "Delivery: 5–7 business days",
          ],
          wa: "Entry%20Package%20(KES%2012%2C000)",
        },
        {
          title: "Standard Package",
          price: "KES 25,000",
          subtitle: "Most popular choice",
          featured: true,
          features: [
            "4–6 custom pages",
            "Responsive design",
            "Social media integration",
            "SEO optimisation",
            "Google Maps integration",
            "Contact forms",
            "Analytics setup",
            "Delivery: 7–10 business days",
          ],
          wa: "Standard%20Package%20(KES%2025%2C000)",
        },
        {
          title: "Business Package",
          price: "KES 60,000",
          subtitle: "For growing businesses",
          features: [
            "6–10 professional pages",
            "Content Management System",
            "Media galleries",
            "Advanced SEO features",
            "Analytics dashboard",
            "Blog functionality",
            "Email setup",
            "Delivery: 14–21 business days",
          ],
          wa: "Business%20Package%20(KES%2060%2C000)",
        },
        {
          title: "Premium Package",
          price: "KES 120,000",
          subtitle: "Enterprise-level solution",
          features: [
            "11–16 custom pages",
            "Backend integration",
            "Admin dashboard",
            "Database-driven forms",
            "User account system",
            "Advanced security",
            "Performance optimisation",
            "6 months hosting included",
            "Delivery: 21–30 business days",
          ],
          wa: "Premium%20Package%20(KES%20120%2C000)",
        },
      ],
      "E-commerce Solutions": [
        {
          title: "E-commerce Basic",
          price: "KES 200,000",
          subtitle: "Start selling online",
          features: [
            "Up to 100 products",
            "Shopping cart functionality",
            "M-Pesa integration",
            "Order management",
            "Customer accounts",
            "Inventory tracking",
            "Mobile optimisation",
            "12 months support included",
            "Delivery: 30–45 business days",
          ],
          wa: "E-commerce%20Basic%20(KES%20200%2C000)",
        },
        {
          title: "E-commerce Advanced",
          price: "KES 350,000",
          subtitle: "Complete online store",
          featured: true,
          features: [
            "Unlimited products",
            "Advanced M-Pesa integration",
            "Multiple payment gateways",
            "Discount system",
            "Advanced inventory management",
            "Sales analytics",
            "CRM integration",
            "API integrations",
            "Advanced security",
            "12 months support included",
            "Delivery: 45–60 business days",
          ],
          wa: "E-commerce%20Advanced%20(KES%20350%2C000)",
        },
      ],
      "Maintenance Plans": [
        {
          title: "Basic Maintenance",
          price: "KES 4,000/mo",
          subtitle: "Essential upkeep",
          features: [
            "Up to 5 pages",
            "Security updates",
            "Weekly backups",
            "Email support",
            "1 hour monthly updates",
          ],
          wa: "Basic%20Maintenance%20(KES%204%2C000%2Fmonth)",
        },
        {
          title: "Standard Maintenance",
          price: "KES 6,000/mo",
          subtitle: "Comprehensive care",
          features: [
            "6–10 pages",
            "Daily backups",
            "Priority support",
            "3 hours monthly updates",
            "Performance reports",
          ],
          wa: "Standard%20Maintenance%20(KES%206%2C000%2Fmonth)",
        },
        {
          title: "Premium Maintenance",
          price: "KES 9,000/mo",
          subtitle: "Complete management",
          featured: true,
          features: [
            "11–20 pages",
            "24/7 monitoring",
            "Emergency support",
            "5 hours monthly updates",
            "SEO optimisation",
          ],
          wa: "Premium%20Maintenance%20(KES%209%2C000%2Fmonth)",
        },
        {
          title: "E-commerce Maintenance",
          price: "KES 20,000/mo",
          subtitle: "Store optimisation",
          features: [
            "Any size online store",
            "Product management",
            "Payment monitoring",
            "10 hours monthly updates",
            "Sales analysis",
            "Conversion optimisation",
          ],
          wa: "E-commerce%20Maintenance%20(KES%2020%2C000%2Fmonth)",
        },
      ],
    },
  },
  "Graphic Design": {
    description:
      "Consistent brand identity across all marketing materials — from logos to complete brand packages.",
    sections: {
      "Logo Design": [
        {
          title: "Logo Design",
          price: "KES 10,000",
          subtitle: "Professional brand identity",
          featured: true,
          features: [
            "3 original concept designs",
            "3 rounds of revisions",
            "All file formats (PNG, JPG, SVG, AI)",
            "Brand guidelines document",
            "Commercial usage rights",
          ],
          wa: "Logo%20Design%20(KES%2010%2C000)",
        },
      ],
      "Marketing Materials": [
        {
          title: "Business Cards",
          price: "KES 1,000",
          subtitle: "Professional networking",
          features: [
            "Custom design",
            "High-quality print ready",
            "Multiple format options",
            "Brand consistency",
          ],
          wa: "Business%20Cards%20(KES%201%2C000)",
        },
        {
          title: "Flyers",
          price: "KES 1,000",
          subtitle: "Promotional materials",
          features: [
            "Eye-catching design",
            "Print-ready format",
            "Custom messaging",
            "Brand alignment",
          ],
          wa: "Flyers%20(KES%201%2C000)",
        },
        {
          title: "Posters",
          price: "KES 1,000",
          subtitle: "Large format advertising",
          features: [
            "High-impact design",
            "Large format optimisation",
            "Attention-grabbing visuals",
            "Professional layout",
          ],
          wa: "Posters%20(KES%201%2C000)",
        },
        {
          title: "Banners",
          price: "KES 1,000",
          subtitle: "Event & web banners",
          features: [
            "Web & print formats",
            "Event customisation",
            "Brand integration",
            "Multiple size options",
          ],
          wa: "Banners%20(KES%201%2C000)",
        },
      ],
      "Digital Assets": [
        {
          title: "Social Media Carousels",
          price: "KES 250/slide",
          subtitle: "Engaging social content",
          features: [
            "Platform-optimised sizing",
            "Consistent branding",
            "Engaging visuals",
            "Multiple format delivery",
          ],
          wa: "Social%20Media%20Carousels%20(KES%20250%2Fslide)",
        },
        {
          title: "Photo Manipulation",
          price: "KES 1,000",
          subtitle: "Professional editing",
          features: [
            "Advanced retouching",
            "Background removal",
            "Colour correction",
            "Creative effects",
          ],
          wa: "Photo%20Manipulation%20(KES%201%2C000)",
        },
        {
          title: "Digital Banners",
          price: "KES 1,000",
          subtitle: "Web advertising",
          features: [
            "Web-optimised formats",
            "Responsive design",
            "CTA focused",
            "Multiple size variations",
          ],
          wa: "Digital%20Banners%20(KES%201%2C000)",
        },
      ],
      Publications: [
        {
          title: "Magazine Design",
          price: "KES 500/page",
          subtitle: "Professional layouts",
          features: [
            "Professional typography",
            "Custom layouts",
            "Print-ready formatting",
            "Brand consistency",
          ],
          wa: "Magazine%20Design%20(KES%20500%2Fpage)",
        },
        {
          title: "Company Profile",
          price: "KES 500/page",
          subtitle: "Corporate presentation",
          features: [
            "Professional design",
            "Corporate branding",
            "Content organisation",
            "Print & digital formats",
          ],
          wa: "Company%20Profile%20(KES%20500%2Fpage)",
        },
        {
          title: "Brochures",
          price: "KES 500/page",
          subtitle: "Marketing collateral",
          features: [
            "Tri-fold & bi-fold designs",
            "Marketing focused",
            "Professional imagery",
            "CTA placement",
          ],
          wa: "Brochures%20(KES%20500%2Fpage)",
        },
      ],
    },
  },
  "Specialized Services": {
    description:
      "Advanced technical services to enhance your digital presence and streamline operations.",
    sections: {
      "Specialized Services": [
        {
          title: "M-Pesa Integration",
          price: "KES 25,000",
          subtitle: "Mobile payment solution",
          features: [
            "Secure payment processing",
            "Transaction reporting",
            "Automated receipt generation",
            "Testing and deployment",
          ],
          wa: "M-Pesa%20Integration%20(KES%2025%2C000)",
        },
        {
          title: "SEO Management",
          price: "KES 15,000/mo",
          subtitle: "Search optimisation",
          features: [
            "Keyword research & optimisation",
            "Content strategy development",
            "Technical SEO implementation",
            "Monthly performance reports",
          ],
          wa: "SEO%20Management%20(KES%2015%2C000%2Fmonth)",
        },
        {
          title: "Social Media Management",
          price: "KES 20,000/mo",
          subtitle: "Complete social presence",
          featured: true,
          features: [
            "Content calendar creation",
            "Daily posting across platforms",
            "Community engagement",
            "Analytics and reporting",
          ],
          wa: "Social%20Media%20Management%20(KES%2020%2C000%2Fmonth)",
        },
        {
          title: "Custom API Integration",
          price: "KES 40,000–60,000",
          subtitle: "System connections",
          features: [
            "Third-party system connections",
            "Data synchronisation",
            "Testing and documentation",
            "Ongoing support",
          ],
          wa: "Custom%20API%20Integration%20(KES%2040%2C000-60%2C000)",
        },
        {
          title: "Training Sessions",
          price: "KES 7,000/session",
          subtitle: "Personalised training",
          features: [
            "2-hour personalised training",
            "Custom materials provided",
            "30 days email support",
            "Website management guidance",
          ],
          wa: "Training%20Sessions%20(KES%207%2C000%2Fsession)",
        },
      ],
    },
  },
};

const PHONE = "254105140326"; // 0105140326 → international format

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function PackageCard({ pkg }) {
  const summary = [
    `Hi, I'd like to inquire about the *${pkg.title}* package.`,
    ``,
    `📦 *Package:* ${pkg.title}`,
    `💰 *Price:* ${pkg.price}`,
    `📝 *About:* ${pkg.subtitle}`,
    ``,
    `✅ *Includes:*`,
    ...pkg.features.map((f) => `  • ${f}`),
    ``,
    `Please provide more details and next steps. Thank you.`,
  ].join("\n");

  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(summary)}`;

  return (
    <div
      style={{
        border: pkg.featured ? "2px solid #c8a84b" : "1px solid #e5e0d5",
        borderRadius: 12,
        padding: "24px 20px",
        background: pkg.featured ? "#fffdf5" : "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        position: "relative",
        boxShadow: pkg.featured
          ? "0 4px 20px rgba(200,168,75,0.15)"
          : "0 2px 8px rgba(0,0,0,0.05)",
        transition: "transform 0.18s, box-shadow 0.18s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = pkg.featured
          ? "0 8px 28px rgba(200,168,75,0.25)"
          : "0 6px 18px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = pkg.featured
          ? "0 4px 20px rgba(200,168,75,0.15)"
          : "0 2px 8px rgba(0,0,0,0.05)";
      }}
    >
      {pkg.featured && (
        <span
          style={{
            position: "absolute",
            top: -11,
            left: 16,
            background: "#c8a84b",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "2px 10px",
            borderRadius: 20,
            fontFamily: "inherit",
          }}
        >
          Popular
        </span>
      )}

      {/* Price */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#c8a84b",
          letterSpacing: "-0.02em",
          marginBottom: 2,
          fontFamily: "'Georgia', serif",
        }}
      >
        {pkg.price}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#1a1a1a",
          marginBottom: 2,
        }}
      >
        {pkg.title}
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 12,
          color: "#888",
          marginBottom: 16,
        }}
      >
        {pkg.subtitle}
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: pkg.featured ? "#ede4c8" : "#f0ece4",
          marginBottom: 14,
        }}
      />

      {/* Features */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {pkg.features.map((f, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              fontSize: 13,
              color: "#444",
              lineHeight: 1.4,
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#c8a84b22",
                border: "1.5px solid #c8a84b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                <path
                  d="M1 2.5L2.8 4L6 1"
                  stroke="#c8a84b"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          marginTop: 20,
          textAlign: "center",
          padding: "10px 0",
          borderRadius: 8,
          background: pkg.featured ? "#c8a84b" : "transparent",
          border: `1.5px solid ${pkg.featured ? "#c8a84b" : "#c8a84b"}`,
          color: pkg.featured ? "#fff" : "#c8a84b",
          fontWeight: 700,
          fontSize: 13,
          textDecoration: "none",
          letterSpacing: "0.04em",
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#c8a84b";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = pkg.featured ? "#c8a84b" : "transparent";
          e.currentTarget.style.color = pkg.featured ? "#fff" : "#c8a84b";
        }}
      >
        Get Started
      </a>
    </div>
  );
}

function Section({ title, packages }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ marginBottom: 28 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px 0",
          marginBottom: open ? 18 : 0,
          width: "100%",
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: "#f5edd8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "transform 0.2s",
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
          }}
        >
          <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
            <path
              d="M1 1.5L5 5.5L9 1.5"
              stroke="#c8a84b"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#1a1a1a",
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            color: "#aaa",
            fontWeight: 500,
          }}
        >
          {packages.length} package{packages.length !== 1 ? "s" : ""}
        </span>
      </button>

      {open && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {packages.map((pkg, i) => (
            <PackageCard key={i} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ServicePackages() {
  const tabs = Object.keys(PACKAGES_DATA);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const { description, sections } = PACKAGES_DATA[activeTab];

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "40px 20px",
        background: "#f9f7f3",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: "#1a1a1a",
            margin: "0 0 8px",
            fontFamily: "'Georgia', serif",
            letterSpacing: "-0.03em",
          }}
        >
          Service Packages
        </h1>
        <p style={{ color: "#888", fontSize: 14, margin: 0 }}>
          Choose the right solution for your business
        </p>
      </div>

      {/* Tab Navigation */}
      <style>{`
        .sp-tab-bar {
          display: flex;
          flex-direction: row;
          gap: 8px;
          background: #eee9de;
          border-radius: 12px;
          padding: 6px;
          width: fit-content;
          margin: 0 auto 32px;
        }
        @media (max-width: 480px) {
          .sp-tab-bar {
            flex-direction: column;
            width: 100%;
          }
          .sp-tab-bar button {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
      <div className="sp-tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.01em",
              background: activeTab === tab ? "#c8a84b" : "transparent",
              color: activeTab === tab ? "#fff" : "#666",
              transition: "background 0.18s, color 0.18s",
              fontFamily: "inherit",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 14,
          color: "#666",
          maxWidth: 620,
          lineHeight: 1.6,
          margin: "0 auto 36px",
          textAlign: "center",
        }}
      >
        {description}
      </p>

      {/* Sections */}
      {Object.entries(sections).map(([sectionTitle, packages]) => (
        <Section key={sectionTitle} title={sectionTitle} packages={packages} />
      ))}
    </div>
  );
}