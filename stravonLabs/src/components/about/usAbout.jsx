import "../../css/about/usAbout.css";

const cards = [
  {
    id: 1,
    title: "Our Mission",
    image: "./mission1.png",
    type: "text",
    content:
      "Empowering businesses through innovative digital solutions that drive growth, elevate user experiences, and create meaningful brand connections.",
  },
  {
    id: 2,
    title: "Our Vision",
    image: "./vision.png",
    type: "text",
    content:
      "To be Kenya's most trusted digital partner, transforming businesses through exceptional web development and design.",
  },
  {
    id: 3,
    title: "Our Goals",
    image: "./goals.png",
    type: "list",
    content: [
      "Create digital experiences that consistently exceed expectations",
      "Build lasting partnerships through exceptional service and support",
      "Lead with cutting-edge technology and design innovation",
      "Drive Kenya's digital economy forward",
    ],
  },
];

export default function PointsUs() {
  return (
    <section className="points-section">
      <div className="points-grid">
        {cards.map((card) => (
          <div className="points-card" key={card.id}>
            {card.image ? (
              <img
                src={card.image}
                alt={card.title}
                className="points-card-image"
              />
            ) : (
              <div className="points-card-image-placeholder" />
            )}

            <div className="points-card-body">
              <h3 className="points-card-title">{card.title}</h3>

              {card.type === "text" ? (
                <p className="points-card-text">{card.content}</p>
              ) : (
                <ul className="points-card-list">
                  {card.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}