"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import Modal from "react-modal";
import { consolidatedMedicalEducation } from "../app/consolidatedMedicalEducation";
import SelectDropDown from "./SelectDropDown";


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
    backgroundColor: "rgba(0, 0, 0, 0.5)",// No change needed for overlay
  },
};

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const calculateTimePeriod = (fromDate: string, toDate: string) => {
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

const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose }) => {
  const [position, setPosition] = useState("");
  const [hire, setHire] = useState("Doctor");
  const [hireFrom, setHireFrom] = useState("");
  const [hireTo, setHireTo] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [salary, setSalary] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [calculatingPeriod, setCalculatingPeriod] = useState(false);
  const [shiftFrom, setShiftFrom] = useState("");
  const [shiftTo, setShiftTo] = useState("");

  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedPGCourses, setSelectedPGCourses] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);
  const [authdata, setAuthData] = useState<any>("");

  useEffect(() => {
    const auth = getCookie("authData");
    if (auth) {
      const authData = JSON.parse(auth as string);
      authData && setAuthData(authData);
    }
  }, []);
  console.log("Auth DATA ", authdata);

  const handleDateChange = (type: "from" | "to", value: string) => {
    let newHireFrom = hireFrom;
    let newHireTo = hireTo;

    if (type === "from") {
      newHireFrom = value;
      setHireFrom(value);
    } else {
      newHireTo = value;
      setHireTo(value);
    }

    if (newHireFrom && newHireTo) {
      setCalculatingPeriod(true);

      const period = calculateTimePeriod(newHireFrom, newHireTo);
      setTimePeriod(period);

      setCalculatingPeriod(false);
    }
  };

  const handlePostJob = async () => {
    setLoading(true);

    const headersList = {
      Accept: "/",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      Authorization: `Bearer ${authdata.token}`,
      "Content-Type": "application/json",
    };

    const bodyContent = JSON.stringify({
      position,
      degree: selectedDegrees.join(", "),
      postGraduateCourses: selectedPGCourses.join(", "),
      specializations: selectedSpecializations.join(", "),
      hire: hire.toUpperCase(),
      hire_from: new Date(hireFrom).toISOString(),
      hire_to: new Date(hireTo).toISOString(),
      time_period: timePeriod,
      salary,
      job_description: jobDescription,
      hospital: authdata.record.id,
      hospital_name: authdata.record.name,
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

      if (response.ok) {
        toast.success("Job posted successfully!");
        setTimeout(() => {
          setLoading(false);
          onClose();
        }, 2000);
      } else {
        toast.error("Failed to post job. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error posting job. Please check your connection.");
      setLoading(false);
    }
  };

  const convertTo12HourFormat = (time: any) => {
    const [hours, minutes] = time.split(":");
    const period = +hours >= 12 ? "PM" : "AM";
    const hour = +hours % 12 || 12;
    return `${hour}:${minutes} ${period}`;
  };

  const handleShiftTimeChange = (type: "from" | "to", value: string) => {
    if (type === "from") {
      setShiftFrom(convertTo12HourFormat(value));
    } else {
      setShiftTo(convertTo12HourFormat(value));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      style={customStyles}
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
          <label className="block font-medium dark:text-white">Position</label>
          <input
            type="text"
            placeholder="Add Position"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium dark:text-white">Hire Type</label>
          <select
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={hire}
            onChange={(e) => setHire(e.target.value)}
          >
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
          </select>
        </div>

        <div>
          <h3 className="dark:text-white">Degree</h3>
          <SelectDropDown
            data={consolidatedMedicalEducation.degrees}
            onChange={(selectedOptions: any[]) => {
              const selectedValues = selectedOptions.map(
                (option) => option.value
              );
              setSelectedDegrees(selectedValues);
            }}
          />
        </div>
        <div>
          <h3 className="dark:text-white">PG Courses</h3>
          <SelectDropDown
            data={consolidatedMedicalEducation.postgraduateCourses}
            onChange={(selectedOptions: any[]) => {
              const selectedValues = selectedOptions.map(
                (option) => option.value
              );
              setSelectedPGCourses(selectedValues);
            }}
          />
        </div>
        <div>
          <h3 className="dark:text-white">Specialisations</h3>
          <SelectDropDown
            data={consolidatedMedicalEducation.specializations}
            onChange={(selectedOptions: any[]) => {
              const selectedValues = selectedOptions.map(
                (option) => option.value
              );
              setSelectedSpecializations(selectedValues);
            }}
          />
        </div>

        {/* Additional Fields for Date, Time, and Job Description */}
        <div>
          <label className="block font-medium dark:text-white">Hire From</label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]} // Ensures the minimum date is today
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={hireFrom}
            onChange={(e) => handleDateChange("from", e.target.value)}
            onClick={(e) => {
              const input = e.target as HTMLInputElement; // Typecast to HTMLInputElement
              if (input.showPicker) input.showPicker(); // Check if showPicker exists
            }}
          />
        </div>
        <div>
          <label className="block font-medium dark:text-white">
            Shift Time From
          </label>
          <input
            type="time"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => handleShiftTimeChange("from", e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium dark:text-white">Hire To</label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]} // Ensures the minimum date is today
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={hireTo}
            onChange={(e) => handleDateChange("to", e.target.value)}
            onClick={(e) => {
              const input = e.target as HTMLInputElement; // Typecast to HTMLInputElement
              if (input.showPicker) input.showPicker(); // Check if showPicker exists
            }}
          />
        </div>
        <div>
          <label className="block font-medium dark:text-white">
            Shift Time To
          </label>
          <input
            type="time"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => handleShiftTimeChange("to", e.target.value)}
          />
        </div>

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
            type="number"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
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
