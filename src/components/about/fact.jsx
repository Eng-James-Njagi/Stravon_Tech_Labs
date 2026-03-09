"use client";
import { useState } from "react";
import "../../css/about/FaqContact.css";

// ─── DATA ────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    question: "How long does a typical website project take?",
    answer:
      "Project timelines vary based on complexity. Landing pages take 3–5 days, while e-commerce sites can take 30–60 days. We'll provide a detailed timeline with your proposal.",
  },
  {
    question: "Do you provide website maintenance after launch?",
    answer:
      "Yes, we offer comprehensive maintenance plans starting from KES 4,000/month, including security updates, backups, and content updates.",
  },
  {
    question: "Can you integrate M-Pesa payments?",
    answer:
      "Absolutely! We specialise in M-Pesa integration and have successfully implemented it for numerous e-commerce clients.",
  },
  {
    question: "Do you work with clients outside Kenya?",
    answer:
      "Yes, we serve clients globally. We use modern communication tools to ensure seamless collaboration regardless of location.",
  },
  {
    question: "What's included in the hosting service?",
    answer:
      "Our hosting includes reliable servers, security monitoring, regular backups, SSL certificates, and technical support.",
  },
];

const CONTACT_INFO = [
  {
    icon: "@",
    title: "Primary Contact",
    items: [
      { label: "Email", value: "midnightalpha031@gmail.com" },
      { label: "Phone", value: "+254 718852518" },
      { label: "WhatsApp", value: "+254 105140326" },
    ],
  },
  {
    icon: "📍",
    title: "Office Location",
    items: [{ value: "Murang'a, Murang'a County, Kenya" }],
  },
  {
    icon: "🕐",
    title: "Business Hours",
    items: [
      { label: "Monday – Friday", value: "8:00 AM – 6:00 PM" },
      { label: "Saturday", value: "9:00 AM – 4:00 PM" },
      { label: "Sunday", value: "Available for urgent support" },
    ],
  },
  {
    icon: "⚡",
    title: "Response Time",
    items: [
      { label: "Email inquiries", value: "Within 24 hours" },
      { label: "Phone calls", value: "Immediate during business hours" },
      { label: "Emergency support", value: "Available 24/7 for maintenance clients" },
    ],
  },
];

// ─── FAQ ITEM ─────────────────────────────────────────────────────────────────

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`stravon-faq-item stravon-slide-in${open ? " stravon-active" : ""}`}>
      <div className="stravon-faq-question" onClick={() => setOpen((v) => !v)}>
        <span>{question}</span>
        <div className="stravon-faq-toggle" />
      </div>
      <div className="stravon-faq-answer">
        <div className="stravon-faq-answer-content">{answer}</div>
      </div>
    </div>
  );
}

// ─── INFO CARD ────────────────────────────────────────────────────────────────

