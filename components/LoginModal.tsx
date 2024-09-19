"use client";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import PocketBase from "pocketbase";
import { setCookie } from "cookies-next";
import {
  resetProfile,
  updateProfile,
} from "@/app/redux/features/profile-slice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/app/redux/store";
import toast from "react-hot-toast";

const pb = new PocketBase(process.env.NEXT_PUBLIC_BACKEND_API);

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToSignUp,
}) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isAuth = useAppSelector((state) => state.authReducer.value.isAuth);

  const isDark = theme === "dark";

  if (!isOpen) return null;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAuthSuccess = async (authData: any) => {
    console.log("Login successful:", authData);

    const userRole = authData.record.role;
    const token = authData.token;
    setCookie("authToken", token, {
      expires: new Date(Date.now() + 3600000 * 24 * 13),
    });
    setCookie("authData", JSON.stringify(authData), {
      expires: new Date(Date.now() + 3600000 * 24 * 13),
    });

    dispatch(
      updateProfile({
        id: authData.record.id,
        role: authData.record.role,
        username: authData.record.username,
        email: authData.record.email,
        name: authData.record.name,
        avatarUrl: authData.record.profile,
      })
    );

    switch (userRole) {
      case "DOCTOR":
        window.location.href = "/doctor-dashboard";
        break;
      case "NURSE":
        window.location.href = "/nurse-dashboard";
        break;
      case "HOSPITAL":
        window.location.href = "/hospital-dashboard";
        break;
      default:
        window.location.href = "/";
    }

    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      pb.authStore.clear();
      dispatch(resetProfile());
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);

      toast.success("Login successful!");
      await handleAuthSuccess(authData);
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = async () => {
    setLoading(true);
    try {
      const authData = await pb
        .collection("users")
        .authWithOAuth2({ provider: "google" });

      toast.success("Successfully logged in!");
      await handleAuthSuccess(authData);
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message ||
        "Failed to login with Google";

      console.error("Google auth error:", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await pb.collection("users").requestPasswordReset(email);
      setResetEmailSent(true);
      toast.success("Password reset email sent!");
    } catch (err) {
      console.error("Forgot Password error:", err);
      setError("Failed to send password reset email");
      toast.error("Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <div className="p-5">
          <h3 className="text-2xl mb-4 font-medium text-center">
            {isForgotPassword ? "Reset your password" : "Login to your account"}
          </h3>
          <form
            onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit}
          >
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                required
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            {!isForgotPassword && (
              <>
                <div className="mb-4 relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1"
                  >
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 pt-5"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.06 10.06 0 0112 19c-5.523 0-10-4.477-10-10 0-1.633.39-3.177 1.075-4.525m15.85-.35A9.975 9.975 0 0119 12c0 5.523-4.477 10-10 10a9.975 9.975 0 01-4.525-1.075m0-15.85A9.975 9.975 0 015 5m14 14l-14-14"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3.98 8.623a10.997 10.997 0 0116.828 0M21 12.91A9.98 9.98 0 0112 21a9.98 9.98 0 01-9-5.09M12 5v.01M9 12v.01M15 12v.01M6 8.94v.01M18 8.94v.01"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="text-sm text-right">
                  <button
                    type="button"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setIsForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>
              </>
            )}
            {isForgotPassword && resetEmailSent && (
              <div className="text-green-500 text-center mb-4">
                A password reset email has been sent to {email}.
              </div>
            )}
            <button
              type="submit"
              className={`w-full py-2 px-4 text-white ${
                loading
                  ? "bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : isForgotPassword
                ? "Send Reset Email"
                : "Login"}
            </button>
          </form>
          {isForgotPassword && (
            <div className="mt-4 text-sm text-center">
              Remembered your password?{" "}
              <button
                type="button"
                className="text-blue-600 dark:text-blue-400 hover:underline"
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetEmailSent(false);
                  setEmail("");
                }}
              >
                Back to login
              </button>
            </div>
          )}
          {!isForgotPassword && (
            <>
              <div className="my-4 flex items-center">
                <hr className="flex-grow border-t border-gray-300 dark:border-gray-600" />
                <span className="mx-2 text-sm text-gray-500 dark:text-gray-400">
                  OR
                </span>
                <hr className="flex-grow border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={googleAuth}
                  className={`flex items-center justify-center gap-2 border border-gray-300 p-2 text-sm font-medium rounded hover:bg-gray-100 focus:ring-2 ${
                    isDark
                      ? "border-gray-700 bg-gray-700 hover:bg-gray-600 focus:ring-gray-500"
                      : "border-slate-300 bg-white hover:bg-gray-100 focus:ring-gray-300"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 90 92"
                    fill="none"
                    className="h-[18px] w-[18px]"
                  >
                    <path
                      d="M90 47.1c0-3.1-.3-6.3-.8-9.3H45.9v17.7h24.8c-1 5.7-4.3 10.7-9.2 13.9l14.8 11.5C85 72.8 90 61 90 47.1z"
                      fill="#4280ef"
                    ></path>
                    <path
                      d="M45.9 91.9c12.4 0 22.8-4.1 30.4-11.1L61.5 69.4c-4.1 2.8-9.4 4.4-15.6 4.4-12 0-22.1-8.1-25.8-18.9L4.9 66.6c7.8 15.5 23.6 25.3 41 25.3z"
                      fill="#34a353"
                    ></path>
                    <path
                      d="M20.1 54.8c-1.9-5.7-1.9-11.9 0-17.6L4.9 25.4c-6.5 13-6.5 28.3 0 41.2l15.2-11.8z"
                      fill="#f6b704"
                    ></path>
                    <path
                      d="M45.9 18.3c6.5-.1 12.9 2.4 17.6 6.9L76.6 12C68.3 4.2 57.3 0 45.9.1c-17.4 0-33.2 9.8-41 25.3l15.2 11.8c3.7-10.9 13.8-18.9 25.8-18.9z"
                      fill="#e54335"
                    ></path>
                  </svg>
                  Login using Google
                </button>
              </div>
            </>
          )}
          <div className="mt-4 text-sm text-center">
            Don't have an account?{" "}
            <a
              type="button"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              href="/usertype"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
