"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineClockCircle, AiOutlineClose } from "react-icons/ai";
import pb from "@/utils/pocketbase-connect";
import toast from "react-hot-toast";

// Define a TypeScript interface for notification data
interface notification {
  id: string;
  title: string;
  description: string;
  user: string;
  time: string;
  bgColor: string;
  textColor: string;
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

const Notifications = (props: any) => {
  const [notifications, setNotifications] = useState<notification[]>([]);

  const loadNoti = async () => {
    const records = await pb.collection("notifications").getFullList({
      sort: "-created",
    });

    // Map the response to the required format
    const formattedNotifications: notification[] = records.map(
      (record: any) => {
        const { bgColor, textColor } = getRandomColorPair();
        return {
          id: record.id,
          title: record.title,
          description: record.message,
          user: record.sender || "Medishifts.in", // Default to "Medishifts.in" if sender is empty
          time: new Date(record.created).toLocaleString(), // Convert to local date and time format
          bgColor: bgColor, // Assign random background color
          textColor: textColor, // Assign corresponding text color
        };
      }
    );

    setNotifications(formattedNotifications);
  };
  const deleteNotification = async (id: string) => {
    try {
      await pb.collection("notifications").delete(id);

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
      toast.success("notification deleted successfully!");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  useEffect(() => {
    loadNoti();
    props.clearNotification();
  }, []);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Notifications
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
          >
            <div className="flex items-start">
              <div className={`rounded-full p-2 ${notification.bgColor}`}>
                <AiOutlineClockCircle className="text-white" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                  {notification.title}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                  {notification.description}
                </p>
                <p className="text-xs mt-2 text-red-500">{notification.user}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {notification.time}
              </span>
              <AiOutlineClose
                onClick={() => deleteNotification(notification.id)}
                className="text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition duration-150 ease-in-out"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
