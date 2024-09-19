"use client";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import AddJobModal from "@/components/AddJobModal";
import ViewApplicantsModal from "@/components/ViewApplicants";
import toast from "react-hot-toast";
import pb from "@/utils/pocketbase-connect";
import { DeleteIcon } from "@/components/DeleteIcon";

const AddedJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [authdata, setAuthData] = useState<any>("");

  useEffect(() => {
    const data = getCookie("authData");
    if (data) {
      const authData = JSON.parse(data as string);
      authData && setAuthData(authData);
      fetchJobs(authData?.token, authData?.record?.id);
    }
  }, []);
  console.log(authdata);

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
      console.log(jobsData.items);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="flex-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Your Jobs</h2>

          <button
            onClick={handleJobModalOpen}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
          >
            + Add Job
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div>Loading...</div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => {
              const randomColor = getRandomFadedColor();
              return (
                <div
                  key={job.id}
                  style={{ backgroundColor: randomColor }}
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

                  {/* Hire From and Hire To Dates */}
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
                    {job.shift_from && job.shift_to ? (
                      <span className="bg-white bg-opacity-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {job.shift_from} - {job.shift_to}
                      </span>
                    ) : (
                      "Shift"
                    )}
                  </div>

                  {job.job_description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {job.job_description}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold">
                        ₹{job.salary.toLocaleString()}/yr
                      </p>
                    </div>
                    <div className="flex justify-between items-center space-x-4">
                      <button
                        onClick={() => handleApplicantsModalOpen(job.id)}
                        className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors w-full"
                      >
                        View Applicants
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-xl">No jobs found.</p>
          </div>
        )}
      </div>

      {/* AddJobModal */}
      {isJobModalOpen && (
        <AddJobModal isOpen={isJobModalOpen} onClose={handleJobModalClose} />
      )}

      {/* ViewApplicantsModal */}
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

// Dummy function for random color generation
const getRandomFadedColor = () => {
  const colors = [
    "rgba(255, 99, 132, 0.4)", // Darker Red
    "rgba(54, 162, 235, 0.4)", // Darker Blue
    "rgba(255, 206, 86, 0.4)", // Darker Yellow
    "rgba(75, 192, 192, 0.4)", // Darker Teal
    "rgba(153, 102, 255, 0.4)", // Darker Purple
    "rgba(255, 159, 64, 0.4)", // Darker Orange
    "rgba(201, 203, 207, 0.4)", // Darker Gray
    "rgba(255, 105, 180, 0.4)", // Darker Pink
    "rgba(100, 149, 237, 0.4)", // Cornflower Blue
    "rgba(218, 165, 32, 0.4)", // Goldenrod
    "rgba(107, 142, 35, 0.4)", // Olive Green
    "rgba(123, 104, 238, 0.4)", // Medium Slate Blue
    "rgba(255, 140, 0, 0.4)", // Dark Orange
    "rgba(47, 79, 79, 0.4)", // Dark Slate Gray
    "rgba(220, 20, 60, 0.4)", // Crimson
    "rgba(255, 69, 0, 0.4)", // Red Orange
    "rgba(34, 139, 34, 0.4)", // Forest Green
    "rgba(72, 61, 139, 0.4)", // Dark Slate Blue
    "rgba(106, 90, 205, 0.4)", // Slate Blue
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

export default AddedJobs;
