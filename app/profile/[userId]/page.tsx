import React from "react";

const ProfilePage: React.FC = () => {
  const profileData = {
    name: "Dr. Alex Johnson",
    title: "Cardiologist",
    location: "San Francisco, CA, United States",
    followers: 440,
    following: 31,
    specialties: [
      { name: "Cardiovascular Disease", level: 3 },
      { name: "Internal Medicine", level: 2 },
      { name: "Preventive Cardiology", level: 3 },
    ],
    bio: "Board-certified cardiologist with over 15 years of experience in managing complex cardiovascular conditions. Committed to providing personalized care and utilizing the latest advancements in heart disease treatment.",
    experience: "15 years of medical practice",
    affiliations: [
      { name: "American College of Cardiology", type: "Member" },
      { name: "Johns Hopkins Hospital", type: "Alumni" },
      { name: "Medical Journal Contributor", type: "Guest Contributor" },
    ],
    certifications: [
      { name: "Board Certified in Cardiology", icon: "🎓" },
      { name: "Advanced Cardiac Life Support", icon: "🏥" },
      { name: "Fellow of the ACC", icon: "⚕️" },
      { name: "Echocardiography", icon: "💓" },
      { name: "Clinical Research", icon: "🔬" },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden my-8">
      <div className="relative">
        <img
          className="w-full h-48 sm:h-56 object-cover"
          src="https://images.unsplash.com/photo-1580281657525-9f5e7bc5292b"
          alt="Hospital Background"
        />
        <div className="absolute top-20 sm:top-24 left-4 sm:left-8 flex items-center">
          <img
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl"
            src="https://placekitten.com/200/200"
            alt={profileData.name}
          />
          <div className="ml-4 sm:ml-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              {profileData.name}
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">
              {profileData.title}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {profileData.location}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-10 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <span className="font-extrabold text-gray-800 dark:text-gray-300 text-lg sm:text-xl">
              {profileData.followers}
            </span>{" "}
            <span className="text-gray-600 dark:text-gray-400">followers</span>
            <span className="font-extrabold text-gray-800 dark:text-gray-300 text-lg sm:text-xl ml-6">
              {profileData.following}
            </span>{" "}
            <span className="text-gray-600 dark:text-gray-400">following</span>
          </div>
          <button className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
            + Follow
          </button>
        </div>

        <h2 className="font-extrabold text-gray-900 dark:text-white text-xl sm:text-2xl mb-5">
          Specialties
        </h2>
        <div className="flex flex-wrap gap-4 mb-8">
          {profileData.specialties.map((specialty, index) => (
            <span
              key={index}
              className="bg-blue-100 dark:bg-blue-900 rounded-full px-4 sm:px-5 py-2 text-sm sm:text-md font-semibold text-blue-800 dark:text-blue-200 shadow-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-300 ease-in-out"
            >
              {specialty.name}{" "}
              <span className="text-yellow-500">
                {"★".repeat(specialty.level)}
              </span>
              <span className="text-gray-300">
                {"★".repeat(3 - specialty.level)}
              </span>
            </span>
          ))}
        </div>

        <h2 className="font-extrabold text-gray-900 dark:text-white text-xl sm:text-2xl mb-5">
          Professional Bio
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-md sm:text-lg mb-6 leading-relaxed">
          {profileData.bio}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {profileData.experience}
        </p>
      </div>

      <div className="px-6 sm:px-10 py-8 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <h2 className="font-extrabold text-gray-900 dark:text-white text-xl sm:text-2xl mb-5">
          Professional Affiliations
        </h2>
        <ul className="space-y-3">
          {profileData.affiliations.map((affiliation, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <span className="text-blue-600 dark:text-blue-300 hover:underline cursor-pointer">
                {affiliation.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {affiliation.type}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-6 sm:px-10 py-8">
        <h2 className="font-extrabold text-gray-900 dark:text-white text-xl sm:text-2xl mb-5">
          Certifications & Achievements
        </h2>
        <div className="flex flex-wrap gap-6">
          {profileData.certifications.map((cert, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
              <span className="text-4xl">{cert.icon}</span>
              <span className="text-md text-gray-700 dark:text-gray-300 mt-2">
                {cert.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
