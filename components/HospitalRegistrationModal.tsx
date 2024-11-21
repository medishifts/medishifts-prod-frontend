"use client";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import PocketBase from "pocketbase";
import toast from "react-hot-toast";
import { setCookie } from "cookies-next";
import LoginModal from "./LoginModal";

const pb = new PocketBase(process.env.NEXT_PUBLIC_BACKEND_API);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HospitalRegistrationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rePasswordVisible, setRePasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one special character."
      );
      return;
    }

    if (password !== rePassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    const data = {
      name: hospitalName,
      email: email,
      emailVisibility: true,
      password: password,
      passwordConfirm: rePassword,
      role: "HOSPITAL",
    };

    const registrationPromise = async () => {
      setLoading(true);
      const record = await pb.collection("users").create(data);
      await pb.collection("users").requestVerification(email);

      const token = pb.authStore.token;
      // setCookie("authToken", token);

      setLoading(false);
      return "Registration Successful! Check your email for verification.";
    };

    toast.promise(
      registrationPromise(),
      {
        loading: "Processing registration...",
        success: () => {
          onClose(); // Close modal on success
          window.location.href = "/registration-success";
          
          return "Registration Successful! Check your email for verification";
        },
        error: (err) => {
          setLoading(false);
          if (err instanceof Error) {
            return err.message;
          } else {
            return String(err);
          }
        },
        // Increase the duration of the success message here
      },
      {
        success: {
          duration: 8000, // 8 seconds
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center z-[999] ${
          isDark ? "bg-black/70" : "bg-black/50"
        }`}
        onClick={onClose}
      >
        <div
          className={`relative rounded-lg shadow-lg w-full max-w-md p-6 ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside it
        >
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="#c6c7c7"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close popup</span>
          </button>
          <h3 className="text-2xl mb-4 font-medium text-center">
            Register Your Hospital
          </h3>
          <p className="text-center mb-6">
            Complete the form below to register your hospital and become a part
            of our network.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded border border-gray-300 shadow-sm"
              required
            />
            <input
              type="text"
              placeholder="Hospital Name"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full p-3 rounded border border-gray-300 shadow-sm"
              required
            />
            <div className="relative w-full">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded border border-gray-300 shadow-sm"
                required
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              Minimum password length is 8 characters.
            </span>
            <div className="relative w-full">
              <input
                type={rePasswordVisible ? "text" : "password"}
                placeholder="Re-Password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                className="w-full p-3 rounded border border-gray-300 shadow-sm"
                required
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setRePasswordVisible(!rePasswordVisible)}
              >
                {rePasswordVisible ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
            <div className="space-y-1">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-600"
                  required
                />
                <span>
                  I agree to the{" "}
                  <a
                    href="/terms-conditions"
                    className="text-blue-600 underline"
                    target="_blank"
                  >
                    Terms and Conditions
                  </a>
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded shadow-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default HospitalRegistrationModal;
