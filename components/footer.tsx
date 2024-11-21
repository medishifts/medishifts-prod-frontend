import React from "react";

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-200 py-12 px-4 sm:px-6 lg:px-8 border-t-2 border-gray-700 dark:bg-gray-800 dark:border-gray-600">
    <div className="container mx-auto grid gap-12 row-gap-10 md:grid-cols-2 lg:grid-cols-4">
      <div className="md:col-span-2">
        <a href="#" className="inline-flex items-center mb-6">
          <svg viewBox="0 0 100 100" className="h-10 w-10">
            <circle cx="50" cy="50" r="40" fill="#4051B5" />
            <path d="M50 30 L70 70 L30 70 Z" fill="#FFFFFF" />
          </svg>
          <span className="ml-3 text-2xl font-bold tracking-tight text-white dark:text-gray-100">
            Medishifts.in
          </span>
        </a>
        <div className="lg:max-w-xl">
          <p className="text-sm text-gray-400 dark:text-gray-300 leading-relaxed">
            Medishifts.in is a leading job portal for medical professionals,
            connecting healthcare providers with qualified candidates. We
            specialize in matching medical staff, such as doctors, nurses, and
            allied healthcare personnel, with temporary or permanent positions
            across various healthcare facilities.
          </p>
        </div>
      </div>

      <div className="text-sm space-y-4">
        <p className="text-lg font-semibold text-white dark:text-gray-100">
          Popular Job Categories
        </p>
        <a
          href="#"
          className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 transition duration-300"
        >
          Doctors
        </a>
        <a
          href="#"
          className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 transition duration-300"
        >
          Nurses
        </a>
      </div>

      <div className="space-y-6">
        <p className="text-lg font-semibold text-white dark:text-gray-100">
          Follow Us
        </p>
        <div className="flex gap-4">
          <a
            href="#"
            className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition duration-300"
          >
            <img
              src="https://medishifts.in/public/images/icons/playstore.svg"
              alt="Playstore Button"
              className="h-6"
            />
          </a>
          <a
            href="https://www.youtube.com/channel/UCo8tEi6SrGFP8XG9O0ljFgA"
            className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition duration-300"
          >
            <img
              src="https://medishifts.in/public/images/icons/youtube.svg"
              alt="Youtube Button"
              className="h-6"
            />
          </a>
        </div>
        <p className="text-lg font-semibold text-white dark:text-gray-100 mt-6">
          Contact Us
        </p>
        <div className="flex items-center text-gray-300 dark:text-gray-400">
          <p className="mr-2">Email:</p>
          <a
            href="mailto:medishifts@gmail.com"
            className="text-blue-400 hover:text-blue-300 dark:text-blue-300 dark:hover:text-blue-200 transition duration-300"
            title="send email"
          >
            medishifts@gmail.com
          </a>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-700 dark:border-gray-600 pt-6 mt-8 flex flex-col-reverse lg:flex-row justify-between items-center">
      <p className="text-sm text-gray-400 dark:text-gray-500">
        © {new Date().getFullYear()} Medishifts.in. All rights reserved.
      </p>
      <ul className="flex flex-wrap gap-4">
        <li>
          <a
            href="/privacy-policy"
            className="text-sm text-gray-400 hover:text-blue-400 dark:text-gray-500 dark:hover:text-blue-300 transition duration-300"
          >
            Privacy &amp; Cookies Policy
          </a>
        </li>
        <li>
          <a
            href="/terms-conditions"
            className="text-sm text-gray-400 hover:text-blue-400 dark:text-gray-500 dark:hover:text-blue-300 transition duration-300"
          >
            Terms and Conditions
          </a>
        </li>
      </ul>
    </div>
  </footer>
);

export default Footer;
