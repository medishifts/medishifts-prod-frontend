/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-sort-props */
import React from "react";

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-200 py-12 px-4 sm:px-6 lg:px-8 border-t-2 border-gray-700 dark:bg-gray-800 dark:border-gray-600">
    <div className="container mx-auto grid gap-12 row-gap-10 md:grid-cols-2 lg:grid-cols-4">
      <div className="md:col-span-2">
        <a href="#" className="inline-flex items-center mb-6">
          <img
            src="https://mcqmate.com/public/images/logos/60x60.png"
            alt="logo"
            className="h-10 w-10"
          />
          <span className="ml-3 text-2xl font-bold tracking-tight text-white dark:text-gray-100">
            Company Name
          </span>
        </a>
        <div className="lg:max-w-xl">
          <p className="text-sm text-gray-400 dark:text-gray-300 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi felis
            mi, faucibus dignissim lorem id, imperdiet interdum mauris.
            Vestibulum ultrices sed libero non porta. Vivamus malesuada urna eu
            nibh malesuada, non finibus massa laoreet. Nunc nisi velit, feugiat
            a semper quis, pulvinar id libero. Vivamus mi diam, consectetur non
            orci ut, tincidunt pretium justo. In vehicula porta molestie.
            Suspendisse potenti.
          </p>
        </div>
      </div>

      <div className="text-sm space-y-4">
        <p className="text-lg font-semibold text-white dark:text-gray-100">
          Popular Courses
        </p>
        <a
          href="#"
          className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 transition duration-300"
        >
          UPSC - Union Public Service Commission
        </a>
        <a
          href="#"
          className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 transition duration-300"
        >
          General Knowledge
        </a>
        <a
          href="#"
          className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 transition duration-300"
        >
          MBA
        </a>
        <p className="text-lg font-semibold text-white dark:text-gray-100 mt-6">
          Popular Topics
        </p>
        <a
          href="#"
          className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 transition duration-300"
        >
          Human Resource Management
        </a>
        <a
          href="#"
          className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 transition duration-300"
        >
          Operations Management
        </a>
        <a
          href="#"
          className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 transition duration-300"
        >
          Marketing Management
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
              src="https://mcqmate.com/public/images/icons/playstore.svg"
              alt="Playstore Button"
              className="h-6"
            />
          </a>
          <a
            href="https://www.youtube.com/channel/UCo8tEi6SrGFP8XG9O0ljFgA"
            className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition duration-300"
          >
            <img
              src="https://mcqmate.com/public/images/icons/youtube.svg"
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
            href="mailto:admin@company.com"
            className="text-blue-400 hover:text-blue-300 dark:text-blue-300 dark:hover:text-blue-200 transition duration-300"
            title="send email"
          >
            admin@company.com
          </a>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-700 dark:border-gray-600 pt-6 mt-8 flex flex-col-reverse lg:flex-row justify-between items-center">
      <p className="text-sm text-gray-400 dark:text-gray-500">
        © {new Date().getFullYear()} Company. All rights reserved.
      </p>
      <ul className="flex flex-wrap gap-4">
        <li>
          <a
            href="#"
            className="text-sm text-gray-400 hover:text-blue-400 dark:text-gray-500 dark:hover:text-blue-300 transition duration-300"
          >
            Privacy &amp; Cookies Policy
          </a>
        </li>
        <li>
          <a
            href="#"
            className="text-sm text-gray-400 hover:text-blue-400 dark:text-gray-500 dark:hover:text-blue-300 transition duration-300"
          >
            Disclaimer
          </a>
        </li>
      </ul>
    </div>
  </footer>
);

export default Footer;
