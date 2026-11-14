import { TowRequest, TowTruck, Review, BaseGarageLocation } from '../types';

export const BASE_GARAGE: BaseGarageLocation = {
  name: "VOLTRESCUE Central Fleet Base & Dispatch Hub",
  address: "Plot 42, Outer Ring Road, Marathahalli Junction, Bengaluru, Karnataka 560037",
  lat: 12.9538,
  lng: 77.6980,
  phone: "+91 98765 43210",
  email: "support@yourdomain.com",
  whatsapp: "+919876543210",
};

export const INITIAL_TRUCKS: TowTruck[] = [
  {
    id: "TRUCK-01",
    callSign: "Truck #01",
    name: "Heavy Duty EV Hydraulic Tilt-Bed",
    driverName: "Rajesh Kumar",
    driverPhone: "+91 98765 01001",
    plateNumber: "KA-01-EV-2024",
    currentLocation: { lat: 12.9550, lng: 77.6320 },
    isOnline: true,
    status: 'assigned',
    activeJobId: "VT-3108",
    features: [
      "100% Zero-Drag Flatbed",
      "Hydraulic Full Tilt Bed (Zero Scrape)",
      "Go-Jack Wheel Dollies (Locked EV Wheels)",
      "High-Voltage Insulated Safety Kit"
    ]
  },
  {
    id: "TRUCK-02",
    callSign: "Truck #02",
    name: "Rapid EV Flatbed & Rescue Winch",
    driverName: "Vikram Rathore",
    driverPhone: "+91 98765 02002",
    plateNumber: "KA-05-EV-8842",
    currentLocation: { lat: 13.0150, lng: 77.6100 },
    isOnline: true,
    status: 'idle',
    activeJobId: null,
    features: [
      "Rapid Response Flatbed",
      "Mobile 7.4kW Rescue EV Charger Boost",
      "Synthetic Non-Scratch Rim Straps",
      "Low Ground Clearance Loading Ramps"
    ]
  }
];