function InfoCard({ icon, title, items }) {
  return (
    <div className="stravon-info-card">
      <h3 className="stravon-info-title">
        <span className="stravon-info-icon">{icon}</span>
        {title}
      </h3>
      {items.map((item, i) => (
        <div key={i} className="stravon-info-item">
          {item.label && <strong>{item.label}: </strong>}
          {item.value}
        </div>
      ))}
    </div>
  );
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────

const INITIAL = {
  fullName: "", email: "", phone: "", company: "",
  projectType: "", budget: "", timeline: "", description: "",
  source: "", additional: "",
};

function ContactForm() {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Wire your email service / Next.js API route here
      console.log("Form submitted:", form);
      await new Promise((r) => setTimeout(r, 800));
      setForm(INITIAL);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stravon-contact-form">
      <form id="contactForm" onSubmit={handleSubmit}>

        {/* 2-col grid */}
        <div className="stravon-form-grid">
          <div className="stravon-form-group">
            <label className="stravon-form-label" htmlFor="fullName">Full Name *</label>
            <input type="text" id="fullName" name="fullName"
              className="stravon-form-input" required
              value={form.fullName} onChange={handleChange} />
          </div>
          <div className="stravon-form-group">
            <label className="stravon-form-label" htmlFor="email">Email Address *</label>
            <input type="email" id="email" name="email"
              className="stravon-form-input" required
              value={form.email} onChange={handleChange} />
          </div>
          <div className="stravon-form-group">
            <label className="stravon-form-label" htmlFor="phone">Phone Number *</label>
            <input type="tel" id="phone" name="phone"
              className="stravon-form-input" required
              value={form.phone} onChange={handleChange} />
          </div>
          <div className="stravon-form-group">
            <label className="stravon-form-label" htmlFor="company">Company / Organisation</label>
            <input type="text" id="company" name="company"
              className="stravon-form-input"
              value={form.company} onChange={handleChange} />
          </div>
          <div className="stravon-form-group">
            <label className="stravon-form-label" htmlFor="projectType">Project Type *</label>
            <select id="projectType" name="projectType"
              className="stravon-form-select" required
              value={form.projectType} onChange={handleChange}>
              <option value="">Select Project Type</option>
              <option value="web-development">Web Development</option>
              <option value="graphic-design">Graphic Design</option>
              <option value="both">Both</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="stravon-form-group">
            <label className="stravon-form-label" htmlFor="budget">Budget Range *</label>
            <select id="budget" name="budget"
              className="stravon-form-select" required
              value={form.budget} onChange={handleChange}>
              <option value="">Select Budget Range</option>
              <option value="under-20000">Under KES 20,000</option>
              <option value="20000-50000">KES 20,000–50,000</option>
              <option value="50000-100000">KES 50,000–100,000</option>
              <option value="100000-200000">KES 100,000–200,000</option>
              <option value="above-200000">Above KES 200,000</option>
            </select>
          </div>
        </div>

        {/* Timeline */}
        <div className="stravon-form-group">
          <label className="stravon-form-label" htmlFor="timeline">Project Timeline *</label>
          <select id="timeline" name="timeline"
            className="stravon-form-select" required
            value={form.timeline} onChange={handleChange}>
            <option value="">Select Timeline</option>
            <option value="asap">ASAP</option>
            <option value="1-2-weeks">1–2 weeks</option>
            <option value="1-month">1 month</option>
            <option value="2-3-months">2–3 months</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        {/* Description */}
        <div className="stravon-form-group">
          <label className="stravon-form-label" htmlFor="description">Project Description *</label>
          <textarea id="description" name="description"
            className="stravon-form-textarea" required
            placeholder="Describe your project goals, requirements, and vision..."
            value={form.description} onChange={handleChange} />
        </div>

        {/* Source + Additional */}
        <div className="stravon-form-grid">
          <div className="stravon-form-group">
            <label className="stravon-form-label" htmlFor="source">How did you hear about us?</label>
            <select id="source" name="source"
              className="stravon-form-select"
              value={form.source} onChange={handleChange}>
              <option value="">Select source</option>
              <option value="google">Google Search</option>
              <option value="social-media">Social Media</option>
              <option value="referral">Referral</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="stravon-form-group">
            <label className="stravon-form-label" htmlFor="additional">Additional Requirements</label>
            <textarea id="additional" name="additional"
              className="stravon-form-textarea"
              placeholder="Any specific requirements?"
              value={form.additional} onChange={handleChange} />
          </div>
        </div>

        <button
          type="submit"
          className={`stravon-submit-btn${loading ? " stravon-loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Project Inquiry"}
        </button>
      </form>

      {status === "success" && (
        <div className="stravon-success-message" style={{ display: "block" }}>
          ✓ Thank you for reaching out! We will review your project details and get back to you within 24 hours with a detailed proposal.
        </div>
      )}
      {status === "error" && (
        <div className="stravon-error-message" style={{ display: "block" }}>
          ✗ Something went wrong. Please try again or contact us directly.
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function FaqContact() {
  return (
    <div className="stravon-faq-contact-wrapper">
      <div className="stravon-bg-pattern" />

      <div className="stravon-container">

        {/* FAQ */}
        <section className="stravon-faq-section">
          <div className="stravon-section-header stravon-slide-in">
            <h2 className="stravon-section-title">Frequently Asked Questions</h2>
            <p className="stravon-section-subtitle">
              Get answers to common questions about our services
            </p>
          </div>
          <div className="stravon-faq-container">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} {...faq} />
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="stravon-contact-section stravon-slide-in">
          <div className="stravon-section-header">
            <h2 className="stravon-section-title">Get in Touch</h2>
            <p className="stravon-section-subtitle">
              Ready to bring your vision to life? Let's discuss your project
            </p>
          </div>
          <div className="stravon-contact-grid">
            <ContactForm />
            <div className="stravon-contact-info">
              {CONTACT_INFO.map((card, i) => (
                <InfoCard key={i} {...card} />
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}