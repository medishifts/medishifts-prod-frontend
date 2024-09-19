"use client";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import PocketBase from "pocketbase";
import toast from "react-hot-toast";
import { setCookie } from "cookies-next";
import LoginModal from "./LoginModal";
import { MdOutlineSendToMobile } from "react-icons/md";

const pb = new PocketBase(process.env.NEXT_PUBLIC_BACKEND_API);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfessionalRegistrationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rePasswordVisible, setRePasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      return;
    }

    const data = {
      email: email,
      emailVisibility: true,
      password: password,
      passwordConfirm: rePassword,
      role: profession,
      name: name,
    };

    const registrationPromise = async () => {
      setLoading(true);
      const record = await pb.collection("users").create(data);
      await pb.collection("users").requestVerification(email);

      console.log(record);
      const token = pb.authStore.token;
      // setCookie("authToken", token);

      setLoading(false);
      return "Registration Successful! Check your email for verification";
    };

    toast.promise(
      registrationPromise(),
      {
        loading: "Processing registration...",
        success: () => {
          onClose(); // Close modal on success
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
          className={`relative w-full max-w-md bg-${
            isDark ? "gray-800" : "white"
          } text-${isDark ? "white" : "gray-900"} p-6 rounded-lg shadow-lg`}
          onClick={(e) => e.stopPropagation()}
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
          <div className="max-h-[80vh] overflow-y-auto p-4">
            <h3 className="text-2xl mb-4 font-semibold text-center">
              Register as a Professional
            </h3>
            <p className="text-sm mb-4 text-center">
              Complete the form below to join our professional network and
              connect with industry leaders.
            </p>
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full p-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full p-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="profession" className="text-sm font-medium">
                  You are a
                </label>
                <select
                  id="profession"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select your profession
                  </option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="NURSE">Nurse</option>
                </select>
              </div>
              <div className="relative space-y-1">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full p-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                Minimum password length is 8 characters with at least one
                uppercase letter, one lowercase letter, and one special
                character.
              </span>
              <div className="relative space-y-1">
                <label htmlFor="re-password" className="text-sm font-medium">
                  Re-Password
                </label>
                <input
                  id="re-password"
                  type={rePasswordVisible ? "text" : "password"}
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full p-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
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
                    <a href="#" className="text-blue-600 underline">
                      Terms and Conditions
                    </a>
                  </span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? "Loading..." : "Register"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessionalRegistrationModal;
