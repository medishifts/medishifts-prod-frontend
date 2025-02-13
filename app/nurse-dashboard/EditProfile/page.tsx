"use client";
import { AppDispatch, useAppSelector } from "@/app/redux/store";
import pb from "@/utils/pocketbase-connect";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { stateCityData } from "../../stateCities";

import { deleteCookie, getCookie } from "cookies-next";
import { Spinner } from "@nextui-org/react";
import EducationalQualificationsTable from "@/components/EducationalQualificationsTable";
import { resetProfile } from "@/app/redux/features/profile-slice";
import { useDispatch } from "react-redux";
import { nurse_qualifications } from "../../nurse_qualifications";

const typedStateCityData = stateCityData as StateCityData;

type StateCityData = {
  [state: string]: string[];
};

const councilOptions = [
  {
    key: "Andhra Pradesh Nurses and Midwives Council (APNMC)",
    name: "Andhra Pradesh Nurses and Midwives Council (APNMC)",
  },
  {
    key: "Assam Nurses Midwives and Health Visitors Council (ANMHVC)",
    name: "Assam Nurses Midwives and Health Visitors Council (ANMHVC)",
  },
  {
    key: "Bihar Nurses Registration Council (BNRC)",
    name: "Bihar Nurses Registration Council (BNRC)",
  },
  {
    key: "Chandigarh Nursing Council (CNC)",
    name: "Chandigarh Nursing Council (CNC)",
  },
  {
    key: "Chhattisgarh Nurses Registration Council (CGNRC)",
    name: "Chhattisgarh Nurses Registration Council (CGNRC)",
  },
  {
    key: "Delhi Nursing Council (DNC)",
    name: "Delhi Nursing Council (DNC)",
  },
  {
    key: "Goa Nursing Council (GNC)",
    name: "Goa Nursing Council (GNC)",
  },
  {
    key: "Gujarat Nursing Council (GNC)",
    name: "Gujarat Nursing Council (GNC)",
  },
  {
    key: "Haryana Nurses Registration Council (HNRC)",
    name: "Haryana Nurses Registration Council (HNRC)",
  },
  {
    key: "Himachal Pradesh Nurses Registration Council (HPNRC)",
    name: "Himachal Pradesh Nurses Registration Council (HPNRC)",
  },
  {
    key: "Jammu and Kashmir Nursing Council (JKNC)",
    name: "Jammu and Kashmir Nursing Council (JKNC)",
  },
  {
    key: "Jharkhand Nurses Registration Council (JNRC)",
    name: "Jharkhand Nurses Registration Council (JNRC)",
  },
  {
    key: "Karnataka State Nursing Council (KSNC)",
    name: "Karnataka State Nursing Council (KSNC)",
  },
  {
    key: "Kerala Nurses and Midwives Council (KNMC)",
    name: "Kerala Nurses and Midwives Council (KNMC)",
  },
  {
    key: "Madhya Pradesh Nurses Registration Council (MPNRC)",
    name: "Madhya Pradesh Nurses Registration Council (MPNRC)",
  },
  {
    key: "Maharashtra Nursing Council (MNC)",
    name: "Maharashtra Nursing Council (MNC)",
  },
  {
    key: "Manipur Nursing Council (MNC)",
    name: "Manipur Nursing Council (MNC)",
  },
  {
    key: "Meghalaya Nursing Council (MNC)",
    name: "Meghalaya Nursing Council (MNC)",
  },
  {
    key: "Mizoram Nursing Council (MNC)",
    name: "Mizoram Nursing Council (MNC)",
  },
  {
    key: "Nagaland Nursing Council (NNC)",
    name: "Nagaland Nursing Council (NNC)",
  },
  {
    key: "Odisha Nurses and Midwives Registration Council (ONMRC)",
    name: "Odisha Nurses and Midwives Registration Council (ONMRC)",
  },
  {
    key: "Puducherry Nursing Council (PNC)",
    name: "Puducherry Nursing Council (PNC)",
  },
  {
    key: "Punjab Nurses Registration Council (PNRC)",
    name: "Punjab Nurses Registration Council (PNRC)",
  },
  {
    key: "Rajasthan Nursing Council (RNC)",
    name: "Rajasthan Nursing Council (RNC)",
  },
  {
    key: "Sikkim Nursing Council (SNC)",
    name: "Sikkim Nursing Council (SNC)",
  },
  {
    key: "Tamil Nadu Nurses and Midwives Council (TNNMC)",
    name: "Tamil Nadu Nurses and Midwives Council (TNNMC)",
  },
  {
    key: "Telangana State Nurses and Midwives Council (TSNMC)",
    name: "Telangana State Nurses and Midwives Council (TSNMC)",
  },
  {
    key: "Tripura Nursing Council (TNC)",
    name: "Tripura Nursing Council (TNC)",
  },
  {
    key: "Uttar Pradesh Nurses and Midwives Council (UPNMC)",
    name: "Uttar Pradesh Nurses and Midwives Council (UPNMC)",
  },
  {
    key: "Uttarakhand Nurses and Midwives Council (UKNMC)",
    name: "Uttarakhand Nurses and Midwives Council (UKNMC)",
  },
  {
    key: "West Bengal Nursing Council (WBNC)",
    name: "West Bengal Nursing Council (WBNC)",
  },
];

