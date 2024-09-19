"use client";
import { useAppSelector } from "@/app/redux/store";
import pb from "@/utils/pocketbase-connect";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { stateCityData } from "../../stateCities";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { educationalQualifications } from "../../educationalQualifications";
import EducationalQualificationsTable from "@/components/EducationalQualificationsTable";

type Degree = keyof typeof educationalQualifications.degrees; // 'MBBS' | 'BAMS' etc.
type PGCourses =
  keyof (typeof educationalQualifications.degrees)[Degree]["postgraduateCourses"];
type SpecializationCourses = string[];

const typedStateCityData = stateCityData as StateCityData;

type StateCityData = {
  [state: string]: string[];
};

const councilOptions = [
  {
    key: "ANDHRA PRADESH MEDICAL COUNCIL",
    name: "ANDHRA PRADESH MEDICAL COUNCIL",
  },
  {
    key: "ARUNACHAL PRADESH MEDICAL COUNCIL",
    name: "ARUNACHAL PRADESH MEDICAL COUNCIL",
  },
  { key: "ASSAM MEDICAL COUNCIL", name: "ASSAM MEDICAL COUNCIL" },
  { key: "BHOPAL MEDICAL COUNCIL", name: "BHOPAL MEDICAL COUNCIL" },
  { key: "BIHAR MEDICAL COUNCIL", name: "BIHAR MEDICAL COUNCIL" },
  { key: "BOMBAY MEDICAL COUNCIL", name: "BOMBAY MEDICAL COUNCIL" },
  { key: "CHANDIGARH MEDICAL COUNCIL", name: "CHANDIGARH MEDICAL COUNCIL" },
  { key: "CHATTISGARH MEDICAL COUNCIL", name: "CHATTISGARH MEDICAL COUNCIL" },
  { key: "DELHI MEDICAL COUNCIL", name: "DELHI MEDICAL COUNCIL" },
  { key: "GOA MEDICAL COUNCIL", name: "GOA MEDICAL COUNCIL" },
  { key: "GUJARAT MEDICAL COUNCIL", name: "GUJARAT MEDICAL COUNCIL" },
  { key: "HARYANA MEDICAL COUNCIL", name: "HARYANA MEDICAL COUNCIL" },
  {
    key: "HIMANCHAL PRADESH MEDICAL COUNCIL",
    name: "HIMANCHAL PRADESH MEDICAL COUNCIL",
  },
  { key: "HYDERABAD MEDICAL COUNCIL", name: "HYDERABAD MEDICAL COUNCIL" },
  {
    key: "JAMMU & KASHMIR MEDICAL COUNCIL",
    name: "JAMMU & KASHMIR MEDICAL COUNCIL",
  },
  { key: "JHARKHAND MEDICAL COUNCIL", name: "JHARKHAND MEDICAL COUNCIL" },
  { key: "KARNATAKA MEDICAL COUNCIL", name: "KARNATAKA MEDICAL COUNCIL" },
  {
    key: "MADHYA PRADESH MEDICAL COUNCIL",
    name: "MADHYA PRADESH MEDICAL COUNCIL",
  },
  { key: "MADRAS MEDICAL COUNCIL", name: "MADRAS MEDICAL COUNCIL" },
  { key: "MAHAKOSHAL MEDICAL COUNCIL", name: "MAHAKOSHAL MEDICAL COUNCIL" },
  { key: "MAHARASHTRA MEDICAL COUNCIL", name: "MAHARASHTRA MEDICAL COUNCIL" },
  { key: "MANIPUR MEDICAL COUNCIL", name: "MANIPUR MEDICAL COUNCIL" },
  { key: "MEDICAL COUNCIL OF INDIA", name: "MEDICAL COUNCIL OF INDIA" },
  {
    key: "MEDICAL COUNCIL OF TANGANYIKA",
    name: "MEDICAL COUNCIL OF TANGANYIKA",
  },
  { key: "MIZORAM MEDICAL COUNCIL", name: "MIZORAM MEDICAL COUNCIL" },
  { key: "MYSORE MEDICAL COUNCIL", name: "MYSORE MEDICAL COUNCIL" },
  { key: "NAGALAND MEDICAL COUNCIL", name: "NAGALAND MEDICAL COUNCIL" },
  {
    key: "ORISSA COUNCIL OF MEDICAL REGISTRATION",
    name: "ORISSA COUNCIL OF MEDICAL REGISTRATION",
  },
  { key: "PONDICHERRY MEDICAL COUNCIL", name: "PONDICHERRY MEDICAL COUNCIL" },
  { key: "PUNJAB MEDICAL COUNCIL", name: "PUNJAB MEDICAL COUNCIL" },
  { key: "RAJASTHAN MEDICAL COUNCIL", name: "RAJASTHAN MEDICAL COUNCIL" },
  { key: "SIKKIM MEDICAL COUNCIL", name: "SIKKIM MEDICAL COUNCIL" },
  { key: "TAMIL NADU MEDICAL COUNCIL", name: "TAMIL NADU MEDICAL COUNCIL" },
  {
    key: "TELANGANA STATE MEDICAL COUNCIL",
    name: "TELANGANA STATE MEDICAL COUNCIL",
  },
  {
    key: "TRAVANCORE COCHIN MEDICAL COUNCIL, TRIVANDRUM",
    name: "TRAVANCORE COCHIN MEDICAL COUNCIL, TRIVANDRUM",
  },
  {
    key: "TRIPURA STATE MEDICAL COUNCIL",
    name: "TRIPURA STATE MEDICAL COUNCIL",
  },
  {
    key: "UTTAR PRADESH MEDICAL COUNCIL",
    name: "UTTAR PRADESH MEDICAL COUNCIL",
  },
  { key: "UTTARAKHAND MEDICAL COUNCIL", name: "UTTARAKHAND MEDICAL COUNCIL" },
  { key: "VIDHARBA MEDICAL COUNCIL", name: "VIDHARBA MEDICAL COUNCIL" },
  { key: "WEST BENGAL MEDICAL COUNCIL", name: "WEST BENGAL MEDICAL COUNCIL" },
];

