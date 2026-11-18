import { TowRequest, TowTruck, Review, BaseGarageLocation, ServiceableLocation } from '../types';

export const BASE_GARAGE: BaseGarageLocation = {
  name: "Mahadev Car Towing Services Central Base & Headquarters (Gachibowli)",
  address: "Ground floor, Sevanti Nivas, Plot No 712, Tngos colony phase 2, Gachibowli, Hyderabad, Telangana 500032",
  lat: 17.4334,
  lng: 78.3475,
  phone: "+91 99121 24247",
  emergencyPhone: "+91 99121 24247",
  email: "dispatch@voltrescue.com",
  whatsapp: "+919912124247",
};

export const INITIAL_SERVICEABLE_LOCATIONS: ServiceableLocation[] = [
  {
    id: "LOC-01",
    name: "Gachibowli & Financial District",
    zone: "Cyberabad IT Corridor",
    hubLandmark: "Wipro Circle, WaveRock & ORR Exit 19",
    pincodes: ["500032", "500075"],
    avgResponseMins: 12,
    standbyTruck: "Truck #01 (Tilt-Bed)",
    isActive: true,
    priorityHub: true
  },
  {
    id: "LOC-02",
    name: "Hitec City & Madhapur",
    zone: "Cyberabad IT Corridor",
    hubLandmark: "Cyber Towers, Mindspace & Inorbit Mall",
    pincodes: ["500081", "500084"],
    avgResponseMins: 15,
    standbyTruck: "Truck #01 (Tilt-Bed)",
    isActive: true,
    priorityHub: true
  },
  {
    id: "LOC-03",
    name: "Outer Ring Road (ORR) Expressway",
    zone: "Highway Expressway Ring",
    hubLandmark: "Gachibowli to Shamshabad / Patancheru Toll Plazas",
    pincodes: ["500075", "501504"],
    avgResponseMins: 18,
    standbyTruck: "Truck #02 (Rapid Flatbed)",
    isActive: true,
    priorityHub: true
  },
  {
    id: "LOC-04",
    name: "Shamshabad RGIA Airport Corridor",
    zone: "Airport Express & South Hub",
    hubLandmark: "PVNR Expressway & Airport Cargo Toll",
    pincodes: ["500409", "501218"],
    avgResponseMins: 20,
    standbyTruck: "Truck #02 (Rapid Flatbed)",
    isActive: true,
    priorityHub: true
  },
  {
    id: "LOC-05",
    name: "Jubilee Hills & Banjara Hills",
    zone: "Central Hyderabad",
    hubLandmark: "Road No. 36 / Road No. 12 & KBR Park",
    pincodes: ["500033", "500034"],
    avgResponseMins: 18,
    standbyTruck: "Truck #01 (Tilt-Bed)",
    isActive: true
  },
  {
    id: "LOC-06",
    name: "Kondapur, KPHB & Miyapur NH65",
    zone: "North-West Corridor",
    hubLandmark: "JNTU Junction & Miyapur Allwyn Cross Roads",
    pincodes: ["500072", "500049"],
    avgResponseMins: 20,
    standbyTruck: "Truck #02 (Rapid Flatbed)",
    isActive: true
  },
  {
    id: "LOC-07",
    name: "Secunderabad & Begumpet",
    zone: "Secunderabad Cantonment & North",
    hubLandmark: "Paradise Circle & Bowenpally Junction",
    pincodes: ["500003", "500011"],
    avgResponseMins: 22,
    standbyTruck: "Truck #01 (Tilt-Bed)",
    isActive: true
  },
  {
    id: "LOC-08",
    name: "Kompally & Medchal Highway NH44",
    zone: "North Highway Corridor",
    hubLandmark: "Suchitra Circle & Cine Planet",
    pincodes: ["500067", "501401"],
    avgResponseMins: 25,
    standbyTruck: "Truck #02 (Rapid Flatbed)",
    isActive: true
  }
];

