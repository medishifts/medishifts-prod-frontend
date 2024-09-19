import React, { useState, useEffect } from "react";
import pb from "@/utils/pocketbase-connect";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import { RecordModel } from "pocketbase";
import { DeleteIcon } from "./DeleteIcon";
// import { Trash2 } from "react-icons";

interface UserCredential extends RecordModel {
  degree: string;
  pg: string;
  specialization: string;
  user: string;
}

interface EducationalQualificationsTableProps {
  userId: string;
  triggerRefetch: number;
  onDelete: () => void;
}

const EducationalQualificationsTable: React.FC<
  EducationalQualificationsTableProps
> = ({ userId, triggerRefetch, onDelete }) => {
  const [qualifications, setQualifications] = useState<UserCredential[]>([]);

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const records = await pb
          .collection("user_credentials")
          .getFullList<UserCredential>({
            filter: `user="${userId}"`,
            sort: "-created",
          });
        setQualifications(records);
      } catch (error) {
        console.error("Error fetching qualifications:", error);
      }
    };

    fetchQualifications();
  }, [userId, triggerRefetch]);

  const handleDelete = async (id: string) => {
    try {
      await pb.collection("user_credentials").delete(id);
      setQualifications(qualifications.filter((qual) => qual.id !== id));
      onDelete();
    } catch (error) {
      console.error("Error deleting qualification:", error);
    }
  };

  return (
    <div className="mt-8 text-black dark:text-white">
      <h2 className="text-sm font-bold mb-4">Selected Qualifications</h2>
      <Table aria-label="Educational qualifications table">
        <TableHeader>
          <TableColumn>DEGREE</TableColumn>
          <TableColumn>PG</TableColumn>
          <TableColumn>SPECIALIZATION</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {qualifications.map((qual) => (
            <TableRow key={qual.id}>
              <TableCell>{qual.degree}</TableCell>
              <TableCell>{qual.pg}</TableCell>
              <TableCell>{qual.specialization}</TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  color="danger"
                  aria-label="Delete"
                  onClick={() => handleDelete(qual.id)}
                >
                  <DeleteIcon size={20} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EducationalQualificationsTable;
