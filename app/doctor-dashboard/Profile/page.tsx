"use client";
import React, { useEffect, useState } from "react";
import { AppDispatch, useAppSelector } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import pb from "@/utils/pocketbase-connect";
import {
  FaMobileAlt,
  FaEnvelope,
  FaRegStar,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { MdWork, MdOutlineCrisisAlert, MdCake } from "react-icons/md";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { motion } from "framer-motion";
import UserQualifications from "@/components/UserQualifications";
import Loader from "@/components/Loader";

interface ProfileData {
  name: string;
  title: string;
  location: string;
  email: string;
  mobile: string;
  dob: string;
  specialties: Array<{ name: string; level: number }>;
  bio: string;
  experience: string;
  experienceYears: number;
  affiliations: Array<{ name: string; type: string }>;
  certifications: Array<{ name: string; icon: string; fileUrl: string }>;
  profileImage: string;
  bannerImage: string;
  is_document_uploaded: boolean;
}

const ProfileDoctor = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const id = useAppSelector((state) => state.profileReducer.value.id);
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({});
  const [IsLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const record = await pb.collection("view_users").getOne(id);
        console.log(record);

        const backendApi = process.env.NEXT_PUBLIC_BACKEND_API;

        const profileImage = `${backendApi}/api/files/${record.collectionId}/${record.id}/${record.profile}?thumb=100x300`;
        const registrationCertificate = `${backendApi}/api/files/${record.collectionId}/${record.id}/${record.registration_certificate}`;
        const degreeCertificate = `${backendApi}/api/files/${record.collectionId}/${record.id}/${record.degree_certificate}`;

        const mappedProfileData: ProfileData = {
          name: record.name,
          title: record.selectedSpecializations,
          location: `${record.city}, ${record.state}, India`,
          email: record.email,
          mobile: record.mobile,
          dob: new Date(record.dob).toLocaleDateString(),
          specialties: [{ name: record.selectedSpecializations, level: 3 }],
          bio: record.bio,
          experience: record.experience,
          experienceYears: record.experienceYears,
          is_document_uploaded: record.is_document_uploaded,
          affiliations: [
            { name: record.selectedCouncil, type: "Medical Council" },
          ],
          certifications: [
            {
              name: "Degree Certificate",
              icon: "🎓",
              fileUrl: degreeCertificate,
            },
            {
              name: "Registration Certificate",
              icon: "📝",
              fileUrl: registrationCertificate,
            },
          ],
          profileImage: profileImage,
          bannerImage:
            "https://i.pinimg.com/736x/05/61/6b/05616b208ff9c38393e4debca000137e.jpg",
        };

        setProfileData(mappedProfileData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  return (
    <>
      {IsLoading ? (
        <div className="flex h-screen justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="max-w-9xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-2xl rounded-xl overflow-hidden  font-sans">
          <div className="relative">
            <img
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover filter brightness-90"
              src="https://cdn.pixabay.com/photo/2024/04/18/10/09/ai-generated-8704008_1280.jpg"
              alt="Hospital Background"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative px-4 sm:px-8 md:px-12 lg:px-16 py-0 -mt-24 sm:-mt-32"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-end">
              <img
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-white shadow-xl object-cover transition-transform duration-300 hover:scale-105"
                src={profileData.profileImage}
                alt={profileData.name}
              />
              <div className=" sm:mt-0 sm:ml-8 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif sm:text-white dark:text-white  text-black text-shadow-lg">
                  {profileData.name}
                </h1>

                <p className="text-sm md:text-base mt-2 text-gray-800 dark:text-white flex items-center justify-center sm:justify-start">
                  <FaMapMarkerAlt className="mr-2" /> {profileData.location}
                </p>
                <p className="text-sm md:text-base mt-1 text-gray-800 dark:text-white flex items-center justify-center sm:justify-start">
                  <MdCake className="mr-2" /> Date of Birth: {profileData.dob}
                </p>
              </div>
            </div>
            {profileData.is_document_uploaded ? (
              " "
            ) : (
              <div className="flex justify-end">
                <button
                  className="  mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                  onClick={() => {
                    props.handleTabClick("edit-profile");
                  }}
                >
                  edit-profile
                </button>
              </div>
            )}
          </motion.div>

          <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
            >
              <div className="mb-4 sm:mb-0">
                <h2 className="font-serif font-bold text-gray-900 dark:text-white text-2xl sm:text-3xl mb-3">
                  Contact Information
                </h2>
                {profileData?.mobile?.length === 10 && (
                  <p className="font-semibold text-gray-800 dark:text-gray-300 text-base sm:text-lg flex items-center">
                    <FaMobileAlt className="mr-2 text-blue-600 dark:text-blue-300" />{" "}
                    {profileData?.mobile}
                  </p>
                )}

                <p className="font-semibold text-gray-800 dark:text-gray-300 text-base sm:text-lg flex items-center mt-2">
                  <FaEnvelope className="mr-2 text-blue-600 dark:text-blue-300" />{" "}
                  {profileData.email}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="font-serif font-bold text-gray-900 dark:text-white text-2xl sm:text-3xl mb-4">
                <MdOutlineCrisisAlert className="inline-block mr-2 text-blue-600 dark:text-blue-300" />{" "}
                Qualifications :
              </h2>
              <UserQualifications userId={id} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="font-serif font-bold text-gray-900 dark:text-white text-2xl sm:text-3xl mb-4">
                <MdWork className="inline-block mr-2 text-blue-600 dark:text-blue-300" />{" "}
                Professional Bio
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                {profileData.bio}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="px-4 sm:px-8 md:px-12 lg:px-16 py-4 bg-gray-50 dark:bg-gray-700"
          >
            <h2 className="font-serif font-bold text-gray-900 dark:text-white text-2xl sm:text-3xl mb-4">
              <MdWork className="inline-block mr-2 text-blue-600 dark:text-blue-300" />{" "}
              Experience
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl font-semibold mb-4">
              {profileData.experienceYears} years of medical practice
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg">
              {profileData.experience}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="px-4 sm:px-8 md:px-12 lg:px-16 py-8"
          >
            <h2 className="font-serif font-bold text-gray-900 dark:text-white text-2xl sm:text-3xl mb-5">
              <HiOutlineAcademicCap className="inline-block mr-2 text-blue-600 dark:text-blue-300" />{" "}
              Professional Affiliations
            </h2>
            <ul className="space-y-3">
              {profileData.affiliations?.map((affiliation, index) => (
                <li
                  key={index}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
                >
                  <span className="text-blue-600 dark:text-blue-300 hover:underline cursor-pointer text-lg sm:text-xl font-semibold">
                    {affiliation.name}
                  </span>
                  <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
                    {affiliation.type}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="px-4 sm:px-8 md:px-12 lg:px-16 py-8"
          >
            <h2 className="font-serif font-bold text-gray-900 dark:text-white text-2xl sm:text-3xl mb-5">
              <HiOutlineAcademicCap className="inline-block mr-2 text-blue-600 dark:text-blue-300" />{" "}
              Certifications & Achievements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profileData.certifications?.map((cert, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out"
                >
                  <span className="text-6xl mb-3">{cert.icon}</span>
                  <span className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 text-center font-semibold">
                    {cert.name}
                  </span>
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-300 mt-3 underline text-base sm:text-lg hover:text-blue-800 dark:hover:text-blue-100 transition-colors duration-300"
                  >
                    View PDF
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ProfileDoctor;
