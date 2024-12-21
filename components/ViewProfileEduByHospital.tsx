import React, { useState, useEffect } from "react";
import pb from "@/utils/pocketbase-connect";
import { Chip } from "@nextui-org/react";
import { RecordModel } from "pocketbase";

interface UserQualification extends RecordModel {
  degree: string;
  pg: string;
  specialization: string;
  user: string;
}

interface UserQualificationsProps {
  userId: string;
}

interface EducationDetails {
  degree: string;
  pg: string;
  specialization: string;
}

const ViewProfileEduByHospital: React.FC<UserQualificationsProps> = ({
  userId,
}) => {
  const [qualifications, setQualifications] = useState<UserQualification[]>([]);
  const [educationDetails, setEducationDetails] = useState<EducationDetails>({
    degree: "",
    pg: "",
    specialization: "",
  });

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const records = await pb
          .collection("user_credentials")
          .getFullList<UserQualification>({
            filter: `user="${userId}"`,
            sort: "-created",
          });

        // Initialize educationDetails with proper types
        const educationDetails: EducationDetails = records.reduce(
          (acc: EducationDetails, record) => {
            acc.degree = record.degree; // Assuming all records have the same degree
            acc.pg += record.pg ? `${record.pg}, ` : ""; // Append PG degrees
            acc.specialization += record.specialization
              ? `${record.specialization}, `
              : ""; // Append specializations
            return acc;
          },
          { degree: "", pg: "", specialization: "" }
        );

        // Remove trailing commas from joined strings
        educationDetails.pg = educationDetails.pg.replace(/,\s*$/, "");
        educationDetails.specialization =
          educationDetails.specialization.replace(/,\s*$/, "");

        setEducationDetails(educationDetails);
        setQualifications(records); // Assuming setQualifications is for the fetched records
      } catch (error) {
        console.error("Error fetching qualifications:", error);
      }
    };

    fetchQualifications();
  }, [userId]);

  return (
    <div>
      <p className="text-lg sm:text-xl text-gray-800 dark:text-white">
        <Chip color="primary" variant="flat">
          {educationDetails.degree || "N/A"}
        </Chip>
        <Chip color="secondary" variant="flat">
          {educationDetails.pg || "N/A"}
        </Chip>
        <Chip color="success" variant="flat">
          {educationDetails.specialization || "N/A"}
        </Chip>
      </p>
    </div>
  );
};

export default ViewProfileEduByHospital;
