"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineClockCircle, AiOutlineClose } from "react-icons/ai";
import pb from "@/utils/pocketbase-connect";
import toast from "react-hot-toast";
import { AppDispatch, useAppSelector } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import { setNotifications as ReduxSetNotifications } from "@/app/redux/features/notifications-slice";
// Define a TypeScript interface for notification data
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

interface NotificationsProps {
  notification: any;
  clearNotification: () => void;
}

// Predefined color pairs that are both attractive and user-friendly
const colorPairs = [
  { bgColor: "bg-blue-500", textColor: "text-white" },
  { bgColor: "bg-green-500", textColor: "text-white" },
  { bgColor: "bg-yellow-500", textColor: "text-black" },
  { bgColor: "bg-red-500", textColor: "text-white" },
  { bgColor: "bg-purple-500", textColor: "text-white" },
  { bgColor: "bg-indigo-500", textColor: "text-white" },
  { bgColor: "bg-pink-500", textColor: "text-white" },
  { bgColor: "bg-teal-500", textColor: "text-white" },
];

// Function to get a random color pair
const getRandomColorPair = () => {
  return colorPairs[Math.floor(Math.random() * colorPairs.length)];
};

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

const Notifications = (props: any) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readCount, setReadCount] = useState(0); // Track read notifications
  const dispatch = useDispatch<AppDispatch>();

  const getNoti = async () => {
    try {
      const records: any = await pb
        .collection("notifications")
        .getFullList<NotificationRecord>({
          sort: "-created",
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

      dispatch(ReduxSetNotifications(notifications));
      const formattedNotifications: Notification[] = records.map(
        (record: any) => {
          const { bgColor, textColor } = getRandomColorPair();
          return {
            id: record.id,
            title: record.title,
            description: record.message,
            user: record.sender || "Medishifts.in",
            time: new Date(record.created).toLocaleString(),
            bgColor,
            textColor,
            read: record.read_receipt === "READ", // Determine read status from record
          };
        }
      );

      // Update notification state and read count
      setNotifications(formattedNotifications);
      setReadCount(formattedNotifications.filter((noti) => noti.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      dispatch(ReduxSetNotifications([]));
    }
  };

  // Load notifications from Pocketbase
  // const loadNoti = async () => {
  //   const records = await pb.collection("notifications").getFullList({
  //     sort: "-created",
  //   });

  //   //@ts-ignore
  //   // dispatch(setNotifications(records));

  //   console.log("Get Notifications --> ", records);

  //   // Map the response to the required format
  //   const formattedNotifications: Notification[] = records.map(
  //     (record: any) => {
  //       const { bgColor, textColor } = getRandomColorPair();
  //       return {
  //         id: record.id,
  //         title: record.title,
  //         description: record.message,
  //         user: record.sender || "Medishifts.in",
  //         time: new Date(record.created).toLocaleString(),
  //         bgColor,
  //         textColor,
  //         read: record.read_receipt === "READ", // Determine read status from record
  //       };
  //     }
  //   );

  //   // Update notification state and read count
  //   setNotifications(formattedNotifications);
  //   setReadCount(formattedNotifications.filter((noti) => noti.read).length);
  // };

  // Mark notification as read only if it's unread
  const markAsRead = async (id: string) => {
    // Find the notification by id
    const notification = notifications.find(
      (notification) => notification.id === id
    );

    // If the notification is already read, do nothing
    if (notification?.read) {
      return; // Exit the function, no API call is made
    }

    // Otherwise, mark it as read
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );

    setNotifications(updatedNotifications);

    setReadCount(updatedNotifications.filter((noti) => noti.read).length);

    try {
      await pb.collection("notifications").update(id, { read_receipt: "READ" });
      await getNoti();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to update notification status");
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    // Check if the notification is unread
    const deletedNotification = notifications.find(
      (notification) => notification.id === id
    );

    if (!deletedNotification) return;

    // Update readCount if the notification was unread
    if (!deletedNotification.read) {
      setReadCount((prevCount) => Math.max(prevCount - 1, 0)); // Prevent going negative
    }

    try {
      await pb.collection("notifications").delete(id);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
      await getNoti();
      toast.success("Notification deleted successfully!");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  useEffect(() => {
    // loadNoti();
    getNoti();
    props.clearNotification();
  }, []);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Notifications
      </h2>
      <div className="mb-4 text-gray-700 dark:text-gray-300">
        <span>{readCount} read</span> /{" "}
        <span>{notifications.length - readCount} unread</span>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg divide-y divide-gray-200 dark:divide-gray-700">
        {notifications &&
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)} // Mark as read on click
              className={`p-4 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out ${
                notification.read
                  ? "bg-gray-200 dark:bg-gray-700" // Change background color for read notifications
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              <div className="flex items-start">
                <div
                  className={`rounded-full p-2 ${
                    notification.read
                      ? "bg-gray-400 dark:bg-gray-600" // Dimmed color for read icon
                      : notification.bgColor
                  }`}
                >
                  <AiOutlineClockCircle
                    className={`${
                      notification.read
                        ? "text-gray-300" // Lighter icon for read
                        : "text-white"
                    }`}
                  />
                </div>
                <div className="ml-4">
                  <p
                    className={`font-semibold text-sm ${
                      notification.read
                        ? "text-gray-500 dark:text-gray-400" // Dimmed text for read
                        : "text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    {notification.title}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      notification.read
                        ? "text-gray-400 dark:text-gray-500" // Dimmed description for read
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {notification.description}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      notification.read
                        ? "text-gray-400 dark:text-gray-500"
                        : "text-red-500"
                    }`}
                  >
                    {notification.user}
                  </p>
                  {/* Display read receipt status */}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <p
                  className={`text-xs mt-2 ${
                    notification.read ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {notification.read ? "Read" : "Unread"}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {notification.time}
                </span>
                <AiOutlineClose
                  className="text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition duration-150 ease-in-out"
                  onClick={() => deleteNotification(notification.id)}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Notifications;
