"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import ApproveHospitals from "@/components/ApproveHospitals";
import ApproveProfessionals from "@/components/ApproveProfessionals";
import ViewAllProfessionals from "@/components/ViewAllProfessionals";
import ViewAllHospitals from "@/components/ViewAllHospitals";
import pb from "@/utils/pocketbase-connect";
import RejectedUsers from "@/components/RejectedUsers";
import Paymenthistory from "@/components/Paymenthistory";

const Page = () => {
  // State to manage the selected view
  const [view, setView] = useState<
    | "default"
    | "professionals"
    | "hospitals"
    | "approveHospitals"
    | "approveProfessionals"
    | "rejectedUsers"
    | "paymentHistory"
  >("default");
  const [isHydrated, setIsHydrated] = useState(false); // To track if hydration is complete

  // Retrieve view from localStorage after client-side render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedView = localStorage.getItem("admin-view");
      if (savedView) {
        setView(
          savedView as
            | "default"
            | "professionals"
            | "hospitals"
            | "approveHospitals"
            | "approveProfessionals"
            | "rejectedUsers"
            | "paymentHistory"
        );
      } else {
        setView("default");
      }
      setIsHydrated(true);
    }
  }, []);

  // Save the selected view to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("admin-view", view);
    }
  }, [view, isHydrated]);

  // Render the component based on the selected view
  const renderContent = () => {
    switch (view) {
      case "professionals":
        return <ViewAllProfessionals />;
      case "hospitals":
        return <ViewAllHospitals />;
      case "approveHospitals":
        return <ApproveHospitals />;
      case "approveProfessionals":
        return <ApproveProfessionals />;
      case "rejectedUsers":
        return <RejectedUsers />;
      case "paymentHistory":
        return <Paymenthistory />;
      case "default":
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
              <h1 className="text-2xl font-bold mb-4">Hi Admin!</h1>
              <p className="text-lg mb-4">
                Welcome to the admin dashboard. Use the buttons above to view or
                manage the professionals and hospitals.
              </p>
              <p className="text-gray-600 mb-4">Here you can:</p>
              <ul className="list-disc list-inside mb-4">
                <li className="text-gray-700">
                  View all doctors and hospitals.
                </li>
                <li className="text-gray-700">
                  Approve or disapprove hospitals and professionals.
                </li>
              </ul>
              <p className="text-gray-500">
                Click on the options to get started!
              </p>
            </div>
          </div>
        );
    }
  };

  if (!isHydrated) {
    // Render nothing or a loader until client-side hydration is complete
    return null; // You could also return a spinner or loading message
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 justify-center items-center">
        <Button
          className="w-full sm:w-auto"
          onClick={() => setView("professionals")}
        >
          View All Professionals
        </Button>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setView("hospitals")}
        >
          View All Hospitals
        </Button>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setView("approveHospitals")}
        >
          Approve Hospitals
        </Button>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setView("approveProfessionals")}
        >
          Approve Professionals
        </Button>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setView("rejectedUsers")}
        >
          Rejected Users
        </Button>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setView("paymentHistory")}
        >
          Payment history
        </Button>
        <Button
          className="w-full sm:w-auto"
          color="warning"
          onClick={async () => {
            await pb.authStore.clear();
            window.location.href = "/Admin/auth";
          }}
        >
          Logout
        </Button>
      </div>

      <div className="mt-4">
        {/* Render the content based on the selected view */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Page;
