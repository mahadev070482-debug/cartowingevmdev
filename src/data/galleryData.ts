export interface RescueGalleryItem {
  id: string;
  title: string;
  vehicle: string;
  category: 'battery' | 'tire' | 'highway' | 'basement';
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
    title: "Luxury SUV Zero-Degree Flatbed Recovery with Wheel Chock Securing",
    vehicle: "Range Rover Evoque",
    category: "highway",
    categoryLabel: "Luxury SUV Towing",
    location: "Outer Ring Road (ORR) near Gachibowli Junction, Hyderabad",
    destination: "Authorized JLR Service Bay, Hitec City",
    issue: "Electronic transmission fault on highway. Low ground clearance with delicate front air splitter and all-wheel-drive transfer case.",
    equipmentUsed: ["Mahadev 0° Hydraulic Slide Bed", "Custom Wheel Chocks", "Tire-Only Webbing Straps"],
    duration: "Loaded in 6 mins",
    imageUrl: "/images/mahadev-flatbed-luxury-suv.jpg",
    story: "Because luxury SUVs have low ground clearance and AWD systems that cannot tolerate tire dragging, our white Mahadev flatbed (9912124247) lowered to true zero degrees. Secured safely with custom yellow wheel wedges and tire straps with zero rim or underbody scratch.",
    verifiedOutcome: "Delivered to authorized service center with 100% paint, rim, and drivetrain integrity."
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
    title: "Severe Front Collision Accident Extraction & Safe Transport",
    vehicle: "Hyundai Venue (Accident Impacted)",
    category: "highway",
    categoryLabel: "Accident Recovery",
    location: "Balanagar Industrial Corridor, Hyderabad, Telangana",
    destination: "Authorized Crash Repair Bay & Insurance Body Shop",
    issue: "Front-end collision sheared off bumper and damaged radiator cradle; steering assembly bound.",
    equipmentUsed: ["Heavy-Duty Under-Lift Boom", "Wheel Lift Cradle", "Safety Tow Chain Restraints"],
    duration: "Secured in 9 mins",
    imageUrl: "/images/mahadev-accident-recovery-balanagar.jpg",
    story: "Accident-damaged vehicles require specialized under-lift cradles that hold the tires without pulling on broken structural components. Our recovery crew in Balanagar locked the wheels into the heavy-duty hydraulic cradle, preventing further chassis distortion.",
    verifiedOutcome: "Safely delivered to the authorized bodyshop for insurance assessment and repair."
  },
  {
    id: "REC-204",
    title: "Highway Breakdown & Safe Mechanical Wheel-Lift Transit",
    vehicle: "Sedan / Passenger Car",
    category: "tire",
    categoryLabel: "Highway Breakdown",
    location: "Mohammadnagar Highway Corridor, Telangana",
    destination: "Multi-Brand Diagnostic Center, Hyderabad",
    issue: "Drive axle locked following sudden transmission bearing failure during highway cruising.",
    equipmentUsed: ["Hydraulic Wheel Lift", "Auxiliary Safety Beacon Lightbar", "Heavy-Duty Wheel Straps"],
    duration: "Dispatched in 12 mins",
    imageUrl: "/images/mahadev-underlift-towing-telangana.jpg",
    story: "Stranded on highway shoulder in Mohammadnagar, our rapid dispatch recovery unit arrived within 18 minutes. The drive axle was smoothly lifted in the hydraulic cradle and securely strapped for highway transit.",
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
    imageUrl: "/images/mahadev-flatbed-innova.jpg",
    story: "Our dedicated Tata Traffic Clearance flatbed (KA 53 B 7469 / 9912124247) responded to the ORR emergency immediately, smoothly winching the loaded Innova Crysta onto the heavy-duty flatbed deck to restore smooth traffic flow.",
    verifiedOutcome: "Rapid clearance prevented expressway traffic jam; vehicle delivered to service station."
  },
  {
    id: "REC-206",
    title: "Basement Parking B2 Tight-Clearance Extraction",
    vehicle: "Mahindra XUV400 EV",
    category: "basement",
    categoryLabel: "Basement Extraction",
    location: "Commercial Tech Complex B2 Parking, Hitec City, Hyderabad",
    destination: "Customer Home Garage, Gachibowli",
    issue: "Vehicle immobilized in basement parking level 2 with 2.1-meter ceiling clearance limit where heavy tow trucks cannot enter.",
    equipmentUsed: ["Low-Profile Extraction Winch", "Maneuvering Wheel Rollers", "Outdoor Transfer Flatbed"],
    duration: "Extracted in 14 mins",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    story: "Commercial basements are notorious for trapping dead EVs. Our rapid-response team entered the basement with compact mechanical dollies, wheeled the immobilized car up the ramp to the outdoor loading bay, and cleanly loaded it onto our full-size hydraulic flatbed.",
    verifiedOutcome: "Safely delivered home without any ceiling scrapes or ramp drag marks."
  }
];
