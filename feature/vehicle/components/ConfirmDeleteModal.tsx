import React from "react";
import { FaExclamationTriangle, FaTrash, FaTimes } from "react-icons/fa";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vehiclePlate: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  vehiclePlate,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-orange-50 rounded-lg shadow-xl p-6 md:p-8 w-full max-w-md m-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-full mr-4">
              <FaExclamationTriangle className="text-red-500 text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Confirm Delete</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="text-gray-600 mb-6">
          <p>
            Are you sure you want to delete the vehicle with plate number
            <strong className="block text-lg text-gray-800 my-1">
              {vehiclePlate}
            </strong>
          </p>
        </div>

        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md mb-6">
          <p>
            <strong className="font-bold">Warning:</strong> This action cannot
            be undone. All data associated with this vehicle will be permanently
            deleted.
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center px-6 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            <FaTrash className="mr-2" />
            Delete Vehicle
          </button>
        </div>
      </div>
    </div>
  );
}
