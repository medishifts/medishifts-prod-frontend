"use client";
import React, { useEffect, useState } from "react";
import { RecordModel } from "pocketbase";
import pb from "../utils/pocketbase-connect";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import UserQualifications from "./UserQualifications";
import { Spinner } from "@nextui-org/react";
import ViewProfileEduByHospital from "./ViewProfileEduByHospital";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

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
  role: string;
  hospitalName?: string;
  isHired?: boolean;
  applicant_id?: string;
  address?: string;
  degree?: any;
  regdNo?: any;
  council?: any;
  exp?: any;
}

interface ViewApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string | null;
}

interface PocketBaseApplicant {
  experienceYears: any;
  applicant_degree: any;
  applicant_address: string;
  degree: any;
  applicant_regdNo: any;
  applicant_selectedCouncil: any;
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
  const [isHireConfirmationModalOpen, setIsHireConfirmationModalOpen] =
    useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const [jobDetails, setJobDetails] = useState<{
    position: string;
    salary: number;
  } | null>(null);
  const backendApi = process.env.NEXT_PUBLIC_BACKEND_API;
  const [authdata, setAuthData] = useState<any>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHiring, setIsHiring] = useState<boolean>(false);
  const [isGeneratingPaymentLink, setIsGeneratingPaymentLink] =
    useState<boolean>(false);
  const [fee, setFee] = useState<any>(0);
  // const [showCouponInput, setShowCouponInput] = useState(false);
  // const [couponCode, setCouponCode] = useState("");
  // const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  useEffect(() => {
    const data = getCookie("authData");
    if (data) {
      const authData = JSON.parse(data as string);
      authData && setAuthData(authData);
    }
    if (!isOpen || !jobId) return;

    const fetchApplicants = async () => {
      setIsLoading(true);
      try {
        const resultList = await pb
          .collection("view_enrollments")
          .getList(1, 50, {
            filter: `job_id='${jobId}'`,
          });
        console.log(resultList);
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
          address: (record as unknown as PocketBaseApplicant).applicant_address,
          exp: (record as unknown as PocketBaseApplicant).experienceYears,
          degree: (record as unknown as PocketBaseApplicant).applicant_degree,
          regdNo: (record as unknown as PocketBaseApplicant).applicant_regdNo,
          council: (record as unknown as PocketBaseApplicant)
            .applicant_selectedCouncil,
        }));
        console.log();

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

    const fetchJobDetails = async () => {
      if (jobId) {
        setIsLoading(true);
        try {
          const job = await pb.collection("jobs").getOne(jobId);
          setJobDetails({
            position: job.position,
            salary: job.salary,
          });
        } catch (error) {
          console.error("Failed to fetch job details", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchApplicants();
    fetchJobDetails();
  }, [isOpen, jobId]);

  // const hireDoctor = async (applicantId: string | undefined, jobId: string) => {
  //   if (!applicantId) {
  //     console.error("Applicant ID is required");
  //     toast.error("Applicant ID is required");
  //     return;
  //   }

  //   const headersList = {
  //     Accept: "application/json",
  //     Authorization: `Bearer ${authdata.token}`,
  //     "Content-Type": "application/json",
  //   };

  //   const bodyContent = JSON.stringify({
  //     job: jobId,
  //     applicant: applicantId,
  //     hired: true,
  //   });

  //   const hiringToastId = toast.loading("Hiring in progress...");

  //   try {
  //     const response = await fetch(`${backendApi}/api/jobs/hire`, {
  //       method: "POST",
  //       body: bodyContent,
  //       headers: headersList,
  //     });

  //     const data = await response.json();
  //     console.log("Hire successful:", data);
  //     toast.dismiss(hiringToastId);
  //     if (!response.ok) {
  //       toast.error(data.message);
  //       return;
  //     }
  //     setApplicants((prevApplicants) =>
  //       prevApplicants.map((applicant) =>
  //         applicant.applicant_id === applicantId
  //           ? { ...applicant, isHired: true }
  //           : applicant
  //       )
  //     );
  //     toast.success("Applicant hired successfully!");
  //   } catch (error: any) {
  //     console.error("Failed to hire applicant:", error);
  //     toast.dismiss(hiringToastId);
  //     toast.error("Failed to hire applicant.");
  //   }
  // };
  const maxFee = 300;
  const calculateFee = (salary: any) => {
    const fee = salary * 0.1;
    if (fee >= maxFee) {
      // setFee(maxFee);
      return maxFee;
    } else {
      // setFee(fee);
      return fee;
    }
  };

  const handleView = async (id: string) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleHireClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsHireConfirmationModalOpen(true);
  };

  const GeneratePaymentLink = async (enrollmentId: string, role: string) => {
    if (role === "NURSE") {
      role = "nurse";
    } else {
      role = "doctor";
    }

    console.log("Role of Hiring ", role);

    setIsGeneratingPaymentLink(true);
    let headersList = {
      Accept: "/",

      Authorization: `Bearer ${authdata.token}`,
      // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJ1cjgzZGxuNnJ1aGw1MWciLCJleHAiOjE3Mjk5NTU3NjcsImlkIjoiYzF2czl6dHkxeTQ3NHVkIiwidHlwZSI6ImF1dGhSZWNvcmQifQ.we7FDSqbPvcQ6LDFxVCtq_zrLpmDyrwlHIbiL2J3-tY",
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      enrollment_id: enrollmentId,
      coupon_code: "",
    });

    try {
      let response = await fetch(
        `${backendApi}/api/payment/create-link-hire-${role}`,
        {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        }
      );

      let data = await response.json();
      console.log(data);
      if (data.link) {
        toast.success(
          "Payment link generated. Complete Payment for successful hiring",
          {
            duration: 8000,
          }
        );
        setTimeout(() => {
          window.open(data.link, "_blank");
        }, 4000);
      } else {
        toast.error("Failed to generate payment link");
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast.error("Failed to create payment link");
    } finally {
      setIsGeneratingPaymentLink(false);
    }
  };

  const handleConfirmHire = async () => {
    if (selectedApplicant && jobDetails) {
      // Call paymentLink function with the enrollment ID
      await GeneratePaymentLink(selectedApplicant.id, selectedApplicant.role);
      setIsHireConfirmationModalOpen(false);
      // Don't close the main modal or call hireDoctor here
      // as we're redirecting to the payment page
    }
  };

  const handleCancelHire = () => {
    setIsHireConfirmationModalOpen(false);
    setSelectedApplicant(null);
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
            <Spinner size="lg" color="primary" />
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
                      <strong>Degree: </strong>
                      {applicant.degree}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Years of experience : </strong>
                      {applicant.exp}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {applicant.applicant_id && (
                      <Button
                        onClick={() => handleView(applicant.applicant_id || "")}
                        size="sm"
                        color="primary"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Spinner size="sm" color="white" />
                        ) : (
                          "Details"
                        )}
                      </Button>
                    )}
                    <Button
                      className="text-white"
                      onClick={() => handleHireClick(applicant)}
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

      {/* User Details Modal */}
      <Modal
        size="2xl"
        isOpen={isUserDetailsModalOpen}
        onClose={() => setIsUserDetailsModalOpen(false)}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                User Details
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col md:flex-row items-center mb-8">
                  <img
                    src={selectedUser?.profile}
                    alt={selectedUser?.name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-4 md:mb-0 md:mr-6 border-4 border-blue-500 dark:border-blue-400 shadow-lg object-cover"
                  />
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-semibold">
                      {selectedUser?.name}
                    </h3>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                      {selectedUser?.role}
                    </p>
                    <p>
                      <strong>Experience: </strong>
                      {selectedUser?.experienceYears
                        ? selectedUser.experienceYears
                        : "N/A"}{" "}
                      years
                    </p>
                    <p>
                      <strong>Registration Number:</strong>
                      {selectedUser?.registrationNumber
                        ? selectedUser.registrationNumber
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Council:</strong>
                      {selectedUser?.selectedCouncil
                        ? selectedUser.selectedCouncil
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedUser?.address}
                    </p>
                    {selectedUser && (
                      <ViewProfileEduByHospital userId={selectedUser.id} />
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md mb-4">
                  <h4 className="font-semibold text-xl mb-3">Experience</h4>
                  <p>
                    <strong>Experience:</strong>
                    {selectedUser?.experience ? selectedUser.experience : "N/A"}
                  </p>
                  <p>
                    <strong>Experience in Years:</strong>
                    {selectedUser?.experienceYears
                      ? selectedUser.experienceYears
                      : "N/A"}{" "}
                    years
                  </p>
                  <p>
                    <strong>Bio:</strong> {selectedUser?.bio || "N/A"}
                  </p>
                </div>

                {selectedUser && (
                  <UserQualifications userId={selectedUser.id} />
                )}

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl mb-3">Document Links</h4>
                  <ul className="space-y-3">
                    {selectedUser?.degreeCertificate && (
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
                    {selectedUser?.registrationCertificate && (
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
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* New Hire Confirmation Modal */}
      {isHireConfirmationModalOpen && selectedApplicant && jobDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Confirm Hiring
            </h2>
            <p className="mb-6 dark:text-gray-300">
              Are you sure you want to hire{" "}
              <strong>{selectedApplicant.name}</strong> for the{" "}
              {jobDetails.position} position with a salary of ₹
              <strong>
                {jobDetails.salary - calculateFee(jobDetails.salary)}
              </strong>
              ?
            </p>
            <p className="mb-6 dark:text-gray-300">
              If yes, you will be redirected to pay maximum ₹300 or 10% of the
              salary, whichever is lower (
              <strong>₹{calculateFee(jobDetails.salary)}</strong>) as a platform
              fee to Medishifts.in
            </p>
            {/* <div className="mb-6">
              <button
                onClick={() => setShowCouponInput(!showCouponInput)}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                {showCouponInput ? "Hide coupon code" : "Have a coupon code?"}
              </button>

              {showCouponInput && (
                <div className="mt-3 flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e: any) => setCouponCode(e.target.value)}
                    className="flex-1"
                    size="sm"
                  />
                  <Button
                    color="primary"
                    size="sm"
                    // onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon}
                  >
                    {isApplyingCoupon ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
              )}
            </div> */}
            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleCancelHire}
                color="default"
                disabled={isGeneratingPaymentLink}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmHire}
                color="primary"
                disabled={isGeneratingPaymentLink}
              >
                {isGeneratingPaymentLink ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplicantsModal;
