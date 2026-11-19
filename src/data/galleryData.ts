export interface RescueGalleryItem {
  id: string;
  title: string;
  vehicle: string;
  category: 'battery' | 'tire' | 'highway' | 'accident' | 'basement';
  categoryLabel: string;
  location: string;
  destination: string;
  issue: string;
  equipmentUsed: string[];
  duration: string;
  imageUrl: string;
  story: string;
  verifiedOutcome: string;
}

export const RESCUE_GALLERY: RescueGalleryItem[] = [
  {
    id: "REC-201",
    title: "Mercedes-Benz SLK Luxury Convertible Zero-Scrape Flatbed Transit",
    vehicle: "Mercedes-Benz SLK Convertible",
    category: "highway",
    categoryLabel: "Luxury Sports Car Towing",
    location: "Jubilee Hills / Banjara Hills Corridor, Hyderabad",
    destination: "Mercedes-Benz Authorized Service Bay, Hyderabad",
    issue: "Ultra-low ground clearance sports convertible with front aero splitter needing zero-drag transport without bumper or exhaust scrape.",
    equipmentUsed: ["Mahadev 0° Hydraulic Slide Bed", "Soft Rim Webbing Straps", "Alloy Wheel Wedges"],
    duration: "Loaded in 5 mins",
    imageUrl: "/images/mahadev-flatbed-mercedes-luxury.jpg",
    story: "Low sports cars with custom splitters cannot endure standard tilt ramps. Our branded Mahadev flatbed (9912124247) tilted flush to the asphalt for a seamless, scratch-free roll onto the deck.",
    verifiedOutcome: "Delivered to dealership in flawless condition with zero underbody or splitter marks."
  },
  {
    id: "REC-202",
    title: "AWD Electric Crossover Full-Platform Safe Zero-Drag Transport",
    vehicle: "Hyundai Ioniq 5 EV",
    category: "battery",
    categoryLabel: "EV Zero-Drag Flatbed",
    location: "Financial District / Wipro Circle Corridor, Gachibowli, Hyderabad",
    destination: "Authorized Hyundai EV Flagship Service Hub",
    issue: "12V auxiliary system crash locked 800V contactor; permanent-magnet dual motors immobilized in park.",
    equipmentUsed: ["Hydraulic Full-Tilt Flatbed", "Go-Jack Skates", "Tire Basket Harness"],
    duration: "Loaded in 7 mins",
    imageUrl: "/images/mahadev-flatbed-ioniq5.jpg",
    story: "Standard towing of an EV induces back-EMF voltage into the high-voltage inverter. Our black Mahadev flatbed loaded the entire Ioniq 5 onto the deck so both front and rear axles remained completely stationary throughout transit.",
    verifiedOutcome: "Delivered safely into the high-voltage bay. Inverter diagnostic passed with 100% health."
  },
  {
    id: "REC-203",
    title: "Severe Collision Side Impact Extraction & Safe Body Transport",
    vehicle: "Maruti Baleno (Side Impact Collision)",
    category: "accident",
    categoryLabel: "Accident Recovery",
    location: "Gachibowli - Miyapur Road Corridor, Hyderabad",
    destination: "Authorized Crash Repair Bay & Insurance Body Shop",
    issue: "Severe side impact crushed doors and locked rear axle; vehicle immobilized on roadway.",
    equipmentUsed: ["Heavy-Duty Hydraulic Winch", "Low-Friction Skates", "4-Point Rim Chocks"],
    duration: "Secured in 8 mins",
    imageUrl: "/images/mahadev-accident-baleno-side-impact.jpg",
    story: "Side-impacted cars suffer from locked wheels and deformed sills. Our Mahadev recovery truck safely winched the vehicle using synthetic straps directly onto the flatbed deck without worsening the body crush.",
    verifiedOutcome: "Safely delivered to authorized bodyshop for insurance assessment and structural repair."
  },
  {
    id: "REC-204",
    title: "Highway Breakdown & Mechanical Recovery for Passenger Sedan",
    vehicle: "Sedan (DL 6S CC 8740)",
    category: "tire",
    categoryLabel: "Breakdown Recovery",
    location: "Outer Ring Road (ORR) Highway Corridor, Hyderabad",
    destination: "Multi-Brand Diagnostic Center, Hyderabad",
    issue: "Drive axle locked following sudden transmission and clutch failure during highway cruising.",
    equipmentUsed: ["Hydraulic Slide Flatbed", "Synthetic Wheel Harness", "Yellow Wheel Chocks"],
    duration: "Loaded in 6 mins",
    imageUrl: "/images/mahadev-breakdown-sedan-towing.jpg",
    story: "Stranded on highway shoulder, our rapid dispatch recovery unit arrived promptly. The vehicle was smoothly winched onto the hydraulic flatbed and securely strapped with rim wedges for safe transit.",
    verifiedOutcome: "Vehicle delivered safely to workshop without transmission drag."
  },
  {
    id: "REC-205",
    title: "Commercial Traffic Clearance Flatbed Transit for SUV/MUV",
    vehicle: "Toyota Innova Crysta",
    category: "highway",
    categoryLabel: "SUV & MUV Towing",
    location: "Outer Ring Road (ORR) Expressway, Hyderabad",
    destination: "Toyota Authorized Service Center, Gachibowli",
    issue: "Engine overheating and coolant loss in expressway fast lane, creating urgent traffic hazard.",
    equipmentUsed: ["Tata Heavy Traffic Clearance Flatbed", "Hydraulic Winch", "Tire Chocks"],
    duration: "Loaded in 5 mins",
    imageUrl: "/images/mahadev-flatbed-innova-crysta.jpg",
    story: "Our dedicated Mahadev flatbed (9912124247) responded to the ORR emergency immediately, smoothly winching the loaded Innova Crysta onto the heavy-duty flatbed deck to restore smooth traffic flow.",
    verifiedOutcome: "Rapid clearance prevented expressway traffic jam; vehicle delivered to service station."
  },
  {
    id: "REC-206",
    title: "Total Damage & Total Loss Severely Crushed Vehicle Recovery",
    vehicle: "Severely Impacted Total Loss Vehicle",
    category: "accident",
    categoryLabel: "Total Loss Recovery",
    location: "Highway Crash Site, Hyderabad Outer Ring Road",
    destination: "Government RTO / Insurance Salvage Yard",
    issue: "High-speed rollover and severe rear crush damage; all axles severed and body structure collapsed.",
    equipmentUsed: ["Heavy-Duty Slide Flatbed", "Dual Winch Lines", "Industrial Steel Deck Restraints"],
    duration: "Extracted in 12 mins",
    imageUrl: "/images/mahadev-total-loss-damage-towing.jpg",
    story: "Total loss vehicles with sheared suspension cannot be towed with conventional wheel lifts. Our heavy-duty Mahadev flatbed deployed its full deck to carefully pull the crushed chassis onto the bed without shedding debris onto the expressway.",
    verifiedOutcome: "Highway cleared safely; vehicle delivered to insurance salvage depot without secondary incidents."
  },
  {
    id: "REC-207",
    title: "Ford Endeavour Heavy 4x4 SUV 24/7 Night Flatbed Dispatch",
    vehicle: "Ford Endeavour 4x4 SUV (TS 19 786)",
    category: "highway",
    categoryLabel: "Night Heavy SUV",
    location: "Night Commercial Corridor, Gachibowli, Hyderabad",
    destination: "Ford Authorized Service Center, Hitec City",
    issue: "Sudden electrical cutoff and 4WD transfer case lock during late-night transit.",
    equipmentUsed: ["Reinforced High-Payload Flatbed", "Yellow Wheel Wedges", "Heavy-Duty Axle Straps"],
    duration: "Secured in 7 mins",
    imageUrl: "/images/mahadev-flatbed-endeavour-suv.jpg",
    story: "Heavy 4x4 SUVs weigh over 2.5 tons and require reinforced flatbed decks. Our night dispatch unit loaded the Endeavour, locking all four wheels with high-visibility yellow wedges and branded Mahadev strapping.",
    verifiedOutcome: "Delivered overnight to service center with zero transfer case drag."
  },
  {
    id: "REC-208",
    title: "Tata Rapid Response Highway Crash Rescue & Traffic Marshaling",
    vehicle: "Accident Impacted Sedan (Highway Towing)",
    category: "accident",
    categoryLabel: "Highway Emergency",
    location: "National Highway Expressway Corridor, Telangana",
    destination: "Authorized Body Shop, Hyderabad",
    issue: "High-speed highway impact causing front fender and roof crushing; active lane blockage.",
    equipmentUsed: ["Tata Branded Flatbed (TG 12 E 6459)", "Reflective Safety Cones", "Towing Winch"],
    duration: "Cleared in 9 mins",
    imageUrl: "/images/mahadev-highway-accident-towing.jpg",
    story: "Our Mahadev rescue truck with trained marshals in fluorescent safety gear arrived on the expressway to secure the scene, direct passing traffic safely, and winch the wrecked vehicle onto the flatbed.",
    verifiedOutcome: "Highway lanes reopened rapidly; vehicle delivered for insurance claim inspection."
  }
];
