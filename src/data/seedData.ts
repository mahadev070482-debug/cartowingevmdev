import { TowRequest, TowTruck, Review, BaseGarageLocation, ServiceableLocation } from '../types';

export const BASE_GARAGE: BaseGarageLocation = {
  name: "VoltRescue Central Base & Headquarters (Gachibowli)",
  address: "Ground floor, Sevanti Nivas, Plot No 712, Tngos colony phase 2, Gachibowli, Hyderabad, Telangana 500032",
  lat: 17.4334,
  lng: 78.3475,
  phone: "+91 00000 00000",
  email: "dispatch@voltrescue.com",
  whatsapp: "+910000000000",
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
    driverPhone: "+91 00000 00001",
    plateNumber: "XX-00-EV-0001",
    currentLocation: { lat: 12.9550, lng: 77.6320 },
    isOnline: true,
    status: 'assigned',
    activeJobId: "VT-3108",
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
    driverPhone: "+91 00000 00002",
    plateNumber: "XX-00-EV-0002",
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
    customerPhone: "+91 00000 00000",
    pickupLocation: {
      address: "Highway Corridor XX near Flyover Pillar XXX, City - XXXXXX",
      lat: 12.9345,
      lng: 77.6821,
      landmark: "Opposite Tech Hub Gate XX"
    },
    dropoffLocation: {
      name: "Tata.ev Mega Fast Charger Hub",
      address: "Main Road, Sector XX, City - XXXXXX",
      type: "fast_charger"
    },
    vehicle: {
      makeModel: "Tata Nexon EV Max",
      regNumber: "XX-00-EV-0000",
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
    customerPhone: "+91 00000 00000",
    pickupLocation: {
      address: "Commercial Boulevard, Near Landmark XXXX, Sector XX, City - XXXXXX",
      lat: 12.9719,
      lng: 77.6412,
      landmark: "Outside Landmark XXXX"
    },
    dropoffLocation: {
      name: "Authorized MG Motors Service Center",
      address: "Service Bay Area, Sector XX, City - XXXXXX",
      type: "service_center"
    },
    vehicle: {
      makeModel: "MG ZS EV Exclusive",
      regNumber: "XX-00-EV-0000",
      color: "Current Red",
      hasWheelLock: false
    },
    issueType: "Flat Tire",
    issueDescription: "Front-left tire blew on road debris. Rim is touching ground, cannot roll car forward.",
    status: "verified_approved",
    urgency: "Standard Tow",
    callMade: true,
    callVerified: true,
    callNotes: "Spoke with Neha on call. She is in a safe parking bay. Agreed to flatbed tow with soft wheel straps to authorized service bay.",
    agreedPrice: 2800,
    assignedTruckId: "TRUCK-01",
    assignedDriverName: "Rajesh Kumar",
    assignedDriverPhone: "+91 00000 00001",
    assignedTruckPlate: "XX-00-EV-0001",
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
    customerName: "Rahul S.",
    evModel: "Tata Nexon EV Max",
    rating: 5,
    comment: "Battery died at 11 PM on the Highway Corridor XX. VoltRescue dispatch owner called me back in less than 90 seconds to confirm location. Tow truck #01 arrived with special wheel skates so my front regenerative motor was 100% safe. Highly professional!",
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
    comment: "Tire sidewall ripped on Expressway Sector XX. Regular roadside assistance wanted to drag my car with front wheels on the road, which would destroy the transmission! VoltRescue sent a flatbed that slid completely flat. Loaded in 5 minutes with zero scrapes.",
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
    comment: "12V auxiliary system crashed and locked the high-voltage pack. The dispatcher gave an honest upfront quote of ₹2,500 on the verification call. Safely unloaded right into the Hyundai EV authorized bay.",
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
    title: "Heavy-Duty Hydraulic Full-Tilt Flatbed Bed",
    category: "flatbeds",
    tag: "Zero-Degree Flatbed",
    specs: "Full deck tilt to zero degrees for zero-scrape loading",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "FLEET-02",
    title: "Low-Angle Slide Deck Platform for Ground Clearance Protection",
    category: "flatbeds",
    tag: "Low Ground Clearance",
    specs: "Designed specifically for low-slung EV battery casings",
    imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "FLEET-03",
    title: "Go-Jack Hydraulic Wheel Skates for Locked EV Parking Brakes",
    category: "skates",
    tag: "Wheel Skates (Locked Wheels)",
    specs: "Rolls dead EVs with electronic parking brakes locked in Park",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "FLEET-04",
    title: "Synthetic Rim-Safe Wheel Basket Harness & Strapping System",
    category: "safety",
    tag: "Alloy Wheel Care",
    specs: "Tire-only contact webbing preserving high-end alloy rims",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "FLEET-05",
    title: "24/7 Mobile Rapid Emergency EV Boost Charger & Battery Unit",
    category: "chargers",
    tag: "Mobile Battery Boost",
    specs: "Emergency charge to reach the nearest DC fast charger",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "FLEET-06",
    title: "1000V Insulated Safety Isolation Kit & High-Voltage PPE",
    category: "safety",
    tag: "High-Voltage Safety Kit",
    specs: "Certified pyro-fuse and contactor disconnect safeguards",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "FLEET-07",
    title: "Heavy-Duty Commercial Emergency Jump Start & Booster Pack System",
    category: "chargers",
    tag: "Emergency Jump Start",
    specs: "High-amperage surge-protected 12V/24V booster unit for luxury and stalled vehicles",
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "FLEET-08",
    title: "Rapid Hydraulic Winch with Synthetic Snatch Block Assembly",
    category: "skates",
    tag: "Gentle Loading Winch",
    specs: "Continuous smooth tension winching without chassis strain",
    imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80"
  }
];

export const COMMON_EV_DROPOFFS = [
  { name: "Nearest Tata.ev Authorized Service Hub", address: "Tata Motors Tech Center, Sector XX, City - XXXXXX", type: "service_center" as const },
  { name: "Nearest 60kW DC Dual-Gun Fast Charger (Fast EV Hub)", address: "EV Fast Charge Station, Sector XX, City - XXXXXX", type: "fast_charger" as const },
  { name: "Nearest MG Motors EV Flagship Center", address: "MG Motors Service Bay, Sector XX, City - XXXXXX", type: "service_center" as const },
  { name: "Nearest Mahindra EV Service Station", address: "Mahindra Automotives, Sector XX, City - XXXXXX", type: "service_center" as const },
  { name: "Customer Home / Private Garage", address: "Custom Drop-off Address, Sector XX, City - XXXXXX", type: "home" as const },
];
