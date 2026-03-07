import "../../css/portfolio/PortfolioSec.css";

const projects = [
   {
      id: 1,
      company: "Modern Living Furniture Co.",
      problem: "Poor product visualization online",
      tag: "E-Commerce",
      imageUrl: "",
   },
   {
      id: 2,
      company: "Horizon Realty Group",
      problem: "Leads not converting from website",
      tag: "Real Estate",
      imageUrl: "",
   },
   {
      id: 3,
      company: "Apex Fitness Studio",
      problem: "No online booking or member retention system",
      tag: "Health & Wellness",
      imageUrl: "",
   },
   {
      id: 4,
      company: "Bramble & Co. Café",
      problem: "Invisible to local search, no digital presence",
      tag: "Food & Beverage",
      imageUrl: "",
   },
];

const ArrowIcon = () => (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
   </svg>
);

const ImagePlaceholder = ({ imageUrl, company }) => {
   if (imageUrl) {
      return <img src={imageUrl} alt={company} className="card-image" />;
   }

   return (
      <div className="image-placeholder">
         <div className="image-placeholder-grid" />
         <div className="image-placeholder-icon">
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
               <rect x="1" y="1" width="18" height="14" rx="2" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
               <circle cx="6.5" cy="5.5" r="1.5" fill="rgba(0,0,0,0.2)" />
               <path d="M1 11l4-3 3 3 3-4 5 5" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
         </div>
         <span className="image-placeholder-label">Project Preview</span>
      </div>
   );
};

const ProjectCard = ({ project }) => (
   <div className="project-card">
      <div className="card-image-wrapper">
         <ImagePlaceholder imageUrl={project.imageUrl} company={project.company} />
         <span className="card-tag">{project.tag}</span>
         <div className="card-arrow">
            <ArrowIcon />
         </div>
      </div>

      <div className="card-body">
         <p className="card-company">{project.company}</p>
         <div className="card-problem-row">
            <span className="card-problem-label">Problem:</span>
            <span className="card-problem-text">{project.problem}</span>
         </div>
         <button className="card-btn">View Solution</button>
      </div>
   </div>
);

export default function PortfolioSec() {
   return (
      <section className="success-section">
         <div className="success-inner">
            <div className="success-header">
               <span className="section-eyebrow">Case Studies</span>
               <h2 className="section-title">
                  Real Challenges.<br /><span>Real Results.</span>
               </h2>
               <p className="section-subtitle">
                  Behind every project is a business that needed more than just a website
                  or platform—they needed a competitive edge. Explore how we've helped
                  companies across industries turn their biggest challenges into their greatest opportunities
               </p>
               <div className="divider" />
            </div>

            <div className="projects-grid">
               {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
               ))}
            </div>
         </div>
      </section>
   );
}