import {
  Search,
  FileText,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose a Service",
    description:
      "Explore our services and find the right solution for your task.",
    icon: Search,
  },
  {
    number: "02",
    title: "Describe Your Task",
    description:
      "Tell the service provider what you need and share your requirements.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Get It Done",
    description:
      "Collaborate with the right expert and get your task completed.",
    icon: CheckCircle2,
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="section-heading">
        <span className="section-label">SIMPLE PROCESS</span>

        <h2>How It Works</h2>

        <p>
          Getting the right service for your task is simple.
        </p>
      </div>

      <div className="steps-grid">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div className="step-card" key={step.number}>
              <div className="step-number">{step.number}</div>

              <div className="step-icon">
                <Icon size={25} />
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default HowItWorks;