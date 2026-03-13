import "../../css/portfolio/testimonial.css";

const testimonials = [
  {
    id: 1,
    name: "Rose Ngugi",
    company: "GSSSystem",
    rating: 3,
    text: "Stravon Tech Lab exceeded my expectations while developing a custom sales and stock management system for my school project. Their team was professional and responsive, delivering a reliable solution that can easily adapt into a full business system. I highly recommend them for their expertise and commitment to client satisfaction.",
    avatar: null,
  },
  {
    id: 2,
    name: "Terry Grace",
    company: "Venture Capital System",
    rating: 2,
    text: "Stravon Tech Labs transformed our online presence completely. The new website not only looks professional but has increased our customer inquiries by 200%.",
    avatar: null,
  },
  {
    id: 3,
    name: "John Ngugi",
    company: "NewLife System",
    rating: 4,
    text: "Stravon Tech Labs transformed our online presence completely. The new website not only looks professional but has increased our customer inquiries by 200%.",
    avatar: null,
  },
  {
    id: 4,
    name: "Amara Osei",
    company: "BrightPath Ltd",
    rating: 3,
    text: "Stravon Tech Labs transformed our online presence completely. The new website not only looks professional but has increased our customer inquiries by 200%.",
    avatar: null,
  },
];

function Stars({ rating, total = 5 }) {
  return (
    <div className="testimonial-stars">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`star${i >= rating ? " empty" : ""}`}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <span className="testimonials-eyebrow">Client Testimonials</span>
        <h2 className="testimonials-title">
          What Our <span>Clients Say</span>
        </h2>
        <p className="testimonials-subtitle">
          Real results from real businesses. Here's how we've helped our clients grow.
        </p>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((t) => (
          <div className="testimonial-card" key={t.id}>
            <Stars rating={t.rating} />

            <div className="testimonial-profile">
              {t.avatar ? (
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="testimonial-avatar"
                />
              ) : (
                <div className="testimonial-avatar-placeholder" />
              )}
              <div className="testimonial-info">
                <p className="testimonial-name">{t.name}</p>
                <p className="testimonial-company">{t.company}</p>
              </div>
            </div>

            <div className="testimonial-divider" />

            <p className="testimonial-text">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}