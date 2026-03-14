import "../css/points.css"

const cards = [
  {
    id: 1,
    title: 'Expert Web Development Designs',
    body: 'Professional designs built with modern technologies and industry best practices for optimal performance and user experience.',
    tags: ['Responsive', 'Responsive'],
    imagePosition: 'left',
    imageSrc: 'sample3.png',
  },
  {
    id: 2,
    title: 'Custom Solutions to your Needs',
    body: 'Every project is unique, crafted specifically to align with your business objectives and target audience requirements.',
    tags: ['Different Industries', 'Powerful Solutions'],
    imagePosition: 'right',
    imageSrc: 'second.png',
  },
  {
    id: 3,
    title: 'Ongoing Support and Maintenance',
    body: 'Comprehensive maintenance and support services to ensure your digital presence stays strong and up-to-date.',
    tags: ['Existing Websites', 'Website Redesign', 'Website Management'],
    imagePosition: 'left',
    imageSrc: 'Icons.png',
  },
  {
    id: 4,
    title: 'Proven Results Across Industries',
    body: 'A successful track record of delivering impactful digital solutions across multiple industries and business sizes.',
    tags: ['Satisfactory Clients'],
    imagePosition: 'right',
    imageSrc: 'THird.png',
  },
];

export default function PointsSection() {
  return (
    <section className="about-section">
      <h2 className="about-section-title">Our Tags</h2>

      <div className="about-cards">
        {cards.map((card) => (
          <div className="about-card" key={card.id}>
            <div className={`about-card-inner${card.imagePosition === 'right' ? ' image-right' : ''}`}>
              {card.imageSrc ? (
                <img src={card.imageSrc} alt={card.title} className="about-card-img" />
              ) : (
                <div className="about-card-img-placeholder" aria-hidden="true" />
              )}
              <div className="about-card-text">
                <h3 className="about-card-title">{card.title}</h3>
                <p className="about-card-body">{card.body}</p>
                {card.tags.length > 0 && (
                  <div className="about-card-tags">
                    {card.tags.map((tag, i) => (
                      <span key={i} className="about-card-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}