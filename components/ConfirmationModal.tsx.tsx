"use client";
import React from "react";
import { Button, Input } from "@nextui-org/react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  showReasonInput?: boolean; // Optional prop to control the display of the reason input
  reason: string;
  onReasonChange: (reason: string) => void;
};

export const ConfirmationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  showReasonInput = false, // Default is false
  reason,
  onReasonChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg z-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">{message}</p>

        {/* Conditional Input Field for Reason */}
        {showReasonInput && (
          <textarea
            placeholder="Reason for Disapproval"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            rows={4}
            className="mb-4 w-full p-2 border border-gray-300 rounded resize-none dark:bg-gray-700 dark:text-gray-100"
          />
        )}

        <div className="flex justify-end gap-2">
          <Button
            color="warning"
            onClick={onClose}
            className="text-white rounded hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            color="success"
            onClick={onConfirm}
            className="text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};
