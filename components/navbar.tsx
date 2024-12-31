"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import NextLink from "next/link";
import ReactLoading from "react-loading";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import LoginModal from "./LoginModal";
import pb from "@/utils/pocketbase-connect";
import { getCookie } from "cookies-next";
import { AppDispatch, useAppSelector } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import { resetProfile } from "@/app/redux/features/profile-slice";
import { FaBell } from "react-icons/fa";
import { UserIcon } from "lucide-react";
import { setNotifications } from "@/app/redux/features/notifications-slice";
import {
  fetchEducationRecords,
  createEducationRecord,
  updateEducationRecordById,
  deleteEducationRecord,
} from "@/app/redux/features/education-slice";

interface User {
  name: string;
}

type NotificationRecord = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  message: string;
  read_receipt: string;
  sender: string;
  title: string;
  updated: string;
  url: string;
  user: string;
};

type NotificationItem = NotificationRecord;

type EducationType = "degree" | "pg" | "specialization";

interface Education {
  degree: string;
  pg: string;
  specialization: string;
}

export const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const name = useAppSelector((state) => state.profileReducer.value.name);
  const role = useAppSelector((state) => state.profileReducer.value.role);
  const id = useAppSelector((state) => state.profileReducer.value.id);
  const education = useAppSelector((state) => state.educationReducer);
  // const degree = useAppSelector((state) => state.educationReducer.degree);
  // const pg = useAppSelector((state) => state.educationReducer.pg);
  const spec = useAppSelector((state) => state.educationReducer.records);

  const notifications = useAppSelector(
    (state) => state.notificationReducer.notifications
  );
  const unreadNotifications = useAppSelector(
    (state) => state.notificationReducer.unreadCount
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userType, setUserType] = useState("admin");
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const records = useAppSelector((state: any) => state.education);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // const [userInitials, setUserInitials] = useState("DR");

  useEffect(() => {
    dispatch(fetchEducationRecords(id));
  }, [id, dispatch]);
  console.log("Education from Redux", spec);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  function extractFirstName(fullName: string) {
    // Use a regular expression to optionally match "Dr." and extract the first name
    const match = fullName.match(/(?:Dr\.?\s*)?(\w+)/);
    return match ? match[1] : fullName;
  }
  // Redux for Educational Details
  // useEffect(() => {
  //   updateEducation();
  //   if (id) {
  //     dispatch(fetchEducationDetails(id));
  //   }
  // }, [dispatch, id]);

  // Function to update education details
  // const updateEducation = async () => {
  //   try {
  //     const records = await pb.collection("user_credentials").getFullList({
  //       filter: `user="${id}"`,
  //       sort: "-created",
  //     });

  //     if (records.length > 0) {
  //       const record = records[0];
  //       const educationData = {
  //         degree: record.degree || "",
  //         pg: record.pg || "",
  //         specialization: record.specialization || "",
  //       };

  //       dispatch(updateEducationDetails(id, educationData));
  //     }
  //   } catch (error) {
  //     console.error("Error updating education details:", error);
  //   }
  // };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    await pb.authStore.clear();
    dispatch(resetProfile());
    setUser(null);
    setLoading(false);
    window.location.href = "/";
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };
  useEffect(() => {
    if (role === "HOSPITAL") {
      setUserType("hospital");
    } else if (role === "DOCTOR") {
      setUserType("doctor");
    } else if (role === "NURSE") {
      setUserType("nurse");
    }
  });

  // console.log("Notification from Redux", notifications);

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = pb.authStore.model;
      if (auth && typeof auth === "object" && "name" in auth) {
        setUser({ name: auth.name });
      }
    };
    checkAuth();
  }, []);
  const getNoti = async () => {
    try {
      const records: any = await pb
        .collection("notifications")
        .getFullList<NotificationRecord>({
          filter: "read_receipt != 'READ'",
        });

      // Map PocketBase records to NotificationItem type
      //@ts-ignore
      const notifications: NotificationItem[] = records.map((record) => ({
        id: record.id,
        collectionId: record.collectionId,
        collectionName: record.collectionName,
        created: record.created,
        message: record.message,
        read_receipt: record.read_receipt,
        sender: record.sender,
        title: record.title,
        updated: record.updated,
        url: record.url,
        user: record.user,
      }));

      dispatch(setNotifications(notifications));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      dispatch(setNotifications([]));
    }
  };

  useEffect(() => {
    getNoti();
  }, []);

  useEffect(() => {
try {
  const unsubscribe = pb
    .collection("notifications")
    .subscribe("*", async function (e) {
      await getNoti();
      // if (e.action === "create") {
      //   toast.success("New notification Received", {
      //     icon: "🔔",
      //   });
      // }
    });
} catch (error) {
  console.error("Error fetching notifications:", error);
}

   

    return () => {
      pb.collection("notifications").unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((auth) => {
      if (auth) {
        setUser({ name: auth });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <ReactLoading type="spin" color="#ffffff" height={100} width={100} />
        </div>
      )}

      <NextUINavbar maxWidth="xl" position="sticky">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-1 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              <img
                src="/logo.png"
                alt="Medishifts Logo"
                className="h-8 w-8 object-contain"
              />

              <p className="font-bold text-inherit">Medishifts</p>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
          <NavbarItem className="hidden sm:flex gap-2">
            {user && name ? (
              <div className="flex items-center gap-x-4">
                <div className="relative flex items-center">
                  <a
                    className="relative inline-flex items-center"
                    href={`/${userType}-dashboard?page=notification`}
                  >
                    <FaBell
                      size={24}
                      className={`text-gray-800 dark:text-white transition-colors duration-300 ${
                        unreadNotifications > 0
                          ? "animate-pulse text-blue-600 dark:text-blue-400"
                          : "hover:text-blue-700 dark:hover:text-blue-500"
                      }`}
                    />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadNotifications > 99 ? "99+" : unreadNotifications}
                      </span>
                    )}
                  </a>
                </div>

                <div className="relative" ref={dropdownRef}>
                  <span
                    className="rounded-lg text-sm font-bold cursor-pointer px-4 py-2 transition-all duration-300 ease-in-out flex items-center gap-2"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                      backgroundColor: dropdownOpen
                        ? "rgba(229, 231, 235, 1)"
                        : "rgba(31, 41, 55, 1)",
                      color: dropdownOpen ? "#1F2937" : "#E5E7EB",
                    }}
                  >
                    <UserIcon size={18} /> {name}
                  </span>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-25 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50">
                      <ul className="py-2">
                        <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                          <button
                            className="w-full text-left"
                            onClick={() => {
                              if (role === "HOSPITAL") {
                                window.location.href = "/hospital-dashboard";
                              } else if (role === "DOCTOR") {
                                window.location.href = "/doctor-dashboard";
                              } else if (role === "NURSE") {
                                window.location.href = "/nurse-dashboard";
                              }
                            }}
                          >
                            Profile
                          </button>
                        </li>
                        {/* <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                          <button
                            className="w-full text-left"
                            onClick={() => {
                              if (role === "HOSPITAL") {
                                window.location.href =
                                  "/hospital-dashboard?page=edit-profile";
                              } else if (role === "DOCTOR") {
                                window.location.href =
                                  "/doctor-dashboard?page=edit-profile";
                              } else if (role === "NURSE") {
                                window.location.href =
                                  "/nurse-dashboard?page=edit-profile";
                              }
                            }}
                          >
                            Edit Profile
                          </button>
                        </li> */}
                        {/* hospital-dashboard?page=hired-professionals */}
                        {role === "HOSPITAL" && (
                          <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                            <button
                              className="w-full text-left"
                              onClick={() => {
                                window.location.href =
                                  "/hospital-dashboard?page=hired-professionals";
                              }}
                            >
                              Your hirings
                            </button>
                          </li>
                        )}
                        {role === "HOSPITAL" && (
                          <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                            <button
                              className="w-full text-left"
                              onClick={() => {
                                window.location.href =
                                  "/hospital-dashboard?page=hired-professionals";
                              }}
                            >
                              Jobs
                            </button>
                          </li>
                        )}

                        <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                          <button
                            className="w-full text-left"
                            onClick={handleSignOut}
                          >
                            Log out
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Button
                className="text-sm font-normal text-default-600 bg-default-100"
                onClick={handleModalOpen}
                variant="flat"
              >
                Login | Signup
              </Button>
            )}
            <ThemeSwitch />
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="sm:hidden basis-1 pr-2" justify="end">
          {name ? (
            <div className="flex items-center gap-x-1">
              <div className="relative flex items-center">
                <a
                  className="relative inline-flex items-center"
                  href={`/${userType}-dashboard?page=notification`}
                >
                  <FaBell
                    size={22}
                    className={`text-gray-800 dark:text-white transition-colors duration-300 ${
                      unreadNotifications > 0
                        ? "animate-pulse text-blue-600 dark:text-blue-400"
                        : "hover:text-blue-700 dark:hover:text-blue-500"
                    }`}
                  />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications > 99 ? "99+" : unreadNotifications}
                    </span>
                  )}
                </a>
              </div>

              <span className="flex items-center rounded-lg text-sm font-bold cursor-pointer px-2 py-2 transition-all duration-300 ease-in-out">
                <UserIcon size={18} />
                <span className="ml-2">{extractFirstName(name)}</span>
              </span>
            </div>
          ) : (
            <Button
              className="text-sm font-normal text-default-600 bg-default-100"
              onClick={handleModalOpen}
              variant="flat"
            >
              Login | Signup
            </Button>
          )}
          <ThemeSwitch />
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarMenu>
          <div className="mx-4 mt-2 flex flex-col gap-2">
            {/* {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  color={
                    index === 2
                      ? "primary"
                      : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                  }
                  href={item.href}
                  size="lg"
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))} */}
            {user && (
              <div className="flex w-full flex-col gap-2">
                <NavbarMenuItem>
                  <Button
                    className="text-sm font-normal text-default-600 bg-default-100"
                    onClick={() => {
                      if (role === "HOSPITAL") {
                        window.location.href = "/hospital-dashboard";
                      } else if (role === "DOCTOR") {
                        window.location.href = "/doctor-dashboard";
                      } else if (role === "NURSE") {
                        window.location.href = "/nurse-dashboard";
                      }
                    }}
                  >
                    Profile
                  </Button>
                </NavbarMenuItem>
                {role === "DOCTOR" && (
                  <>
                    <NavbarMenuItem>
                      <Button
                        className="text-sm font-normal text-default-600 bg-default-100"
                        onClick={() => {
                          window.location.href =
                            "/doctor-dashboard?page=applied-jobs";
                        }}
                      >
                        Applied Jobs
                      </Button>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                      <Button
                        className="text-sm font-normal text-default-600 bg-default-100"
                        onClick={() => {
                          window.location.href = "/findJobs";
                        }}
                      >
                        Find Jobs
                      </Button>
                    </NavbarMenuItem>
                  </>
                )}
                {role === "NURSE" && (
                  <>
                    <NavbarMenuItem>
                      <Button
                        className="text-sm font-normal text-default-600 bg-default-100"
                        onClick={() => {
                          window.location.href =
                            "/nurse-dashboard?page=applied-jobs";
                        }}
                      >
                        Applied Jobs
                      </Button>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                      <Button
                        className="text-sm font-normal text-default-600 bg-default-100"
                        onClick={() => {
                          window.location.href = "/findJobs";
                        }}
                      >
                        Find Jobs
                      </Button>
                    </NavbarMenuItem>
                  </>
                )}
                {/* <NavbarMenuItem>
                  <Button
                    className="text-sm font-normal text-default-600 bg-default-100"
                    onClick={() => {
                      if (role === "HOSPITAL") {
                        window.location.href =
                          "/hospital-dashboard?page=edit-profile";
                      } else if (role === "DOCTOR") {
                        window.location.href =
                          "/doctor-dashboard?page=edit-profile";
                      } else if (role === "NURSE") {
                        window.location.href =
                          "/nurse-dashboard?page=edit-profile";
                      }
                    }}
                  >
                    Edit Profile
                  </Button>
                </NavbarMenuItem> */}
                {/* hospital-dashboard?page=hired-professionals */}
                {role === "HOSPITAL" && (
                  <>
                    <NavbarMenuItem>
                      <Button
                        className="text-sm font-normal text-default-600 bg-default-100"
                        onClick={() => {
                          window.location.href =
                            "/hospital-dashboard?page=hired-professionals";
                        }}
                      >
                        Your hirings
                      </Button>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                      <Button
                        className="text-sm font-normal text-default-600 bg-default-100"
                        onClick={() => {
                          window.location.href =
                            "/hospital-dashboard?page=jobs";
                        }}
                      >
                        Jobs
                      </Button>
                    </NavbarMenuItem>
                  </>
                )}

                <NavbarMenuItem>
                  <Button
                    className="text-sm font-normal text-default-600 bg-default-100"
                    onClick={handleSignOut}
                    variant="flat"
                  >
                    Sign out
                  </Button>
                </NavbarMenuItem>
              </div>
            )}
          </div>
        </NavbarMenu>
      </NextUINavbar>

      <LoginModal isOpen={isModalOpen} onClose={handleModalClose} />
    </>
  );
};
