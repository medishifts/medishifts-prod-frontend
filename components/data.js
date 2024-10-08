import React from "react";

const columns = [
  { name: "PROFILE IMAGE", uid: "avatar" },
  { name: "NAME", uid: "name" },
  { name: "EMAIL", uid: "email" },
  { name: "ROLE", uid: "role" },
  { name: "TEAM", uid: "team" },
  { name: "JOINED DATE", uid: "joined" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const users = [
  {
    id: 1,
    name: "Dr. Tony Reichert",
    role: "doctor",
    regNo: "D12345",
    team: "Cardiology",
    joined: "2020-01-15",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "City Hospital",
    role: "hospital",
    regNo: "H67890",
    team: "Healthcare",
    joined: "2019-06-25",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "info@cityhospital.com",
  },
  {
    id: 3,
    name: "Dr. Zoey Lang",
    role: "doctor",
    regNo: "D67890",
    team: "Neurology",
    joined: "2021-03-10",
    status: "not verified",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    email: "zoey.lang@example.com",
  },
  {
    id: 4,
    name: "Green Valley Hospital",
    role: "hospital",
    regNo: "H12345",
    team: "Healthcare",
    joined: "2020-11-01",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026701d",
    email: "contact@greenvalley.com",
  },
  {
    id: 5,
    name: "Dr. Jane Fisher",
    role: "doctor",
    regNo: "D54321",
    team: "Pediatrics",
    joined: "2018-07-19",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 6,
    name: "Central Clinic",
    role: "hospital",
    regNo: "H98765",
    team: "Healthcare",
    joined: "2017-02-14",
    status: "not verified",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "info@centralclinic.com",
  },
  {
    id: 7,
    name: "Dr. Alice Walker",
    role: "doctor",
    regNo: "D11111",
    team: "Orthopedics",
    joined: "2022-05-23",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026702d",
    email: "alice.walker@example.com",
  },
  {
    id: 8,
    name: "Sunset Hospital",
    role: "hospital",
    regNo: "H22222",
    team: "Emergency",
    joined: "2021-09-17",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026703d",
    email: "contact@sunsethospital.com",
  },
  {
    id: 9,
    name: "Dr. Michael Johnson",
    role: "doctor",
    regNo: "D33333",
    team: "Oncology",
    joined: "2019-11-05",
    status: "not verified",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026704d",
    email: "michael.johnson@example.com",
  },
  {
    id: 10,
    name: "Mountain View Clinic",
    role: "hospital",
    regNo: "H44444",
    team: "Family Medicine",
    joined: "2020-02-18",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026705d",
    email: "info@mountainviewclinic.com",
  },
  {
    id: 11,
    name: "Dr. Emily Davis",
    role: "doctor",
    regNo: "D55555",
    team: "Dermatology",
    joined: "2016-08-29",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026706d",
    email: "emily.davis@example.com",
  },
  {
    id: 12,
    name: "Eastside Hospital",
    role: "hospital",
    regNo: "H55555",
    team: "Pediatrics",
    joined: "2022-12-05",
    status: "not verified",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026707d",
    email: "info@eastsidehospital.com",
  },
  {
    id: 13,
    name: "Dr. Tony Stark",
    role: "doctor",
    regNo: "D12345",
    team: "Cardiology",
    joined: "2020-01-15",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 14,
    name: "Dr. Anshuman Panda",
    role: "doctor",
    regNo: "D12345",
    team: "Cardiology",
    joined: "2020-01-15",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 15,
    name: "Dr. Subhranshu Chou",
    role: "doctor",
    regNo: "D12345",
    team: "Cardiology",
    joined: "2020-01-15",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 15,
    name: "Dr. Subash Rout",
    role: "doctor",
    regNo: "D12345",
    team: "Cardiology",
    joined: "2020-01-15",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 16,
    name: "Dr. Amarendra Rout",
    role: "doctor",
    regNo: "D12345",
    team: "Cardiology",
    joined: "2020-01-15",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 17,
    name: "Dr. Abhisek Rout",
    role: "doctor",
    regNo: "D12345",
    team: "Cardiology",
    joined: "2020-01-15",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 18,
    name: "Dr. Wonder Woman",
    role: "doctor",
    regNo: "D12345",
    team: "Cardiology",
    joined: "2020-01-15",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 18,
    name: "Dr. Deadpool",
    role: "doctor",
    regNo: "D12345",
    team: "Cardiology",
    joined: "2020-01-15",
    status: "verified",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
];

export { columns, users };