export const INITIAL_TRUCKS: TowTruck[] = [
  {
    id: "TRUCK-01",
    callSign: "Truck #01",
    name: "Heavy Duty EV Hydraulic Tilt-Bed",
    driverName: "Rajesh Kumar",
    driverPhone: "+91 99121 24247",
    plateNumber: "TS-09-UB-4247",
    currentLocation: { lat: 17.4334, lng: 78.3475 },
    isOnline: true,
    status: 'idle',
    activeJobId: null,
    features: [
      "100% Zero-Degree Flatbed",
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
    driverPhone: "+91 99121 24247",
    plateNumber: "TS-09-UB-9912",
    currentLocation: { lat: 17.4474, lng: 78.3762 },
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

export const INITIAL_REQUESTS: TowRequest[] = [];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "REV-101",
    customerName: "Rahul S.",
    evModel: "Tata Nexon EV Max",
    rating: 5,
    comment: "Battery died at 11 PM on the Highway Corridor XX. Mahadev Car Towing dispatch owner called me back in less than 90 seconds to confirm location. Tow truck #01 arrived with special wheel skates so my front regenerative motor was 100% safe. Highly professional!",
    date: "2 days ago",
    serviceType: "Dead Battery Emergency Tow",
    authorToken: "demo-token-1",
    verified: true
  },
  {
    id: "REV-102",
    customerName: "Ananya S.",
    evModel: "MG ZS EV",
    rating: 5,
    comment: "Tire sidewall ripped on Expressway Sector XX. Regular roadside assistance wanted to drag my car with front wheels on the road, which would destroy the transmission! Mahadev Car Towing sent a flatbed that slid completely flat. Loaded in 5 minutes with zero scrapes.",
    date: "5 days ago",
    serviceType: "Flat Tire Flatbed Recovery",
    authorToken: "demo-token-2",
    verified: true
  },
  {
    id: "REV-103",
    customerName: "Vikramaditya S.",
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
    customerName: "Dr. Priya N.",
    evModel: "Hyundai Ioniq 5",
    rating: 5,
    comment: "12V auxiliary system crashed and locked the high-voltage pack. The dispatcher gave quick honest assistance on the verification call. Safely unloaded right into the Hyundai EV authorized bay.",
    date: "2 weeks ago",
    serviceType: "12V Electrical Failure",
    authorToken: "demo-token-4",
    verified: true
  }
];

export const EV_CATEGORIZED_MODELS = {
  "Luxury Vehicle": [
    "BMW (i4, iX, i7, 3/5/7 Series)",
    "Mercedes-Benz (EQE, EQS, C/E/S-Class)",
    "Audi (e-tron, A4, A6, Q5, Q7)",
    "Porsche (Taycan, Macan, Cayenne)",
    "Jaguar & Land Rover (I-Pace, Defender, Range Rover)",
    "Volvo (EX40, C40 Recharge, XC60, XC90)",
    "Other Luxury / Performance Car"
  ],
  "Car": [
    "Tata Tiago EV / Tigor EV",
    "MG Comet EV",
    "Tata Curvv EV (Coupe Sedan)",
    "BYD Seal (Sedan)",
    "Hyundai Ioniq 6",
    "Other Hatchback / Sedan"
  ],
  "SUV": [
    "Tata Nexon EV (Prime / Max / Fearless)",
    "Tata Punch EV / Harrier EV",
    "Mahindra XUV400 EV / XUV700",
    "MG ZS EV Exclusive / Windsor EV",
    "Hyundai Ioniq 5 AWD / Creta",
    "Kia EV6 GT-Line",
    "BYD Atto 3 / eMax 7",
    "Other SUV / MUV"
  ]
};

export const EV_MODELS: string[] = [
  ...EV_CATEGORIZED_MODELS["Luxury Vehicle"],
  ...EV_CATEGORIZED_MODELS["SUV"],
  ...EV_CATEGORIZED_MODELS["Car"]
];

export interface FleetEquipmentImage {
  id: string;
  title: string;
  category: 'flatbeds' | 'skates' | 'chargers' | 'safety';
  imageUrl: string;
  tag: string;
  specs: string;
}

export const FLEET_EQUIPMENT_IMAGES: FleetEquipmentImage[] = [
  {
    id: "FLEET-01",
    title: "Mahadev Hydraulic 0° Full-Tilt Bed (Ioniq 5 EV Recovery)",
    category: "flatbeds",
    tag: "Zero-Degree Flatbed",
    specs: "Full ground-level zero-degree hydraulic tilt bed (Call: 9912124247)",
    imageUrl: "/images/mahadev-flatbed-ioniq5.jpg"
  },
  {
    id: "FLEET-02",
    title: "White & Red Striped Zero-Scrape Flatbed (Range Rover Evoque)",
    category: "flatbeds",
    tag: "Luxury Car Towing",
    specs: "Zero bumper or underbody scrape for luxury SUVs & sports cars",
    imageUrl: "/images/mahadev-flatbed-luxury-suv.jpg"
  },
  {
    id: "FLEET-03",
    title: "Mahadev Traffic Clearance Heavy Tata Flatbed (Innova Crysta)",
    category: "flatbeds",
    tag: "Highway & SUV Recovery",
    specs: "Commercial heavy-duty traffic clearance flatbed unit for ORR & highways",
    imageUrl: "/images/mahadev-flatbed-innova.jpg"
  },
  {
    id: "FLEET-04",
    title: "Hydraulic Under-Lift Accident Recovery Crane (Balanagar, Hyderabad)",
    category: "safety",
    tag: "Accident Recovery",
    specs: "Specialized under-lift cradle for front-impact & total loss vehicles",
    imageUrl: "/images/mahadev-accident-recovery-balanagar.jpg"
  },
  {
    id: "FLEET-05",
    title: "Heavy-Duty Highway Breakdown & Wheel-Lift Unit (Telangana)",
    category: "flatbeds",
    tag: "Breakdown Recovery",
    specs: "Fast deployment wheel-lift cradle for mechanical & transmission failures",
    imageUrl: "/images/mahadev-underlift-towing-telangana.jpg"
  },
  {
    id: "FLEET-06",
    title: "Go-Jack Hydraulic Wheel Skates for Locked EV Parking Brakes",
    category: "skates",
    tag: "Wheel Skates (Locked Wheels)",
    specs: "Rolls dead EVs with electronic parking brakes locked in Park",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "FLEET-07",
    title: "Synthetic Rim-Safe Wheel Basket Harness & Strapping System",
    category: "safety",
    tag: "Alloy Wheel Care",
    specs: "Tire-only contact webbing preserving high-end alloy rims",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "FLEET-08",
    title: "24/7 Mobile Rapid Emergency EV Boost Charger & Battery Unit",
    category: "chargers",
    tag: "Mobile Battery Boost",
    specs: "Emergency charge to reach the nearest DC fast charger",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80"
  }
];

export const COMMON_EV_DROPOFFS = [
  { name: "Nearest Tata.ev Authorized Service Hub", address: "Tata Motors Tech Center, Sector XX, City - XXXXXX", type: "service_center" as const },
  { name: "Nearest 60kW DC Dual-Gun Fast Charger (Fast EV Hub)", address: "EV Fast Charge Station, Sector XX, City - XXXXXX", type: "fast_charger" as const },
  { name: "Nearest MG Motors EV Flagship Center", address: "MG Motors Service Bay, Sector XX, City - XXXXXX", type: "service_center" as const },
  { name: "Nearest Mahindra EV Service Station", address: "Mahindra Automotives, Sector XX, City - XXXXXX", type: "service_center" as const },
  { name: "Customer Home / Private Garage", address: "Custom Drop-off Address, Sector XX, City - XXXXXX", type: "home" as const },
];
