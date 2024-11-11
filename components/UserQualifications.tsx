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

const UserQualifications: React.FC<UserQualificationsProps> = ({ userId }) => {
  const [qualifications, setQualifications] = useState<UserQualification[]>([]);

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const records = await pb
          .collection("user_credentials")
          .getFullList<UserQualification>({
            filter: `user="${userId}"`,
            sort: "-created",
          });
        setQualifications(records);
      } catch (error) {
        console.error("Error fetching qualifications:", error);
      }
    };

    fetchQualifications();
  }, [userId]);

  return (
    <div className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Qualifications
      </h2>
      {qualifications.map((qual) => (
        <div
          key={qual.id}
          className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md"
        >
          <div className="mb-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 mr-2">
              Degree:
            </span>
            <Chip color="primary" variant="flat">
              {qual.degree}
            </Chip>
          </div>
          {qual.pg && (
            <div className="mb-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 mr-2">
                Post Graduation:
              </span>
              <Chip color="secondary" variant="flat">
                {qual.pg}
              </Chip>
            </div>
          )}
          {qual.specialization && (
            <div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 mr-2">
                Specialization:
              </span>
              <Chip color="success" variant="flat">
                {qual.specialization}
              </Chip>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserQualifications;
