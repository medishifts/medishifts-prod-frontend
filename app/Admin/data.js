/* eslint-disable prettier/prettier */
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
];

export { columns, users };
