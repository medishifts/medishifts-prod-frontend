"use client";
import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import { Chip } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";

const pb = new PocketBase(process.env.NEXT_PUBLIC_BACKEND_API);

interface AppliedJob {
  id: string;
  applicant_email: string;
  applicant_id: string;
  applicant_name: string;
  applicant_role: string;
  hospital: string;
  hospital_name: string;
  is_hired: boolean;
  job_id: string;
  position: string;
  salary: number;
  specialization: string;
  degree: string;
}

const AppliedJobs: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false); // Toggle dark mode based on your logic

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const resultList = await pb
          .collection("view_enrollments")
          .getList<AppliedJob>(1, 50);
        setAppliedJobs(resultList.items);
        console.log(resultList.items);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const withdrawApplication = async (id: string) => {
    try {
      // Show confirmation prompt
      const confirmed = window.confirm(
        "Are you sure you want to withdraw this application?"
      );
      if (!confirmed) return;

      // Use toast.promise to handle the API request
      await toast.promise(pb.collection("enrollments").delete(id), {
        loading: "Processing your request...",
        success: "Application withdrawn successfully.",
        error: "Failed to withdraw application. Please try again later.",
      });

      // Update the UI after successful withdrawal
      setAppliedJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Error withdrawing application:", error);
      // Error is handled by toast.promise
    }
  };

  const generateLightColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const lightness = Math.floor(Math.random() * 20) + 80; // Ensures light and faded colors
    return `hsl(${hue}, 70%, ${lightness}%)`;
  };

  if (loading) {
    return <div className="text-center text-2xl mt-8">Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6">applied-jobs</h1>
      {appliedJobs.length === 0 ? (
        <p className="text-center text-xl">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {appliedJobs.map((job) => (
            <div
              key={job.id}
              style={{ backgroundColor: generateLightColor() }}
              className={`max-w-xs rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 ${
                isDark ? "bg-opacity-20" : "bg-opacity-50"
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="flex-grow">
                  <h3
                    className={`text-lg font-semibold ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {job.applicant_role}
                  </h3>
                  <h2
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {job.position}
                  </h2>
                </div>
                <div
                  className={`${
                    isDark ? "bg-gray-700" : "bg-white"
                  } bg-opacity-50 rounded-full p-2`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
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
                {job.specialization && (
                  <span
                    className={`${
                      isDark
                        ? "bg-gray-700 text-gray-200"
                        : "bg-white text-gray-700"
                    } bg-opacity-50 text-xs font-semibold px-2.5 py-0.5 rounded`}
                  >
                    {job.specialization}
                  </span>
                )}
              </div>

              <div className="flex flex-col mb-4">
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <strong>Email:</strong> {job.applicant_email}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <strong>Hospital:</strong> {job.hospital_name}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <strong>Salary:</strong> ${job.salary.toFixed(2)}
                </p>
                <p className="text-sm mb-4">
                  <strong className="text-black">Status:</strong>{" "}
                  <Chip
                    color={job.is_hired ? "success" : "danger"}
                    variant="shadow"
                    className={`${isDark ? "text-gray-100" : "text-gray-900"}`}
                  >
                    {job.is_hired ? "Hired" : "Not Hired"}
                  </Chip>
                </p>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => withdrawApplication(job.id)} // Call the function with the job ID
                  className={`${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  } text-sm font-semibold px-4 py-2 rounded-full transition-colors`}
                >
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default AppliedJobs;