export default function EditProfileComponent(props: any) {
  console.log("Props", props);
  const id = useAppSelector((state) => state.profileReducer.value.id);

  const [authdata, setAuthData] = useState<any>("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [address, setAddress] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [selectedCouncil, setSelectedCouncil] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [regCert, setRegCert] = useState<File | null>(null);
  const [degreeCert, setDegreeCert] = useState<File | null>(null);
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState(""); // New state for bio
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
  const [isRegCertUploaded, setIsRegCertUploaded] = useState(false);
  const [isDegreeCertUploaded, setIsDegreeCertUploaded] = useState(false);
  const [experienceYears, setExperienceYears] = useState("");
  const [selectedDegree, setSelectedDegree] = useState<Degree | "">("");
  const [selectedPGCourse, setSelectedPGCourse] = useState<PGCourses | "">("");
  const [selectedSpecialization, setSelectedSpecialization] =
    useState("Not Applicable");
  const [pgCourses, setPGCourses] = useState<PGCourses[]>([]);
  const [specializationCourses, setSpecializationCourses] =
    useState<SpecializationCourses>([]);
  const [qualificationsRefetchTrigger, setQualificationsRefetchTrigger] =
    useState<number>(0);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isContactVerified, setIsContactVerified] = useState(false);
  const [isEducationUploaded, setIsEducationUploaded] = useState(false);

  const handleDelete = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const data = getCookie("authData");
    if (data) {
      const authData = JSON.parse(data as string);
      authData && setAuthData(authData);
    }
  }, []);
  // Handler for when a degree is selected
  const handleDegreeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const degree = e.target.value as Degree;
    setSelectedDegree(degree);

    // Update PG courses based on the selected degree
    if (degree) {
      const pgOptions = Object.keys(
        educationalQualifications.degrees[degree].postgraduateCourses
      ) as PGCourses[];
      setPGCourses(pgOptions);
    } else {
      setPGCourses([]);
    }

    setSelectedPGCourse("");
    setSpecializationCourses([]);
  };

  // Handler for when a postgraduate course is selected
  const handlePGCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pgCourse = e.target.value as PGCourses;
    setSelectedPGCourse(pgCourse);

    // Update specialization courses based on the selected PG course
    if (pgCourse && selectedDegree) {
      const specializationOptions =
        educationalQualifications.degrees[selectedDegree].postgraduateCourses[
          pgCourse
        ];
      setSpecializationCourses(specializationOptions);
    } else {
      setSpecializationCourses([]);
    }
  };
  const handleSpecializationChange = (e: any) => {
    setSelectedSpecialization(e.target.value);
  };

  const handleCouncilChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCouncil(event.target.value);
  };

  const validateContactNumber = () => {
    if (mobile.length !== 10) {
      toast.error("Contact number must be 10 digits long.");
      return false;
    }
    return true;
  };
  const setIsDocumentUploaded = async (): Promise<void> => {
    let headersList = {
      Accept: "/",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      Authorization: `Bearer ${authdata?.token}`,
      "Content-Type": "application/json",
    };

    const bodyContent = JSON.stringify({
      is_document_uploaded: true,
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/is-document-uploaded`,
      {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      }
    );

    const data = await response.text();
    console.log(data);
    return new Promise((resolve) => {
      console.log("Document marked as uploaded.");
      resolve();
    });
  };
  const handleEducationalDetails = async () => {
    if (!selectedDegree || !selectedPGCourse || !selectedSpecialization) {
      toast.error("Please select all educational details.");
      return;
    }

    const data = {
      degree: selectedDegree,
      pg: selectedPGCourse,
      specialization: selectedSpecialization,
      user: id,
    };

    try {
      const record = await pb.collection("user_credentials").create(data);
      console.log("Educational details posted successfully:", record);
      toast.success("Educational details added successfully!");

      setSelectedDegree("");
      setSelectedPGCourse("");
      setSelectedSpecialization("");
      setPGCourses([]);
      setSpecializationCourses([]);

      // Trigger a refetch of the qualifications
      setQualificationsRefetchTrigger((prev) => prev + 1);
      setIsEducationUploaded(true);
    } catch (error: any) {
      console.error("Error posting educational details:", error);
      toast.error(error.message || "An error occurred while adding details.");
    }
  };

  const validateProfilePhoto = () => {
    if (profilePhoto) {
      const allowedTypes = ["image/png", "image/jpeg"];
      if (!allowedTypes.includes(profilePhoto.type)) {
        toast.error(
          "Only PNG and JPG formats are allowed for the profile photo."
        );
        return false;
      }
    }
    return true;
  };

  const uploadProfilePhoto = async () => {
    if (!profilePhoto) {
      console.error("No profile photo selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profile", profilePhoto);

    return toast
      .promise(pb.collection("users").update(id, formData), {
        loading: "Uploading profile photo...",
        success: "profile photo uploaded successfully 😎",
        error: "profile photo upload failed 😞",
      })
      .then(() => setIsPhotoUploaded(true));
  };

  const uploadRegistrationCertificate = async () => {
    if (!regCert) {
      console.error("No registration certificate selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("registration_certificate", regCert);

    return toast
      .promise(pb.collection("users").update(id, formData), {
        loading: "Uploading registration certificate...",
        success: "Registration certificate uploaded successfully 😎",
        error: "Registration certificate upload failed 😞",
      })
      .then(() => setIsRegCertUploaded(true));
  };

  const uploadDegreeCertificate = async () => {
    if (!degreeCert) {
      console.error("No degree certificate selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("degree_certificate", degreeCert);

    return toast
      .promise(pb.collection("users").update(id, formData), {
        loading: "Uploading degree certificate...",
        success: "Degree certificate uploaded successfully 😎",
        error: "Degree certificate upload failed 😞",
      })
      .then(() => setIsDegreeCertUploaded(true));
  };

  const updateProfile = async () => {
    // Validate contact number and profile photo
    if (!validateProfilePhoto()) {
      return;
    }

    // Prepare the profile data
    const profileData = {
      dob,
      mobile,
      state: selectedState,
      city: selectedCity,
      address,
      registrationNumber,
      selectedCouncil,
      experience,
      selectedDegrees: selectedDegree,
      selectedSpecializations: selectedPGCourse,
      bio,
      experienceYears,
    };

    // Show loading toast while the profile is being updated
    try {
      await toast.promise(pb.collection("users").update(id, profileData), {
        loading: "Updating profile...",
        success: () => {
          // Call the function to mark the document as uploaded on success
          setIsDocumentUploaded();
          props.handleShowEditProfile(true);
          props.handleTabClick("profile");

          // Reset all fields upon successful profile update
          resetFields();

          return "profile updated and sent for verification. Once verified, you can post jobs. ✨";
        },
        error: "profile update failed 😞",
      });

      // Show final success toast message

      // router.refresh();
      // window.location.href = "/doctor-dashboard";
    } catch (error) {
      console.error(
        "Error while updating profile or marking document as uploaded:",
        error
      );
      toast.error("An error occurred during the update process.");
    }
  };

  // Function to reset all fields
  const resetFields = () => {
    setDob("");
    setMobile("");
    setSelectedState("");
    setSelectedCity("");
    setAddress("");
    setRegistrationNumber("");
    setSelectedCouncil("");
    setExperience("");
    setSelectedDegree("");
    setSelectedPGCourse("");
    setBio("");
    setExperienceYears("");
    setProfilePhoto(null);
    setRegCert(null);
    setDegreeCert(null);
    setIsPhotoUploaded(false);
    setIsRegCertUploaded(false);
    setIsDegreeCertUploaded(false);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = event.target.value;
    setSelectedState(newState);
    setSelectedCity("");
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };
  const handleSendOtp = async () => {
    let headersList = {
      Accept: "/",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      Authorization: `Bearer ${authdata?.token}`,
      "Content-Type": "application/json",
    };
    let bodyContent = JSON.stringify({
      mobile: mobile,
    });

    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/collections/users/send-otp`,
        {
          method: "POST",
          headers: headersList,
          body: bodyContent,
        }
      );

      const data = await response.json(); // Extract JSON from the response

      if (response.ok) {
        setOtpSent(true);
        setIsOtpVisible(true);
        toast.success(data.message || "OTP sent successfully!"); // Show message from the response
      } else {
        toast.error(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred while sending OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    let headersList = {
      Accept: "/",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      Authorization: `Bearer ${authdata?.token}`,
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      otp: otp,
    });

    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/collections/users/verify-otp`,
        {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        }
      );

      const data = await response.json(); // Extract JSON from the response

      if (response.ok) {
        toast.success(data.message || "OTP verified successfully!"); // Show message from the response
        setIsOtpVisible(false);
        setIsContactVerified(true);
      } else {
        toast.error(
          data.message || "OTP verification failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred while verifying OTP.");
    }
  };

  const isFormValid = () => {
    const allFieldsFilled =
      dob &&
      selectedState &&
      selectedCity &&
      address &&
      registrationNumber &&
      selectedCouncil &&
      experience &&
      bio &&
      experienceYears;

    // Check if profile photo and documents are uploaded
    const allDocumentsUploaded =
      isPhotoUploaded && isRegCertUploaded && isDegreeCertUploaded;

    return allFieldsFilled && allDocumentsUploaded;
  };
  const allFieldsSelected = selectedDegree && selectedPGCourse;
  return (
    <div className="flex flex-col text-black dark:text-white w-full max-w-8xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6 dark:text-white text-blue-800 text-center">
        Edit Professional profile
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* profile Photo */}
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-300 bg-gray-100">
            {profilePhoto ? (
              <img
                src={URL.createObjectURL(profilePhoto)}
                alt="profile Preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-gray-500 text-xs sm:text-sm dark:text-white">
                No Photo
              </span>
            )}
          </div>
          <input
            required
            accept="image/png, image/jpeg"
            type="file"
            onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
            className="hidden"
            id="profile-photo-upload"
          />
          <label
            htmlFor="profile-photo-upload"
            className=" cursor-pointer px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Select profile Photo
            <span className="text-red-500 ml-1">*</span>
          </label>
          <button
            onClick={uploadProfilePhoto}
            className="mt-2 px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isPhotoUploaded}
          >
            {isPhotoUploaded
              ? "profile Photo Uploaded"
              : "Upload profile Photo"}
          </button>
        </div>

        {/* Registration Certificate */}
        <div>
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
              Upload Registration Certificate
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              required
              type="file"
              accept=".pdf"
              onChange={(e) => setRegCert(e.target.files?.[0] || null)}
              className="w-full p-2 dark:text-white dark:bg-gray-800 text-black sm:p-3 border rounded-lg bg-gray-100 text-sm sm:text-base"
            />
            <button
              onClick={uploadRegistrationCertificate}
              className="mt-2 px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isRegCertUploaded}
            >
              {isRegCertUploaded
                ? "Registration Certificate Uploaded"
                : "Upload Registration Certificate"}
            </button>
          </div>

          {/* Degree Certificate */}
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
              Upload Degree Certificate
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              required
              type="file"
              accept=".pdf"
              onChange={(e) => setDegreeCert(e.target.files?.[0] || null)}
              className="w-full text-black dark:text-white dark:bg-gray-800 p-2 sm:p-3 border rounded-lg bg-gray-100 text-sm sm:text-base"
            />
            <button
              onClick={uploadDegreeCertificate}
              className="mt-2 px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isDegreeCertUploaded}
            >
              {isDegreeCertUploaded
                ? "Degree Certificate Uploaded"
                : "Upload Degree Certificate"}
            </button>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Date of Birth */}
            <div>
              <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                Date of Birth
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                required
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full dark:text-white p-3 sm:p-4 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Contact Number */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-lg font-medium dark:text-white text-gray-700 mb-2">
                Contact Number
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                required
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full dark:text-white p-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter contact number"
              />
              <button
                onClick={handleSendOtp}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors dark:text-white"
              >
                Verify Contact Number
              </button>
              {otpSent && (
                <p className="text-green-500 mt-2">
                  OTP sent to the corresponding number!
                </p>
              )}
              {isOtpVisible && (
                <div className="mt-4">
                  <label className="block text-lg font-medium dark:text-white text-gray-700 mb-2">
                    Enter OTP
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full dark:text-white p-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter the OTP"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:text-white"
                  >
                    Verify OTP
                  </button>
                </div>
              )}
            </div>
            {/* State */}
            <div>
              <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                State
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                required
                value={selectedState}
                onChange={handleStateChange}
                className="w-full dark:text-white p-3 sm:p-4 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="">Select a state</option>
                {Object.keys(typedStateCityData).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                City
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                required
                value={selectedCity}
                onChange={handleCityChange}
                className="w-full p-3 sm:p-4 dark:text-white text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                disabled={!selectedState}
              >
                <option value="">Select a city</option>
                {selectedState &&
                  typedStateCityData[selectedState].map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            </div>

            {/* Address */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-base sm:text-lg dark:text-white font-medium text-gray-700 mb-1 sm:mb-2">
                Address
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-gray-700 p-3 dark:text-white sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Enter address"
                rows={4}
              />
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                Registration Number
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="w-full text-gray-700 dark:text-white p-3 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Enter registration number"
                required
              />
            </div>

            {/* Council */}
            <div>
              <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                Council
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                required
                value={selectedCouncil}
                onChange={handleCouncilChange}
                className="w-full p-3 sm:p-4 text-gray-700  border rounded-lg focus:outline-none dark:text-white focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="" disabled>
                  Select your council
                </option>
                {councilOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Years */}
            <div>
              <label className="block text-base sm:text-lg font-medium text-gray-700 dark:text-white mb-1 sm:mb-2">
                Experience years
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                required
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full dark:text-white text-gray-700 p-3 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Enter experience in years"
              />
            </div>

            {/* Experience */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-base sm:text-lg font-medium text-gray-700 dark:text-white mb-1 sm:mb-2">
                Describe your experience
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                required
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-3 dark:text-white text-gray-700 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Describe your experience"
                rows={4}
              />
            </div>
          </div>

          {/* Degree Dropdown */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label
                htmlFor="degree"
                className="block text-gray-700 dark:text-white font-medium mb-2"
              >
                Select Degree
              </label>
              <select
                id="degree"
                value={selectedDegree}
                onChange={handleDegreeChange}
                className="w-full dark:text-white text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select a Degree</option>
                {Object.keys(educationalQualifications.degrees).map(
                  (degree) => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Postgraduate Course Dropdown */}
            {pgCourses.length > 0 && (
              <div className="flex-1 min-w-[200px]">
                <label
                  htmlFor="pg-course"
                  className="block text-gray-700 dark:text-white font-medium mb-2"
                >
                  Select Postgraduate Course
                </label>
                <select
                  id="pg-course"
                  value={selectedPGCourse}
                  onChange={handlePGCourseChange}
                  className="w-full dark:text-white text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                >
                  <option value="">Select a PG Course</option>
                  {pgCourses.map((pgCourse) => (
                    <option key={pgCourse} value={pgCourse}>
                      {pgCourse}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Specialization Course Dropdown */}
            {specializationCourses.length > 0 && (
              <div className="flex-1 min-w-[200px]">
                <label
                  htmlFor="specialization-course"
                  className="block text-gray-700 dark:text-white font-medium mb-2"
                >
                  Select Specialization
                </label>
                <select
                  id="specialization-course"
                  value={selectedSpecialization}
                  onChange={handleSpecializationChange}
                  className="w-full text-black p-2 border dark:text-white border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                >
                  <option value="">Select a Specialization</option>
                  {specializationCourses.map((specialization) => (
                    <option key={specialization} value={specialization}>
                      {specialization}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Add Button */}
            {allFieldsSelected && (
              <div className="flex-1 min-w-[200px] flex items-end">
                <button
                  onClick={handleEducationalDetails}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Add Qualification
                </button>
              </div>
            )}
          </div>
          <EducationalQualificationsTable
            userId={id}
            triggerRefetch={qualificationsRefetchTrigger}
            onDelete={handleDelete}
          />

          {/* Bio */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
              Biography
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-gray-700 p-3 dark:text-white sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Write a brief biography"
              rows={4}
            />
          </div>
        </div>

        {isFormValid() && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={updateProfile}
              className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Update profile and Send for Verification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
