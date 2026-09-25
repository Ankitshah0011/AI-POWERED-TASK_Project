import {
  ArrowRight,
  Star,
  Code2,
  Palette,
  Bot,
  BarChart3,
  PenTool,
  Megaphone,
  Brain,
  Image as ImageIcon,
} from "lucide-react";

const iconMap = {
  content: PenTool,
  design: Palette,
  development: Code2,
  ai: Bot,
  data: BarChart3,
  marketing: Megaphone,
  ml: Brain,
  image: ImageIcon,
};

function ServiceCard({ service }) {
  const Icon = iconMap[service.icon] || Bot;

  return (
    <article className="service-card">
      {/* Visual */}
      <div className={`service-card-visual ${service.visualClass}`}>
        <div className="visual-pattern"></div>

        <div className="service-visual-icon">
          <Icon size={42} strokeWidth={1.7} />
        </div>

        <span className="service-category-badge">
          {service.category}
        </span>
      </div>

      {/* Content */}
      <div className="service-card-content">
        <h3>{service.title}</h3>

        <p className="service-description">
          {service.description}
        </p>

        <div className="service-rating">
          <Star size={16} fill="currentColor" />
          <span>{service.rating}</span>
          <span className="review-count">
            ({service.reviews} reviews)
          </span>
        </div>

        <div className="service-card-bottom">
          <div>
            <span className="starting-label">Starting from</span>
            <strong>${service.price}</strong>
          </div>

          <button className="view-service-btn">
            View Service
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ServiceCard;