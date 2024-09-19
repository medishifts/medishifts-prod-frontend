import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../styles/PricingSection.css"; // Ensure you have appropriate CSS for animations

interface Plan {
  name: string;
  description: string;
  price: string;
  features: string[];
  buttonLabel: string;
  buttonLink: string;
}

interface PricingCardProps {
  plan: Plan;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-black transform transition duration-500 hover:scale-105">
    <div className="p-6">
      <h2 className="text-xl leading-6 font-bold text-gray-900 dark:text-gray-100">
        {plan.name}
      </h2>
      <p className="mt-2 text-base text-gray-700 dark:text-gray-300 leading-tight">
        {plan.description}
      </p>
      <p className="mt-8">
        <span className="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tighter">
          {plan.price}
        </span>
        <span className="text-base font-medium text-gray-500 dark:text-gray-400">
          /mo
        </span>
      </p>
      <a
        href={plan.buttonLink}
        className="mt-8 block w-full bg-gray-900 dark:bg-gray-600 rounded-md py-2 text-sm font-semibold text-white dark:text-gray-100 text-center"
      >
        {plan.buttonLabel}
      </a>
    </div>
    <div className="pt-6 pb-8 px-6">
      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-wide uppercase">
        What s included
      </h3>
      <ul className="mt-4 space-y-3" role="list">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0 h-5 w-5 text-green-400 dark:text-green-300"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M5 12l5 5l10 -10"></path>
            </svg>
            <span className="text-base text-gray-700 dark:text-gray-300">
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const monthlyPlans: Plan[] = [
  {
    name: "Starter",
    description: "For new makers who want to fine-tune and test an idea.",
    price: "$0",
    features: [
      "1 landing page included",
      "1,000 visits/mo",
      "Access to all UI blocks",
      "50 conversion actions included",
      "5% payment commission",
      "Real-time analytics",
    ],
    buttonLabel: "Join as a Starter",
    buttonLink: "/sign-up",
  },
  {
    name: "Superior",
    description:
      "For creators with multiple ideas who want to efficiently test and refine them.",
    price: "$8",
    features: [
      "All Free features",
      "5 landing pages included",
      "50,000 visits/mo",
      "1,000 conversion actions included",
      "1% payment commission",
    ],
    buttonLabel: "Join as a Superior",
    buttonLink: "/sign-up",
  },
  {
    name: "Shipper",
    description: "For productive shippers who want to work more efficiently.",
    price: "$15",
    features: [
      "All Standard features",
      "20 landing pages included",
      "200,000 visits/mo",
      "5,000 conversion actions included",
      "No payment commission",
    ],
    buttonLabel: "Join as a Shipper",
    buttonLink: "/sign-up",
  },
];

const yearlyPlans: Plan[] = [
  {
    name: "Starter",
    description: "For new makers who want to fine-tune and test an idea.",
    price: "$0",
    features: [
      "1 landing page included",
      "1,000 visits/yr",
      "Access to all UI blocks",
      "50 conversion actions included",
      "5% payment commission",
      "Real-time analytics",
    ],
    buttonLabel: "Join as a Starter",
    buttonLink: "/sign-up",
  },
  {
    name: "Superior",
    description:
      "For creators with multiple ideas who want to efficiently test and refine them.",
    price: "$80",
    features: [
      "All Free features",
      "5 landing pages included",
      "50,000 visits/yr",
      "1,000 conversion actions included",
      "1% payment commission",
    ],
    buttonLabel: "Join as a Superior",
    buttonLink: "/sign-up",
  },
  {
    name: "Shipper",
    description: "For productive shippers who want to work more efficiently.",
    price: "$150",
    features: [
      "All Standard features",
      "20 landing pages included",
      "200,000 visits/yr",
      "5,000 conversion actions included",
      "No payment commission",
    ],
    buttonLabel: "Join as a Shipper",
    buttonLink: "/sign-up",
  },
];

const PricingSection: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const handleBillingPeriodChange = (period: "monthly" | "yearly") => {
    setBillingPeriod(period);
  };

  return (
    <div className="flex w-full flex-col bg-gray-100 dark:bg-black py-16">
      <div className="sm:flex sm:flex-col sm:align-center px-4 sm:px-10">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 text-center mb-8">
          Our Pricing Plans
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 text-center mb-12">
          Choose the plan that best suits your needs. Whether you re just
          getting started or you re ready to scale, we have a plan for you.
        </p>
        <div className="relative self-center bg-gray-200 dark:bg-gray-800 rounded-lg p-0.5 flex">
          <button
            type="button"
            onClick={() => handleBillingPeriodChange("monthly")}
            className={`relative w-1/2 rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none sm:w-auto sm:px-8 ${
              billingPeriod === "monthly"
                ? "bg-gray-50 dark:bg-gray-700 border-gray-50 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "bg-transparent border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400"
            }`}
          >
            Monthly billing
          </button>
          <button
            type="button"
            onClick={() => handleBillingPeriodChange("yearly")}
            className={`ml-0.5 relative w-1/2 border rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none sm:w-auto sm:px-8 ${
              billingPeriod === "yearly"
                ? "border-transparent text-gray-900 dark:text-gray-100"
                : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400"
            }`}
          >
            Yearly billing
          </button>
        </div>
        <div className="mt-12 space-y-3 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 md:max-w-5xl md:mx-auto xl:grid-cols-3">
          <TransitionGroup component={null}>
            {(billingPeriod === "monthly" ? monthlyPlans : yearlyPlans).map(
              (plan, index) => (
                <CSSTransition
                  key={index}
                  timeout={300}
                  classNames="pricing-card"
                >
                  <PricingCard plan={plan} />
                </CSSTransition>
              )
            )}
          </TransitionGroup>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
