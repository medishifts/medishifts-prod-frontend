"use client";
import React, { useState, useEffect } from "react";

import PocketBase from "pocketbase";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import Loader from "@/components/Loader";
import { EyeIcon } from "@/components/EyeIcon";
const pb = new PocketBase(process.env.NEXT_PUBLIC_BACKEND_API);

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

export default function JobsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [userId, setUserId] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    hire: "all",
    salary: "default",
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const jobsPerPage = 9;


  useEffect(() => {
    const authDataCookie = getCookie("authData");

    if (authDataCookie) {
      console.log("Cookie Value:", authDataCookie);

      try {
        const authData = JSON.parse(authDataCookie as string);
        setUserId(authData.record.id);
        setUserRole(authData.record.role);
        console.log("User ID:", authData.record.id);
        console.log("User Role:", authData.record.role);
      } catch (error) {
        console.error("Error parsing cookie:", error);
        toast.error("Failed to parse auth data. Please log in again.");
      }
    } else {
      toast.error("Authentication data not found. Please log in.");
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        let queryParams: Record<string, any> = {
          page: currentPage,
          perPage: jobsPerPage,
        };

        // Add search query
        if (searchTerm) {
          queryParams.filter = `position~"${searchTerm}"`;
        }

        if (filter.hire !== "all") {
          queryParams.filter = `${
            queryParams.filter ? `${queryParams.filter} AND ` : ""
          }hire="${filter.hire}"`;
        }

        // Add sorting query
        if (filter.salary === "lowToHigh") {
          queryParams.sort = "salary";
        } else if (filter.salary === "highToLow") {
          queryParams.sort = "-salary";
        }

        const queryString = new URLSearchParams(queryParams).toString();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/collections/jobs/records?${queryString}&filter=(hire~'${userRole}' )`,

          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const resultList = await response.json();
        setJobs(resultList.items);
        setTotalPages(resultList.totalPages);
        console.log(resultList);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, filter, searchTerm, userRole]);
  const openJobModal = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeJobModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };
  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      setSearchValue(searchTerm);
      setCurrentPage(1);
    }
  };
  const applyForJob = async (jobId: string) => {
    const authDataCookie = getCookie("authData");
    if (!authDataCookie) {
      toast.error("You must be logged in to apply for a job.");
      return;
    }

    const authData = JSON.parse(authDataCookie as string);

    const headersList = {
      Accept: "application/json",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      Authorization: `Bearer ${authData.token}`,
      "Content-Type": "application/json",
    };

    const bodyContent = JSON.stringify({
      job: jobId,
      applicant: authData.record.id,
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/collections/enrollments/records `,
        {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        }
      );
      const responseData = await response.json();
      if (response.ok) {
        toast.success("Successfully applied for the job!");
      } else {
        toast.error(responseData.message);
      }
    } catch (error: any) {
      console.error("Error applying for the job:", error);
      toast.error(error.message || "Failed to apply for the job.");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
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

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Hero Section */}
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
          🌟 <strong>Are you ready to make an impact?</strong> Join a team where
          your skills and passion are valued. We offer exciting opportunities to
          work on groundbreaking projects and collaborate with industry leaders.
        </p>
      </header>

      {/* Search Bar */}
      <div className="flex justify-center mt-12 mb-8 px-4">
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
      </div>

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
                Hire Type
              </span>
              <select
                value={filter.hire}
                onChange={(e) => setFilter({ ...filter, hire: e.target.value })}
                className={`block w-full p-3 border rounded-md transition-colors duration-300 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                }`}
              >
                <option value="all">All</option>
                <option value="DOCTOR">Doctor</option>
                <option value="NURSE">Nurse</option>
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
                <Loader />
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
                      <div className="flex justify-between items-start mb-4">
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {new Date(job.created).toLocaleDateString()}
                        </p>
                        <button
                          className={`${
                            isDark
                              ? "text-gray-400 hover:text-gray-200"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center mb-4">
                        <div className="flex-grow">
                          <h3
                            className={`text-lg font-semibold ${
                              isDark ? "text-gray-200" : "text-gray-700"
                            }`}
                          >
                            {job.hire}
                          </h3>
                          <h2
                            className={`text-xl font-bold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {job.position}
                          </h2>
                        </div>
                        {job.hospital_name ? (
                          <div
                            className={`${
                              isDark ? "bg-gray-700" : "bg-white"
                            } bg-opacity-50 rounded-full p-2`}
                          >
                            {job.hospital_name}
                          </div>
                        ) : (
                          "Hospital name"
                        )}
                      </div>
                      <div className="flex flex-col mb-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Job From:</strong>{" "}
                          {new Date(job.hire_from).toLocaleDateString("en-GB")}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Job To:</strong>{" "}
                          {new Date(job.hire_to).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.degree && (
                          <span
                            className={`${
                              isDark
                                ? "bg-gray-700 text-gray-200"
                                : "bg-white text-gray-700"
                            } bg-opacity-50 text-xs font-semibold px-2.5 py-0.5 rounded`}
                          >
                            {job.degree}
                          </span>
                        )}

                        {job.time_period && (
                          <span
                            className={`${
                              isDark
                                ? "bg-gray-700 text-gray-200"
                                : "bg-white text-gray-700"
                            } bg-opacity-50 text-xs font-semibold px-2.5 py-0.5 rounded`}
                          >
                            {job.time_period}
                          </span>
                        )}

                        {job.shift_from && job.shift_to ? (
                          <span className="bg-white bg-opacity-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded">
                            {job.shift_from} - {job.shift_to}
                          </span>
                        ) : (
                          "Shift"
                        )}
                      </div>

                      {job.job_description && (
                        <p
                          className={`text-sm mb-4 line-clamp-2 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {job.job_description}
                        </p>
                      )}

                      <div className="flex justify-between items-center">
                        <div>
                          <p
                            className={`text-2xl font-bold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            ${job.salary.toLocaleString()}/yr
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
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`max-w-2xl w-full m-4 rounded-3xl p-8 shadow-2xl transition-all duration-300 transform ${
              isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            } scale-100 hover:scale-105`}
            style={{
              transitionTimingFunction: "ease-in-out",
            }}
          >
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-extrabold text-gradient bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                {selectedJob.position}
              </h2>
              <button
                onClick={closeJobModal}
                className="text-3xl font-bold text-gray-500 hover:text-red-500 transition-colors duration-300"
              >
                &times;
              </button>
            </div>
            {selectedJob.hospital_name ? (
              <div
                className={`${
                  isDark ? "bg-gray-700" : "bg-white"
                } bg-opacity-50 rounded-full p-2`}
              >
                {selectedJob.hospital_name}
              </div>
            ) : (
              "Hospital name"
            )}

            {/* Salary and Hire Type Section */}
            <div className="mb-6">
              <p
                className={`text-lg font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Hiring: <strong>{selectedJob.hire}</strong>
              </p>
              <p className="text-3xl font-bold mt-2 text-gradient bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
                Salary: ${selectedJob.salary.toLocaleString()}/yr
              </p>
            </div>

            {/* Tags Section */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedJob.degree && (
                <span
                  className={`${
                    isDark
                      ? "bg-gray-700 text-gray-200"
                      : "bg-gray-200 text-gray-700"
                  } text-sm font-semibold px-4 py-1 rounded-full shadow-lg`}
                >
                  Required Degree: {selectedJob.degree}
                </span>
              )}
              {selectedJob.postGraduateCourses && (
                <span
                  className={`${
                    isDark
                      ? "bg-gray-700 text-gray-200"
                      : "bg-gray-200 text-gray-700"
                  } text-sm font-semibold px-4 py-1 rounded-full shadow-lg`}
                >
                  Required PG's: {selectedJob.postGraduateCourses}
                </span>
              )}
              {selectedJob.specializations && (
                <span
                  className={`${
                    isDark
                      ? "bg-gray-700 text-gray-200"
                      : "bg-gray-200 text-gray-700"
                  } text-sm font-semibold px-4 py-1 rounded-full shadow-lg`}
                >
                  Required PG's: {selectedJob.specializations}
                </span>
              )}
              {selectedJob.time_period && (
                <span
                  className={`${
                    isDark
                      ? "bg-gray-700 text-gray-200"
                      : "bg-gray-200 text-gray-700"
                  } text-sm font-semibold px-4 py-1 rounded-full shadow-lg`}
                >
                  Job time Period: {selectedJob.time_period}
                </span>
              )}

              {selectedJob.shift_from && selectedJob.shift_to ? (
                <span className="bg-white bg-opacity-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded  shadow-lg">
                  Shift Timing : {selectedJob.shift_from} -{" "}
                  {selectedJob.shift_to}
                </span>
              ) : (
                "Shift"
              )}
            </div>

            {/* Job Description Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2 text-gradient bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Job Description
              </h3>
              <p
                className={`text-lg leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {selectedJob.job_description}
              </p>
            </div>

            {/* Apply Now Button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  applyForJob(selectedJob.id);
                  closeJobModal();
                }}
                className={`${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 text-white"
                } text-lg font-semibold px-6 py-3 rounded-full shadow-xl transition-transform transform hover:scale-105 duration-300`}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