export const INITIAL_REQUESTS: TowRequest[] = [
  {
    id: "VT-8492",
    customerName: "Siddharth Rao",
    customerPhone: "+91 98765 11223",
    pickupLocation: {
      address: "Outer Ring Road near Bellandur Flyover, Bengaluru",
      lat: 12.9345,
      lng: 77.6821,
      landmark: "Opposite Ecospace Tech Park"
    },
    dropoffLocation: {
      name: "Tata.ev Mega Fast Charger Hub",
      address: "Sarjapur Road, Near Wipro Campus, Bengaluru",
      type: "fast_charger"
    },
    vehicle: {
      makeModel: "Tata Nexon EV Max",
      regNumber: "KA-03-NA-4412",
      color: "Pristine White",
      hasWheelLock: true
    },
    issueType: "Dead Battery (0% SOC)",
    issueDescription: "Battery reached 0% on flyover incline. Drive selector locked in Park, electronic parking brake engaged.",
    status: "pending_verification",
    urgency: "Emergency (High Priority)",
    callMade: false,
    callVerified: false,
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(), // 6 mins ago
  },
  {
    id: "VT-3108",
    customerName: "Neha Deshmukh",
    customerPhone: "+91 98765 33445",
    pickupLocation: {
      address: "100ft Road, Near CMH Junction, Indiranagar, Bengaluru",
      lat: 12.9719,
      lng: 77.6412,
      landmark: "Outside Starbucks Indiranagar"
    },
    dropoffLocation: {
      name: "Authorized MG Motors Service Center",
      address: "Old Airport Road, Domlur, Bengaluru",
      type: "service_center"
    },
    vehicle: {
      makeModel: "MG ZS EV Exclusive",
      regNumber: "KA-04-MG-8891",
      color: "Current Red",
      hasWheelLock: false
    },
    issueType: "Flat Tire",
    issueDescription: "Front-left tire blew on road debris. Rim is touching ground, cannot roll car forward.",
    status: "verified_approved",
    urgency: "Standard Tow",
    callMade: true,
    callVerified: true,
    callNotes: "Spoke with Neha. She is in a safe parking bay. Agreed to flatbed tow with soft wheel straps to MG Domlur.",
    agreedPrice: 2800,
    assignedTruckId: "TRUCK-01",
    assignedDriverName: "Rajesh Kumar",
    assignedDriverPhone: "+91 98765 01001",
    assignedTruckPlate: "KA-01-EV-2024",
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    driverLiveLocation: {
      lat: 12.9550,
      lng: 77.6320,
      updatedAt: new Date().toISOString(),
      heading: 45,
      speed: 32
    },
    etaMinutes: 12
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "REV-101",
    customerName: "Rahul Sharma",
    evModel: "Tata Nexon EV Max",
    rating: 5,
    comment: "Battery died at 11 PM on the NICE expressway. VoltRescue dispatch owner called me back in less than 90 seconds to confirm location. Tow truck #01 arrived with special wheel skates so my front regenerative motor was 100% safe. Highly professional!",
    date: "2 days ago",
    serviceType: "Dead Battery Emergency Tow",
    authorToken: "demo-token-1",
    verified: true
  },
  {
    id: "REV-102",
    customerName: "Ananya Sen",
    evModel: "MG ZS EV",
    rating: 5,
    comment: "Tire sidewall ripped on Airport Road. Regular roadside assistance wanted to drag my car with front wheels on the road, which would destroy the transmission! VoltRescue sent a flatbed that slid completely flat. Loaded in 5 minutes with zero scrapes.",
    date: "5 days ago",
    serviceType: "Flat Tire Flatbed Recovery",
    authorToken: "demo-token-2",
    verified: true
  },
  {
    id: "REV-103",
    customerName: "Vikramaditya Singh",
    evModel: "Mahindra XUV400",
    rating: 5,
    comment: "Live GPS tracking on my phone was amazing. I was stranded with my family on a rainy night, and being able to see Truck #01 moving on the map towards us eliminated all panic. Driver Rajesh was polite and EV certified.",
    date: "1 week ago",
    serviceType: "Mechanical Breakdown Tow",
    authorToken: "demo-token-3",
    verified: true
  },
  {
    id: "REV-104",
    customerName: "Dr. Priya Nair",
    evModel: "Hyundai Ioniq 5",
    rating: 5,
    comment: "12V auxiliary system crashed and locked the high-voltage pack. The dispatcher gave an honest upfront quote of ₹2,500 on the verification call. Safely unloaded right into the Hyundai EV authorized bay.",
    date: "2 weeks ago",
    serviceType: "12V Electrical Failure",
    authorToken: "demo-token-4",
    verified: true
  }
];

export const EV_MODELS = [
  "Tata Nexon EV (Prime / Max / Fearless)",
  "Tata Punch EV",
  "Tata Tiago EV / Tigor EV",
  "Tata Curvv EV",
  "Mahindra XUV400 EV",
  "MG ZS EV",
  "MG Windsor EV",
  "MG Comet EV",
  "Hyundai Ioniq 5",
  "Hyundai Kona Electric",
  "Kia EV6",
  "BYD Atto 3",
  "BYD Seal",
  "BYD eMax 7",
  "BMW iX / i4 / iX1",
  "Mercedes-Benz EQB / EQC / EQS",
  "Volvo EX40 / C40 Recharge",
  "Other Electric Vehicle"
];

export const COMMON_EV_DROPOFFS = [
  { name: "Nearest Tata.ev Authorized Service Hub", address: "Tata Motors EV Tech Center, Koramangala", type: "service_center" as const },
  { name: "Nearest 60kW DC Dual-Gun Fast Charger (Zeon / Jio-bp)", address: "Shell Fuel & EV Fast Charge Station, Indiranagar", type: "fast_charger" as const },
  { name: "Nearest MG Motors EV Flagship Center", address: "MG Motors Service Bay, Outer Ring Road", type: "service_center" as const },
  { name: "Nearest Mahindra EV Service Station", address: "Mahindra Automotives, Hosur Main Road", type: "service_center" as const },
  { name: "Customer Home / Private Garage", address: "Custom Drop-off Address", type: "home" as const },
];
