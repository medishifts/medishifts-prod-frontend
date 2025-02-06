"use client";
import pb from "@/utils/pocketbase-connect";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { stateCityData } from "../../stateCities";
import { deleteCookie, getCookie } from "cookies-next";
import { resetProfile } from "@/app/redux/features/profile-slice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/app/redux/store";

type StateCityData = {
  [state: string]: string[];
};
type ProfilePageProps = {
  onEditProfileClick: () => void;
};

const typedStateCityData = stateCityData as StateCityData;

export default function EditProfileComponent(props: any) {
  console.log("Props", props);
  const dispatch = useDispatch<AppDispatch>();
  const id = useAppSelector((state) => state.profileReducer.value.id);
  const role = useAppSelector((state) => state.profileReducer.value.role);
  const [name, setName] = useState<any>(null);
  const [dob, setDob] = useState<any>(null);
  const [pointOfContact, setPointOfContact] = useState<any>(null);
  const [email, setEmail] = useState<any>(null);
  const [mobile, setMobile] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [bio, setBio] = useState<any>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [documents, setDocuments] = useState<FileList | null>(null);
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
  const [areDocumentsUploaded, setAreDocumentsUploaded] = useState(false);
  const [authdata, setAuthData] = useState<any>("");
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isContactVerified, setIsContactVerified] = useState(false);
  const [secondTimeAccUpdate, setSecondTimeAccUpdate] = useState(false);

  // New state for field validation
  const [fieldErrors, setFieldErrors] = useState({
    dob: false,
    pointOfContact: false,
    mobile: false,
    selectedState: false,
    selectedCity: false,
    address: false,
    bio: false,
    profilePhoto: false,
    documents: false,
  });

  useEffect(() => {
    const data = getCookie("authData");
    if (data) {
      console.log(data);
      const authData = JSON.parse(data as string);
      authData && setAuthData(authData);
    }
  }, []);
  useEffect(() => {
    const fetchProfileData = async () => {
      const record = await pb.collection("view_users").getOne(id);
      console.log(record);
      console.log(record?.isFirstTimeCompleted);

      setSecondTimeAccUpdate(record?.isFirstTimeCompleted);
      console.log(secondTimeAccUpdate);
    };
    fetchProfileData();
  }, []);

  const validateMobile = () => {
    if (mobile.length !== 10) {
      toast.error("Mobile number must be 10 digits long.");
      return false;
    }
    return true;
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
      uploadPhoto();
    } catch (error) {
      console.log("Photo uploading failed");
    }
  }, [profilePhoto]);

  const uploadPhoto = async () => {
    if (!profilePhoto) {
      console.error("No profile photo selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profile", profilePhoto);

    return toast
      .promise(pb.collection("users").update(id, formData), {
        loading: "Uploading profile photo...",
        success: "Profile photo uploaded successfully 😎",
        error: "Profile photo upload failed 😞",
      })
      .then(() => setIsPhotoUploaded(true));
  };

  const uploadDocuments = async () => {
    if (!documents) {
      console.error("No documents selected for upload.");
      return;
    }

    const formData = new FormData();

    const documentPromises = Array.from(documents).map((file) => {
      formData.append("hospital_document", file);
      return pb.collection("users").update(id, formData);
    });

    return toast
      .promise(Promise.all(documentPromises), {
        loading: "Uploading documents...",
        success: "Documents uploaded successfully 😎",
        error: "Document upload failed 😞",
      })
      .then(() => setAreDocumentsUploaded(true));
  };

  const setIsDocumentUploaded = async (): Promise<void> => {
    let headersList = {
      Accept: "/",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      Authorization: `Bearer ${authdata.token}`,
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

  const validateFields = () => {
    const errors = {
      dob: !dob,
      pointOfContact: !pointOfContact,
      mobile: !mobile || !isContactVerified,
      selectedState: !selectedState,
      selectedCity: !selectedCity,
      address: !address,
      bio: !bio,
      profilePhoto: !isPhotoUploaded,
      documents: !areDocumentsUploaded,
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

    if (!validateProfilePhoto()) {
      return;
    }

    const profileData = {
      dob,
      pointOfContact,
      mobile,
      state: selectedState,
      city: selectedCity,
      address,
      bio,
      isFirstTimeCompleted: true,
    };

    try {
      await toast.promise(pb.collection("users").update(id, profileData), {
        loading: "Updating profile...",
        success: () => {
          setIsDocumentUploaded();
          props.handleShowEdit(true);
          props.handleTabClick("profile");
          resetFields();
          return "Profile updated and sent for verification. Once verified, you can post jobs. ✨";
        },
        error: "Profile update failed 😞",
      });
    } catch (error) {
      console.error(
        "Error while updating profile or marking document as uploaded:",
        error
      );
      toast.error("An error occurred during the update process.");
    }
  };

  const resetFields = () => {
    setDob(null);
    setMobile(null);
    setSelectedState(null);
    setSelectedCity(null);
    setAddress(null);
    setPointOfContact(null);
    setBio(null);
    setProfilePhoto(null);
    setDocuments(null);
    setIsPhotoUploaded(false);
    setAreDocumentsUploaded(false);
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

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setIsOtpVisible(true);
        toast.success(data.message || "OTP sent successfully!");
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

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "OTP verified successfully!");
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
        toast.success("Profile re-verification requested");
        props.handleTabClick("profile");
      }
      // console.log(data);s
    } catch (error) {}
  };
  const updateProfileNew = async () => {
    const criticalFieldsPresent = documents || name;

    console.log("Critical Fields Present:", criticalFieldsPresent);

    const profileData = {
      name,
      dob,
      pointOfContact,
      mobile,
      state: selectedState,
      city: selectedCity,
      address,
      bio,
    };

    console.log("Profile Data:", profileData);

    // Filter out null or undefined fields
    const availableFields = Object.entries(profileData).filter(
      ([key, value]) => value !== null && value !== undefined
    );

    // Convert the filtered fields back to an object
    const filteredProfileData = Object.fromEntries(availableFields);

    if (Object.keys(filteredProfileData).length === 0) {
      toast.error("Please fill in atleast one field to update.");
    } else {
      try {
        await toast.promise(
          pb.collection("users").update(id, filteredProfileData),
          {
            loading: "Updating profile...",
            success: () => {
              setIsDocumentUploaded();

              if (!criticalFieldsPresent) {
                // props.handleShowEditProfile(true);
                props.handleTabClick("profile");

                resetFields();
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
                    ⚠️ Profile Update Reminder
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

  return (
    <>
      {secondTimeAccUpdate ? (
        <>
          <div className="flex flex-col text-black dark:text-white w-full max-w-8xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
            <h1 className="text-3xl sm:text-4xl font-semibold mb-6 text-blue-800 text-center dark:text-white">
              Edit Hospital Profile
            </h1>
            <div className="grid grid-cols-1 gap-6">
              {/* Profile Photo */}
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center w-32 h-32 rounded-full border-4 border-gray-300 bg-gray-100">
                  {profilePhoto ? (
                    <img
                      src={URL.createObjectURL(profilePhoto)}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-gray-500 dark:text-white text-sm">
                      No Photo
                    </span>
                  )}
                </div>
                <input
                  accept="image/png, image/jpeg"
                  type="file"
                  onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                  className="hidden"
                  id="profile-photo-upload"
                  // disabled={isPhotoUploaded}
                />
                <label
                  htmlFor="profile-photo-upload"
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isPhotoUploaded
                    ? "Update Profile Photo"
                    : "Select Profile Photo"}
                </label>
                <span>
                  If you're only updating your profile photo, there's no need to
                  click 'Save Changes.' Your photo will automatically update
                  once the upload is complete, and a confirmation notification
                  will appear.
                </span>
                {/* <button
            onClick={uploadPhoto}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isPhotoUploaded}
          >
            {isPhotoUploaded
              ? "Profile Photo Uploaded"
              : "Upload Profile Photo"}
          </button> */}
              </div>

              {/* Profile Details */}
              <div className="col-span-1 dark:text-white text-black md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Address */}
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
                      placeholder="Enter Name"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium mb-2">
                      Address
                    </label>
                    <textarea
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
                      placeholder="Enter address"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium mb-2">
                      State
                    </label>
                    <select
                      required
                      value={selectedState}
                      onChange={handleStateChange}
                      className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
                    >
                      <option value="">Select state</option>
                      {Object.keys(typedStateCityData).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-lg font-medium mb-2">
                      City
                    </label>
                    <select
                      required
                      value={selectedCity}
                      onChange={handleCityChange}
                      className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
                      disabled={!selectedState}
                    >
                      <option value="">Select city</option>
                      {selectedState &&
                        typedStateCityData[selectedState]?.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Bio */}
                  <div id="bio-section">
                    <label className="block text-lg font-medium mb-2">
                      Services Provided
                    </label>
                    <textarea
                      required
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter the services provided by your hospital in ',' comma separated values. Ex: Multispeciality , ICU "
                    />
                  </div>
                  <label className="block text-lg font-medium dark:text-white text-gray-700 mb-2">
                    Enter name of the POC
                    {renderInput(
                      "pointOfContact",
                      pointOfContact,
                      (e) => setPointOfContact(e.target.value),
                      "Enter point of contact name"
                    )}
                  </label>

                  {/* Mobile Number */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-lg font-medium dark:text-white text-gray-700 mb-2">
                      Change Email Address
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
                      Enter WhatsApp number
                    </label>
                    <span>Mobile number must be associated with Whatsapp</span>
                    <input
                      required
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full dark:text-white p-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Please enter whatsapp number "
                    />

                    <button
                      onClick={handleSendOtp}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors dark:text-white"
                    >
                      Change Contact Number
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
                      Date of Establishment
                    </label>
                    <input
                      required
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full dark:text-white p-3 sm:p-4 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>

                  {/* State */}
                </div>
              </div>
            </div>
            {/* Document Upload */}
            <div className="flex flex-col space-y-4">
              <label className="block text-lg font-medium text-gray-700 dark:text-white mb-2">
                Upload Documents (Reg Doc / Light Bill / Tax Bill)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setDocuments(e.target.files)}
                className="w-full text-black dark:text-white p-3 border rounded-lg bg-gray-100 dark:bg-gray-800"
              />
              <button
                onClick={uploadDocuments}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={areDocumentsUploaded}
              >
                {areDocumentsUploaded
                  ? "Documents Uploaded"
                  : "Upload Documents"}
              </button>
            </div>

            {/* Always Visible Update Button */}
            <p className="lg:flex md:flex-auto justify-center text-sm   text-gray-600 font-bold dark:text-gray-400 mt-4">
              If you change any of the fields marked with asterisk (
              <span className="text-red-500">*</span>), Admin will need to
              re-verify your profile before you can post new jobs.
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
            <h1 className="text-3xl sm:text-4xl font-semibold mb-6 text-blue-800 text-center dark:text-white">
              Edit Hospital Profile
            </h1>
            <div className="grid grid-cols-1 gap-6">
              {/* Profile Photo */}
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center w-32 h-32 rounded-full border-4 border-gray-300 bg-gray-100">
                  {profilePhoto ? (
                    <img
                      src={URL.createObjectURL(profilePhoto)}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-gray-500 dark:text-white text-sm">
                      No Photo
                    </span>
                  )}
                </div>
                <input
                  accept="image/png, image/jpeg"
                  type="file"
                  onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                  className="hidden"
                  id="profile-photo-upload"
                  // disabled={isPhotoUploaded}
                />
                <label
                  htmlFor="profile-photo-upload"
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isPhotoUploaded
                    ? "Update Profile Photo"
                    : "Select Profile Photo"}

                  <span className="text-red-500 ml-1">*</span>
                </label>
                {/* <button
            onClick={uploadPhoto}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isPhotoUploaded}
          >
            {isPhotoUploaded
              ? "Profile Photo Uploaded"
              : "Upload Profile Photo"}
          </button> */}
                {fieldErrors.profilePhoto && (
                  <p className="text-red-500 mt-1">Profile photo is required</p>
                )}
              </div>

              {/* Profile Details */}
              <div className="col-span-1 dark:text-white text-black md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Address */}
                  <div>
                    <label className="block text-lg font-medium mb-2">
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
                      placeholder="Enter address"
                    />
                    {fieldErrors.address && (
                      <p className="text-red-500 mt-1">Address is required</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg font-medium mb-2">
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
                      <option value="">Select state</option>
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

                  {/* City */}
                  <div>
                    <label className="block text-lg font-medium mb-2">
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
                      <option value="">Select city</option>
                      {selectedState &&
                        typedStateCityData[selectedState]?.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                    </select>
                    {fieldErrors.selectedCity && (
                      <p className="text-red-500 mt-1">City is required</p>
                    )}
                  </div>
                  {/* Bio */}
                  <div id="bio-section">
                    <label className="block text-lg font-medium mb-2">
                      Services Provided
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      required
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.bio ? "border-red-500" : ""
                      }`}
                      placeholder="Enter the services provided by your hospital in ',' comma separated values. Ex: Multispeciality , ICU "
                    />
                    {fieldErrors.bio && (
                      <p className="text-red-500 mt-1">
                        Services provided is required
                      </p>
                    )}
                  </div>
                  <label className="block text-lg font-medium dark:text-white text-gray-700 mb-2">
                    Enter name of the POC
                    <span className="text-red-500 ml-1">*</span>
                    {renderInput(
                      "pointOfContact",
                      pointOfContact,
                      (e) => setPointOfContact(e.target.value),
                      "Enter point of contact name"
                    )}
                  </label>

                  {/* Mobile Number */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-lg font-medium dark:text-white text-gray-700 mb-2">
                      Enter WhatsApp number
                      <span className="text-red-500 ml-1">*</span>
                      {renderInput(
                        "mobile",
                        mobile,
                        (e) => setMobile(e.target.value),
                        "Please enter contact number"
                      )}
                    </label>

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
                  <label className="block text-lg font-medium dark:text-white text-gray-700 mb-2">
                    Enter Date of Establishment
                    <span className="text-red-500 ml-1">*</span>
                    {renderInput(
                      "dob",
                      dob,
                      (e) => setDob(e.target.value),
                      "Enter date of establishment",
                      "date"
                    )}
                  </label>

                  {/* State */}
                </div>
              </div>
            </div>
            {/* Document Upload */}
            <div className="flex flex-col space-y-4">
              <label className="block text-lg font-medium text-gray-700 dark:text-white mb-2">
                Upload Documents (Reg Doc / Light Bill / Tax Bill)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setDocuments(e.target.files)}
                className="w-full text-black dark:text-white p-3 border rounded-lg bg-gray-100 dark:bg-gray-800"
              />
              <button
                onClick={uploadDocuments}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={areDocumentsUploaded}
              >
                {areDocumentsUploaded
                  ? "Documents Uploaded"
                  : "Upload Documents"}
              </button>
              {fieldErrors.documents && (
                <p className="text-red-500 mt-1">Documents are required</p>
              )}
            </div>

            {/* Always Visible Update Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={updateProfile}
                className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Update Profile and Send for Verification
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
