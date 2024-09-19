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
    <>
      <h1
        className={`text-3xl font-extrabold mb-8 ${
          isDark ? "text-gray-100" : "text-gray-800"
        }`}
      >
        Welcome to Our Registration Portal
      </h1>
      <div
        className={`flex flex-col items-center min-h-screen p-6 ${
          isDark ? "bg-gray-900" : "bg-gray-100"
        } relative`}
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1681843058031-838bccab8578?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div
          className={`relative z-10 flex flex-col items-center h-70% p-6 ${
            isDark ? "bg-gray-900 bg-opacity-70" : "bg-gray-100 bg-opacity-70"
          }`}
        >
          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-12 md:justify-center">
            {/* Card for Registering a Professional */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`max-w-xs md:max-w-sm lg:max-w-md shadow-lg rounded-lg overflow-hidden ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-300"
              } transition-transform duration-300`}
            >
              <Card>
                <CardHeader
                  className={`pb-0 pt-2 px-4 text-center ${
                    isDark ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  <p
                    className={`text-xs uppercase font-bold ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    For Professionals
                  </p>
                  <h4
                    className={`font-bold text-lg mt-1 ${
                      isDark ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Join Our Network
                  </h4>
                </CardHeader>
                <CardBody
                  className={`py-4 px-6 text-center ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <div className="flex justify-center mb-4">
                    <Image
                      alt="Professional Registration"
                      className="object-cover rounded-lg"
                      src="https://media.istockphoto.com/id/1486019083/photo/doctors-working-on-the-move.webp?b=1&s=170667a&w=0&k=20&c=dHfuVJAEGEmvJqPnFqv6OAFuJDBRiPEYoVqaom9w5Vs="
                      width={270}
                      height={180}
                    />
                  </div>
                  <p className="mb-4 text-sm leading-relaxed">
                    Are you a professional looking to connect with industry
                    leaders and expand your network? Register now to become a
                    part of our exclusive professional community.
                  </p>
                  <Button
                    color="primary"
                    className="w-full mb-2 text-sm font-semibold tracking-wide"
                    onClick={() => setProfessionalModalOpen(true)}
                  >
                    Register as Professional
                  </Button>
                </CardBody>
              </Card>
            </motion.div>

            {/* Card for Registering a Hospital */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`max-w-xs md:max-w-sm lg:max-w-md shadow-lg rounded-lg overflow-hidden ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-300"
              } transition-transform duration-300`}
            >
              <Card>
                <CardHeader
                  className={`pb-0 pt-2 px-4 text-center ${
                    isDark ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  <p
                    className={`text-xs uppercase font-bold ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    For Hospitals
                  </p>
                  <h4
                    className={`font-bold text-lg mt-1 ${
                      isDark ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Register Your Hospital
                  </h4>
                </CardHeader>
                <CardBody
                  className={`py-4 px-6 text-center ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <div className="flex justify-center mb-4">
                    <Image
                      alt="Hospital Registration"
                      className="object-cover rounded-lg"
                      src="https://media.istockphoto.com/id/1312706413/photo/modern-hospital-building.webp?b=1&s=170667a&w=0&k=20&c=UipwEz9AKAnDVFeMoexMbHSHlmDnBEQ1uWZ6NtKbfOo="
                      width={270}
                      height={180}
                    />
                  </div>
                  <p className="mb-4 text-sm leading-relaxed">
                    Is your hospital looking to join a network of healthcare
                    providers? Register now to get access to exclusive resources
                    and connect with other healthcare institutions.
                  </p>
                  <Button
                    color="success"
                    className="w-full text-white mb-2 text-sm font-semibold tracking-wide"
                    onClick={() => setHospitalModalOpen(true)}
                  >
                    Register as Hospital
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Modals */}
        <HospitalRegistrationModal
          isOpen={isHospitalModalOpen}
          onClose={() => setHospitalModalOpen(false)}
        />
        <ProfessionalRegistrationModal
          isOpen={isProfessionalModalOpen}
          onClose={() => setProfessionalModalOpen(false)}
        />
      </div>
    </>
  );
};

export default App;
