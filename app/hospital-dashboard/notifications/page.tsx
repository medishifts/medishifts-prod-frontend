"use client";

import React, { useEffect, useState } from "react";
import { AiOutlineClockCircle, AiOutlineClose } from "react-icons/ai";
import pb from "@/utils/pocketbase-connect";
import toast from "react-hot-toast";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import { setNotifications as ReduxSetNotifications } from "@/app/redux/features/notifications-slice";
import { Spinner } from "@nextui-org/react";

// Notification interface
interface Notification {
  id: string;
  title: string;
  description: string;
  user: string;
  time: string;
  bgColor: string;
  textColor: string;
  read: boolean;
}

// NotificationRecord type
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

const getRandomColorPair = () => {
  return colorPairs[Math.floor(Math.random() * colorPairs.length)];
};

const Notifications = (props: { clearNotification: () => void }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readCount, setReadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  const getNoti = async () => {
    try {
      setIsLoading(true);

      const records = await pb
        .collection("notifications")
        .getFullList<NotificationRecord>({
          sort: "-created",
        });

      const formattedNotifications = records.map((record) => {
        const { bgColor, textColor } = getRandomColorPair();
        return {
          id: record.id,
          title: record.title,
          description: record.message,
          user: record.sender || "Medishifts.in",
          time: new Date(record.created).toLocaleString(),
          bgColor,
          textColor,
          read: record.read_receipt === "READ",
        };
      });

      setNotifications(formattedNotifications);
      setReadCount(formattedNotifications.filter((noti) => noti.read).length);
      dispatch(ReduxSetNotifications(records));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    const notification = notifications.find((noti) => noti.id === id);
    if (!notification || notification.read) return;

    const updatedNotifications = notifications.map((noti) =>
      noti.id === id ? { ...noti, read: true } : noti
    );

    setNotifications(updatedNotifications);
    setReadCount(updatedNotifications.filter((noti) => noti.read).length);

    try {
      await pb.collection("notifications").update(id, { read_receipt: "READ" });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to update notification status");
    }
  };

  const deleteNotification = async (id: string) => {
    const notificationToDelete = notifications.find((noti) => noti.id === id);
    if (!notificationToDelete) return;

    if (!notificationToDelete.read) {
      setReadCount((prev) => Math.max(prev - 1, 0));
    }

    try {
      await pb.collection("notifications").delete(id);
      setNotifications((prev) => prev.filter((noti) => noti.id !== id));
      toast.success("Notification deleted successfully!");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  useEffect(() => {
    getNoti();
    props.clearNotification();
  }, []);

  return isLoading ? (
    <div className="flex h-screen justify-center items-center">
      <Spinner />
    </div>
  ) : (
    <div className="p-2 sm:p-4 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Notifications
      </h2>
      <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
        <span>{readCount} read</span> /{" "}
        <span>{notifications.length - readCount} unread</span>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out ${
              notification.read
                ? "bg-gray-50 dark:bg-gray-700"
                : "bg-white dark:bg-gray-800"
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div
                  className={`rounded-full w-10 h-10 flex items-center justify-center ${
                    notification.read ? "bg-gray-400" : notification.bgColor
                  }`}
                >
                  <AiOutlineClockCircle
                    className={`w-5 h-5 ${
                      notification.read ? "text-gray-300" : "text-white"
                    }`}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start w-full">
                  <div
                    className="flex-1 pr-4 cursor-pointer"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <p
                      className={`font-semibold text-sm ${
                        notification.read
                          ? "text-gray-500"
                          : "text-gray-800 dark:text-gray-100"
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        notification.read
                          ? "text-gray-400"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {notification.description}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        notification.read ? "text-gray-400" : "text-red-500"
                      }`}
                    >
                      {notification.user}
                    </p>
                  </div>
                  <div className="flex flex-col items-end w-32 flex-shrink-0">
                    <div className="flex items-center space-x-1">
                      <span
                        className={`text-xs whitespace-nowrap ${
                          notification.read ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {notification.read ? "Read" : "Unread"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full ml-1"
                      >
                        <AiOutlineClose className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
