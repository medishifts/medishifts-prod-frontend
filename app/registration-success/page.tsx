"use client";
import LoginModal from "@/components/LoginModal";
import React, { useState, useEffect } from "react";
import { Check, Mail, ArrowRight } from "lucide-react";

const Page: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleSwitchToSignUp = () => {
    console.log("Switching to SignUp modal...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-5 bg-center bg-no-repeat bg-cover" />

      <div className="relative flex flex-col justify-center items-center min-h-screen p-4 sm:p-8">
        {/* Success Icon */}
        <div
          className={`mb-8 transform transition-all duration-700 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-20 opacity-0"
          }`}
        >
          <div className="bg-green-100 rounded-full p-4">
            <Check className="w-12 h-12 text-green-500" />
          </div>
        </div>

        {/* Main Content Container */}
        <div
          className={`w-full max-w-3xl transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          <div className="bg-white/90 backdrop-blur-sm p-8 sm:p-12 md:p-16 rounded-2xl shadow-xl border border-blue-100">
            {/* Header */}
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
              Welcome to Medishifts.in
            </h1>

            {/* Status Cards */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3 text-blue-700">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Registration Complete</span>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <div className="flex items-center gap-3 text-yellow-700">
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold">
                    Email Verification Process
                  </span>
                </div>
              </div>
            </div>

            {/* Message */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              Registration Successful! Please check your email to verify your
              account and unlock full access to all Medishifts platform
              features. If you have already verified your account, you can log
              in now.
            </p>

            {/* Buttons Container */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={toggleModal}
                className="group relative w-full sm:w-auto bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Login to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p
          className={`mt-6 text-gray-500 text-center transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          Need help? Contact our support at{" "}
          <a
            href="mailto:support@medishifts.in"
            className="text-blue-600 hover:underline"
          >
            support@medishifts.in
          </a>
        </p>
      </div>

      <LoginModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        // onSwitchToSignUp={handleSwitchToSignUp}
      />
    </div>
  );
};

export default Page;