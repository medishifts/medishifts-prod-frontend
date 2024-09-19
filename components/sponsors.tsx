import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Sponsors: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration of animations in milliseconds
      once: true, // Whether animation should happen only once
    });
  }, []);

  return (
    <div className="bg-white dark:bg-black py-10">
      <div className="container mx-auto px-6">
        <h2
          className="text-3xl font-semibold mb-8 text-gray-900 dark:text-gray-100 text-center"
          data-aos="fade-up"
        >
          Our Partners
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div
            className="flex items-center justify-center"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png"
              alt="Slack"
              className="h-12 sm:h-16 md:h-20 lg:h-24"
            />
          </div>
          <div
            className="flex items-center justify-center"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
              alt="Netflix"
              className="h-12 sm:h-16 md:h-20 lg:h-24"
            />
          </div>
          <div
            className="flex items-center justify-center"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSya2WyAuIAW6V__pcjFWpzJBsoGa6reAARiQ&s"
              alt="Fitbit"
              className="h-12 sm:h-16 md:h-20 lg:h-24"
            />
          </div>
          <div
            className="flex items-center justify-center"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
              alt="Google"
              className="h-12 sm:h-16 md:h-20 lg:h-24"
            />
          </div>
          <div
            className="flex items-center justify-center"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg"
              alt="Airbnb"
              className="h-12 sm:h-16 md:h-20 lg:h-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
