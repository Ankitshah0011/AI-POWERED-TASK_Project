import { Star } from "lucide-react";

/**
 * ServiceCard
 * -----------
 * A single reusable card used to display one service.
 *
 * This component receives all of its content through PROPS.
 * That means the same component can be reused for every service
 * in the list — only the data passed in changes, not the JSX.
 *
 * Props:
 *  - icon: a lucide-react icon component (not JSX, the component itself)
 *  - title: service title, e.g. "Build a Modern React Website"
 *  - category: category label shown as a small badge, e.g. "Web Development"
 *  - description: one or two line summary of the service
 *  - price: number, e.g. 2999 (we format it with ₹ and commas below)
 *  - rating: number, e.g. 4.9
 *  - reviews: number of reviews, e.g. 124
 *  - provider: name of the person/team offering the service
 */
function ServiceCard({
  icon: Icon,
  title,
  category,
  description,
  price,
  rating,
  reviews,
  provider,
}) {
  return (
    <article className="service-card">
      <div className="service-card__top">
        <div className="service-card__icon">
          <Icon size={22} strokeWidth={2} />
        </div>
        <span className="service-card__category">{category}</span>
      </div>

      <h3 className="service-card__title">{title}</h3>
      <p className="service-card__description">{description}</p>

      <div className="service-card__meta">
        <div className="service-card__rating">
          <Star size={15} className="service-card__star" />
          <span className="service-card__rating-value">{rating}</span>
          <span className="service-card__reviews">({reviews})</span>
        </div>
        <span className="service-card__provider">by {provider}</span>
      </div>

      <div className="service-card__footer">
        <div className="service-card__price">
          <span className="service-card__price-label">Starting at</span>
          <span className="service-card__price-value">
            ₹{price.toLocaleString("en-IN")}
          </span>
        </div>
        <button type="button" className="btn btn--primary btn--sm">
          View Service
        </button>
      </div>
    </article>
  );
}

export default ServiceCard;
