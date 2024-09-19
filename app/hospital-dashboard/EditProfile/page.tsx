"use client";
import { useAppSelector } from "@/app/redux/store";
import pb from "@/utils/pocketbase-connect";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { stateCityData } from "../../stateCities";
import { getCookie } from "cookies-next";

type StateCityData = {
  [state: string]: string[];
};
type ProfilePageProps = {
  onEditProfileClick: () => void; // New prop for handling the click
};

const typedStateCityData = stateCityData as StateCityData;

export default function EditProfileComponent(props: any) {
  console.log("Props", props);
  const id = useAppSelector((state) => state.profileReducer.value.id);
  const role = useAppSelector((state) => state.profileReducer.value.role);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [pointOfContact, setPointOfContact] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [documents, setDocuments] = useState<FileList | null>(null);
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
  const [areDocumentsUploaded, setAreDocumentsUploaded] = useState(false);
  const [authdata, setAuthData] = useState<any>("");
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isContactVerified, setIsContactVerified] = useState(false);

  useEffect(() => {
    const data = getCookie("authData");
    if (data) {
      console.log(data);
      const authData = JSON.parse(data as string);
      authData && setAuthData(authData);
    }
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
        success: "profile photo uploaded successfully 😎",
        error: "profile photo upload failed 😞",
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
  const updateProfile = async () => {
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
    };

    try {
      await toast.promise(
        pb.collection("users").update(id, profileData), // Assuming `pb` is an instance of your database client
        {
          loading: "Updating profile...",
          success: () => {
            // Call the function to mark the document as uploaded on success
            setIsDocumentUploaded();
            props.handleShowEdit(true);
            props.handleTabClick("profile");

            // add logic to go to profile section

            // Reset all fields upon successful profile update
            resetFields();

            return "profile updated and sent for verification. Once verified, you can post jobs. ✨";
          },
          error: "profile update failed 😞",
        }
      );
      // Reset all fields upon successful profile update
      resetFields();

      // window.location.href = "/doctor-dashboard";
    } catch (error) {
      console.error(
        "Error while updating profile or marking document as uploaded:",
        error
      );
      toast.error("An error occurred during the update process.");
    }
  };
  const resetFields = () => {
    // setName("");
    setDob("");
    setMobile("");
    setSelectedState("");
    setSelectedCity("");
    setAddress("");
    setPointOfContact("");
    // setEmail("");
    setBio("");
    setProfilePhoto(null);
    setDocuments(null);
    setIsPhotoUploaded(false);
    setAreDocumentsUploaded(false);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = event.target.value;
    setSelectedState(newState);
    setSelectedCity(""); // Reset city when state changes
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
    return (
      dob &&
      pointOfContact &&
      selectedState &&
      selectedCity &&
      address &&
      bio &&
      isPhotoUploaded &&
      areDocumentsUploaded
    );
  };

  return (
    <div className="flex flex-col max-w-7xl mx-auto p-6 sm:p-6 bg-white shadow-lg rounded-lg dark:bg-gray-900">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-6 text-blue-800 text-center dark:text-white">
        Edit Hospital profile
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* profile Photo */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center w-32 h-32 rounded-full border-4 border-gray-300 bg-gray-100">
            {profilePhoto ? (
              <img
                src={URL.createObjectURL(profilePhoto)}
                alt="profile Preview"
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
          />
          <label
            htmlFor="profile-photo-upload"
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Select profile Photo
            <span className="text-red-500 ml-1">*</span>
          </label>
          <button
            onClick={uploadPhoto}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isPhotoUploaded}
          >
            {isPhotoUploaded
              ? "profile Photo Uploaded"
              : "Upload profile Photo"}
          </button>
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
            {areDocumentsUploaded ? "Documents Uploaded" : "Upload Documents"}
          </button>
        </div>

        {/* profile Details */}
        <div className="col-span-1 dark:text-white text-black md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hospital Name */}
            {/*<div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Hospital Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter hospital name"
              />
            </div>*/}

            {/* Date of Establishment */}
            <div>
              <label className="block text-lg font-medium dark:text-white text-gray-700 mb-2">
                Date of Establishment
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                required
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Point of Contact Name */}
            <div>
              <label className="block text-lg font-medium mb-2">
                Point of Contact Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                required
                type="text"
                value={pointOfContact}
                onChange={(e) => setPointOfContact(e.target.value)}
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter point of contact name"
              />
            </div>

            {/* Email
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Email
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
              />
            </div> */}

            {/* Mobile Number */}
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
              <label className="block text-lg font-medium  mb-2">
                State
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                required
                value={selectedState}
                onChange={handleStateChange}
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-lg font-medium  mb-2">
                City
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                required
                value={selectedCity}
                onChange={handleCityChange}
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </div>

          {/* Address */}
          <div>
            <label className="block text-lg font-medium  mb-2">
              Address
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter address"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-lg font-medium  mb-2">
              Hospital Bio
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter bio"
            />
          </div>
        </div>
      </div>

      {/* Conditionally Rendered Button */}
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
  );
}
