"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardBody, Button, Image } from "@nextui-org/react";
import { motion } from "framer-motion";
import HospitalRegistrationModal from "@/components/HospitalRegistrationModal";
import ProfessionalRegistrationModal from "@/components/ProfessionalRegistrationModal";
import { useTheme } from "next-themes";

const App = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isHospitalModalOpen, setHospitalModalOpen] = useState(false);
  const [isProfessionalModalOpen, setProfessionalModalOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div
        className={`flex flex-col items-center min-h-screen py-6 md:py-12 px-2 md:px-6 ${
          isDark ? "bg-gray-900" : "bg-gray-100"
        } relative`}
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1681843058031-838bccab8578?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 backdrop-blur-sm" />

        <div
          className={`relative z-10 w-full max-w-6xl mx-auto p-4 md:p-8 rounded-xl md:rounded-2xl shadow-2xl backdrop-blur-md ${
            isDark ? "bg-gray-900/80" : "bg-gray-100/80"
          }`}
        >
          <div className="flex flex-col items-center gap-4 md:gap-16 md:flex-row md:justify-center">
            {/* Card for Registering a Professional */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`w-full max-w-md shadow-xl rounded-xl overflow-hidden ${
                isDark
                  ? "bg-gray-800/90 border-gray-700"
                  : "bg-white/90 border-gray-300"
              } transition-all duration-300 hover:shadow-2xl`}
            >
              <Card className="border-none bg-transparent">
                <CardHeader
                  className={`pb-0 pt-4 md:pt-6 px-4 md:px-6 text-center ${
                    isDark ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  <p
                    className={`text-xs uppercase font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full ${
                      isDark
                        ? "bg-blue-900/50 text-blue-400"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    For Healthcare Professionals (Doctor / Nurse)
                  </p>
                </CardHeader>
                <CardBody
                  className={`py-4 md:py-6 px-4 md:px-8 text-center ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <div className="flex justify-center mb-4 md:mb-6 overflow-hidden rounded-xl shadow-lg">
                    <Image
                      alt="Professional Registration"
                      className="object-cover rounded-lg transform hover:scale-105 transition-transform duration-500"
                      src="https://media.istockphoto.com/id/1486019083/photo/doctors-working-on-the-move.webp?b=1&s=170667a&w=0&k=20&c=dHfuVJAEGEmvJqPnFqv6OAFuJDBRiPEYoVqaom9w5Vs="
                      width={270}
                      height={180}
                    />
                  </div>
                  <p className="mb-4 md:mb-8 text-sm leading-relaxed">
                    Welcome to Medishifts! Here, you can find flexible,
                    short-term job opportunities tailored to fit your schedule.
                    Join us to earn extra income, explore new experiences, and
                    manage your time on your terms
                  </p>
                  <Button
                    color="primary"
                    size="lg"
                    className="w-full mb-2 font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setProfessionalModalOpen(true)}
                  >
                    Register as Professional
                  </Button>
                </CardBody>
              </Card>
            </motion.div>

            {/* Card for Registering a Hospital */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`w-full max-w-md shadow-xl rounded-xl overflow-hidden ${
                isDark
                  ? "bg-gray-800/90 border-gray-700"
                  : "bg-white/90 border-gray-300"
              } transition-all duration-300 hover:shadow-2xl`}
            >
              <Card className="border-none bg-transparent">
                <CardHeader
                  className={`pb-0 pt-4 md:pt-6 px-4 md:px-6 text-center ${
                    isDark ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  <p
                    className={`text-xs uppercase font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full ${
                      isDark
                        ? "bg-green-900/50 text-green-400"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    For Healthcare Institutions
                  </p>
                </CardHeader>
                <CardBody
                  className={`py-4 md:py-6 px-4 md:px-8 text-center ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <div className="flex justify-center mb-4 md:mb-6 overflow-hidden rounded-xl shadow-lg">
                    <Image
                      alt="Hospital Registration"
                      className="object-cover rounded-lg transform hover:scale-105 transition-transform duration-500"
                      src="https://media.istockphoto.com/id/1312706413/photo/modern-hospital-building.webp?b=1&s=170667a&w=0&k=20&c=UipwEz9AKAnDVFeMoexMbHSHlmDnBEQ1uWZ6NtKbfOo="
                      width={270}
                      height={180}
                    />
                  </div>
                  <p className="mb-4 md:mb-8 text-sm leading-relaxed">
                    Welcome to Medishifts! We help you quickly find skilled
                    doctors and nurses for short-term needs, ensuring quality
                    patient care without staffing interruptions. Start here to
                    meet your facility's immediate demands.
                  </p>
                  <Button
                    color="success"
                    size="lg"
                    className="w-full text-white mb-2 font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setHospitalModalOpen(true)}
                  >
                    Register as Hospital
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>

        <HospitalRegistrationModal
          isOpen={isHospitalModalOpen}
          onClose={() => setHospitalModalOpen(false)}
        />
        <ProfessionalRegistrationModal
          isOpen={isProfessionalModalOpen}
          onClose={() => setProfessionalModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default App;
