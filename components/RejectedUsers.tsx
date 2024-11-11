"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Tooltip,
  Button,
  Chip,
  ChipProps,
  Input,
} from "@nextui-org/react";
import pb from "@/utils/pocketbase-connect";
import { toast } from "react-hot-toast";
import UserQualifications from "@/components/UserQualifications";

// Define the color map with valid values
const statusColorMap: Record<string, ChipProps["color"]> = {
  true: "success", // When admin_verified is true
  false: "danger", // When admin_verified is false
};

type User = {
  pointOfContact: string;
  disapprove_message: string;
  id: string;
  name: string;
  profile: string;
  role: string;
  address: string;
  selectedSpecializations: string;
  admin_verified: boolean;
  email: string;
  mobile: number;
  registrationNumber: string;
  selectedCouncil: string;
  selectedDegrees: string;
  registrationCertificate: string;
  degreeCertificate: string;
  city: string;
  state: string;
  dob: string;
  bio: string;
  mobile_verified: boolean;
  verified: boolean;
  hospital_document: string;
  experience: string;
  experienceYears: string;
};

export default function RejectedUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "disapprove">();
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);

  const backendApi = process.env.NEXT_PUBLIC_BACKEND_API;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultList = await pb.collection("reject_list").getList(1, 50);
        console.log(resultList);

        const usersData = resultList.items.map((item: any) => ({
          id: item.id,
          address: item.address,
          name: item.name,
          profile: `${backendApi}/api/files/${item.collectionId}/${item.id}/${item.profile}`,
          role: item.role,
          selectedSpecializations: item.selectedSpecializations,
          admin_verified: item.admin_verified,
          email: item.email,
          mobile: item.mobile,
          registrationNumber: item.registrationNumber,
          selectedCouncil: item.selectedCouncil,
          selectedDegrees: item.selectedDegrees,
          registrationCertificate: `${backendApi}/api/files/${item.collectionId}/${item.id}/${item.registration_certificate}`,
          degreeCertificate: `${backendApi}/api/files/${item.collectionId}/${item.id}/${item.degree_certificate}`,
          city: item.city,
          state: item.state,
          dob: item.dob,
          experience: item.experience,
          experienceYears: item.experienceYears,
          bio: item.bio,
          mobile_verified: item.mobile_verified,
          verified: item.verified,
          hospital_document: `${backendApi}/api/files/${item.collectionId}/${item.id}/${item.hospital_document}`,
          disapprove_message: item.disapprove_message,
          pointOfContact: item.pointOfContact,
        }));

        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch data from PocketBase", error);
      }
    };

    fetchData();
  }, [backendApi]);

  const handleView = async (id: string) => {
    try {
      const user = await pb.collection("users").getOne(id);
      setSelectedUser({
        id: user.id,
        selectedSpecializations: user.selectedSpecializations,
        name: user.name,
        profile: `${backendApi}/api/files/${user.collectionId}/${user.id}/${user.profile}`,
        role: user.role,
        admin_verified: user.admin_verified,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        registrationNumber: user.registrationNumber,
        selectedCouncil: user.selectedCouncil,
        selectedDegrees: user.selectedDegrees,
        registrationCertificate: `${backendApi}/api/files/${user.collectionId}/${user.id}/${user.registration_certificate}`,
        degreeCertificate: `${backendApi}/api/files/${user.collectionId}/${user.id}/${user.degree_certificate}`,
        mobile_verified: user.mobile_verified,
        verified: user.verified,
        city: user.city,
        state: user.state,
        dob: user.dob,
        bio: user.bio,
        // hospital_document: user.hospital_document,
        hospital_document: `${backendApi}/api/files/${user.collectionId}/${user.id}/${user.hospital_document}`,
        experience: user.experience,
        experienceYears: user.experienceYears,
        disapprove_message: user.disapprove_message,
        pointOfContact: user.pointOfContact,
      });
      setIsUserDetailsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch user details", error);
    }
  };

  const pages = Math.ceil(users.length / rowsPerPage);

  // Paginate the fetched users data
  const items = users.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Disapproved Users</h1>
      {/* <h4 className="text-orange-400">This is in Building Stage</h4> */}
      <div className="mb-4">
        <Input
          isClearable
          fullWidth
          color="primary"
          size="lg"
          variant="underlined"
          placeholder="Search by name"
        />
      </div>
      <Table aria-label="Table with client-side pagination and approval actions">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Role</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Reason for Rejection</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center">
                  <img
                    src={item.profile}
                    alt={item.name}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  {item.name}
                </div>
              </TableCell>

              <TableCell>{item.role}</TableCell>

              <TableCell>
                <Chip
                  className="capitalize"
                  color={
                    statusColorMap[
                      String(item.admin_verified)
                    ] as ChipProps["color"]
                  }
                  size="sm"
                  variant="flat"
                >
                  {item.admin_verified ? "Verified" : "Not Verified"}
                </Chip>
              </TableCell>
              <TableCell>{item.disapprove_message}</TableCell>

              <TableCell>
                <div className="flex gap-2">
                  <Tooltip content="View">
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => handleView(item.id)}
                    >
                      View
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isUserDetailsModalOpen &&
        selectedUser &&
        selectedUser.role === "HOSPITAL" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
                  Hospital Details
                </h2>
              </div>

              <div className="flex flex-col md:flex-row items-center mb-8">
                <img
                  src={selectedUser.profile}
                  alt={selectedUser.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-4 md:mb-0 md:mr-6 border-4 border-blue-500 dark:border-blue-400 shadow-lg"
                />
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">
                    {selectedUser.name}
                  </h3>
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    {selectedUser.role}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Point of Contact
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedUser.pointOfContact}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Contact Information
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Mobile:</strong> {selectedUser.mobile}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Status
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Admin Verified:</strong>{" "}
                    <span
                      className={
                        selectedUser.admin_verified
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {selectedUser.admin_verified
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Mobile Verified</strong>{" "}
                    <span
                      className={
                        selectedUser.mobile_verified
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {selectedUser.mobile_verified
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </p>
                </div>

                {selectedUser.address && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                    <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                      Address
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Address:</strong> {selectedUser.address}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>City:</strong> {selectedUser.city}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>State:</strong> {selectedUser.state}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Date of Establishment:
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedUser.dob
                      ? new Date(selectedUser.dob).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Bio
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedUser.bio || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Document Links
                  </h4>
                  <ul className="space-y-3">
                    {selectedUser.hospital_document && (
                      <li>
                        <a
                          href={selectedUser.hospital_document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition duration-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m7.5 0H6.75M19.5 15.75v3a2.25 2.25 0 01-2.25 2.25h-10.5A2.25 2.25 0 014.5 18.75v-3M19.5 15.75a2.25 2.25 0 00-2.25-2.25h-10.5a2.25 2.25 0 00-2.25 2.25m15 0V9.75m0 6v-3m-15 3v-3"
                            />
                          </svg>
                          Hospital Document
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  onClick={() => setIsUserDetailsModalOpen(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-8 py-3 rounded-full transition duration-300 ease-in-out text-lg font-semibold shadow-md"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

      {isUserDetailsModalOpen &&
        selectedUser &&
        selectedUser.role === "DOCTOR" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
                  User Details
                </h2>
              </div>
              <div className="flex flex-col md:flex-row items-center mb-8">
                <img
                  src={selectedUser.profile}
                  alt={selectedUser.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-4 md:mb-0 md:mr-6 border-4 border-blue-500 dark:border-blue-400 shadow-lg object-cover"
                />
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">
                    {selectedUser.name}
                  </h3>
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    {selectedUser.role}
                  </p>
                </div>
              </div>
              <div className="space-y-8">
                {/* Contact Information */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Contact Information
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Mobile:</strong> {selectedUser.mobile}
                  </p>
                </div>

                {/* Status */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Status
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Admin Verified:</strong>{" "}
                    <span
                      className={
                        selectedUser.admin_verified
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {selectedUser.admin_verified
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Mobile Verified</strong>{" "}
                    <span
                      className={
                        selectedUser.mobile_verified
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {selectedUser.mobile_verified
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </p>
                </div>

                {/* Address */}
                {selectedUser.address && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                    <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                      Address
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Address:</strong> {selectedUser.address}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>City:</strong> {selectedUser.city}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>State:</strong> {selectedUser.state}
                    </p>
                  </div>
                )}

                {/* Date of Establishment */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Date of Birth:
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedUser.dob
                      ? new Date(selectedUser.dob).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* Bio */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Bio
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedUser.bio || "N/A"}
                  </p>
                </div>

                {/* Degree and Specializations */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Degree and Specializations
                  </h4>
                  <UserQualifications userId={selectedUser.id} />
                </div>

                {/* Experience */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Experience
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Experience:</strong>{" "}
                    {selectedUser.experience ? selectedUser.experience : "N/A"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Experience in Years:</strong>{" "}
                    {selectedUser.experienceYears
                      ? selectedUser.experienceYears
                      : "N/A"}{" "}
                    years
                  </p>
                </div>

                {/* Registration Number and Council */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Registration Number and Council
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Registration Number:</strong>{" "}
                    {selectedUser.registrationNumber
                      ? selectedUser.registrationNumber
                      : "N/A"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Council:</strong>{" "}
                    {selectedUser.selectedCouncil
                      ? selectedUser.selectedCouncil
                      : "N/A"}
                  </p>
                </div>

                {/* Document Links */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Document Links
                  </h4>
                  <ul className="space-y-3">
                    {selectedUser.degreeCertificate && (
                      <li>
                        <a
                          href={selectedUser.degreeCertificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition duration-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m7.5 0H6.75M19.5 15.75v3a2.25 2.25 0 01-2.25 2.25h-10.5A2.25 2.25 0 014.5 18.75v-3M19.5 15.75a2.25 2.25 0 00-2.25-2.25h-10.5a2.25 2.25 0 00-2.25 2.25m15 0V9.75m0 6v-3m-15 3v-3"
                            />
                          </svg>
                          Degree Certificate
                        </a>
                      </li>
                    )}
                    {selectedUser.registrationCertificate && (
                      <li>
                        <a
                          href={selectedUser.registrationCertificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition duration-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m7.5 0H6.75M19.5 15.75v3a2.25 2.25 0 01-2.25 2.25h-10.5A2.25 2.25 0 014.5 18.75v-3M19.5 15.75a2.25 2.25 0 00-2.25-2.25h-10.5a2.25 2.25 0 00-2.25 2.25m15 0V9.75m0 6v-3m-15 3v-3"
                            />
                          </svg>
                          Registration Certificate
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setIsUserDetailsModalOpen(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-8 py-3 rounded-full transition duration-300 ease-in-out text-lg font-semibold shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      {isUserDetailsModalOpen &&
        selectedUser &&
        selectedUser.role === "NURSE" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
                  User Details
                </h2>
              </div>
              <div className="flex flex-col md:flex-row items-center mb-8">
                <img
                  src={selectedUser.profile}
                  alt={selectedUser.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-4 md:mb-0 md:mr-6 border-4 border-blue-500 dark:border-blue-400 shadow-lg object-cover"
                />
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">
                    {selectedUser.name}
                  </h3>
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    {selectedUser.role}
                  </p>
                </div>
              </div>
              <div className="space-y-8">
                {/* Contact Information */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Contact Information
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Mobile:</strong> {selectedUser.mobile}
                  </p>
                </div>

                {/* Status */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Status
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Admin Verified:</strong>{" "}
                    <span
                      className={
                        selectedUser.admin_verified
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {selectedUser.admin_verified
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Mobile Verified</strong>{" "}
                    <span
                      className={
                        selectedUser.mobile_verified
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {selectedUser.mobile_verified
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </p>
                </div>

                {/* Address */}
                {selectedUser.address && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                    <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                      Address
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Address:</strong> {selectedUser.address}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>City:</strong> {selectedUser.city}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>State:</strong> {selectedUser.state}
                    </p>
                  </div>
                )}

                {/* Date of Establishment */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Date of Birth:
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedUser.dob
                      ? new Date(selectedUser.dob).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* Bio */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Bio
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedUser.bio || "N/A"}
                  </p>
                </div>

                {/* Degree and Specializations */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Degree and Specializations
                  </h4>
                  <UserQualifications userId={selectedUser.id} />
                </div>

                {/* Experience */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Experience
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Experience:</strong>{" "}
                    {selectedUser.experience ? selectedUser.experience : "N/A"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Experience in Years:</strong>{" "}
                    {selectedUser.experienceYears
                      ? selectedUser.experienceYears
                      : "N/A"}{" "}
                    years
                  </p>
                </div>

                {/* Registration Number and Council */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Registration Number and Council
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Registration Number:</strong>{" "}
                    {selectedUser.registrationNumber
                      ? selectedUser.registrationNumber
                      : "N/A"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Council:</strong>{" "}
                    {selectedUser.selectedCouncil
                      ? selectedUser.selectedCouncil
                      : "N/A"}
                  </p>
                </div>

                {/* Document Links */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-3">
                    Document Links
                  </h4>
                  <ul className="space-y-3">
                    {selectedUser.degreeCertificate && (
                      <li>
                        <a
                          href={selectedUser.degreeCertificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition duration-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m7.5 0H6.75M19.5 15.75v3a2.25 2.25 0 01-2.25 2.25h-10.5A2.25 2.25 0 014.5 18.75v-3M19.5 15.75a2.25 2.25 0 00-2.25-2.25h-10.5a2.25 2.25 0 00-2.25 2.25m15 0V9.75m0 6v-3m-15 3v-3"
                            />
                          </svg>
                          Degree Certificate
                        </a>
                      </li>
                    )}
                    {selectedUser.registrationCertificate && (
                      <li>
                        <a
                          href={selectedUser.registrationCertificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition duration-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m7.5 0H6.75M19.5 15.75v3a2.25 2.25 0 01-2.25 2.25h-10.5A2.25 2.25 0 014.5 18.75v-3M19.5 15.75a2.25 2.25 0 00-2.25-2.25h-10.5a2.25 2.25 0 00-2.25 2.25m15 0V9.75m0 6v-3m-15 3v-3"
                            />
                          </svg>
                          Registration Certificate
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setIsUserDetailsModalOpen(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-8 py-3 rounded-full transition duration-300 ease-in-out text-lg font-semibold shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      <div className="flex justify-center mt-4">
        <Pagination
          total={pages}
          initialPage={1}
          onChange={(page) => setPage(page)}
        />
      </div>
      {/* <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onClose={() => setIsModalOpen(false)}
        title={`Confirm ${
          modalAction === "approve" ? "Approval" : "Disapproval"
        }`}
        message={`Are you sure you want to ${
          modalAction === "approve" ? "approve" : "disapprove"
        } this hospital?`}
      /> */}
    </div>
  );
}
