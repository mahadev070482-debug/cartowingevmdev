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
    title: "Expressway Dead Battery Recovery with Zero Gearbox Drag",
    vehicle: "Tata Nexon EV Max",
    category: "battery",
    categoryLabel: "Dead Battery (0% SOC)",
    location: "Expressway Corridor Sector XX near Flyover Pillar XXX",
    destination: "EV Mega Fast Charger Hub, Sector XX",
    issue: "Battery reached 0% on flyover incline. Drive selector locked in 'Park', electronic handbrake automatically locked on rear wheels.",
    equipmentUsed: ["Go-Jack Hydraulic Skates", "Hydraulic Full-Tilt Bed", "Soft Tire Basket Straps"],
    duration: "Loaded in 6 mins",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
    story: "Standard towing would have dragged the locked rear motor on the road, destroying the reduction gearbox. Our crew positioned hydraulic wheel skates under all 4 tires in under 3 minutes, smoothly winched the vehicle onto the hydraulic flatbed deck, and transported it directly to the DC fast charger.",
    verifiedOutcome: "Battery safely recharged to 100% with zero electrical or drivetrain errors."
  },
  {
    id: "REC-202",
    title: "Low Ground Clearance Flatbed Recovery After High-Speed Tire Blowout",
    vehicle: "MG ZS EV Exclusive",
    category: "tire",
    categoryLabel: "Flat Tire / Rim Care",
    location: "Highway Arterial Bypass, Sector XX, City - XXXXXX",
    destination: "Authorized MG Motors Service Bay, Sector XX",
    issue: "Low-profile EV tire sidewall ruptured on road debris. Aluminum alloy rim was touching the asphalt; vehicle could not be driven forward even 1 meter.",
    equipmentUsed: ["Low-Angle Slide Bed", "Synthetic Rim Slings", "Wheel Ramp Extensions"],
    duration: "Loaded in 8 mins",
    imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80",
    story: "Because the vehicle has low ground clearance and the front battery guard was only 130mm off the ground, standard flatbeds would have scraped the underside. We extended low-angle ramp skates and secured only the tire rubber with non-scratch webbing.",
    verifiedOutcome: "Underside battery pack 100% scratch-free; new OEM tire fitted at authorized service center."
  },
  {
    id: "REC-203",
    title: "All-Wheel Drive (AWD) Dual-Motor Electrical Fault Safe Transport",
    vehicle: "Hyundai Ioniq 5 AWD",
    category: "highway",
    categoryLabel: "Highway Breakdown",
    location: "Outer Ring Expressway - Exit XX, City - XXXXXX",
    destination: "Hyundai EV Authorized Flagship Center, Sector XX",
    issue: "12V auxiliary system crashed and locked the 800V high-voltage contactor. Both front and rear motors permanently locked.",
    equipmentUsed: ["1000V Insulated Safety Gear", "4-Wheel Dolly Skates", "Full Platform Carrier"],
    duration: "Loaded in 9 mins",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    story: "Dual-motor AWD electric vehicles are the most vulnerable to improper towing: if any axle rotates while stationary, back-EMF voltage surges straight into the power electronics. Our crew used our 4-point wheel dolly system to isolate both axles from ground rotation completely.",
    verifiedOutcome: "Delivered directly into Hyundai's high-voltage bay. Inverter diagnostic passed with 100% health."
  },
  {
    id: "REC-204",
    title: "Basement Parking B2 Tight-Clearance Extraction",
    vehicle: "Mahindra XUV400 EV",
    category: "basement",
    categoryLabel: "Low-Clearance Parking",
    location: "Commercial Tech Complex B2 Parking, Sector XX",
    destination: "Customer Home Garage, Sector XX",
    issue: "Vehicle immobilized in basement parking level 2 with 2.1-meter ceiling clearance limit where heavy tow trucks cannot enter.",
    equipmentUsed: ["Low-Profile Extraction Winch", "Maneuvering Wheel Rollers", "Outdoor Transfer Flatbed"],
    duration: "Extracted in 14 mins",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    story: "Commercial basements are notorious for trapping dead EVs. Our rapid-response team entered the basement with compact mechanical dollies, wheeled the immobilized car up the ramp to the outdoor loading bay, and cleanly loaded it onto our full-size hydraulic flatbed.",
    verifiedOutcome: "Safely delivered home without any ceiling scrapes or ramp drag marks."
  },
  {
    id: "REC-205",
    title: "Highway Collision Recovery with Battery Safety Isolation",
    vehicle: "BYD Atto 3",
    category: "highway",
    categoryLabel: "Highway Breakdown",
    location: "Peripheral Expressway Corridor - Mile Marker XX",
    destination: "Authorized BYD Body & Service Bay, Sector XX",
    issue: "Front-end impact triggered high-voltage pyro-fuse disconnect. Steering rack misaligned and left wheel bound.",
    equipmentUsed: ["High-Voltage Safety Isolation PPE", "Heavy Winch with Snatch Block", "Full Flatbed Platform"],
    duration: "Secured in 11 mins",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
    story: "Following collision, electric vehicles require trained personnel who understand Blade battery chemistry and emergency disconnection procedures. Our EV-certified crew verified zero thermal runaway hazards before delicately winching the vehicle onto the tilt deck.",
    verifiedOutcome: "Delivered to authorized BYD facility. Battery casing was completely intact."
  },
  {
    id: "REC-206",
    title: "Suspension Link Failure Safe Flatbed Recovery",
    vehicle: "Kia EV6 GT-Line",
    category: "tire",
    categoryLabel: "Flat Tire / Rim Care",
    location: "Metro Link Corridor, Sector XX, City - XXXXXX",
    destination: "Kia Motors Service Hub, Sector XX",
    issue: "Pothole impact fractured lower control arm. Front wheel camber severely tilted against the wheel arch.",
    equipmentUsed: ["Air-Cushion Ramp Shims", "Hydraulic Slide Deck", "Precision Soft Strapping"],
    duration: "Loaded in 10 mins",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    story: "Dragging this car even a few feet would have ripped the fender and crushed the radiator coolant lines for the battery pack. Our crew used air-cushion shims to level the wheel before the hydraulic deck slid directly underneath the tire contact patches.",
    verifiedOutcome: "Loaded and unloaded with zero bodywork or coolant line damage."
  }
];