export default function EditProfileComponent(props: any) {
  // console.log("Props", props);
  const dispatch = useDispatch<AppDispatch>();
  const id = useAppSelector((state) => state.profileReducer.value.id);
  const [authdata, setAuthData] = useState<any>("");
  const [name, setName] = useState<any>(null);
  const [dob, setDob] = useState<any>(null);
  const [mobile, setMobile] = useState<any>(null);
  const [email, setEmail] = useState<any>("");
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [registrationNumber, setRegistrationNumber] = useState<any>(null);
  const [selectedCouncil, setSelectedCouncil] = useState<any>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [regCert, setRegCert] = useState<File | null>(null);
  const [degreeCert, setDegreeCert] = useState<File | null>(null);
  const [experience, setExperience] = useState<any>(null);
  // const [bio, setBio] = useState<any>(null); // New state for bio
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
  const [isRegCertUploaded, setIsRegCertUploaded] = useState(false);
  const [isDegreeCertUploaded, setIsDegreeCertUploaded] = useState(false);
  const [experienceYears, setExperienceYears] = useState<any>(null);
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedPGCourse, setSelectedPGCourse] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [pgCourses, setPGCourses] = useState<string[]>([]);
  const [specializationCourses, setSpecializationCourses] = useState<string[]>(
    []
  );
  const [qualificationsRefetchTrigger, setQualificationsRefetchTrigger] =
    useState<number>(0);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [otp, setOtp] = useState<any>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [isContactVerified, setIsContactVerified] = useState(false);
  const [isEducationUploaded, setIsEducationUploaded] = useState(false);
  const [secondTimeAccUpdate, setSecondTimeAccUpdate] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    dob: false,
    mobile: false,
    selectedState: false,
    selectedCity: false,
    address: false,
    profilePhoto: false,
    degreeCert: false,
    regCert: false,
    registrationNumber: false,
    experience: false,
    experienceYears: false,
    selectedCouncil: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadedQualification, setIsUploadedQualification] = useState(false);
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
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true); // Start loading
        const record = await pb.collection("view_users").getOne(id);
        setSecondTimeAccUpdate(record?.isFirstTimeCompleted);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };
    fetchProfileData();
  }, []);
  // Handler for when a degree is selected
  const handleDegreeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const degree = e.target.value;
    setSelectedDegree(degree);

    // Set default PG course and specialization to "Not Applicable"
    setSelectedPGCourse("Not Applicable");
    setSelectedSpecialization("Not Applicable");

    // Update PG courses based on the selected degree
    if (degree) {
      setPGCourses(nurse_qualifications.postgraduate);
    } else {
      setPGCourses([]);
    }
    setSpecializationCourses([]); // Clear specialization options for new degree
  };

  // Handler for when a postgraduate course is selected
  const handlePGCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pgCourse = e.target.value;
    setSelectedPGCourse(pgCourse);

    // Set specialization to "Not Applicable" by default
    setSelectedSpecialization("Not Applicable");

    // Update specialization courses based on the selected PG course
    if (pgCourse) {
      setSpecializationCourses(nurse_qualifications.specialization);
    } else {
      setSpecializationCourses([]);
    }
  };

  // Handler for when a specialization is selected
  const handleSpecializationChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
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
  const handleEducationalDetailsFirst = async () => {
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
      setIsUploadedQualification(true);
    } catch (error: any) {
      console.error("Error posting educational details:", error);
      toast.error(error.message || "An error occurred while adding details.");
    }
  };
  const handleEducationalDetailsSecond = async () => {
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
  useEffect(() => {
    try {
      uploadProfilePhoto();
    } catch (error) {}
  }, [profilePhoto]);

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
  const validateFields = () => {
    const errors = {
      dob: !dob,
      mobile: !mobile || !isContactVerified,
      selectedState: !selectedState,
      selectedCity: !selectedCity,
      address: !address,
      profilePhoto: !isPhotoUploaded,
      degreeCert: !isDegreeCertUploaded,
      regCert: !isRegCertUploaded,
      registrationNumber: !registrationNumber,
      experience: !experience,
      experienceYears: !experienceYears,
      selectedCouncil: !selectedCouncil,
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const updateProfile = async () => {
    if (!validateFields()) {
      toast.error(
        "Please fill all required fields and verify your contact number."
      );
      return;
    }
    if (!isUploadedQualification) {
      toast.error("Please save your qualifications");
      return;
    }

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
      experienceYears,
      isFirstTimeCompleted: true,
    };

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

          return "Profile updated and sent for verification.✨";
        },
        error: "profile update failed 😞",
      });
    } catch (error) {
      console.error(
        "Error while updating profile or marking document as uploaded:",
        error
      );
      toast.error("An error occurred during the update process.");
    }
  };
  const sendForVerification = async () => {
    try {
      let headersList = {
        Authorization: `Bearer ${authdata?.token}`,
      };

      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/collections/users/re-verify-documents`,
        {
          method: "GET",
          headers: headersList,
        }
      );

      let data = await response.text();
      if (response.status === 200) {
        toast.success("Profile has been sent for verification");
        props.handleTabClick("profile");
      }
      console.log(data);
    } catch (error) {}
  };
  const updateProfileNew = async () => {
    const criticalFieldsPresent =
      name ||
      isEducationUploaded ||
      isRegCertUploaded ||
      isDegreeCertUploaded ||
      selectedCouncil ||
      registrationNumber;

    console.log("Critical Fields Present:", criticalFieldsPresent);

    const profileData = {
      name,
      dob,
      mobile,
      state: selectedState,
      city: selectedCity,
      address,
      experience,
      experienceYears,
      selectedCouncil,
      registrationNumber,
    };

    console.log("Profile Data:", profileData);

    // Filter out null or undefined fields
    const availableFields = Object.entries(profileData).filter(
      ([key, value]) => value !== null && value !== undefined
    );

    // Convert the filtered fields back to an object
    const filteredProfileData = Object.fromEntries(availableFields);

    if (Object.keys(filteredProfileData).length === 0) {
      toast.error("Please fill in at least one field to update.");
    } else {
      try {
        await toast.promise(
          pb.collection("users").update(id, filteredProfileData),
          {
            loading: "Updating profile...",
            success: () => {
              setIsDocumentUploaded();

              if (!criticalFieldsPresent) {
                props.handleShowEditProfile(true);
                props.handleTabClick("profile");

                resetFields();

                // return "profile updated and sent for verification. Once verified, you can post jobs. ✨";
              }

              return "Profile updated successfully";
            },
            error: "Profile update failed",
          }
        );
      } catch (error) {
        console.error(
          "Error while updating profile or marking document as uploaded:",
          error
        );
        toast.error("An error occurred during the update process.");
      }
    }

    if (criticalFieldsPresent) {
      await sendForVerification();
    }
  };

  // Function to reset all fields
  const resetFields = () => {
    setDob(null);
    setMobile(null);
    setSelectedState(null);
    setSelectedCity(null);
    setAddress(null);
    setRegistrationNumber(null);
    setSelectedCouncil(null);
    setExperience(null);
    setSelectedDegree("");
    setSelectedPGCourse("");
    setExperienceYears(null);
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
  const handleEmailChange = async () => {
    if (!email || email.length === 0) {
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to update your email address? You will be logged out and will need to log in again after verifying your new email. Please check your inbox to complete the verification process."
    );

    if (!confirmed) return;
    try {
      const response = await pb.collection("users").requestEmailChange(email);
      console.log("Email change response ", response);
      toast.success("Email change request sent successfully!");
      pb.authStore.clear();
      deleteCookie("authToken");
      deleteCookie("authData");
      dispatch(resetProfile());
      toast.success("You have been logged out successfully!");
      window.location.href = "/";
    } catch (error) {
      console.log("Email change error", error);
      toast.error("Changing Email failed. Try again");
    }
  };
  const handleSendOtp = async () => {
    let headersList = {
      Accept: "/",
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
        setMobile(null);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMobile(null);
      toast.error("An error occurred while sending OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    let headersList = {
      Accept: "/",
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
  const renderInput = (
    name: keyof typeof fieldErrors,
    value: string,
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void,
    placeholder: string,
    type: string = "text"
  ) => (
    <div>
      <input
        required
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          fieldErrors[name] ? "border-red-500" : ""
        }`}
        placeholder={placeholder}
      />
      {fieldErrors[name] && (
        <p className="text-red-500 mt-1">This field is required</p>
      )}
    </div>
  );

  const allFieldsSelected = selectedDegree && selectedPGCourse;
  useEffect(() => {
    if (secondTimeAccUpdate) {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="/logo.png"
                    alt="Medishifts Logo"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    ⚠ Profile Update Reminder
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Kindly edit or add the required fields marked with an
                    asterisk (*) and any other necessary details. All fields do
                    not need to be filled.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    }
  }, [secondTimeAccUpdate]);
  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center ">
        <Spinner />
      </div>
    ); // Show loader until data is fetched
  }
  // if (secondTimeAccUpdate) {
  //   toast.wa;
  // }
  return (
    <>
      {secondTimeAccUpdate ? (
        // Second time after first time Profile Update :=>
        <>
          <div className="flex flex-col text-black dark:text-white w-full max-w-8xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6 dark:text-white text-blue-800 text-center">
              Edit Professional profile
            </h1>

            <div className="grid grid-cols-1  gap-4 sm:gap-6">
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
                  {isPhotoUploaded
                    ? "Update Profile Photo "
                    : "Select profile Photo"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <span>
                  If you're only updating your profile photo, there's no need to
                  click 'Save Changes.' Your photo will automatically update
                  once the upload is complete, and a confirmation notification
                  will appear.
                </span>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-base sm:text-lg dark:text-white font-medium text-gray-700 mb-1 sm:mb-2">
                  Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-gray-700 p-3 dark:text-white sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter address"
                />
              </div>

              {/* Registration Certificate */}

              <div className="col-span-1 lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Date of Birth */}
                  <div>
                    <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                      Date of Birth
                    </label>
                    <input
                      required
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full dark:text-white p-3 sm:p-4 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-lg font-medium dark:text-white text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full dark:text-white p-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Email Address"
                    />
                    <button
                      onClick={handleEmailChange}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors dark:text-white"
                    >
                      Change Email
                    </button>
                  </div>

                  {/* Contact Number */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-lg font-medium dark:text-white text-gray-700 mb-2">
                      Enter Whatsapp Number
                    </label>
                    <span>Mobile number must be associated with Whatsapp</span>
                    <input
                      required
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full dark:text-white p-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your whatsapp number"
                    />

                    <button
                      onClick={handleSendOtp}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors dark:text-white"
                    >
                      Change Whatsapp Number
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
                  <div>
                    <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                      State
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

                  {/* Experience Years */}
                  <div>
                    <label className="block text-base sm:text-lg font-medium text-gray-700 dark:text-white mb-1 sm:mb-2">
                      Experience years
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

                <div>
                  <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                    Council
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    required
                    value={selectedCouncil}
                    onChange={handleCouncilChange}
                    className="w-full p-3 sm:p-4 text-gray-700  border rounded-lg focus:outline-none dark:text-white focus:ring-2 focus:ring-blue-500 text-sm sm:text-base "
                  >
                    <option value="">Select your council</option>
                    {councilOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                    Registration Number
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Reg Number Without Council"
                    required
                  />
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
                      {nurse_qualifications.degree.map((degree) => (
                        <option key={degree} value={degree}>
                          {degree}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Postgraduate Course Dropdown */}

                  {selectedDegree && (
                    <div className="flex-1">
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
                        {nurse_qualifications.postgraduate.map((pgCourse) => (
                          <option key={pgCourse} value={pgCourse}>
                            {pgCourse}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Specialization Course Dropdown - Only shown if a PG course is selected */}
                  {selectedPGCourse && (
                    <div className="flex-1">
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
                        {nurse_qualifications.specialization.map(
                          (specialization) => (
                            <option key={specialization} value={specialization}>
                              {specialization}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )}

                  {/* Add Button */}
                  {selectedDegree &&
                    selectedPGCourse &&
                    selectedSpecialization && (
                      <div className="flex-1 min-w-[200px] flex items-end">
                        <button
                          onClick={handleEducationalDetailsSecond}
                          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          Save Qualification
                        </button>
                      </div>
                    )}
                </div>
                <EducationalQualificationsTable
                  userId={id}
                  triggerRefetch={qualificationsRefetchTrigger}
                  onDelete={handleDelete}
                />

                <p className="flex justify-center text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                  If you have multiple documents, please merge them into a
                  single PDF file before uploading.
                </p>
                <div>
                  <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                    Upload Registration Certificate
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    required
                    type="file"
                    accept=".pdf, .png, .jpeg, .jpg"
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
                <div>
                  <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                    Upload Passing / Degree Certificate
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    required
                    type="file"
                    accept=".pdf, .png, .jpeg, .jpg"
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
                      : "Upload Passing / Degree Certificate"}
                  </button>
                </div>
              </div>
            </div>

            <p className="lg:flex md:flex-auto justify-center text-sm sm:text-base text-gray-600 font-bold dark:text-gray-400 mt-4">
              If you change any of the fields marked with asterisk (
              <span className="text-red-500">*</span>), Admin will need to
              verify your profile again before you can apply for new jobs.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={updateProfileNew}
                className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col text-black dark:text-white w-full max-w-8xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6 dark:text-white text-blue-800 text-center">
              Edit Professional profile
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6">
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
                  {isPhotoUploaded
                    ? "Update Profile Photo "
                    : "Select profile Photo"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                {/* <button
                  onClick={uploadProfilePhoto}
                  className="mt-2 px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isPhotoUploaded}
                >
                  {isPhotoUploaded
                    ? "profile Photo Uploaded"
                    : "Upload profile Photo"}
                </button> */}
                {fieldErrors.profilePhoto && (
                  <p className="text-red-500 mt-1">Profile photo is required</p>
                )}
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
                    {fieldErrors.dob && (
                      <p className="text-red-500 mt-1">
                        Date of birth is required
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div className="col-span-1 sm:col-span-2">
                    {renderInput(
                      "mobile",
                      mobile,
                      (e) => setMobile(e.target.value),
                      "Enter your whatsapp number"
                    )}
                    <button
                      onClick={handleSendOtp}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors dark:text-white"
                    >
                      Verify Contact Number
                    </button>
                    {fieldErrors.mobile && (
                      <p className="text-red-500 mt-1">
                        Contact number must be verified
                      </p>
                    )}
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
                      className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.selectedState ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select a state</option>
                      {Object.keys(typedStateCityData).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.selectedState && (
                      <p className="text-red-500 mt-1">State is required</p>
                    )}
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
                      className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.selectedCity ? "border-red-500" : ""
                      }`}
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
                    {fieldErrors.selectedCity && (
                      <p className="text-red-500 mt-1">City is required</p>
                    )}
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
                      className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.address ? "border-red-500" : ""
                      }`}
                      // className="w-full text-gray-700 p-3 dark:text-white sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="Enter address"
                      rows={4}
                    />
                    {fieldErrors.address && (
                      <p className="text-red-500 mt-1">Address is required</p>
                    )}
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
                      className={`w-full dark:text-white text-gray-700 p-3 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                        fieldErrors.experienceYears ? "border-red-500" : ""
                      }`}
                      // className="w-full dark:text-white text-gray-700 p-3 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
                      className={`w-full p-3 dark:text-white text-gray-700 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                        fieldErrors.experience ? "border-red-500" : ""
                      }`}
                      // className="w-full p-3 dark:text-white text-gray-700 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="Describe your experience"
                      rows={4}
                    />
                    {fieldErrors.experience && (
                      <p className="text-red-500 mt-1">
                        Experience is required
                      </p>
                    )}
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
                      className={`w-full p-3 sm:p-4 text-gray-700  border rounded-lg focus:outline-none dark:text-white focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                        fieldErrors.selectedCouncil ? "border-red-500" : ""
                      }`}
                      // className="w-full p-3 sm:p-4 text-gray-700  border rounded-lg focus:outline-none dark:text-white focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    >
                      <option value="">Select your council</option>
                      {councilOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.selectedCouncil && (
                      <p className="text-red-500 mt-1">Council is required</p>
                    )}
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
                      className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.registrationNumber ? "border-red-500" : ""
                      }`}
                      // className="w-full text-gray-700 dark:text-white p-3 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="Enter Reg Number Without Council"
                      required
                    />
                    {fieldErrors.registrationNumber && (
                      <p className="text-red-500 mt-1">
                        Registration number is required
                      </p>
                    )}
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
                      {nurse_qualifications.degree.map((degree) => (
                        <option key={degree} value={degree}>
                          {degree}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedDegree && (
                    <div className="flex-1">
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
                        {nurse_qualifications.postgraduate.map((pgCourse) => (
                          <option key={pgCourse} value={pgCourse}>
                            {pgCourse}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Specialization Course Dropdown - Only shown if a PG course is selected */}
                  {selectedPGCourse && (
                    <div className="flex-1">
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
                        {nurse_qualifications.specialization.map(
                          (specialization) => (
                            <option key={specialization} value={specialization}>
                              {specialization}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )}

                  {/* Add Button */}
                  {selectedDegree &&
                    selectedPGCourse &&
                    selectedSpecialization && (
                      <div className="flex-1 min-w-[200px] flex items-end">
                        <button
                          onClick={handleEducationalDetailsFirst}
                          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          Save Qualification
                        </button>
                      </div>
                    )}
                </div>
                <EducationalQualificationsTable
                  userId={id}
                  triggerRefetch={qualificationsRefetchTrigger}
                  onDelete={handleDelete}
                />
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
                    accept=".pdf, .png, .jpeg, .jpg"
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
                  {fieldErrors.regCert && (
                    <p className="text-red-500 mt-1">
                      Registration certificate is required
                    </p>
                  )}
                </div>

                {/* Degree Certificate */}
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                    Upload Passing / Degree Certificate
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    required
                    type="file"
                    accept=".pdf, .png, .jpeg, .jpg"
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
                      : "Upload Passing / Degree Certificate"}
                  </button>
                  {fieldErrors.degreeCert && (
                    <p className="text-red-500 mt-1">
                      Passing / Degree certificate is required
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={updateProfile}
                className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Update profile and Send for Verification
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
