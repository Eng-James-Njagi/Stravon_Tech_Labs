import "../../css/about/company.css";

const cards = [
  {
    id: 1,
    title: "Who Are We?",
    image: "./Com.jpg",
    imagePosition: "left",
    body: 'Stravon Tech Labs is a digital solutions company based in Kangare, Murang\'a, Kenya. We specialize in crafting high-performance websites and impactful graphic designs that help businesses build a powerful digital presence and achieve measurable results."',
    badge: {
      icon: true,
      label: "Murang'a Town Murang'a County",
    },
  },
  {
    id: 2,
    title: "Our Approach",
    image: "./approach.png",
    imagePosition: "right",
    body: "We believe in true collaboration with our clients. Our process starts with understanding your business, audience, and objectives. From there, we create tailored solutions that meet your current needs while positioning you for future growth and success.",
    badge: null,
  },
  {
    id: 3,
    title: "Our Team",
    image: "./team.png",
    imagePosition: "left",
    body: "Our multidisciplinary team blends technical expertise with creative innovation. From developers who write clean, efficient code to designers who create visually compelling work, every team member is dedicated to delivering exceptional results.",
    badge: null,
  },
];

export default function Company() {
  return (
    <section className="about-section">
      <h2 className="about-section-title">Stravon Tech Labs</h2>

      <div className="about-cards">
        {cards.map((card) => (
          <div className="about-card" key={card.id}>
            <div
              className={`about-card-inner${
                card.imagePosition === "right" ? " image-right" : ""
              }`}
            >
              {card.image ? (
                <img
                  src={card.image}
                  alt={card.title}
                  className="about-card-img"
                />
              ) : (
                <div className="about-card-img-placeholder" />
              )}

              <div className="about-card-text">
                <h3 className="about-card-title">{card.title}</h3>
                <p className="about-card-body">{card.body}</p>

                {card.badge && (
                  <span className="about-location-badge">
                    {card.badge.icon && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    )}
                    {card.badge.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}