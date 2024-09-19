import React, { useState, useEffect } from "react";
import pb from "@/utils/pocketbase-connect";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
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
    <div className="mt-8">
      <Table
        aria-label="User educational qualifications"
        className="border-collapse border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
      >
        <TableHeader>
          <TableColumn className="text-xs md:text-sm font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 py-2 px-4 rounded-tl-lg">
            DEGREE
          </TableColumn>
          <TableColumn className="text-xs md:text-sm font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 py-2 px-4">
            POST GRADUATION
          </TableColumn>
          <TableColumn className="text-xs md:text-sm font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 py-2 px-4 rounded-tr-lg">
            SPECIALIZATION
          </TableColumn>
        </TableHeader>
        <TableBody>
          {qualifications.map((qual, index) => (
            <TableRow
              key={qual.id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-300`}
            >
              <TableCell className="py-3 px-4 text-sm md:text-base text-gray-700 dark:text-gray-300">
                {qual.degree}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm md:text-base text-gray-700 dark:text-gray-300">
                {qual.pg}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm md:text-base text-gray-700 dark:text-gray-300">
                {qual.specialization}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserQualifications;
