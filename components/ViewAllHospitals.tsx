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
import { ConfirmationModal } from "./ConfirmationModal.tsx";
import { toast } from "react-hot-toast";
import { Star } from "lucide-react";

// Define the color map with valid values
const statusColorMap: Record<string, ChipProps["color"]> = {
  true: "success", // When admin_verified is true
  false: "danger", // When admin_verified is false
};

type User = {
  id: string;
  name: string;
  profile: string;
  role: string;
  admin_verified: boolean;
  email: string;
  mobile: number;
  hospital_document: string;
  pointOfContact: string;
  address: string;
  city: string;
  state: string;
  dob: string;
  bio: string;
  degree_certificate: string;
  registration_certificate: string;
  mobile_verified: boolean;
  verified: boolean;
  avg_rating: number;
};

export default function ApproveProfessionals() {
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
        const resultList = await pb
          .collection("admin_view_hospitals_verification")
          .getList(1, 50, {
            filter: "is_email_verified=true && admin_verified=true",
          });
        console.log(resultList);
        const usersData = resultList.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          profile: `${backendApi}/api/files/${item.collectionId}/${item.id}/${item.profile}`,
          role: item.role,
          admin_verified: item.admin_verified,
          email: item.email,
          mobile: item.mobile,
          hospital_document: `${backendApi}/api/files/${item.collectionId}/${item.id}/${item.hospital_document}`,
          pointOfContact: item.pointOfContact,
          address: item.address,
          city: item.city,
          state: item.state,
          dob: item.dob,
          bio: item.bio,
          degree_certificate: item.degree_certificate,
          registration_certificate: item.registration_certificate,
          mobile_verified: item.mobile_verified,
          verified: item.verified,
          avg_rating: item.average_rating,
        }));

        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch data from PocketBase", error);
      }
    };

    fetchData();
  }, [backendApi]);

  // Calculate the total number of pages based on the fetched users
  const pages = Math.ceil(users.length / rowsPerPage);

  // Paginate the fetched users data
  const items = users.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleApprove = async (id: string) => {
    setSelectedUserId(id);
    setModalAction("approve");
    setIsModalOpen(true);
  };

  const handleDisapprove = async (id: string) => {
    setSelectedUserId(id);
    setModalAction("disapprove");
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    const token = pb.authStore.token;
    if (!selectedUserId) return;
    const is_verified = modalAction === "approve";
    const bodyContent = JSON.stringify({
      id: selectedUserId,
      is_verified,
    });

    const headersList = {
      Accept: "/",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/admin/verify-user`, {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      }).then(async (response) => {
        if (response.ok) {
          // Update the users state to reflect the change
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === selectedUserId
                ? { ...user, admin_verified: is_verified }
                : user
            )
          );
        } else {
          throw new Error("Failed to update the Hospital");
        }
      }),
      {
        loading: "Processing...",
        success: is_verified
          ? "Hospital approved successfully!"
          : "Hospital disapproved successfully!",
        error: "Failed to update the Hospital status",
      }
    );

    setIsModalOpen(false);
    setSelectedUserId(undefined);
    setModalAction(undefined);
  };

  const handleView = async (id: string) => {
    try {
      const user = await pb.collection("users").getOne(id);
      console.log(user);
      setSelectedUser({
        id: user.id,
        name: user.name,
        profile: `${backendApi}/api/files/${user.collectionId}/${user.id}/${user.profile}`,
        role: user.role,
        admin_verified: user.admin_verified,
        email: user.email,
        mobile: user.mobile,
        hospital_document: `${backendApi}/api/files/${user.collectionId}/${user.id}/${user.hospital_document}`,
        pointOfContact: user.pointOfContact,
        address: user.address,
        city: user.city,
        state: user.state,
        dob: user.dob,
        bio: user.bio,
        degree_certificate: user.degree_certificate,
        registration_certificate: user.registration_certificate,
        mobile_verified: user.mobile_verified,
        verified: user.verified,
        avg_rating: user.average_rating,
      });
      setIsUserDetailsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch user details", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">View Hospitals</h1>
      <div className="mb-4">
        <Input
          isClearable
          fullWidth
          color="primary"
          size="lg"
          variant="underlined"
          placeholder="Search by name"
          // value={searchQuery}
          // onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Table
        aria-label="Table with client-side pagination and approval actions"
        className="min-w-full"
        shadow="md"
      >
        <TableHeader>
          <TableColumn width="25%" className="text-sm font-semibold">
            Name
          </TableColumn>
          <TableColumn width="15%" className="text-sm font-semibold">
            Role
          </TableColumn>
          <TableColumn width="15%" className="text-sm font-semibold">
            Status
          </TableColumn>
          <TableColumn width="20%" className="text-sm font-semibold">
            Certificates
          </TableColumn>
          <TableColumn width="25%" className="text-sm font-semibold">
            Actions
          </TableColumn>
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
              <TableCell>
                <div className="flex flex-col">
                  <p className="font-bold text-sm capitalize">{item.role}</p>
                </div>
              </TableCell>
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

              <TableCell>
                <div className="flex flex-col">
                  <a
                    href={item.hospital_document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    Hospital Document
                  </a>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Tooltip content="View">
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => handleView(item.id)}
                    >
                      View
                    </Button>
                  </Tooltip>

                  <Tooltip content="Delete User">
                    <Button
                      size="sm"
                      color="danger"
                      // onClick={() => handleDelete(item.id)}
                    >
                      Delete User
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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

      {/* Modal to show the detailed view of the selected user */}
      {isUserDetailsModalOpen && selectedUser && (
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
                <div className="flex flex-row items-center justify-center md:justify-start ">
                  <Star color="#FFD700" fill="#FFD700" />
                  <p className="font-bold dark:text-white text-black sm:text-black  ml-2 sm:ml-0">
                    {selectedUser?.avg_rating} Overall Rating
                  </p>
                </div>
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
                    {selectedUser.admin_verified ? "Verified" : "Not Verified"}
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
                    {selectedUser.mobile_verified ? "Verified" : "Not Verified"}
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
                  {selectedUser.degree_certificate && (
                    <li>
                      <a
                        href={selectedUser.degree_certificate}
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
                  {selectedUser.registration_certificate && (
                    <li>
                      <a
                        href={selectedUser.registration_certificate}
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
    </div>
  );
}
