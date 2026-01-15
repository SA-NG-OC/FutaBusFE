"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Vehicle, VehicleRequest } from "../types/index";

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleRequest) => void;
  initialData?: Vehicle | null;
  title: string;
}

const VehicleModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: VehicleModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VehicleRequest>();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setValue("licenseplate", initialData.licenseplate);
        setValue("vehicletype", initialData.vehicletype);
        setValue("totalseats", initialData.totalseats);
        setValue("status", initialData.status);
      } else {
        reset({
          licenseplate: "",
          vehicletype: "",
          totalseats: 0,
          status: "Operational",
        });
      }
    }
  }, [isOpen, initialData, reset, setValue]);

  if (!isOpen) return null;

  const handleFormSubmit = (data: VehicleRequest) => {
    onSubmit({
      ...data,
      totalseats: Number(data.totalseats),
    });
  };

  return (
    <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl p-8 relative w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClose}
          type="button"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="flex flex-col">
            <label className="mb-1.5 font-semibold text-gray-700">
              License Plate <span className="text-red-500">*</span>
            </label>
            <input
              {...register("licenseplate", {
                required: "License plate is required",
              })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.licenseplate
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-red-400"
              }`}
              placeholder="Ex: 51A-12345"
            />
            {errors.licenseplate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.licenseplate.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 font-semibold text-gray-700">
              Vehicle Type <span className="text-red-500">*</span>
            </label>
            <input
              {...register("vehicletype", {
                required: "Vehicle type is required",
              })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.vehicletype
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-red-400"
              }`}
              placeholder="Ex: Sleeper"
            />
            {errors.vehicletype && (
              <p className="text-red-500 text-sm mt-1">
                {errors.vehicletype.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 font-semibold text-gray-700">
              Total Seats <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register("totalseats", {
                required: "Total seats are required",
                min: { value: 1, message: "Must be at least 1" },
              })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.totalseats
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-red-400"
              }`}
            />
            {errors.totalseats && (
              <p className="text-red-500 text-sm mt-1">
                {errors.totalseats.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 font-semibold text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register("status", { required: true })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="Operational">Operational</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t mt-8">
            <button
              type="button"
              className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
            >
              {initialData ? "Update Vehicle" : "Save Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;

// Add this to your globals.css or a relevant CSS file for the animation
/*
@keyframes fade-in-scale {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-fade-in-scale {
  animation: fade-in-scale 0.3s ease-out forwards;
}
*/
