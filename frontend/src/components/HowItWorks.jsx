import { Search, MessageSquare, CheckCircle } from "lucide-react";

// Steps live in an array so we can render them with .map() instead of
// writing the same block of JSX three times.
const steps = [
  {
    id: 1,
    icon: Search,
    title: "Find a Service",
    description: "Browse services and find the right professional for your task.",
  },
  {
    id: 2,
    icon: MessageSquare,
    title: "Connect & Discuss",
    description: "Connect with the service provider and discuss your requirements.",
  },
  {
    id: 3,
    icon: CheckCircle,
    title: "Get It Done",
    description: "Track progress and receive your completed work.",
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="section-heading">
        <h2>How It Works</h2>
        <p>Three simple steps to get your task done.</p>
      </div>

      <div className="how-it-works__steps">
        {steps.map((step, index) => (
          <div className="how-it-works__step" key={step.id}>
            <div className="how-it-works__marker">
              <span className="how-it-works__number">{step.id}</span>
              <div className="how-it-works__icon">
                <step.icon size={20} strokeWidth={2} />
              </div>
            </div>
            {/* Connecting line between steps, hidden after the last step */}
            {index < steps.length - 1 && (
              <span className="how-it-works__line" aria-hidden="true" />
            )}
            <h3 className="how-it-works__title">{step.title}</h3>
            <p className="how-it-works__description">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
