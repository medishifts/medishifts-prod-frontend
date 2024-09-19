"use client";

import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import pb from "@/utils/pocketbase-connect";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // Make sure to use the correct import
import { setCookie } from "cookies-next";
import { resetProfile } from "@/app/redux/features/profile-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter(); // useRouter can now be used safely

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToastId = toast.loading("Authenticating...");

    try {
      const response = await pb.admins.authWithPassword(email, password);
      console.log(response);
      // Authentication successful
      if (pb.authStore.token) {
        setCookie("pb_auth", pb.authStore.token, {
          expires: new Date(Date.now() + 3600000),
        });
      }

      toast.success("Successfully authenticated!", {
        id: loadingToastId,
      });

      // Redirect to Admin page
      window.location.href = "/Admin";
    } catch (error) {
      console.error("Authentication failed:", error);

      toast.error("Authentication failed. Please try again.", {
        id: loadingToastId,
      });
    }
  };

  return (
    <main className="container mx-auto p-6 flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-black text-gray-700 dark:text-gray-300">
      <div className="w-full sm:w-8/12 md:w-6/12 lg:w-5/12 xl:w-4/12 mb-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gray-800 dark:bg-gray-700 text-white rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">A</span>
          </div>
        </div>
        <h1 className="text-4xl font-semibold">Welcome back Admin</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-8/12 md:w-6/12 lg:w-5/12 xl:w-4/12 bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg"
      >
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          required
          fullWidth
          classNames={{
            inputWrapper: "mb-4",
            input: "text-base",
          }}
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={handlePasswordChange}
          required
          fullWidth
          type={isVisible ? "text" : "password"}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          classNames={{
            inputWrapper: "mb-6",
            input: "text-base",
          }}
        />
        <Button
          type="submit"
          color="primary"
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition duration-300"
        >
          Log In
        </Button>
      </form>
    </main>
  );
};

export default Login;
function dispatch(arg0: { payload: undefined; type: "profile/resetProfile" }) {
  throw new Error("Function not implemented.");
}

