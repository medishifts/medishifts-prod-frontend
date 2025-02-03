"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import Modal from "react-modal";
import { consolidatedMedicalEducation } from "../app/consolidatedMedicalEducation";
import SelectDropDown from "./SelectDropDown";
import { consolidatedNurseEducation } from "@/app/consolidatedNurseEducation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "20px",
    maxWidth: "500px",
    width: "100%",
    zIndex: "1000",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const calculateTimePeriod = (fromDate: Date, toDate: Date) => {
  const start = new Date(fromDate);
  const end = new Date(toDate);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `${years} year(s), ${months} month(s), ${days} day(s)`;
};

const formatDateToString = (date: Date | null): string => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose }) => {
  const [position, setPosition] = useState("");
  const [hire, setHire] = useState("Doctor");
  const [hireFrom, setHireFrom] = useState<Date | null>(null);
  const [hireTo, setHireTo] = useState<Date | null>(null);
  const [timePeriod, setTimePeriod] = useState("");
  const [salary, setSalary] = useState<any>("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [shiftFrom, setShiftFrom] = useState("");
  const [shiftTo, setShiftTo] = useState("");
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedPGCourses, setSelectedPGCourses] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);
  const [authdata, setAuthData] = useState<any>(null);
  const [fee, setFee] = useState<any>(0);

  
  useEffect(() => {
    const auth = getCookie("authData");
    if (auth) {
      const authData = JSON.parse(auth as string);
      setAuthData(authData);
    }
  }, []);

  const maxFee = 300;

  const calculateFee = (salary: any) => {
    const fee = salary * 0.1;
    if (fee >= maxFee) {
      return maxFee;
    } else {
      return fee;
    }
  };

  useEffect(() => {
    if (hireFrom && hireTo) {
      const period = calculateTimePeriod(hireFrom, hireTo);
      setTimePeriod(period);
    }
  }, [hireFrom, hireTo]);

  useEffect(() => {
    if (salary) {
      const fee = calculateFee(Number(salary));
      setFee(fee);
    }
  }, [salary]);

  const extractTimeIn12HourFormat = (date: Date | null): string => {
    if (!date) return "";

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12; // Convert to 12-hour format

    return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  const handleDateChange = (date: Date | null, type: "from" | "to") => {
    if (type === "from") {
      setHireFrom(date);
      if (date) {
        setShiftFrom(extractTimeIn12HourFormat(date));
      }
    } else {
      setHireTo(date);
      if (date) {
        setShiftTo(extractTimeIn12HourFormat(date));
      }
    }
  };

  const handlePostJob = async () => {
    if (!position || !hireFrom || !hireTo || !salary || !jobDescription) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    const headersList = {
      Accept: "/",
      Authorization: `Bearer ${authdata?.token}`,
      "Content-Type": "application/json",
    };

    const bodyContent = JSON.stringify({
      position,
      degree: selectedDegrees.join(", "),
      postGraduateCourses: selectedPGCourses.join(", "),
      specializations: selectedSpecializations.join(", "),
      hire: hire.toUpperCase(),
      hire_from: hireFrom?.toISOString(),
      hire_to: hireTo?.toISOString(),
      time_period: timePeriod,
      salary: Number(salary),
      job_description: jobDescription,
      hospital: authdata?.record?.id,
      hospital_name: authdata?.record?.name,
      shift_from: shiftFrom,
      shift_to: shiftTo,
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/collections/jobs/records`,
        {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Job posted successfully!");
        setTimeout(() => {
          setLoading(false);
          onClose();
        }, 2000);
      } else {
        throw new Error(data.message || data.error || "Failed to post job");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error posting job. Please check your connection.";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Modal
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg p-5 w-full max-w-lg mx-auto shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Job Modal"
    >
      <div className="flex justify-end">
        <Button color="warning" onPress={onClose}>
          Close
        </Button>
      </div>
      <form className="space-y-4 max-h-[400px] overflow-auto dark:bg-gray-800 dark:text-white">
        <div>
          <label className="block font-medium dark:text-white">Hire as</label>
          <input
            type="text"
            placeholder="Add Position"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium dark:text-white">
            Hire Doctor/Nurse
          </label>
          <select
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={hire}
            onChange={(e) => setHire(e.target.value)}
          >
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
          </select>
        </div>
        {hire === "Doctor" ? (
          <>
            <div>
              <h3 className="dark:text-white">Degree</h3>
              <SelectDropDown
                data={consolidatedMedicalEducation.degrees}
                onChange={(selectedOptions: any[]) => {
                  setSelectedDegrees(
                    selectedOptions.map((option) => option.value)
                  );
                }}
              />
            </div>
            <div>
              <h3 className="dark:text-white">PG Courses</h3>
              <SelectDropDown
                data={consolidatedMedicalEducation.postgraduateCourses}
                onChange={(selectedOptions: any[]) => {
                  setSelectedPGCourses(
                    selectedOptions.map((option) => option.value)
                  );
                }}
              />
            </div>
            <div>
              <h3 className="dark:text-white">Specialisations</h3>
              <SelectDropDown
                data={consolidatedMedicalEducation.specializations}
                onChange={(selectedOptions: any[]) => {
                  setSelectedSpecializations(
                    selectedOptions.map((option) => option.value)
                  );
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <h3 className="dark:text-white">Degree</h3>
              <SelectDropDown
                data={consolidatedNurseEducation.degree}
                onChange={(selectedOptions: any[]) => {
                  setSelectedDegrees(
                    selectedOptions.map((option) => option.value)
                  );
                }}
              />
            </div>
            <div>
              <h3 className="dark:text-white">PG Courses</h3>
              <SelectDropDown
                data={consolidatedNurseEducation.postgraduate}
                onChange={(selectedOptions: any[]) => {
                  setSelectedPGCourses(
                    selectedOptions.map((option) => option.value)
                  );
                }}
              />
            </div>
            <div>
              <h3 className="dark:text-white">Specialisations</h3>
              <SelectDropDown
                data={consolidatedNurseEducation.specialization}
                onChange={(selectedOptions: any[]) => {
                  setSelectedSpecializations(
                    selectedOptions.map((option) => option.value)
                  );
                }}
              />
            </div>
          </>
        )}
       <div className="w-full max-w-md mx-auto">
          <label className="block text-bold font-medium mb-2 dark:text-white">
            Hire from date & Shift from time
          </label>
          <div className="relative">
            <DatePicker
              selected={hireFrom}
              onChange={(date: Date | null) => {
                handleDateChange(date, "from");
              }}
              dateFormat="dd/MM/yyyy h:mm aa"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Shift from"
              minDate={new Date()}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholderText="Select start date and time"
              isClearable
              calendarClassName="responsive-calendar"
              popperProps={{
                strategy: "fixed",
              }}
              wrapperClassName="w-full"
            />
          </div>
        </div>
        {/* <div>
          <label className="block font-medium dark:text-white">
            Shift Time From
          </label>
          <input
            type="time"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => handleShiftTimeChange("from", e.target.value)}
          />
        </div> */}
        <div className="w-full max-w-md mx-auto">
          <label className="block text-bold font-medium mb-2 dark:text-white">
            Hire to date & Shift to time
          </label>
          <DatePicker
            selected={hireTo}
            onChange={(date: Date | null) => {
              handleDateChange(date, "to");
            }}
            dateFormat="dd/MM/yyyy h:mm aa" // Format for date and time
            showTimeSelect // Enable time selection
            timeFormat="HH:mm" // Time format (24-hour format)
            timeIntervals={15} // Time intervals in minutes (optional)
            timeCaption="Shift to" // Caption for the time dropdown
            minDate={hireFrom || new Date()} // Minimum date
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholderText="Select end date and time"
            isClearable
            calendarClassName="responsive-calendar"
            popperProps={{
              strategy: "fixed",
            }}
            wrapperClassName="w-full"
          />
        </div>

        {/* <div>
          <label className="block font-medium dark:text-white">
            Shift Time To
          </label>
          <input
            type="time"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => handleShiftTimeChange("to", e.target.value)}
          />
        </div> */}
        {timePeriod && (
          <div>
            <label className="block font-medium dark:text-white">
              Time Period
            </label>
            <p className="dark:text-white">{timePeriod}</p>
          </div>
        )}
        <div>
          <label className="block font-medium dark:text-white">Salary</label>
          <input
            onWheel={(e: any) => e.target.blur()}
            type="number"
            placeholder="Please provide the total amount for the time period"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          <span className="dark:text-white">
            {" "}
            A platform fee of maximum ₹{salary ? fee : "300"} or 10% of the
            salary, whichever is lower, will be charged upon hiring.{" "}
          </span>
        </div>
        <div>
          <label className="block font-medium dark:text-white">
            Job Description
          </label>
          <textarea
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={3}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </form>

      <div className="flex justify-center">
        <Button
          onPress={handlePostJob}
          disabled={loading}
          color="primary"
          className="mt-4 w-full dark:bg-blue-800"
        >
          {loading ? <ClipLoader size={20} color="#ffffff" /> : "Post Job"}
        </Button>
      </div>
    </Modal>
  );
};

export default AddJobModal;
