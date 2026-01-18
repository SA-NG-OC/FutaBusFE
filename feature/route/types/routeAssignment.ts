// ========== VEHICLE ROUTE ASSIGNMENT TYPES ==========
export interface VehicleRouteAssignmentResponse {
  assignmentId: number;
  vehicleId: number;
  vehicleLicensePlate: string;
  vehicleType: string;
  totalSeats: number;
  routeId: number;
  routeName: string;
  originName: string;
  destinationName: string;
  priority: number;
  isActive: boolean;
  maintenanceSchedule?: string;
  nextMaintenanceDate?: string;
  needsMaintenance: boolean;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface CreateVehicleRouteAssignmentRequest {
  vehicleId: number;
  routeId: number;
  priority: number;
  maintenanceSchedule?: string;
  nextMaintenanceDate?: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

// ========== DRIVER ROUTE ASSIGNMENT TYPES ==========
export interface DriverRouteAssignmentResponse {
  assignmentId: number;
  driverId: number;
  driverName: string;
  licenseNumber: string;
  routeId: number;
  routeName: string;
  origin: string;
  destination: string;
  preferredRole: 'Main' | 'Backup';
  priority: number;
  startDate: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateDriverRouteAssignmentRequest {
  driverId: number;
  routeId: number;
  preferredRole: 'Main' | 'Backup';
  priority: number;
  startDate: string;
  endDate?: string;
  notes?: string;
}

// ========== ROUTE STATISTICS ==========
export interface RouteStatistics {
  routeId: number;
  routeName: string;
  origin: string;
  destination: string;
  totalVehicles: number;
  totalDrivers: number;
  activeVehicles: number;
  activeDrivers: number;
  mainDrivers: number;
  backupDrivers: number;
}
