import React from "react";
import { MessageCircle, Mail, Phone } from "lucide-react";
const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-200 py-6 px-4 sm:px-6 lg:px-8 border-t-2 border-gray-700 dark:bg-gray-800 dark:border-gray-600">
    <div className="container mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="md:col-span-2">
        <a href="#" className="inline-flex items-center mb-3">
          <img
            src="/logo.png"
            alt="Medishifts Logo"
            className="h-8 w-8 object-contain"
          />
          <span className="ml-2 text-xl font-bold tracking-tight text-white dark:text-gray-100">
            Medishifts.in
          </span>
        </a>
        <div className="lg:max-w-xl">
          <p className="text-s text-gray-400 dark:text-gray-300 leading-relaxed">
            Medishifts.in connects medical professionals with healthcare
            providers, specializing in matching qualified staff for temporary
            and permanent positions.
          </p>
        </div>
      </div>

      <div className="text-s space-y-2">
        <p className="text-sm font-semibold text-white dark:text-gray-100">
          Popular Job Categories
        </p>
        <div className="flex flex-col space-y-1">
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
      </div>
      <div className="text-sm space-y-2">
        <p className="text-sm font-semibold text-white dark:text-gray-100">
          Contact Us
        </p>
        <div className="flex items-center space-x-4">
          <a
            href="https://wa.me/917499544044"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-green-500 hover:text-green-600 transition-colors"
          >
            <MessageCircle size={24} />
            <span>WhatsApp</span>
          </a>
          <a
            href="mailto:support@medishifts.in"
            className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
          >
            <Mail size={24} />
            <span>Gmail</span>
          </a>
          <div className="flex items-center space-x-2 text-blue-500">
            <Phone size={24} />
            <span>+91 7499544044</span>
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-700 dark:border-gray-600 pt-4 mt-4 flex flex-col-reverse lg:flex-row justify-between items-center">
      <p className="text-s text-gray-400 dark:text-gray-500 mt-2 lg:mt-0">
        © {new Date().getFullYear()} Medishifts.in. All rights reserved.
      </p>
      <ul className="flex flex-wrap gap-3 justify-center">
        <li>
          <a
            href="/privacy-policy"
            className="text-s text-gray-400 hover:text-blue-400 dark:text-gray-500 dark:hover:text-blue-300 transition duration-300"
          >
            Privacy Policy
          </a>
        </li>
        <li>
          <a
            href="/terms-conditions"
            className="text-s text-gray-400 hover:text-blue-400 dark:text-gray-500 dark:hover:text-blue-300 transition duration-300"
          >
            Terms & Conditions
          </a>
        </li>
        <li>
          <a
            href="/refund-cancellation-policy"
            className="text-s text-gray-400 hover:text-blue-400 dark:text-gray-500 dark:hover:text-blue-300 transition duration-300"
          >
            Refund & Cancellation Policy
          </a>
        </li>
      </ul>
    </div>
  </footer>
);

export default Footer;