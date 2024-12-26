import React from "react";
import {
  UserPlus,
  FileCheck,
  ClipboardCheck,
  SearchCode,
  Bell,
  Mail,
  Clock,
  DollarSign,
  Building,
  Briefcase,
  Users,
  CreditCard,
  CheckCircle,
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
    {/* Main connection line with gradient */}
    <div className="w-full h-px bg-gradient-to-r from-blue-500/50 via-blue-400/50 to-blue-300/50">
      {/* Animated glow effect */}
      <div className="absolute w-8 h-px bg-blue-400 animate-[shift_2s_ease-in-out_infinite]" />
    </div>

    {/* Decorative elements */}
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
    {/* Enhanced gradient background with better opacity handling */}
    <div
      className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.color} transform transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 opacity-90 blur-sm`}
    />

    {/* Main card content with refined styling */}
    <div className="relative h-72 p-8 bg-white dark:bg-gray-800/95 rounded-3xl shadow-lg backdrop-blur-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
      {/* Enhanced step number indicator */}
      <div className="absolute -top-4 left-8 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
        {index + 1}
      </div>

      {/* Icon container with refined styling */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50/90 to-gray-100/90 dark:from-gray-700/90 dark:to-gray-600/90 flex items-center justify-center mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-md">
        {step.icon}
      </div>

      {/* Content section with improved typography */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
        {step.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow text-lg">
        {step.description}
      </p>

      {/* Subtle decorative element */}
      <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full opacity-20 transform rotate-45" />
    </div>

    {!isLast && <StepConnector />}
  </div>
);

const HowItWorksSection = () => {
  const professionalSteps = [
    {
      icon: <UserPlus className="w-8 h-8 text-blue-500" />,
      title: "Register",
      description: "Sign up on MediShifts and verify your email.",
      color: "from-blue-500/20 via-blue-500/10 to-blue-600/30",
    },
    {
      icon: <FileCheck className="w-8 h-8 text-green-500" />,
      title: "Complete Your Profile",
      description:
        "Provide necessary details about your qualifications and experience.",
      color: "from-green-500/20 via-green-500/10 to-green-600/30",
    },
    {
      icon: <ClipboardCheck className="w-8 h-8 text-purple-500" />,
      title: "Admin Approval",
      description:
        "Wait for profile verification and approval within 24 hours. You'll be notified.",
      color: "from-purple-500/20 via-purple-500/10 to-purple-600/30",
    },
    {
      icon: <SearchCode className="w-8 h-8 text-indigo-500" />,
      title: "Apply for Jobs",
      description:
        "Browse and apply for short-term jobs that fit your schedule and expertise.",
      color: "from-indigo-500/20 via-indigo-500/10 to-indigo-600/30",
    },
    {
      icon: <Bell className="w-8 h-8 text-yellow-500" />,
      title: "Get Hired",
      description:
        "If selected, you'll be notified of the successful application.",
      color: "from-yellow-500/20 via-yellow-500/10 to-yellow-600/30",
    },
    {
      icon: <Mail className="w-8 h-8 text-red-500" />,
      title: "Receive Details",
      description: "Get hospital contact information via email and WhatsApp.",
      color: "from-red-500/20 via-red-500/10 to-red-600/30",
    },
    {
      icon: <Clock className="w-8 h-8 text-cyan-500" />,
      title: "Show Up",
      description:
        "Arrive on time and complete your assigned duties professionally.",
      color: "from-cyan-500/20 via-cyan-500/10 to-cyan-600/30",
    },
    {
      icon: <DollarSign className="w-8 h-8 text-emerald-500" />,
      title: "Receive Payment",
      description: "Get paid directly by the hospital upon job completion.",
      color: "from-emerald-500/20 via-emerald-500/10 to-emerald-600/30",
    },
  ];

  const hospitalSteps = [
    {
      icon: <Building className="w-8 h-8 text-blue-500" />,
      title: "Register Institution",
      description:
        "Sign up on MediShifts and complete your institution profile with necessary details.",
      color: "from-blue-500/20 via-blue-500/10 to-blue-600/30",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      title: "Get Verified",
      description:
        "Wait for admin verification and approval within 24 hours. You'll be notified once approved.",
      color: "from-green-500/20 via-green-500/10 to-green-600/30",
    },
    {
      icon: <Briefcase className="w-8 h-8 text-purple-500" />,
      title: "Post Requirements",
      description:
        "List your job requirements for doctors or nurses with complete details and salary information.",
      color: "from-purple-500/20 via-purple-500/10 to-purple-600/30",
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      title: "Review Applications",
      description:
        "Review profiles and credentials of interested healthcare professionals who apply.",
      color: "from-indigo-500/20 via-indigo-500/10 to-indigo-600/30",
    },
    {
      icon: <Bell className="w-8 h-8 text-yellow-500" />,
      title: "Select Professionals",
      description:
        "Choose the candidates that best match your requirements and initiate the hiring process.",
      color: "from-yellow-500/20 via-yellow-500/10 to-yellow-600/30",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-red-500" />,
      title: "Initial Payment",
      description:
        "Pay the platform commission (10% up to ₹300) of the total posted salary to proceed.",
      color: "from-red-500/20 via-red-500/10 to-red-600/30",
    },
    {
      icon: <Mail className="w-8 h-8 text-cyan-500" />,
      title: "Receive Details",
      description:
        "Get the selected professional's contact information and credentials via email.",
      color: "from-cyan-500/20 via-cyan-500/10 to-cyan-600/30",
    },
    {
      icon: <DollarSign className="w-8 h-8 text-emerald-500" />,
      title: "Complete Payment",
      description:
        "Pay the professional the agreed salary (minus the platform commission) upon joining.",
      color: "from-emerald-500/20 via-emerald-500/10 to-emerald-600/30",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title section */}
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

        {/* For Healthcare Professionals */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

        {/* For Hospitals/Institutions */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
