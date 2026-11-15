export type RequestStatus =
  | 'pending_verification'   // 1. Request Submitted (Awaiting Verification Call)
  | 'verified_approved'      // 2. Call Verified & Approved by Owner
  | 'driver_accepted'        // 3. Assigned & Accepted by Tow Truck
  | 'en_route'               // 4. Driver En Route to Pickup
  | 'arrived_pickup'         // 5. Arrived at Pickup
  | 'in_transit'             // 6. Vehicle Loaded & In Transit
  | 'completed'              // 7. Completed
  | 'declined';              // Cancelled / Declined with Owner's reason

export type IssueType =
  | 'Dead Battery (0% SOC)'
  | 'Flat Tire'
  | 'Accident / Collision'
  | 'Mechanical / Drive Unit'
  | '12V Auxiliary System Failure';

export interface LocationPoint {
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
}

export interface DropoffLocation {
  name: string;
  address: string;
  type: 'service_center' | 'fast_charger' | 'home' | 'custom';
}

export type VehicleCategory = '2 Wheelers' | 'Car' | 'SUV' | 'Others';

export interface EVVehicle {
  category?: VehicleCategory;
  makeModel: string;
  regNumber?: string;
  color?: string;
  hasWheelLock?: boolean; // whether drive wheels are locked in park
}

export interface TowRequest {
  id: string; // e.g. "VT-8492"
  customerName: string;
  customerPhone: string; // "+91 00000 00000"
  pickupLocation: LocationPoint;
  dropoffLocation: DropoffLocation;
  vehicle: EVVehicle;
  issueType: IssueType;
  issueDescription?: string;
  status: RequestStatus;
  urgency: 'Emergency (High Priority)' | 'Standard Tow' | 'Scheduled Tow';
  
  // Call verification workflow
  callMade: boolean;
  callVerified: boolean;
  callNotes?: string;
  agreedPrice?: number; // In INR ₹
  
  // Truck assignment
  assignedTruckId?: string; // "TRUCK-01" or "TRUCK-02"
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  assignedTruckPlate?: string;
  
  // Rejection handling
  rejectionReason?: 'Fake / Unreachable Number' | 'Out of Service Area' | 'Customer Cancelled on Call' | 'Duplicate Request' | 'Other';
  rejectionNotes?: string;
  
  // Timestamps
  createdAt: string;
  verifiedAt?: string;
  acceptedAt?: string;
  arrivedAt?: string;
  loadedAt?: string;
  completedAt?: string;
  
  // Real-time tracking
  driverLiveLocation?: {
    lat: number;
    lng: number;
    updatedAt: string;
    heading?: number;
    speed?: number;
  };
  etaMinutes?: number;
}

export interface TowTruck {
  id: string; // "TRUCK-01"
  callSign: string; // "Truck #01"
  name: string; // "Heavy Duty EV Hydraulic Tilt-Bed"
  driverName: string;
  driverPhone: string;
  plateNumber: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  isOnline: boolean;
  status: 'idle' | 'assigned' | 'en_route' | 'at_pickup' | 'in_transit' | 'off_duty';
  activeJobId?: string | null;
  features: string[];
}

export interface Review {
  id: string;
  customerName: string;
  evModel: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  serviceType: string;
  authorToken: string; // stored in local storage for customer self-delete
  verified: boolean;
}

export type ActiveAppView = 'customer' | 'owner' | 'driver';

export interface BaseGarageLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  whatsapp: string;
}

export interface ServiceableLocation {
  id: string;
  name: string;
  zone: string;
  hubLandmark: string;
  pincodes: string[];
  avgResponseMins: number;
  standbyTruck: string;
  isActive: boolean;
  priorityHub?: boolean;
}

export interface CompanyStats {
  yearsExperience: number;
  rescuesCountText: string;
  responseMinutes: number;
  activeTrucksCount: number;
  satisfactionRate: string;
}
