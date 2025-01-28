"use client";
import React, { useState, useEffect } from "react";
import PocketBase, { RecordModel } from "pocketbase";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import Loader from "@/components/Loader";
import { EyeIcon } from "@/components/EyeIcon";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
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
  Calendar,
  Star,
} from "lucide-react";
import { stateCityData } from "../stateCities";
const pb = new PocketBase(process.env.NEXT_PUBLIC_BACKEND_API);

type Job = {
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
  created: string;
  hospital_city: string;
  hospital_state: string;
  average_rating: number;
};

const mapRecordToJob = (record: RecordModel): Job => {
  return {
    id: record.id,
    position: record.position || "",
    degree: record.degree || "",
    hire: record.hire || "",
    hire_from: record.hire_from || "",
    hire_to: record.hire_to || "",
    time_period: record.time_period || "",
    salary: record.salary || 0,
    job_description: record.job_description || "",
    hospital: record.hospital || "",
    shift_from: record.shift_from || "",
    shift_to: record.shift_to || "",
    hospital_name: record.name || "",
    postGraduateCourses: record.postGraduateCourses || "",
    specializations: record.specializations || "",
    created: record.created || "",
    hospital_city: record.city || "",
    hospital_state: record.state || "",
    average_rating: record.average_rating || 0,
  };
};
const ROLE_CONFIGS = {
  NURSE: {
    degrees: ["ANM", "GNM", "BSc Nursing", "BSc Nursing (Post Basic)"],
    title: "Nursing Positions"
  },
  DOCTOR: {
    degrees: ["MBBS", "BHMS", "BAMS", "BDS"],
    title: "Medical Positions"
  }
};
const getAllCities = () => {
  const cities = new Set();
  Object.values(stateCityData).forEach((cityArray) => {
    cityArray.forEach((city) => cities.add(city));
  });
  return Array.from(cities).sort();
};
export default function JobsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [userId, setUserId] = useState("");
  const [jobs, setJobs] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [filter, setFilter] = useState({
    hire: "all",
    salary: "default",
    degree: "all",
    city: "all",
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const jobsPerPage = 9;
  const cities = getAllCities();

  // Initialize user data and trigger initial fetch
  useEffect(() => {
    const initializeUserData = async () => {
      const authDataCookie = getCookie("authData");
      if (!authDataCookie) {
        toast.error("Authentication data not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const authData = JSON.parse(authDataCookie as string);
        setUserId(authData.record.id);
        setUserRole(authData.record.role);
        setIsInitialized(true);
      } catch (error) {
        console.error("Error parsing auth data:", error);
        toast.error("Failed to parse auth data. Please log in again.");
        setLoading(false);
      }
    };

    initializeUserData();
  }, []);

  // Fetch jobs when userRole is set or filters change
  useEffect(() => {
    if (isInitialized && userRole) {
      fetchJobs();
    }
  }, [isInitialized, userRole, filter, currentPage, searchTerm]);

  const fetchJobs = async () => {
    if (!userRole) {
      setJobs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const queryParams = {
        page: currentPage,
        perPage: jobsPerPage,
        sort: "-created",
        filter: "",
      };

      // Build filter string
      const filterConditions = [];
      
      // Always add role filter first
      filterConditions.push(`hire="${userRole}"`);

      if (filter.city !== "all") {
        filterConditions.push(`city="${filter.city}"`);
      }

      if (filter.degree !== "all") {
        filterConditions.push(`degree="${filter.degree}"`);
      }

      if (searchTerm) {
        filterConditions.push(`position~"${searchTerm}"`);
      }

      // Combine all filters
      queryParams.filter = filterConditions.join("&&");

      // Apply salary sorting
      if (filter.salary === "lowToHigh") {
        queryParams.sort = "+salary";
      } else if (filter.salary === "highToLow") {
        queryParams.sort = "-salary";
      }

      console.log("Query params:", queryParams); // Debug log

      const resultList = await pb
        .collection("view_jobs")
        .getList(currentPage, jobsPerPage, queryParams);

      const mappedJobs = resultList.items.map(mapRecordToJob);
      setJobs(mappedJobs);
      setTotalPages(Math.ceil(resultList.totalItems / jobsPerPage));
      
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getDegreeOptions = () => {
    if (!userRole || !ROLE_CONFIGS[userRole as keyof typeof ROLE_CONFIGS]) {
      return [];
    }
    return ROLE_CONFIGS[userRole as keyof typeof ROLE_CONFIGS].degrees;
  };

  // Rest of your existing helper functions
  const openJobModal = (job) => {
    setSelectedJob(job);
    onOpen();
  };

  const closeJobModal = () => {
    setSelectedJob(null);
    onClose();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getRandomFadedColor = () => {
    const colors = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const maxFee = 300;
  const calculateFee = (salary: number, maxFee: number) => {
    const fee = salary * 0.1;
    return fee >= maxFee ? maxFee : fee;
  };

  // Your existing applyForJob function
  const applyForJob = async (jobId: string) => {
    const authDataCookie = getCookie("authData");
    if (!authDataCookie) {
      toast.error("You must be logged in to apply for a job.");
      return;
    }

    const authData = JSON.parse(authDataCookie as string);

    const applyPromise = new Promise(async (resolve, reject) => {
      try {
        const data = {
          job: jobId,
          applicant: authData.record.id,
        };

        await pb.collection("enrollments").create(data);
        resolve("Successfully applied for the job!");
      } catch (error: any) {
        console.error("Error applying for the job:", error);
        reject(error.message || "Failed to apply for the job.");
      }
    });

    toast.promise(applyPromise, {
      loading: "Applying for the job...",
      success: (message) => `${message}`,
      error: (message) => `${message}`,
    });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <header
        className={`py-6 px-8 shadow-lg flex flex-col items-center text-center transition-colors duration-300 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h1
          className={`text-4xl md:text-5xl font-extrabold mb-6 transition-colors duration-300 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Discover Your Dream Job with Us!
        </h1>
        <p
          className={`text-lg max-w-3xl transition-colors duration-300 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          🌟{" "}
          <strong>
            Discover jobs which suits your lifestyle . Have Freedom. Work when
            you feel like it & get paid.
          </strong>{" "}
        </p>
      </header>

      {/* Search Bar */}
      {/* <div className="flex justify-center mt-12 mb-8 px-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search for a job position..."
          className={`w-full max-w-2xl p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
            isDark
              ? "bg-gray-800 text-white border-gray-700 placeholder-gray-500"
              : "bg-white text-gray-900 border-gray-300 placeholder-gray-400"
          }`}
        />
      </div> */}

      {/* Main Content */}
      <div className="flex flex-col md:flex-row p-6 gap-8">
        {/* Filters */}
        <div className="md:w-1/4 mb-8 md:mb-0">
          <h3
            className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Filters
          </h3>
          <div
            className={`p-6 rounded-lg shadow-lg transition-colors duration-300 ${
              isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <label className="block mb-6">
              <span
                className={`text-lg mb-2 block transition-colors duration-300 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Degree
              </span>
              <select
                value={filter.degree}
                onChange={(e) =>
                  setFilter({ ...filter, degree: e.target.value })
                }
                className={`block w-full p-3 border rounded-md transition-colors duration-300 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                }`}
              >
                <option value="all">All Degrees</option>
                {getDegreeOptions().map((degree) => (
                  <option key={degree} value={degree}>
                    {degree}
                  </option>
                ))}
              </select>
            </label>
            <label className="block mb-6">
              <span
                className={`text-lg mb-2 block transition-colors duration-300 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                City
              </span>
              <select
                value={filter.city}
                onChange={(e) => setFilter({ ...filter, city: e.target.value })}
                className={`block w-full p-3 border rounded-md transition-colors duration-300 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                }`}
              >
                <option value="all">All Cities</option>
                {cities.map((city) => (
                  <option key={city as string} value={city as string}>
                    {String(city)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span
                className={`text-lg mb-2 block transition-colors duration-300 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Salary
              </span>
              <select
                value={filter.salary}
                onChange={(e) =>
                  setFilter({ ...filter, salary: e.target.value })
                }
                className={`block w-full p-3 border rounded-md transition-colors duration-300 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                }`}
              >
                <option value="default">Default</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </label>
          </div>
        </div>

        {/* Job Listings */}
        <main className="flex-1 p-2 rounded-lg shadow-lg transition-colors duration-300 bg-gray-100 dark:bg-gray-800">
          <div className="max-w-8xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 transition-colors duration-300 text-gray-800 dark:text-white">
              Available Jobs
            </h2>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Spinner />
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.map((job) => {
                  const randomColor = getRandomFadedColor();
                  return (
                    <div
                      key={job.id}
                      style={{ backgroundColor: randomColor }}
                      className={`max-w-xs rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 ${
                        isDark ? "bg-opacity-20" : "bg-opacity-50"
                      }`}
                    >
                      <div className="flex justify-end items-end mb-4">
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          <strong>Posted on:</strong>{" "}
                          {new Date(job.created).toLocaleDateString()}
                        </p>
                      </div>

                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          isDark ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Hospital - {job.hospital_name}
                        <p>
                          At- {job.hospital_city},{job.hospital_state}
                        </p>
                      </h3>

                      <h2
                        className={`text-xl font-bold mb-3 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Hiring For: {job.position}
                      </h2>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.degree && (
                          <span
                            className={`${
                              isDark
                                ? "bg-gray-700 text-gray-200"
                                : "bg-white text-gray-700"
                            } bg-opacity-50 text-xs font-semibold px-2.5 py-0.5 rounded`}
                          >
                            <strong>Degree:</strong>
                            {job.degree}
                          </span>
                        )}
                        {job.postGraduateCourses && (
                          <span
                            className={`${
                              isDark
                                ? "bg-gray-700 text-gray-200"
                                : "bg-white text-gray-700"
                            } bg-opacity-50 text-xs font-semibold px-2.5 py-0.5 rounded`}
                          >
                            PG's: {job.postGraduateCourses}
                          </span>
                        )}
                        {job.specializations && (
                          <span
                            className={`${
                              isDark
                                ? "bg-gray-700 text-gray-200"
                                : "bg-white text-gray-700"
                            } bg-opacity-50 text-xs font-semibold px-2.5 py-0.5 rounded`}
                          >
                            Specializations: {job.specializations}
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-lg font-semibold mb-3 ${
                          isDark ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Hiring Period
                      </h4>
                      <div className="flex items-center mb-2">
                        <Calendar
                          size={18}
                          className={isDark ? "text-blue-400" : "text-blue-600"}
                        />
                        <p
                          className={`ml-2 text-sm ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          <span className="font-medium">From:</span>{" "}
                          {new Date(job.hire_from).toLocaleDateString()}
                          <span className="mx-2">|</span>
                          <span className="font-medium">
                            {" "}
                            {job.shift_from}{" "}
                          </span>{" "}
                          <br />
                          <span className="font-medium">To:</span>{" "}
                          {new Date(job.hire_to).toLocaleDateString()}
                          <span className="mx-2">|</span>
                          <span className="font-medium">
                            {" "}
                            {job.shift_to}{" "}
                          </span>{" "}
                        </p>
                      </div>

                      {job.time_period && (
                        <p
                          className={`text-sm mt-2 ${
                            isDark ? "text-gray-400" : "text-gray-700"
                          }`}
                        >
                          <span className="font-medium">Duration:</span>{" "}
                          {job.time_period}
                        </p>
                      )}

                      <div className="flex justify-between items-center">
                        <div>
                          <p
                            className={`text-2xl font-bold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            <strong>
                              ₹
                              {Number(job.salary) -
                                Math.round(calculateFee(job.salary, maxFee))}
                            </strong>
                          </p>
                        </div>
                        <button
                          onClick={() => openJobModal(job)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <EyeIcon className="text-4xl" />
                        </button>
                        <button
                          onClick={() => applyForJob(job.id)}
                          className={`${
                            isDark
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-900 hover:bg-gray-800 text-white"
                          } text-sm font-semibold px-4 py-2 rounded-full transition-colors`}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-xl transition-colors duration-300 text-gray-600 dark:text-gray-400">
                  No jobs found.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Pagination */}
      <div className="flex justify-center my-10">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
            isDark
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          } mr-4`}
        >
          Previous
        </button>
        <span className="mx-4 flex items-center text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
            isDark
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          } ml-4`}
        >
          Next
        </button>
      </div>

      {/* Job Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeJobModal}
        size="4xl"
        scrollBehavior="inside"
        className={isDark ? "dark" : ""}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">{selectedJob?.position}</h2>
                <p className="text-base text-gray-600 dark:text-gray-400 flex items-center">
                  <Briefcase size={18} className="mr-2" />
                  {selectedJob?.hospital_name}
                </p>
                <div className="flex">
                  <Star color="#FFD700" fill="#FFD700" />
                  <p className="font-bold dark:text-white text-black sm:text-black  ml-2 sm:ml-0">
                    {selectedJob?.average_rating} Overall Rating
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Hiring Details */}
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3">
                        Hiring Details
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Hiring Type:
                          </p>
                          <p className="font-medium">{selectedJob?.hire}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Duration:
                          </p>
                          <p className="font-medium">
                            {selectedJob &&
                              `${new Date(
                                selectedJob.hire_from
                              ).toLocaleDateString()} - ${new Date(
                                selectedJob.hire_to
                              ).toLocaleDateString()}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Time Period:
                          </p>
                          <p className="font-medium">
                            {selectedJob?.time_period}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Compensation */}
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                      <span>
                        The total salary for this job is{" "}
                        <strong>₹{selectedJob?.salary}. </strong>
                        After deducting the platform fee of{" "}
                        <strong>
                          {" "}
                          ₹
                          {selectedJob &&
                            Math.round(
                              calculateFee(selectedJob.salary, maxFee)
                            )}
                        </strong>
                        , which is covered by the hospital, your net
                        compensation will be provided.
                      </span>

                      <h3 className="text-lg font-semibold mb-3">
                        Compensation
                      </h3>
                      <div className="text-2xl font-bold flex items-center">
                        ₹
                        {selectedJob &&
                          Number(selectedJob.salary) -
                            Math.round(
                              calculateFee(selectedJob.salary, maxFee)
                            )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Qualifications */}
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3">
                        Required Qualifications
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Degree Required:
                          </p>
                          <p className="font-medium">{selectedJob?.degree}</p>
                        </div>
                        {selectedJob?.postGraduateCourses && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Post Graduate Courses:
                            </p>
                            <p className="font-medium">
                              {selectedJob.postGraduateCourses}
                            </p>
                          </div>
                        )}
                        {selectedJob?.specializations && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
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
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3">
                        Work Schedule
                      </h3>
                      {selectedJob?.shift_from && selectedJob?.shift_to && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Shift Hours:
                          </p>
                          <p className="font-medium">
                            {selectedJob.shift_from} - {selectedJob.shift_to}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Job Description - Full Width */}
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mt-4">
                  <h3 className="text-lg font-semibold mb-3">
                    Job Description
                  </h3>
                  <p className="whitespace-pre-line">
                    {selectedJob?.job_description}
                  </p>
                </div>

                {/* Tags Section */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-3">Quick Overview</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob?.degree && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 flex items-center">
                        <GraduationCap size={12} className="mr-1" />
                        {selectedJob.degree}
                      </span>
                    )}
                    {selectedJob?.postGraduateCourses && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 flex items-center">
                        <BookOpen size={12} className="mr-1" />
                        PG: {selectedJob.postGraduateCourses}
                      </span>
                    )}
                    {selectedJob?.specializations && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300 flex items-center">
                        <Stethoscope size={12} className="mr-1" />
                        {selectedJob.specializations}
                      </span>
                    )}
                    {selectedJob?.time_period && (
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {selectedJob.time_period}
                      </span>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    selectedJob && applyForJob(selectedJob.id);
                    onClose();
                  }}
                >
                  Apply Now
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
