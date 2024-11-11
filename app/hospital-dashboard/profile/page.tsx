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
import Loader from "@/components/Loader";
import { Button, Chip } from "@nextui-org/react";
import toast from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

interface ProfileData {
  name: string;
  title: string;
  location: string;
  email: string;
  mobile: string;
  dob: string;
  specialties: Array<{ name: string; level: number }>;
  bio: string | null;
  experience: string;
  experienceYears: number;
  pointofcontact: string;
  certifications: Array<{ name: string; icon: string; fileUrl: string }>;
  profileImage: string;
  bannerImage: string;
  is_document_uploaded: boolean;
}
const HospitalProfilePage = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const id = useAppSelector((state) => state.profileReducer.value.id);
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({});
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const record = await pb.collection("view_users").getOne(id);
        console.log(record);

        const backendApi = process.env.NEXT_PUBLIC_BACKEND_API;

        const profileImage = `${backendApi}/api/files/${record.collectionId}/${record.id}/${record.profile}?thumb=100x300`;
        const verificationCertificate = `${backendApi}/api/files/${record.collectionId}/${record.id}/${record.hospital_document}`;

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
          pointofcontact: record.pointOfContact,
          is_document_uploaded: record.is_document_uploaded,

          certifications: [
            {
              name: "Verification Certificate",
              icon: "📝",
              fileUrl: verificationCertificate,
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
  const bioServices = profileData.bio
    ? profileData.bio.split(",").map((service) => service.trim())
    : [];
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
  return (
    <>
      {isLoading ? (
        <div className="flex h-screen justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="max-w-8xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden my-2 font-sans">
          <div className="relative">
            <img
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
              src="https://media.istockphoto.com/id/1292949571/vector/hospital-building-and-ambulance-car-in-city.jpg?s=2048x2048&w=is&k=20&c=C7hqbjro9ZOcM3sMclw6LZ72Rm246HAbMPCp6HwGY_I="
              alt="Hospital Background"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>

          <div className="relative px-4 sm:px-8 md:px-12 lg:px-16 py-0 -mt-24 sm:-mt-32">
            <div className="flex flex-col sm:flex-row items-center sm:items-end">
              <img
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-white shadow-xl object-cover"
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
                  <MdCake className="mr-2" /> Date of Establishment:{" "}
                  {profileData.dob}
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
                  window.location.href =
                    "/hospital-dashboard?page=edit-profile";
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
          </div>

          <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-8">
            <div className="mb-8">
              <h2 className="font-serif font-bold text-gray-900 dark:text-white text-2xl sm:text-3xl mb-4">
                <MdWork className="inline-block mr-2 text-blue-600 dark:text-blue-300" />{" "}
                Services Provided
              </h2>
              <div className="flex flex-wrap gap-2">
                {bioServices.map((service, index) => (
                  <Chip key={index} color="primary" variant="flat">
                    {service}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div className="mb-4 sm:mb-0">
                <h2 className="font-serif font-bold text-gray-900 dark:text-white text-2xl sm:text-3xl mb-3">
                  Contact Information
                </h2>
                <p className="font-semibold text-gray-800 dark:text-gray-300 text-base sm:text-lg flex items-center">
                  <FaMobileAlt className="mr-2 text-blue-600 dark:text-blue-300" />
                  Point of Contact: {profileData.pointofcontact}
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-300 text-base sm:text-lg flex items-center">
                  <FaMobileAlt className="mr-2 text-blue-600 dark:text-blue-300" />{" "}
                  Mobile: {profileData.mobile}
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-300 text-base sm:text-lg flex items-center mt-2">
                  <FaEnvelope className="mr-2 text-blue-600 dark:text-blue-300" />{" "}
                  {profileData.email}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-2">
            <h2 className="font-serif font-bold text-gray-900 dark:text-white text-2xl sm:text-3xl mb-5">
              <HiOutlineAcademicCap className="inline-block mr-2 text-blue-600 dark:text-blue-300" />{" "}
              Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profileData.certifications?.map((cert, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
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
                </div>
              ))}
            </div>
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

export default HospitalProfilePage;
