# VOLTRESCUE™ | 24/7 EV Flatbed Towing & Roadside Assistance Service

A modern, responsive, full-stack web application designed specifically for **Electric Vehicle (EV) Flatbed Towing & High-Voltage Roadside Recovery**, featuring three synchronized interfaces:

1. **Customer View** (Landing Page, Zero-Friction Booking, Live Tracking & Reviews)
2. **Owner / Dispatcher Dashboard** (PIN Protected `1234`, Call-First Verification Workflow, Approve/Reject Controls & Review Moderation)
3. **Tow Truck Driver View** (Mobile-first Driver Console, Receives Only Owner-Approved Jobs, One-Tap Status Progression & Throttled Live GPS)

---

## ⚡ Design & Aesthetic
- **Color Palette:** Modern automotive & EV aesthetic using an electric-blue/cyan accent palette (`#00D2FF`, `#00F5D4`, `#0F172A` dark slate backgrounds, and crisp structured cards for forms).
- **Zero-Degree Flatbed Focus:** Explicit educational safeguards highlighting why EVs with permanent-magnet synchronous motors cannot be towed with wheels on the ground.
- **Mobile-First Layout:** Designed for stranded motorists on expressways, mobile dispatchers, and tow truck drivers in the vehicle cabin.

---

## 🚀 Key Features by View

### 1. Customer View
- **Sticky Emergency Bar:** Always-visible click-to-call (`+91 99121 24247`), WhatsApp live chat (`wa.me`), and 24/7 Dispatch Live badge.
- **Zero-Friction Booking (No Login Required):**
  - Customer name & 10-digit mobile number (`+91`) with a 2-minute call verification note.
  - **One-Click Live GPS Sharing:** Browser `navigator.geolocation` with `enableHighAccuracy: true` + reverse geocoding to automatically resolve street addresses.
  - **Interactive Leaflet Map:** Draggable red pin to fine-tune exact curb location and landmark.
  - **Drop-off Destination:** Quick chips for authorized EV service centers (Tata.ev, MG Motors, Mahindra), nearest 60kW DC fast chargers, or home garage.
  - **EV Specifics:** EV model selector (Tata Nexon EV, Mahindra XUV400, MG ZS EV, Hyundai Ioniq 5, BYD Atto 3, etc.) and issue type with drive wheel lock alert for wheel skates.
- **Live Request Tracking (7-Step Stepper):**
  1. `Request Submitted (Awaiting Verification Call)`
  2. `Call Verified & Approved by Owner` *(or `Request Declined` with owner's reason)*
  3. `Assigned & Accepted by Tow Truck`
  4. `Driver En Route to Pickup`
  5. `Arrived at Pickup`
  6. `Vehicle Loaded & In Transit`
  7. `Completed`
  - Real-time map displaying the pinned pickup location, the live moving tow truck marker (with radar pulse), and estimated arrival time (ETA).
- **Customer Reviews:**
  - Overall average star rating and verified reviews list.
  - Add review form with 1–5 stars, name, EV model, and feedback.
  - Generates an `authorToken` in `localStorage` so customers can delete their own review.

---

### 2. Owner / Dispatcher Dashboard
- **Protected Access:** PIN protected with demo PIN `1234`.
- **Call-First Verification Workflow:**
  - Incoming requests land in the **Pending Call Verification** queue.
  - Prominent one-tap **"Call Customer"** (`tel:`) button.
  - **"Call Made"** toggle badge to keep track of calls.
  - **"Approve & Assign Truck"** (Green button): Sets agreed quote, selects truck (`Truck #01`, `Truck #02`), enters call notes, and pushes the job to the driver.
  - **"Reject / Cancel Request"** (Red button): Quick reason selector (`Fake / Unreachable Number`, `Out of Service Area`, `Customer Cancelled on Call`, `Duplicate Request`) that instantly updates the customer's tracking screen to `Declined`.
- **Order Sorting & Filtering:**
  - Sort by: **Newest First**, **Oldest First**, **Priority / Issue Type** (Accident > Dead Battery > Flat Tire), **Distance from Base Garage**, or **Status**.
  - Filter tabs: `All`, `Pending Verification`, `Approved & Active`, `Completed`, `Rejected / Cancelled`.
  - Search by Tracking ID, customer name, or mobile number.
- **Fleet Monitor:** Real-time status of both tow trucks.
- **Review Moderation:** View and delete reviews directly as Admin with confirmation prompt.

---

### 3. Tow Truck Driver View
- **Mobile-First Console:** Route `/driver` or bottom-right role switcher (`Truck #01` or `Truck #02`).
- **Spam-Proof Feed:** Receives **only** jobs call-verified and approved by the owner.
- **"Accept Tow Request" Button:** Accepts newly assigned jobs, notifies owner & customer, and activates GPS broadcasting.
- **One-Tap Thumb-Friendly Progression Button:**
  1. `Start Driving (En Route)`
  2. `Mark Arrived at Pickup`
  3. `EV Loaded & In Transit`
  4. `Complete Drop-off`
- **Live GPS Broadcasting & Turn-by-Turn Navigation:**
  - Broadcasts live coordinates throttled to **once every 5 seconds** (free tier quota optimized).
  - Toggle switch: `GPS Sharing: ON/OFF`.
  - One-tap **"Google Maps Nav"** straight to the customer's GPS pin.
  - One-tap **"Call Customer"** button.

---

## 🧪 Pre-Seeded Demo Data

The application comes pre-populated with:
1. **Demo Request 1 (`VT-8492`):** In `pending_verification` (Awaiting Owner Call)
   - Test the owner call verification flow: click **Owner** (PIN `1234`), review the call card, click **Approve & Assign Truck** or **Reject**.
2. **Demo Request 2 (`VT-3108`):** In `verified_approved` (Assigned to `Truck #01`)
   - Test the driver flow: click **Driver** -> `Truck #01`, click **Accept Tow Request**, and step through the progression while watching the customer tracking view!
3. **2 Tow Trucks:**
   - `Truck #01` (Driver: Rajesh Kumar, Plate: `XX-00-EV-0001`)
   - `Truck #02` (Driver: Vikram Rathore, Plate: `XX-00-EV-0002`)
4. **4 Verified Customer Reviews** (Tata Nexon EV, MG ZS EV, Mahindra XUV400, Hyundai Ioniq 5).
5. **Reset Seed Button:** Use the "Reset Seed" button on the floating switcher at any time to re-run the demo from scratch.

---

## 🛠️ Local Development & Build

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 🌐 Deployment to Vercel / Netlify & Custom Domain (GoDaddy)

### Option A: Vercel (Recommended)
1. Push code to GitHub.
2. In Vercel, click **Add New Project** and select this repository.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**.

### Option B: Netlify
1. Connect repository in Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy!

### Connecting GoDaddy Custom Domain:
1. Go to your GoDaddy DNS Management for your domain (e.g. `voltrescue.in` or `yourdomain.com`).
2. Add an **A Record**:
   - Host: `@`
   - Value: `76.76.21.21` (for Vercel)
3. Add a **CNAME Record**:
   - Host: `www`
   - Value: `cname.vercel-dns.com` (for Vercel)
4. In Vercel / Netlify Settings > **Domains**, enter your domain name. SSL is automatically provisioned for free!
