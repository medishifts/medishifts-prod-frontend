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
  Bell,
  Trash2,
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
const isHiringAvailable = (job: Job): boolean => {
  const now = new Date();

  // Get hire_from date
  const hireFromDate = new Date(job.hire_from);

  // Parse shift_from time (12-hour format)
  const timeMatch = job.shift_from.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!timeMatch) return false;

  let hours = parseInt(timeMatch[1]);
  const minutes = parseInt(timeMatch[2]);
  const period = timeMatch[3].toUpperCase();

  // Convert to 24-hour format
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  // Set the shift start time on hire_from date
  const shiftStartTime = new Date(hireFromDate);
  shiftStartTime.setHours(hours, minutes, 0, 0);

  // Add 1 hour to shift start time
  const cutoffTime = new Date(shiftStartTime.getTime() + 60 * 60 * 1000);

  // If current time is past cutoff time (hire_from date + shift_from time + 1 hour), return false
  if (now > cutoffTime) {
    return false;
  }

  return true;
};

const isQuickHiringAvailable = (job: Job): boolean => {
  const now = new Date();

  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get hire_to date at midnight
  const hireFromDate = new Date(job.hire_from);
  hireFromDate.setHours(0, 0, 0, 0);

  // If hire_to date is not today, quick hiring is not available
  if (hireFromDate.getTime() !== today.getTime()) {
    return false;
  }

  // Parse 12-hour time format (e.g., "2:00 PM")
  const timeMatch = job.shift_from.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!timeMatch) return false;

  let hours = parseInt(timeMatch[1]);
  const minutes = parseInt(timeMatch[2]);
  const period = timeMatch[3].toUpperCase();

  // Convert to 24-hour format
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  // Create shift end time for today
  const shiftStartTime = new Date(today);
  shiftStartTime.setHours(hours, minutes, 0, 0);

  // If current time is before shift end, return false
  if (now < shiftStartTime) {
    return false;
  }

  // Calculate time difference in milliseconds
  const timeDifference = now.getTime() - shiftStartTime.getTime();
  const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds

  // Return true if the difference is less than or equal to 1 hour
  return timeDifference <= oneHourInMs;
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
        <Spinner />
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
                className="max-w-xs rounded-3xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-gray-200 relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {new Date(job.created).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => deleteJob(job.id)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span className="sr-only">Delete job</span>
                    </Button>
                    {/* {isQuickHiringAvailable(job) && (
                      <div
                        className="bg-yellow-400 text-yellow-800 animate-pulse rounded-full p-1 flex items-center space-x-1"
                        title="Urgent Hiring Available"
                      >
                        <Bell className="w-5 h-5" />
                        <span className="text-xs font-semibold">
                          Urgent Hiring
                        </span>
                      </div>
                    )} */}
                  </div>
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
                            ₹ {selectedJob?.salary.toLocaleString()}
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
          isHiringAvailable={isHiringAvailable(
            jobs.find((job) => job.id === selectedJobId)
          )}
        />
      )}
    </main>
  );
};

// Utility function for random color generation
const getRandomFadedColor = () => {
  const colors = [
    "rgba(255, 99, 132, 0.2)", // Light Red
    "rgba(54, 162, 235, 0.2)", // Light Blue
    "rgba(255, 206, 86, 0.2)", // Light Yellow
    "rgba(75, 192, 192, 0.2)", // Light Teal
    "rgba(153, 102, 255, 0.2)", // Light Purple
    "rgba(255, 159, 64, 0.2)", // Light Orange
    "rgba(201, 203, 207, 0.2)", // Light Gray
    "rgba(255, 182, 193, 0.2)", // Light Pink
    "rgba(135, 206, 250, 0.2)", // Light Sky Blue
    "rgba(240, 230, 140, 0.2)", // Light Khaki
    "rgba(144, 238, 144, 0.4)", // Light Green
    "rgba(255, 192, 203, 0.4)", // Light Pink (another shade)
    "rgba(221, 160, 221, 0.2)", // Light Plum
    "rgba(173, 216, 230, 0.5)", // Light Blue (Pale)
    "rgba(224, 255, 255, 0.2)", // Light Cyan
    "rgba(250, 235, 215, 0.2)", // Light Antique White
    "rgba(255, 228, 225, 0.5)", // Light Misty Rose
    "rgba(245, 222, 179, 0.2)", // Light Wheat
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

export default AddedJobs;
