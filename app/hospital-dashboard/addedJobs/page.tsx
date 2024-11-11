"use client";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import AddJobModal from "@/components/AddJobModal";
import ViewApplicantsModal from "@/components/ViewApplicants";
import toast from "react-hot-toast";
import pb from "@/utils/pocketbase-connect";
import { DeleteIcon } from "@/components/DeleteIcon";
import { EyeIcon } from "@/components/EyeIcon";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ScrollShadow,
  Spinner,
} from "@nextui-org/react";
import {
  X,
  Briefcase,
  DollarSign,
  Clock,
  GraduationCap,
  BookOpen,
  Stethoscope,
} from "lucide-react";

type Job = {
  [x: string]: string | number | Date;
  id: string;
  position: string;
  degree: string;
  hire: string;
  hire_from: string;
  hire_to: string;
  time_period: string;
  salary: number;
  job_description: string;
  hospital: string;
  shift_from: string;
  shift_to: string;
  hospital_name: string;
  postGraduateCourses: string;
  specializations: string;
};

const AddedJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [authdata, setAuthData] = useState<any>("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const data = getCookie("authData");
    if (data) {
      const authData = JSON.parse(data as string);
      authData && setAuthData(authData);
      fetchJobs(authData?.token, authData?.record?.id);
    }
  }, []);

  const fetchJobs = async (token: string, id: string) => {
    try {
      const headersList = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/collections/jobs/records?filter=(hospital='${id}')&sort=-created`,
        {
          method: "GET",
          headers: headersList,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const jobsData = await response.json();
      setJobs(jobsData.items || []);
      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const openJobModal = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeJobModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };

  const deleteJob = async (id: string) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this Job?"
      );
      if (!confirmed) return;

      await toast.promise(pb.collection("jobs").delete(id), {
        loading: "Processing your request...",
        success: "Job deleted successfully.",
        error: "Failed to delete job. Please try again later.",
      });

      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleJobModalOpen = () => {
    setIsJobModalOpen(true);
  };

  const handleJobModalClose = () => {
    setIsJobModalOpen(false);
    fetchJobs(authdata?.token, authdata.record.id);
  };

  const handleApplicantsModalOpen = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsApplicantsModalOpen(true);
  };

  const handleApplicantsModalClose = () => {
    setIsApplicantsModalOpen(false);
    setSelectedJobId(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <main className="flex-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-white max-w-8xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Your Jobs</h2>
          <Button
            onClick={handleJobModalOpen}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white"
            size="lg"
          >
            + Add Job
          </Button>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <div
                key={job.id}
                style={{ backgroundColor: getRandomFadedColor() }}
                className="max-w-xs rounded-3xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {new Date(job.created).toLocaleDateString()}
                  </p>
                  <DeleteIcon
                    onClick={() => deleteJob(job.id)}
                    className="text-red-600 hover:text-orange-900 cursor-pointer text-3xl"
                  />
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{job.hire}</h3>
                    <h2 className="text-xl font-bold">{job.position}</h2>
                  </div>
                </div>

                <div className="flex flex-col mb-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Hire From:</strong>{" "}
                    {new Date(job.hire_from).toLocaleDateString("en-GB")}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Hire To:</strong>{" "}
                    {new Date(job.hire_to).toLocaleDateString("en-GB")}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.degree && (
                    <span className="bg-white bg-opacity-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {job.degree}
                    </span>
                  )}
                  {job.time_period && (
                    <span className="bg-white bg-opacity-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {job.time_period}
                    </span>
                  )}
                  {job.shift_from && job.shift_to && (
                    <span className="bg-white bg-opacity-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {job.shift_from} - {job.shift_to}
                    </span>
                  )}
                </div>

                {job.job_description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {job.job_description}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold">
                    ₹{Number(job.salary).toLocaleString()}
                  </p>
                  <Button
                    isIconOnly
                    variant="light"
                    onClick={() => openJobModal(job)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <EyeIcon className="text-4xl" />
                  </Button>
                  <Button
                    onClick={() => handleApplicantsModalOpen(job.id)}
                    className="bg-gray-900 hover:bg-gray-800 text-white"
                    size="sm"
                  >
                    View Applicants
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-xl">No jobs found.</p>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeJobModal}
        size="3xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh]",
          body: "p-0",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">{selectedJob?.position}</h2>
                <p className="text-base text-gray-600 dark:text-gray-400 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {selectedJob?.hospital_name || "Hospital name"}
                </p>
              </ModalHeader>

              <ModalBody>
                <ScrollShadow className="w-full">
                  <div className="px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {/* Hiring Details */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <h3 className="text-lg font-semibold mb-3">
                            Hiring Details
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-500">
                                Hiring Type:
                              </p>
                              <p className="font-medium">{selectedJob?.hire}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Duration:</p>
                              <p className="font-medium">
                                {selectedJob?.hire_from &&
                                  new Date(
                                    selectedJob.hire_from
                                  ).toLocaleDateString()}{" "}
                                -
                                {selectedJob?.hire_to &&
                                  new Date(
                                    selectedJob.hire_to
                                  ).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Time Period:
                              </p>
                              <p className="font-medium">
                                {selectedJob?.time_period}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Compensation */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <h3 className="text-lg font-semibold mb-3">
                            Compensation
                          </h3>
                          <div className="flex items-center text-xl font-bold">
                            <DollarSign className="w-6 h-6 mr-2" />₹
                            {selectedJob?.salary.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {/* Qualifications */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <h3 className="text-lg font-semibold mb-3">
                            Required Qualifications
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-500">
                                Degree Required:
                              </p>
                              <p className="font-medium">
                                {selectedJob?.degree}
                              </p>
                            </div>
                            {selectedJob?.postGraduateCourses && (
                              <div>
                                <p className="text-sm text-gray-500">
                                  Post Graduate Courses:
                                </p>
                                <p className="font-medium">
                                  {selectedJob.postGraduateCourses}
                                </p>
                              </div>
                            )}
                            {selectedJob?.specializations && (
                              <div>
                                <p className="text-sm text-gray-500">
                                  Specializations:
                                </p>
                                <p className="font-medium">
                                  {selectedJob.specializations}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Schedule */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <h3 className="text-lg font-semibold mb-3">
                            Work Schedule
                          </h3>
                          <div className="space-y-2">
                            {selectedJob?.shift_from &&
                              selectedJob?.shift_to && (
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Shift Hours:
                                  </p>
                                  <p className="font-medium">
                                    {selectedJob.shift_from} -{" "}
                                    {selectedJob.shift_to}
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Job Description */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                      <h3 className="text-lg font-semibold mb-3">
                        Job Description
                      </h3>
                      <p className="whitespace-pre-line">
                        {selectedJob?.job_description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-3">
                        Quick Overview
                        {/* Continuing from the Tags section in the modal */}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob?.degree && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 flex items-center">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            {selectedJob.degree}
                          </span>
                        )}
                        {selectedJob?.postGraduateCourses && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 flex items-center">
                            <BookOpen className="w-3 h-3 mr-1" />
                            PG: {selectedJob.postGraduateCourses}
                          </span>
                        )}
                        {selectedJob?.specializations && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300 flex items-center">
                            <Stethoscope className="w-3 h-3 mr-1" />
                            {selectedJob.specializations}
                          </span>
                        )}
                        {selectedJob?.time_period && (
                          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {selectedJob.time_period}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollShadow>
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    selectedJob && handleApplicantsModalOpen(selectedJob.id);
                  }}
                >
                  View Applicants
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Add Job Modal */}
      {isJobModalOpen && (
        <AddJobModal isOpen={isJobModalOpen} onClose={handleJobModalClose} />
      )}

      {/* View Applicants Modal */}
      {isApplicantsModalOpen && selectedJobId && (
        <ViewApplicantsModal
          isOpen={isApplicantsModalOpen}
          onClose={handleApplicantsModalClose}
          jobId={selectedJobId}
        />
      )}
    </main>
  );
};

// Utility function for random color generation
const getRandomFadedColor = () => {
  const colors = [
    "rgba(255, 99, 132, 0.4)",
    "rgba(54, 162, 235, 0.4)",
    "rgba(255, 206, 86, 0.4)",
    "rgba(75, 192, 192, 0.4)",
    "rgba(153, 102, 255, 0.4)",
    "rgba(255, 159, 64, 0.4)",
    "rgba(201, 203, 207, 0.4)",
    "rgba(255, 105, 180, 0.4)",
    "rgba(100, 149, 237, 0.4)",
    "rgba(218, 165, 32, 0.4)",
    "rgba(107, 142, 35, 0.4)",
    "rgba(123, 104, 238, 0.4)",
    "rgba(255, 140, 0, 0.4)",
    "rgba(47, 79, 79, 0.4)",
    "rgba(220, 20, 60, 0.4)",
    "rgba(255, 69, 0, 0.4)",
    "rgba(34, 139, 34, 0.4)",
    "rgba(72, 61, 139, 0.4)",
    "rgba(106, 90, 205, 0.4)",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

export default AddedJobs;
