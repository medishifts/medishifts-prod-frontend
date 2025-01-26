import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import {
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
  divider,
} from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import {
  X,
  Briefcase,
  DollarSign,
  GraduationCap,
  BookOpen,
  Clock,
  MapPin,
  Calendar,
  User,
  Home,
  FileText,
  Award,
  Stethoscope,
  Star,
} from "lucide-react";
import { useAppSelector } from "@/app/redux/store";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { getCookie } from "cookies-next";

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
  specializations: string;
  degree: string;
  postGraduateCourses: string;
  job_description: string;
  experienceYears: string;
  hire: string;
  hire_from: string;
  hire_to: string;
  shift_from: string;
  shift_to: string;
  time_period: string;
  is_doctor_rated: number;
  is_hospital_rated: number;
  is_nurse_rated: number;
  hospital_rating: number;
}

const JobCard: React.FC<{
  job: AppliedJob;
  onViewDetails: () => void;
  onWithdraw: () => void;
  isDark: boolean;
}> = ({ job, onViewDetails, onWithdraw, isDark }) => {
  const backendApi = process.env.NEXT_PUBLIC_BACKEND_API;
  const [rating, setRating] = useState(0);
  const userId = useAppSelector((state) => state.profileReducer.value.id);
  const [authdata, setAuthData] = useState<any | null>(null);
  useEffect(() => {
    const data = getCookie("authData");
    if (data) {
      console.log(data);
      const authData = JSON.parse(data as string);
      authData && setAuthData(authData);
    }
  }, []);

  const handleRating = async (
    user: string | undefined,
    enrollment_id: string | undefined
  ) => {
    try {
      let headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${authdata.token}`,
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        enrollment_id: enrollment_id,
        rating: rating,
        user: user,
      });

      let response = await fetch(`${backendApi}/api/review`, {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      if (response.ok) {
        let data = await response.json(); // Assuming the API sends a JSON response
        toast.success(data.message || "Rating submitted successfully!");
      } else {
        let errorData = await response.json();
        toast.error(errorData.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Network error or unexpected issue occurred!");
      console.error("Error:", error);
    }
  };

  const generateLightColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const lightness = Math.floor(Math.random() * 20) + 80;
    return `hsl(${hue}, 70%, ${lightness}%)`;
  };
  const maxFee = 300;
  const calculateFee = (salary: any, maxFee: any) => {
    const fee = salary * 0.1;
    return fee >= maxFee ? maxFee : fee;
  };

  return (
    <div
      style={{ backgroundColor: generateLightColor() }}
      className={`rounded-3xl p-6 flex flex-col h-full max-w-80 shadow-md hover:shadow-xl transition-all duration-300 ${
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
          <Briefcase
            className={`h-6 w-6 ${isDark ? "text-gray-300" : "text-gray-500"}`}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.degree && (
          <span
            className={`${
              isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-700"
            } bg-opacity-50 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center`}
          >
            <GraduationCap size={12} className="mr-1" /> {job.degree}
          </span>
        )}
        {job.specializations && (
          <span
            className={`${
              isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-700"
            } bg-opacity-50 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center`}
          >
            <BookOpen size={12} className="mr-1" /> {job.specializations}
          </span>
        )}
        {job.hire && (
          <span
            className={`${
              isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-700"
            } bg-opacity-50 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center`}
          >
            <Clock size={12} className="mr-1" /> {job.hire}
          </span>
        )}
        {job.time_period && (
          <span
            className={`${
              isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-700"
            } bg-opacity-50 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center`}
          >
            <Calendar size={12} className="mr-1" /> {job.time_period}
          </span>
        )}
      </div>

      <div className="flex flex-col mb-4">
        <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          <strong>Hospital:</strong> {job.hospital_name}
        </p>
        <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          <strong>Salary:</strong> ₹{" "}
          {Number(job.salary) - Math.round(calculateFee(job.salary, maxFee))}
        </p>
        <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          <strong>Shift:</strong> <Clock size={12} className="inline mr-1" />{" "}
          {job.shift_from} - {job.shift_to}
        </p>
        <p className="text-sm mt-2">
          <strong>Status:</strong>{" "}
          <Chip
            color={job.is_hired ? "success" : "danger"}
            variant="flat"
            size="sm"
          >
            {job.is_hired ? "Hired" : "Not Hired"}
          </Chip>
        </p>
        {job.is_hired && (
          <div className="flex justify-between items-center">
            {job.is_doctor_rated > 0 ? (
              <>
                <Rating
                  style={{ maxWidth: 120 }}
                  value={job.is_doctor_rated}
                  readOnly
                />
                <p className="text-sm flex">
                  Rated {job.is_doctor_rated}{" "}
                  <Star color="yellow" fill="#e29f0f" size={19} />
                </p>
              </>
            ) : (
              <>
                <Rating
                  style={{ maxWidth: 120 }}
                  value={rating}
                  onChange={setRating}
                />
                <Button
                  onClick={() => handleRating(job.hospital || "", job.id || "")}
                  size="sm"
                  color="warning"
                >
                  Rate
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-auto pt-4">
        <Button
          onClick={onViewDetails}
          color="primary"
          className="rounded-full"
          size="sm"
        >
          View Details
        </Button>
        <Button
          onClick={onWithdraw}
          color="danger"
          className="rounded-full"
          size="sm"
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
};

const JobModal: React.FC<{
  job: AppliedJob | null;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}> = ({ job, isOpen, onClose, isDark }) => {
  if (!job) return null;

  const maxFee = 300;
  const calculateFee = (salary: any, maxFee: any) => {
    const fee = salary * 0.1;
    return fee >= maxFee ? maxFee : fee;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "p-3",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">{job.position}</h2>
              <p className="text-base text-gray-600 dark:text-gray-400 flex items-center">
                <Briefcase size={16} className="mr-2" />
                {job.hospital_name}
              </p>
              <div className="flex">
                <Star color="#FFD700" fill="#FFD700" />
                <p className="font-bold dark:text-white text-black sm:text-black  ml-2 sm:ml-0">
                  {job?.hospital_rating} Overall Rating
                </p>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Hiring Details */}
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">
                      Hiring Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Hiring Type:
                        </p>
                        <p className="text-base font-medium">{job.hire}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Duration:
                        </p>
                        <p className="text-base font-medium">
                          {new Date(job.hire_from).toLocaleDateString("en-GB")}{" "}
                          - {new Date(job.hire_to).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Time Period:
                        </p>
                        <p className="text-base font-medium">
                          {job.time_period}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Compensation */}
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <span>
                      The total salary for this job is{" "}
                      <strong>₹{job?.salary}. </strong>
                      After deducting the platform fee of{" "}
                      <strong>
                        {" "}
                        ₹{job && Math.round(calculateFee(job.salary, maxFee))}
                      </strong>
                      , which is covered by the hospital, your net compensation
                      will be provided.
                    </span>
                    <h3 className="text-lg font-semibold mb-4">Compensation</h3>
                    <div className="text-2xl font-bold flex items-center">
                      ₹
                      {Number(job.salary) -
                        Math.round(calculateFee(job.salary, maxFee))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Qualifications */}
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">
                      Required Qualifications
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Degree Required:
                        </p>
                        <p className="text-base font-medium">{job.degree}</p>
                      </div>
                      {job.postGraduateCourses && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Post Graduate Courses:
                          </p>
                          <p className="text-base font-medium">
                            {job.postGraduateCourses}
                          </p>
                        </div>
                      )}
                      {job.specializations && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Specializations:
                          </p>
                          <p className="text-base font-medium">
                            {job.specializations}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">
                      Work Schedule
                    </h3>
                    <div className="space-y-3">
                      {job.shift_from && job.shift_to && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Shift Hours:
                          </p>
                          <p className="text-base font-medium">
                            {job.shift_from} - {job.shift_to}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mt-6">
                <h3 className="text-lg font-semibold mb-4">Job Description</h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{job.job_description}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Quick Overview</h3>
                <div className="flex flex-wrap gap-2">
                  {job.degree && (
                    <Chip
                      color="primary"
                      variant="flat"
                      className="flex items-center"
                    >
                      <GraduationCap size={12} className="mr-1" /> {job.degree}
                    </Chip>
                  )}
                  {job.postGraduateCourses && (
                    <Chip
                      color="success"
                      variant="flat"
                      className="flex items-center"
                    >
                      <BookOpen size={12} className="mr-1" /> PG:{" "}
                      {job.postGraduateCourses}
                    </Chip>
                  )}
                  {job.specializations && (
                    <Chip
                      color="warning"
                      variant="flat"
                      className="flex items-center"
                    >
                      <Stethoscope size={12} className="mr-1" />{" "}
                      {job.specializations}
                    </Chip>
                  )}
                  {job.time_period && (
                    <Chip
                      color="secondary"
                      variant="flat"
                      className="flex items-center"
                    >
                      <Clock size={12} className="mr-1" /> {job.time_period}
                    </Chip>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const AppliedJobs: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [selectedJob, setSelectedJob] = useState<AppliedJob | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      pb.autoCancellation(false);
      try {
        const resultList = await pb
          .collection("view_enrollments")
          .getList<AppliedJob>(1, 50, {
            sort: "-created",
          });

        setAppliedJobs(resultList.items);
        console.log(resultList);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
        toast.error("Failed to fetch applied jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const withdrawApplication = async (id: string) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to withdraw this application?"
      );
      if (!confirmed) return;

      await toast.promise(pb.collection("enrollments").delete(id), {
        loading: "Processing your request...",
        success: "Application withdrawn successfully.",
        error: "Failed to withdraw application. Please try again later.",
      });

      setAppliedJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Error withdrawing application:", error);
    }
  };

  const handleViewDetails = (job: AppliedJob) => {
    setSelectedJob(job);
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
    setSelectedJob(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-900 ${
        isDark ? "text-white" : "text-gray-800"
      } min-h-screen p-8`}
    >
      <h1 className="text-3xl dark:text-white font-bold mb-6">Applied Jobs</h1>
      {appliedJobs.length === 0 ? (
        <p className="text-center text-xl">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {appliedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onViewDetails={() => handleViewDetails(job)}
              onWithdraw={() => withdrawApplication(job.id)}
              isDark={isDark}
            />
          ))}
        </div>
      )}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          isOpen={isOpen}
          onClose={handleCloseModal}
          isDark={isDark}
        />
      )}
      <Toaster />
    </div>
  );
};

export default AppliedJobs;
