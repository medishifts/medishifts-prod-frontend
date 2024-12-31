"use client";
import React, { ReactNode, useEffect, useState } from "react";
import EditProfileComponent from "./EditProfile/page";
import Notifications from "./notifications/page";
import PocketBase from "pocketbase";
import AddedJobs from "./addedJobs/page";
import toast from "react-hot-toast";
import { SidebarDoctor } from "@/components/SidebarDoctor";
import { AppDispatch, useAppSelector } from "../redux/store";
import { useDispatch } from "react-redux";
import HospitalProfilePage from "./profile/page";
import HiredDoctors from "@/components/HiredDoctors";
import { useRouter, useSearchParams } from "next/navigation";
import { setNotifications as ReduxSetNotifications } from "@/app/redux/features/notifications-slice";

type LayoutProps = {
  children: ReactNode;
};
interface Notification {
  id: string;
  title: string;
  description: string;
  user: string;
  time: string;
  bgColor: string;
  textColor: string;
  read: boolean; // Add read status
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

type NotificationItem = {
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

const pb = new PocketBase(process.env.NEXT_PUBLIC_BACKEND_API);

const HospitalDashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const id = useAppSelector((state) => state.profileReducer.value.id);
  const [notifications, setNotifications] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [is_document_uploaded, SetIs_document_uploaded] = useState(false);

  const fetchProfileData = async () => {
    pb.autoCancellation(false);
    try {
      const record = await pb.collection("view_users").getOne(id);
      console.log(record.is_document_uploaded);
      SetIs_document_uploaded(record.is_document_uploaded);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    const myWindow: any = window;

    myWindow.scroll({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  });
  useEffect(() => {
    pb.autoCancellation(false);
    fetchProfileData();

    const pageName = searchParams.get("page");
    if (pageName) {
      handleTabClick(pageName.trim());
    }
  }, [id]);
  const handleShowEdit = (show: boolean): any => {
    SetIs_document_uploaded(show);
  };

  const getNoti = async () => {
    try {
      const records: any = await pb
        .collection("notifications")
        .getFullList<NotificationRecord>();

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

      dispatch(ReduxSetNotifications(notifications));

      // Update notification state and read count
    } catch (error) {
      console.error("Error fetching notifications:", error);
      dispatch(ReduxSetNotifications([]));
    }
  };

  useEffect(() => {
try {
  const unsubscribe = pb
    .collection("notifications")
    .subscribe("*", async function (e) {
      console.log("Notifications ", e.record);
      if (e.action === "create") {
        await getNoti();
        // toast.success("New notification Received", {
        //   icon: "🔔",
        // });
        setNotifications(e.record);
      } else {
        console.log(`Action type: ${e.action}`);
      }
    });
} catch (error) {
  console.error("Error subscribing to notifications:", error);
}

   

    return () => {
      pb.collection("notifications").unsubscribe();
    };
  }, []);

  const handleTabClick = async (item: string) => {
    setActiveTab(item);
    // if (item === "Logout") {
    //   try {
    //     await pb.authStore.clear();
    //     deleteCookie("authToken");
    //     deleteCookie("authData");
    //     dispatch(resetProfile());
    //     toast.success("You have been logged out successfully!");
    //     window.location.href = "/";
    //   } catch (error: any) {
    //     toast.error(`Logout failed: ${error.message}`);
    //   }
    // }
  };

  const sidebarItems = is_document_uploaded
    ? [
        { name: "profile", icon: "edit", label: "Profile" },
        // { name: "edit-profile", icon: "edit", label: "Edit Profile" },
        // // { name: "notification", icon: "bell", label: "..." },
        // { name: "Reviews", icon: "star", label: "Reviews" },
        { name: "jobs", icon: "briefcase", label: "Jobs" },
        {
          name: "hired-professionals",
          icon: "user",
          label: "Hirings",
        },
      ]
    : [
        { name: "profile", icon: "edit", label: "Profile" },
        // { name: "edit-profile", icon: "edit", label: "Edit Profile" },
        // // { name: "notification", icon: "bell", label: "..." },
        // { name: "Reviews", icon: "star", label: "Reviews" },
        { name: "jobs", icon: "briefcase", label: "Jobs" },
        {
          name: "hired-professionals",
          icon: "user",
          label: "Hirings",
        },
      ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "edit":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 4H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-7-7l7 7M9 11l7-7M12 2a10 10 0 110 20 10 10 0 010-20z"
            />
          </svg>
        );
      case "bell":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a7.002 7.002 0 00-5-6.708V4a3 3 0 00-6 0v.292A7.002 7.002 0 002 11v3.159c0 .538-.214 1.055-.595 1.437L0 17h20zM7 17a3 3 0 006 0H7z"
            />
          </svg>
        );
      case "star":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.18 6.71a1 1 0 00.95.69h7.191a.998.998 0 01.588 1.81l-5.818 4.243a1 1 0 00-.363 1.118l2.18 6.71c.3.921-.755 1.688-1.54 1.118l-5.817-4.243a1 1 0 00-1.175 0l-5.818 4.243c-.784.57-1.84-.197-1.54-1.118l2.18-6.71a1 1 0 00-.364-1.118L.852 12.138a1 1 0 01.588-1.81h7.19a1 1 0 00.951-.69l2.18-6.71z"
            />
          </svg>
        );
      case "archive":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h18a2 2 0 012 2v4a2 2 0 01-2 2h-1l-2 9H6l-2-9H3a2 2 0 01-2-2V5a2 2 0 012-2zM3 7v2a2 2 0 002 2h14a2 2 0 002-2V7"
            />
          </svg>
        );
      case "plus":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        );
      case "briefcase":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 7V3a2 2 0 012-2h6a2 2 0 012 2v4M3 13h18M3 13a9 9 0 009 9 9 9 0 009-9M3 13a9 9 0 000-3h18a9 9 0 000 3z"
            />
          </svg>
        );
      case "user":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 3.582-8 8v1h16v-1c0-4.418-3.582-8-8-8z"
            />
          </svg>
        );
      case "logout":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-white min-h-screen flex flex-col md:flex-row p-2 bg-gray-50 dark:bg-black dark:text-white">
      {/* Sidebar Large Screens*/}
      <aside className="w-full max-w-[300px] md:w-1/4 p-5 hidden md:flex flex-col justify-between rounded-lg shadow-lg bg-blue-800 dark:bg-gray-800">
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold flex items-center space-x-2">
              {getIcon("user")}
              <span>Hospital Dashboard</span>
            </h2>
          </div>
          <ul className="space-y-2">
            {sidebarItems.map(({ name, icon, label }) => (
              <SidebarDoctor
                type={"hospital-dashboard"}
                name={name}
                icon={icon}
                label={label}
                activeTab={activeTab}
                handleTabClick={() => {
                  handleTabClick(name);
                }}
                getIcon={getIcon}
                title={
                  name === "notification"
                    ? notifications
                      ? "Notification 🚀"
                      : "Notification"
                    : label
                    ? label
                    : name
                }
              />
            ))}
          </ul>
        </div>
      </aside>

      {/* Sidebar for mobile */}
      <aside className="md:hidden w-full max-h-[80px] no-scrollbar overflow-x-auto overflow-y-hidden p-1 rounded-lg shadow-lg bg-blue-800 dark:bg-gray-800 text-sm">
        <ul className="flex w-full justify-between items-center ">
          {sidebarItems.map(({ name, icon, label }) => (
            <li key={name} className="flex-1 flex justify-center">
              <SidebarDoctor
                type="hospital-dashboard"
                name={name}
                icon={icon}
                label={label}
                activeTab={activeTab}
                handleTabClick={() => handleTabClick(name)}
                getIcon={getIcon}
                title={
                  name === "notification"
                    ? notifications
                      ? "Notification 🚀"
                      : "Notification"
                    : label || name
                }
              />
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {/* Button to change tab to "edit-profile" */}

        {activeTab === "edit-profile" && (
          <EditProfileComponent
            handleShowEdit={handleShowEdit}
            handleTabClick={handleTabClick}
          />
        )}
        {activeTab === "notification" && (
          <Notifications
            notification={notifications}
            clearNotification={() => setNotifications(null)}
          />
        )}
        {activeTab === "jobs" && <AddedJobs />}
        {activeTab === "hired-professionals" && <HiredDoctors />}
        {activeTab === "profile" && (
          <HospitalProfilePage handleTabClick={handleTabClick} />
        )}
        {children}
      </div>
    </div>
  );
};

export default HospitalDashboardLayout;
