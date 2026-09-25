import {
  Sparkles,
  Code2,
  Palette,
  PenTool,
  BarChart3,
  Megaphone,
} from "lucide-react";

const icons = {
  "All Services": Sparkles,
  "AI & Automation": Sparkles,
  Development: Code2,
  Design: Palette,
  Content: PenTool,
  "Data & Analytics": BarChart3,
  Marketing: Megaphone,
};

function ServiceCategoryCard({
  category,
  activeCategory,
  onClick,
}) {
  const Icon = icons[category] || Sparkles;
  const isActive = activeCategory === category;

  return (
    <button
      className={`category-filter ${isActive ? "active" : ""}`}
      onClick={() => onClick(category)}
    >
      <Icon size={18} />
      <span>{category}</span>
    </button>
  );
}

export default ServiceCategoryCard;