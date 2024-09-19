import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

interface Testimonial {
  text: string;
  avatar: string;
  name: string;
}

const testimonials: Testimonial[] = [
  {
    text: "I love the fitness apparel and gear I purchased from this site. The quality is exceptional and the prices are unbeatable.",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    name: "Sheryl Berge",
  },
  {
    text: "As a professional athlete, I rely on high-performance gear for my training. This site offers a great selection of top-notch products.",
    avatar: "https://randomuser.me/api/portraits/women/15.jpg",
    name: "Leland Kiehn",
  },
  {
    text: "The fitness apparel I bought here fits perfectly and feels amazing. I highly recommend this store to anyone looking for quality gear.",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    name: "Peter Renolds",
  },
];

const TestimonialSection: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration of animations in milliseconds
      once: true, // Whether animation should happen only once
    });
  }, []);

  return (
    <section
      aria-label="What our customers are saying"
      className="bg-slate-50 dark:bg-black py-20 sm:py-32"
      id="testimonials"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl md:text-center">
          <h2
            className="font-display text-3xl tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl transition-colors duration-300"
            data-aos="fade-up"
          >
            What Our Customers Are Saying
          </h2>
        </div>
        <ul
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
          role="list"
        >
          {testimonials.map((testimonial, index) => (
            <li
              key={index}
              className="transition-transform duration-500 transform hover:scale-105"
              data-aos="fade-up"
              data-aos-delay={index * 100} // Stagger animations with a delay
            >
              <ul className="flex flex-col gap-y-6 sm:gap-y-8" role="list">
                <li>
                  <figure
                    className="relative rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl shadow-slate-900/10 hover:shadow-slate-700/30 transition-shadow duration-300"
                    data-aos="fade-up"
                    data-aos-delay={index * 200} // Add additional delay for inner elements
                  >
                    <svg
                      aria-hidden="true"
                      className="absolute left-6 top-6 fill-slate-100 dark:fill-slate-700 transition-colors duration-300"
                      height="78"
                      width="105"
                    >
                      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
                    </svg>
                    <blockquote className="relative">
                      <p className="text-lg tracking-tight text-slate-900 dark:text-slate-100 transition-colors duration-300">
                        {testimonial.text}
                      </p>
                    </blockquote>
                    <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-6">
                      <div>
                        <div className="font-display text-base text-slate-900 dark:text-slate-100">
                          {testimonial.name}
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-full bg-slate-50 dark:bg-slate-700">
                        <img
                          alt={testimonial.name}
                          className="h-14 w-14 object-cover transition-transform duration-300 hover:scale-110"
                          src={testimonial.avatar}
                          style={{ color: "transparent" }}
                        />
                      </div>
                    </figcaption>
                  </figure>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TestimonialSection;
