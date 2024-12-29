import React from "react";
import {
  UserPlus,
  FileCheck,
  Briefcase,
  Bell,
  DollarSign,
  Building,
  MessageSquarePlus,
  Users,
  CreditCard,
  Star,
  ThumbsUp,
} from "lucide-react";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface StepCardProps {
  step: Step;
  index: number;
  isLast?: boolean;
}

const StepConnector = () => (
  <div className="hidden lg:flex absolute top-1/2 -right-8 transform -translate-y-1/2 w-16 items-center">
    <div className="w-full h-px bg-gradient-to-r from-blue-500/50 via-blue-400/50 to-blue-300/50">
      <div className="absolute w-8 h-px bg-blue-400 animate-[shift_2s_ease-in-out_infinite]" />
    </div>
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2">
      <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" />
      <div className="relative w-2 h-2 bg-blue-500 rounded-full" />
    </div>
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2">
      <div className="w-2 h-2 bg-blue-400 rounded-full" />
    </div>
  </div>
);

const StepCard: React.FC<StepCardProps> = ({ step, index, isLast = false }) => (
  <div
    className="relative group"
    data-aos="fade-up"
    data-aos-delay={index * 100}
  >
    <div
      className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.color} transform transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 opacity-90 blur-sm`}
    />
    <div className="relative h-72 p-8 bg-white dark:bg-gray-800/95 rounded-3xl shadow-lg backdrop-blur-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
      <div className="absolute -top-4 left-8 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
        {index + 1}
      </div>
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50/90 to-gray-100/90 dark:from-gray-700/90 dark:to-gray-600/90 flex items-center justify-center mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-md">
        {step.icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
        {step.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
        {step.description}
      </p>
    </div>
    {!isLast && index % 3 !== 2 && <StepConnector />}
  </div>
);

const HowItWorksSection = () => {
  const professionalSteps = [
    {
      icon: <UserPlus className="w-8 h-8 text-blue-500" />,
      title: "Sign Up & Verify",
      description:
        "Register on MediShifts, verify your email, and complete your profile with qualifications and experience.",
      color: "from-blue-500/20 via-blue-500/10 to-blue-600/30",
    },
    {
      icon: <FileCheck className="w-8 h-8 text-green-500" />,
      title: "Get Approved",
      description: "Wait for admin approval (within 24 hours).",
      color: "from-green-500/20 via-green-500/10 to-green-600/30",
    },
    {
      icon: <Briefcase className="w-8 h-8 text-purple-500" />,
      title: "Browse & Apply",
      description:
        "Explore short-term jobs that match your expertise and schedule.",
      color: "from-purple-500/20 via-purple-500/10 to-purple-600/30",
    },
    {
      icon: <Bell className="w-8 h-8 text-yellow-500" />,
      title: "Get Hired & Notified",
      description:
        "If selected, receive hospital contact details via email and WhatsApp.",
      color: "from-yellow-500/20 via-yellow-500/10 to-yellow-600/30",
    },
    {
      icon: <DollarSign className="w-8 h-8 text-emerald-500" />,
      title: "Work & Get Paid",
      description:
        "Show up on time, complete your duties, and receive payment directly from the hospital.",
      color: "from-emerald-500/20 via-emerald-500/10 to-emerald-600/30",
    },
    {
      icon: <Star className="w-8 h-8 text-orange-500" />,
      title: "Get Rated",
      description:
        "Receive ratings and reviews from hospitals to build your professional profile.",
      color: "from-orange-500/20 via-orange-500/10 to-orange-600/30",
    },
  ];

  const hospitalSteps = [
    {
      icon: <Building className="w-8 h-8 text-blue-500" />,
      title: "Sign Up & Verify",
      description:
        "Register on MediShifts, verify your email, and complete your institution's profile.",
      color: "from-blue-500/20 via-blue-500/10 to-blue-600/30",
    },
    {
      icon: <MessageSquarePlus className="w-8 h-8 text-green-500" />,
      title: "Post Job",
      description: "Share your requirements for healthcare professionals.",
      color: "from-green-500/20 via-green-500/10 to-green-600/30",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "Review & Hire",
      description:
        "View applicants' profiles, select the best match, and confirm the hire.",
      color: "from-purple-500/20 via-purple-500/10 to-purple-600/30",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-yellow-500" />,
      title: "Pay Commission",
      description:
        "Pay a 10% commission (up to ₹300), and receive the professional's contact details.",
      color: "from-yellow-500/20 via-yellow-500/10 to-yellow-600/30",
    },
    {
      icon: <DollarSign className="w-8 h-8 text-emerald-500" />,
      title: "Complete Payment",
      description:
        "Pay the professional's salary minus MediShifts' commission after the job is done.",
      color: "from-emerald-500/20 via-emerald-500/10 to-emerald-600/30",
    },
    {
      icon: <ThumbsUp className="w-8 h-8 text-orange-500" />,
      title: "Rate Professional",
      description:
        "Provide ratings and feedback for the healthcare professional's service.",
      color: "from-orange-500/20 via-orange-500/10 to-orange-600/30",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4 block">
            Simple Process
          </span>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Your Gateway to Healthcare Staffing - Follow these simple steps to
            get started with MediShifts
          </p>
        </div>

        <div className="mb-24">
          <div className="relative mb-16">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-8 py-3 bg-white dark:bg-gray-800 text-2xl font-bold text-gray-900 dark:text-white rounded-full shadow-sm">
                For Healthcare Professionals
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {professionalSteps.map((step, index) => (
              <StepCard
                key={index}
                step={step}
                index={index}
                isLast={index === professionalSteps.length - 1}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="relative mb-16">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-8 py-3 bg-white dark:bg-gray-800 text-2xl font-bold text-gray-900 dark:text-white rounded-full shadow-sm">
                For Hospitals/Institutions
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hospitalSteps.map((step, index) => (
              <StepCard
                key={index}
                step={step}
                index={index}
                isLast={index === hospitalSteps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;