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
import toast from "react-hot-toast";
import { MdWork, MdOutlineCrisisAlert, MdCake } from "react-icons/md";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { motion } from "framer-motion";
import UserQualifications from "@/components/UserQualifications";
import Loader from "@/components/Loader";
import {
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Star } from "lucide-react";

interface EducationDetails {
  degree: string;
  pg: string[];
  specialization: string[];
}
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
  isFirstTimeCompleted: boolean;
  registrationNumber: string;
  average_rating: number;
}

const ProfileDoctor = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const id = useAppSelector((state) => state.profileReducer.value.id);
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({});
  const [council, setcCouncil] = useState("");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [IsLoading, setIsLoading] = useState(true);
  const education = useAppSelector((state) => state.educationReducer.records);
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
          average_rating: record.average_rating,
          bio: record.bio,
          isFirstTimeCompleted: record.isFirstTimeCompleted,
          experience: record.experience,
          experienceYears: record.experienceYears,
          is_document_uploaded: record.is_document_uploaded,
          registrationNumber: record.registrationNumber,
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
  const handlePasswordReset = async () => {
    if (!profileData.email) {
      toast.error("Email not found in profile data");
      return;
    }

    setResetError(null);
    setResetLoading(true);

    try {
      await pb.collection("users").requestPasswordReset(profileData.email);
      setResetEmailSent(true);
      toast.success("Password reset email sent! Please check your inbox.");
      setIsResetModalOpen(false);
    } catch (err) {
      console.error("Password reset error:", err);
      setResetError("Failed to send password reset email");
      toast.error("Failed to send password reset email");
    } finally {
      setResetLoading(false);
    }
  };
  const educationDetails: EducationDetails = education.reduce(
    (acc: EducationDetails, record) => {
      acc.degree = record.degree; // Assuming all records have the same degree

      // Filter "Not Applicable" values while pushing
      if (record.pg !== "Not Applicable") {
        acc.pg.push(record.pg);
      }
      if (record.specialization !== "Not Applicable") {
        acc.specialization.push(record.specialization);
      }

      return acc;
    },
    { degree: "", pg: [], specialization: [] }
  );

  // Join the PG and specialization values into single strings
  //@ts-ignore
  educationDetails.pg = educationDetails.pg.join(", ");
  //@ts-ignore
  educationDetails.specialization = educationDetails.specialization.join(", ");

  console.log("Education Details ", educationDetails);

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
              <div className=" sm:mt-0 sm:ml-8 text-center sm:text-left ">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif sm:text-white dark:text-white  text-black text-shadow-lg ">
                  {profileData.name}
                </h1>
                <div className="flex   items-center justify-center sm:justify-start">
                  <Star color="#FFD700" fill="#FFD700" />
                  <p className="font-bold dark:text-white text-black sm:text-black md:text-white ml-2 sm:ml-0">
                    {profileData.average_rating} Overall Rating
                  </p>
                </div>
                <p>
                  <span className="text-lg sm:text-xl lg:text-white text-black dark:text-white">
                    {profileData.experienceYears} Years of Medical experience
                  </span>
                </p>
                <p>
                  <span className="text-lg md:text-black lg:text-white sm:text-xl text-gray-800 dark:text-white">
                    <strong>Reg Num : </strong>{" "}
                    {
                      profileData.affiliations?.[0].name.match(
                        /\(([^)]+)\)/
                      )?.[1]
                    }{" "}
                    <strong> - </strong>
                    {profileData.registrationNumber}
                  </span>
                </p>
                <p className="text-lg sm:text-xl text-gray-800 dark:text-white">
                  {educationDetails.degree &&
                    educationDetails.degree !== "Not Applicable" && (
                      <Chip color="primary" variant="flat">
                        {educationDetails.degree}
                      </Chip>
                    )}

                  {educationDetails.pg && (
                    <Chip color="secondary" variant="flat">
                      {educationDetails.pg}
                    </Chip>
                  )}
                  {educationDetails.specialization && (
                    <Chip color="success" variant="flat">
                      {educationDetails.specialization}
                    </Chip>
                  )}
                </p>

                <p className="text-sm md:text-base mt-2 text-gray-800 dark:text-white flex items-center justify-center sm:justify-start">
                  <FaMapMarkerAlt className="mr-2" /> {profileData.location}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="group mt-4 px-8 py-3 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 
  text-white rounded-xl shadow-xl hover:shadow-blue-500/30 font-semibold tracking-wide 
  transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 
  hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 active:scale-95"
                onClick={() => {
                  window.location.href = "/doctor-dashboard?page=edit-profile";
                }}
              >
                <span>Edit Profile</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:rotate-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
          </motion.div>

          <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mb-8"
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
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="font-serif font-bold text-gray-900 dark:text-white text-2xl sm:text-3xl mb-4">
                <MdOutlineCrisisAlert className="inline-block mr-2 text-blue-600 dark:text-blue-300" />{" "}
                Qualifications :
              </h2>
              <UserQualifications userId={id} />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="mb-8"
              >
                <h2 className="font-serif font-bold text-gray-900 dark:text-white text-2xl sm:text-3xl mb-5">
                  <HiOutlineAcademicCap className="inline-block mr-2 text-blue-600 dark:text-blue-300" />{" "}
                  Medical Council
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
                className="mb-8"
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
                  <br />
                </div>
              </motion.div>
            </motion.div>

            {/* <motion.div
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
            </motion.div> */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
            >
              <div className="mb-4 sm:mb-0">
                <h2 className="font-serif font-bold text-gray-900 dark:text-white text-2xl sm:text-3xl mb-3">
                  About
                </h2>
                <p className="font-semibold text-gray-800 dark:text-gray-300 text-base sm:text-lg flex items-center">
                  <MdCake className="mr-2" /> <strong>Date of Birth : </strong>{" "}
                  {profileData.dob}
                </p>
                {profileData?.mobile && (
                  <p className="font-semibold text-gray-800 dark:text-gray-300 text-base sm:text-lg flex items-center">
                    <FaMobileAlt className="mr-2 text-blue-600 dark:text-blue-300" />{" "}
                    <strong>Contact number : </strong>
                    {profileData?.mobile}
                  </p>
                )}

                <p className="font-semibold text-gray-800 dark:text-gray-300 text-base sm:text-lg flex items-center mt-2">
                  <FaEnvelope className="mr-2 text-blue-600 dark:text-blue-300" />{" "}
                  <strong>Email : </strong> {profileData.email}
                </p>
              </div>
            </motion.div>
          </div>
          <div className="flex justify-end space-x-4 p-4">
            <Button
              color="primary"
              onClick={() => setIsResetModalOpen(true)}
              disabled={!profileData.email}
            >
              Change Password
            </Button>
          </div>
          <Modal
            isOpen={isResetModalOpen}
            onClose={() => {
              setIsResetModalOpen(false);
              setResetError(null);
              setResetEmailSent(false);
            }}
          >
            <ModalContent>
              <ModalHeader>Reset Password</ModalHeader>
              <ModalBody>
                {resetEmailSent ? (
                  <p className="text-green-600">
                    Password reset email has been sent to {profileData.email}
                  </p>
                ) : (
                  <>
                    <p>
                      A password reset link will be sent to your email address:
                      <br />
                      <strong>{profileData.email}</strong>
                    </p>
                    {resetError && (
                      <p className="text-red-500 mt-2">{resetError}</p>
                    )}
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onClick={() => setIsResetModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onClick={handlePasswordReset}
                  isLoading={resetLoading}
                  disabled={resetEmailSent}
                >
                  Send Reset Link
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      )}
    </>
  );
};

export default ProfileDoctor;
