/**
 * ServiceCategoryCard
 * -------------------
 * Displays one category tile (icon, title, description, count of services).
 *
 * "color" is a small keyword ("blue" | "purple" | "green" | "orange" | "red")
 * used to tint just the icon container, so each category feels distinct
 * without breaking the overall navy/blue identity of the page.
 */
function ServiceCategoryCard({ icon: Icon, title, description, count, color = "blue" }) {
  return (
    <div className={`category-card category-card--${color}`}>
      <div className="category-card__icon">
        <Icon size={24} strokeWidth={2} />
      </div>
      <h3 className="category-card__title">{title}</h3>
      <p className="category-card__description">{description}</p>
      <span className="category-card__count">{count}</span>
    </div>
  );
}

export default ServiceCategoryCard;
