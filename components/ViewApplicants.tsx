"use client";
import React, { useEffect, useState } from "react";
import { RecordModel } from "pocketbase";
import pb from "../utils/pocketbase-connect";
import { Button } from "@nextui-org/button";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import UserQualifications from "./UserQualifications";

type User = {
  id: string;
  name: string;
  profile: string;
  role: string;
  address: string;
  selectedSpecializations: string;
  admin_verified: boolean;
  email: string;
  mobile: number;
  registrationNumber: string;
  selectedCouncil: string;
  selectedDegrees: string;
  registrationCertificate: string;
  degreeCertificate: string;
  city: string;
  state: string;
  dob: string;
  bio: string;
  mobile_verified: boolean;
  verified: boolean;
  hospital_document: string;
  experience: string;
  experienceYears: string;
};

interface Applicant {
  id: string;
  job_id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  hospitalName?: string;
  isHired?: boolean;
  applicant_id?: string;
}

interface ViewApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string | null;
}

interface PocketBaseApplicant {
  job_id: any;
  id: string;
  applicant_id?: string;
  applicant_name: string;
  applicant_email: string;
  applicant_role: string;
  hospital_name?: string;
  is_hired?: boolean;
}

const ViewApplicantsModal: React.FC<ViewApplicantsModalProps> = ({
  isOpen,
  onClose,
  jobId,
}) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [applicantToHire, setApplicantToHire] = useState<{
    applicantId: string | undefined;
    jobId: string;
  } | null>(null);
  const backendApi = process.env.NEXT_PUBLIC_BACKEND_API;
  const [authdata, setAuthData] = useState<any>("");

  useEffect(() => {
    const data = getCookie("authData");
    if (data) {
      console.log(data);
      const authData = JSON.parse(data as string);
      authData && setAuthData(authData);
    }
    if (!isOpen || !jobId) return;

    const fetchApplicants = async () => {
      try {
        const resultList = await pb
          .collection("view_enrollments")
          .getList(1, 50, {
            filter: `job_id='${jobId}'`,
          });

        const applicantsData = resultList.items.map((record: RecordModel) => ({
          id: record.id,
          name: (record as unknown as PocketBaseApplicant).applicant_name,
          email: (record as unknown as PocketBaseApplicant).applicant_email,
          role: (record as unknown as PocketBaseApplicant).applicant_role,
          hospitalName: (record as unknown as PocketBaseApplicant)
            .hospital_name,
          isHired: (record as unknown as PocketBaseApplicant).is_hired,
          applicant_id: (record as unknown as PocketBaseApplicant).applicant_id,
          job_id: (record as unknown as PocketBaseApplicant).job_id,
        }));

        setApplicants(applicantsData);
        console.log(applicantsData);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            console.log("Fetch aborted");
          } else {
            setError(err.message);
          }
        } else {
          setError("An unexpected error occurred.");
        }
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [isOpen, jobId]);

  const hireDoctor = async (applicantId: string | undefined, jobId: string) => {
    if (!applicantId) {
      console.error("Applicant ID is required");
      toast.error("Applicant ID is required");
      return;
    }

    const headersList = {
      Accept: "application/json",
      Authorization: `Bearer ${authdata.token}`,
      "Content-Type": "application/json",
    };

    const bodyContent = JSON.stringify({
      job: jobId,
      applicant: applicantId,
      hired: true,
    });

    const hiringToastId = toast.loading("Hiring in progress...");

    try {
      const response = await fetch(`${backendApi}/api/jobs/hire`, {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      const data = await response.json();
      console.log("Hire successful:", data);
      toast.dismiss(hiringToastId);
      if (!response.ok) {
        toast.error(data.message);
        return;
      }
      setApplicants((prevApplicants) =>
        prevApplicants.map((applicant) =>
          applicant.applicant_id === applicantId
            ? { ...applicant, isHired: true }
            : applicant
        )
      );
      toast.success("Applicant hired successfully!");
    } catch (error: any) {
      console.error("Failed to hire applicant:", error);
      toast.dismiss(hiringToastId);
      toast.error("Failed to hire applicant.");
    }
  };

  const handleView = async (id: string) => {
    console.log(id);
    try {
      const user = await pb.collection("view_users").getOne(id);
      setSelectedUser({
        id: user.id,
        selectedSpecializations: user.selectedSpecializations,
        name: user.name,
        profile: `${backendApi}/api/files/${user.collectionId}/${user.id}/${user.profile}`,
        role: user.role,
        admin_verified: user.admin_verified,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        registrationNumber: user.registrationNumber,
        selectedCouncil: user.selectedCouncil,
        selectedDegrees: user.selectedDegrees,
        registrationCertificate: `${backendApi}/api/files/${user.collectionId}/${user.id}/${user.registration_certificate}`,
        degreeCertificate: `${backendApi}/api/files/${user.collectionId}/${user.id}/${user.degree_certificate}`,
        mobile_verified: user.mobile_verified,
        verified: user.verified,
        city: user.city,
        state: user.state,
        dob: user.dob,
        bio: user.bio,
        hospital_document: user.hospital_document,
        experience: user.experience,
        experienceYears: user.experienceYears,
      });
      setIsUserDetailsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch user details", error);
    }
  };

  const handleHireClick = (applicantId: string | undefined, jobId: string) => {
    setApplicantToHire({ applicantId, jobId });
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmHire = () => {
    if (applicantToHire) {
      hireDoctor(applicantToHire.applicantId, applicantToHire.jobId);
      setIsConfirmationModalOpen(false);
      onClose(); // Close the applicants modal after confirming hire
    }
  };

  const handleCancelHire = () => {
    setApplicantToHire(null);
    setIsConfirmationModalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4 dark:bg-gray-900 dark:text-white">
          <h3 className="text-xl font-bold">Applicants</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            &times;
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32 dark:bg-gray-900 dark:text-white">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 dark:text-red-400">
            <p>Error: {error}</p>
          </div>
        ) : applicants.length > 0 ? (
          <div className="dark:bg-gray-900 dark:text-white">
            <ul className="space-y-4">
              {applicants.map((applicant) => (
                <li
                  key={applicant.id}
                  className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-lg font-semibold">{applicant.name}</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {applicant.email}
                    </p>
                    {applicant.hospitalName && (
                      <p className="text-gray-600 dark:text-gray-300">
                        {applicant.hospitalName}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {applicant.applicant_id && (
                      <Button
                        onClick={() => handleView(applicant.applicant_id || "")}
                        size="sm"
                        color="primary"
                      >
                        View
                      </Button>
                    )}
                    <Button
                      onClick={() =>
                        handleHireClick(
                          applicant.applicant_id,
                          applicant.job_id
                        )
                      }
                      size="sm"
                      color="success"
                      disabled={applicant.isHired}
                    >
                      {applicant.isHired ? "Hired" : "Hire"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="dark:text-white">No applicants found for this job.</p>
        )}
      </div>

      {/* Confirmation Modal */}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Confirm Action</h2>
            <p className="mb-6">
              Are you sure you want to hire this applicant?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelHire}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmHire}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {isUserDetailsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
              <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
                User Details
              </h2>
            </div>
            <div className="flex flex-col md:flex-row items-center mb-8">
              <img
                src={selectedUser.profile}
                alt={selectedUser.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-4 md:mb-0 md:mr-6 border-4 border-blue-500 dark:border-blue-400 shadow-lg object-cover"
              />
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">
                  {selectedUser.name}
                </h3>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  {selectedUser.role}
                </p>
              </div>
            </div>
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                  Contact Information
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Mobile:</strong> {selectedUser.mobile}
                </p>
              </div>

              {/* Status */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                  Status
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Admin Verified:</strong>{" "}
                  <span
                    className={
                      selectedUser.admin_verified
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {selectedUser.admin_verified ? "Verified" : "Not Verified"}
                  </span>
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Mobile Verified</strong>{" "}
                  <span
                    className={
                      selectedUser.mobile_verified
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {selectedUser.mobile_verified ? "Verified" : "Not Verified"}
                  </span>
                </p>
              </div>

              {/* Address */}
              {selectedUser.address && (
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Address
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Address:</strong> {selectedUser.address}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>City:</strong> {selectedUser.city}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>State:</strong> {selectedUser.state}
                  </p>
                </div>
              )}

              {/* Date of Establishment */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                  Date of Birth:
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedUser.dob
                    ? new Date(selectedUser.dob).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              {/* Bio */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                  Bio
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedUser.bio || "N/A"}
                </p>
              </div>

              {/* Degree and Specializations */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                  Degree and Specializations
                </h4>
                <UserQualifications userId={selectedUser.id} />
              </div>

              {/* Experience */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                  Experience
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Experience:</strong>{" "}
                  {selectedUser.experience ? selectedUser.experience : "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Experience in Years:</strong>{" "}
                  {selectedUser.experienceYears
                    ? selectedUser.experienceYears
                    : "N/A"}{" "}
                  years
                </p>
              </div>

              {/* Registration Number and Council */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                  Registration Number and Council
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Registration Number:</strong>{" "}
                  {selectedUser.registrationNumber
                    ? selectedUser.registrationNumber
                    : "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Council:</strong>{" "}
                  {selectedUser.selectedCouncil
                    ? selectedUser.selectedCouncil
                    : "N/A"}
                </p>
              </div>

              {/* Document Links */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                  Document Links
                </h4>
                <ul className="space-y-3">
                  {selectedUser.degreeCertificate && (
                    <li>
                      <a
                        href={selectedUser.degreeCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition duration-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m7.5 0H6.75M19.5 15.75v3a2.25 2.25 0 01-2.25 2.25h-10.5A2.25 2.25 0 014.5 18.75v-3M19.5 15.75a2.25 2.25 0 00-2.25-2.25h-10.5a2.25 2.25 0 00-2.25 2.25m15 0V9.75m0 6v-3m-15 3v-3"
                          />
                        </svg>
                        Degree Certificate
                      </a>
                    </li>
                  )}
                  {selectedUser.registrationCertificate && (
                    <li>
                      <a
                        href={selectedUser.registrationCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition duration-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m7.5 0H6.75M19.5 15.75v3a2.25 2.25 0 01-2.25 2.25h-10.5A2.25 2.25 0 014.5 18.75v-3M19.5 15.75a2.25 2.25 0 00-2.25-2.25h-10.5a2.25 2.25 0 00-2.25 2.25m15 0V9.75m0 6v-3m-15 3v-3"
                          />
                        </svg>
                        Registration Certificate
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setIsUserDetailsModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-8 py-3 rounded-full transition duration-300 ease-in-out text-lg font-semibold shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplicantsModal;
