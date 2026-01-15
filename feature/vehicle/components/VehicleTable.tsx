import React from "react";
import { Vehicle } from "../types";
import { FaEdit, FaTrash } from "react-icons/fa";

type VehicleTableProps = {
  vehicleList: Vehicle[];
  handleUpdate: (vehicleid: number) => void;
  handleDelete: (vehicleid: number) => void;
};

const statusColorMap: Record<Vehicle["status"], string> = {
  Active: "bg-green-100 text-green-800",
  Maintenance: "bg-yellow-100 text-yellow-800",
};

export default function VehicleTable({
  vehicleList,
  handleUpdate,
  handleDelete,
}: VehicleTableProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        All Vehicles ({vehicleList.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 font-semibold text-gray-600">
                Plate Number
              </th>
              <th className="py-3 px-4 font-semibold text-gray-600">Type</th>
              <th className="py-3 px-4 font-semibold text-gray-600">
                Capacity
              </th>
              <th className="py-3 px-4 font-semibold text-gray-600">Status</th>

              <th className="py-3 px-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicleList.map((vehicle) => (
              <tr
                key={vehicle.vehicleid}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4 text-gray-700">
                  {vehicle.licenseplate}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {vehicle.vehicletype}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {vehicle.totalseats} seats
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      statusColorMap[vehicle.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdate(vehicle.vehicleid)}
                      className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-600"
                      aria-label="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.vehicleid)}
                      className="p-2 bg-gray-100 rounded-md hover:bg-red-100 text-red-500"
                      aria-label="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
