import { TowRequest, TowTruck, Review, RequestStatus, ServiceableLocation, EVVehicle, VehicleCategory } from '../types';
import { INITIAL_REQUESTS, INITIAL_TRUCKS, INITIAL_REVIEWS, BASE_GARAGE, INITIAL_SERVICEABLE_LOCATIONS } from '../data/seedData';
import { cloudDb } from './db';

const STORAGE_KEY = 'voltrescue_state_v1';
const REVIEW_TOKENS_KEY = 'voltrescue_my_author_tokens';

export interface AppState {
  requests: TowRequest[];
  trucks: TowTruck[];
  reviews: Review[];
  serviceableLocations: ServiceableLocation[];
}

// Distance helper (Haversine formula in km)
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

export function estimateEtaMinutes(distanceKm: number, averageSpeedKmh: number = 30): number {
  const timeHours = distanceKm / averageSpeedKmh;
  const timeMinutes = Math.round(timeHours * 60);
  return Math.max(3, timeMinutes); // Minimum 3 mins
}

class StoreService {
  private state: AppState;
  private listeners: Set<() => void> = new Set();
  private channel: BroadcastChannel | null = null;

  constructor() {
    this.state = this.loadState();

    // Setup cross-tab sync via BroadcastChannel
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('voltrescue_broadcast');
      this.channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC') {
          this.state = this.loadState();
          this.notify();
        }
      };
    }

    // Fallback sync via window storage event
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY) {
          this.state = this.loadState();
          this.notify();
        }
      });
    }
  }

  private loadState(): AppState {
    if (typeof window === 'undefined') {
      return {
        requests: INITIAL_REQUESTS,
        trucks: INITIAL_TRUCKS,
        reviews: INITIAL_REVIEWS,
        serviceableLocations: INITIAL_SERVICEABLE_LOCATIONS
      };
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.requests && parsed.trucks && parsed.reviews) {
          if (!parsed.serviceableLocations || parsed.serviceableLocations.length === 0) {
            parsed.serviceableLocations = INITIAL_SERVICEABLE_LOCATIONS;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse local storage state:', e);
    }

    // Default seed
    const defaultState: AppState = {
      requests: INITIAL_REQUESTS,
      trucks: INITIAL_TRUCKS,
      reviews: INITIAL_REVIEWS,
      serviceableLocations: INITIAL_SERVICEABLE_LOCATIONS
    };
    this.saveState(defaultState);
    return defaultState;
  }

  private saveState(state: AppState) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      this.channel?.postMessage({ type: 'SYNC', timestamp: Date.now() });
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AppState {
    return this.state;
  }

  public getRequests(): TowRequest[] {
    return this.state.requests;
  }

  public getTrucks(): TowTruck[] {
    return this.state.trucks;
  }

  public getReviews(): Review[] {
    return this.state.reviews;
  }

  public getRequestById(id: string): TowRequest | undefined {
    const cleanId = id.trim().toUpperCase();
    return this.state.requests.find((r) => r.id.toUpperCase() === cleanId);
  }

  public findRequest(query: string): TowRequest | undefined {
    const q = query.trim().replace(/\s+/g, '').toLowerCase();
    if (!q) return undefined;
    return this.state.requests.find((r) => {
      const matchId = r.id.toLowerCase().replace(/\s+/g, '') === q;
      const matchPhone = r.customerPhone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, ''));
      return matchId || (q.length >= 6 && matchPhone);
    });
  }

  // --- ACTIONS ---

  public createRequest(data: {
    customerName: string;
    customerPhone: string;
    pickupLocation: {
      address: string;
      lat: number;
      lng: number;
      landmark?: string;
    };
    dropoffLocation: {
      name: string;
      address: string;
      type: 'service_center' | 'fast_charger' | 'home' | 'custom';
    };
    vehicle: {
      category?: VehicleCategory;
      makeModel: string;
      regNumber?: string;
      color?: string;
      hasWheelLock?: boolean;
    };
    issueType: TowRequest['issueType'];
    issueDescription?: string;
    urgency: TowRequest['urgency'];
  }): TowRequest {
    // Generate unique ID like VT-5839
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newId = `VT-${randomDigits}`;

    const newRequest: TowRequest = {
      ...data,
      id: newId,
      status: 'pending_verification',
      callMade: false,
      callVerified: false,
      createdAt: new Date().toISOString(),
    };

    const updatedRequests = [newRequest, ...this.state.requests];
    this.state = { ...this.state, requests: updatedRequests };
    this.saveState(this.state);
    this.notify();
    cloudDb.syncTowRequest(newRequest);
    return newRequest;
  }

  public toggleCallMade(requestId: string): void {
    const updated = this.state.requests.map((r) => {
      if (r.id === requestId) {
        return { ...r, callMade: !r.callMade };
      }
      return r;
    });

    this.state = { ...this.state, requests: updated };
    this.saveState(this.state);
    this.notify();
  }

  public approveAndAssign(
    requestId: string,
    params: {
      agreedPrice: number;
      truckId: string;
      notes?: string;
    }
  ): void {
    const targetTruck = this.state.trucks.find((t) => t.id === params.truckId);
    if (!targetTruck) return;

    const req = this.state.requests.find((r) => r.id === requestId);
    if (!req) return;

    // Calculate initial ETA based on truck location and pickup location
    const dist = calculateDistanceKm(
      targetTruck.currentLocation.lat,
      targetTruck.currentLocation.lng,
      req.pickupLocation.lat,
      req.pickupLocation.lng
    );
    const eta = estimateEtaMinutes(dist);

    const updatedRequests = this.state.requests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'verified_approved' as RequestStatus,
          callVerified: true,
          callMade: true,
          agreedPrice: params.agreedPrice,
          callNotes: params.notes || r.callNotes,
          assignedTruckId: targetTruck.id,
          assignedDriverName: targetTruck.driverName,
          assignedDriverPhone: targetTruck.driverPhone,
          assignedTruckPlate: targetTruck.plateNumber,
          verifiedAt: new Date().toISOString(),
          etaMinutes: eta,
          driverLiveLocation: {
            lat: targetTruck.currentLocation.lat,
            lng: targetTruck.currentLocation.lng,
            updatedAt: new Date().toISOString(),
            speed: 0
          }
        };
      }
      return r;
    });

    // Update truck status
    const updatedTrucks = this.state.trucks.map((t) => {
      if (t.id === params.truckId) {
        return {
          ...t,
          status: 'assigned' as const,
          activeJobId: requestId
        };
      }
      return t;
    });

    this.state = {
      ...this.state,
      requests: updatedRequests,
      trucks: updatedTrucks
    };
    this.saveState(this.state);
    this.notify();

    const targetReq = updatedRequests.find((r) => r.id === requestId);
    if (targetReq) cloudDb.syncTowRequest(targetReq);
  }

  public rejectRequest(
    requestId: string,
    params: {
      reason: TowRequest['rejectionReason'];
      notes?: string;
    }
  ): void {
    const updatedRequests = this.state.requests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'declined' as RequestStatus,
          rejectionReason: params.reason,
          rejectionNotes: params.notes,
          callMade: true
        };
      }
      return r;
    });

    // Free up any truck that was assigned to this request
    const updatedTrucks = this.state.trucks.map((t) => {
      if (t.activeJobId === requestId) {
        return {
          ...t,
          status: 'idle' as const,
          activeJobId: null
        };
      }
      return t;
    });

    this.state = {
      ...this.state,
      requests: updatedRequests,
      trucks: updatedTrucks
    };
    this.saveState(this.state);
    this.notify();

    const targetReq = updatedRequests.find((r) => r.id === requestId);
    if (targetReq) cloudDb.syncTowRequest(targetReq);
  }

  public acceptJobByDriver(requestId: string, truckId: string): void {
    const updatedRequests = this.state.requests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'driver_accepted' as RequestStatus,
          acceptedAt: new Date().toISOString(),
        };
      }
      return r;
    });

    const updatedTrucks = this.state.trucks.map((t) => {
      if (t.id === truckId) {
        return {
          ...t,
          status: 'en_route' as const,
          activeJobId: requestId
        };
      }
      return t;
    });

    this.state = {
      ...this.state,
      requests: updatedRequests,
      trucks: updatedTrucks
    };
    this.saveState(this.state);
    this.notify();

    const targetReq = updatedRequests.find((r) => r.id === requestId);
    if (targetReq) cloudDb.syncTowRequest(targetReq);
  }

  public advanceDriverStatus(requestId: string): void {
    const req = this.state.requests.find((r) => r.id === requestId);
    if (!req) return;

    let nextStatus: RequestStatus = req.status;
    let nextTruckStatus: TowTruck['status'] = 'assigned';

    switch (req.status) {
      case 'verified_approved':
      case 'driver_accepted':
        nextStatus = 'en_route';
        nextTruckStatus = 'en_route';
        break;
      case 'en_route':
        nextStatus = 'arrived_pickup';
        nextTruckStatus = 'at_pickup';
        break;
      case 'arrived_pickup':
        nextStatus = 'in_transit';
        nextTruckStatus = 'in_transit';
        break;
      case 'in_transit':
        nextStatus = 'completed';
        nextTruckStatus = 'idle';
        break;
      default:
        return;
    }

    const now = new Date().toISOString();
    const updatedRequests = this.state.requests.map((r) => {
      if (r.id === requestId) {
        const patch: Partial<TowRequest> = { status: nextStatus };
        if (nextStatus === 'arrived_pickup') patch.arrivedAt = now;
        if (nextStatus === 'in_transit') patch.loadedAt = now;
        if (nextStatus === 'completed') {
          patch.completedAt = now;
          patch.etaMinutes = 0;
        }
        return { ...r, ...patch };
      }
      return r;
    });

    // Update corresponding truck
    const updatedTrucks = this.state.trucks.map((t) => {
      if (t.id === req.assignedTruckId) {
        return {
          ...t,
          status: nextTruckStatus,
          activeJobId: nextStatus === 'completed' ? null : t.activeJobId
        };
      }
      return t;
    });

    this.state = {
      ...this.state,
      requests: updatedRequests,
      trucks: updatedTrucks
    };
    this.saveState(this.state);
    this.notify();

    const targetReq = updatedRequests.find((r) => r.id === requestId);
    if (targetReq) cloudDb.syncTowRequest(targetReq);
  }

  public updateDriverLocation(
    truckId: string,
    lat: number,
    lng: number,
    heading: number = 0,
    speed: number = 30
  ): void {
    const updatedTrucks = this.state.trucks.map((t) => {
      if (t.id === truckId) {
        return {
          ...t,
          currentLocation: { lat, lng }
        };
      }
      return t;
    });

    // If this truck has an active job, update driverLiveLocation and recalculate ETA
    const truck = this.state.trucks.find((t) => t.id === truckId);
    let updatedRequests = this.state.requests;

    if (truck && truck.activeJobId) {
      const activeJob = this.state.requests.find((r) => r.id === truck.activeJobId);
      if (activeJob && activeJob.status !== 'completed' && activeJob.status !== 'declined') {
        const targetLat = activeJob.status === 'in_transit' 
          ? (activeJob.pickupLocation.lat + 0.05) // Destination proxy
          : activeJob.pickupLocation.lat;
        const targetLng = activeJob.status === 'in_transit'
          ? (activeJob.pickupLocation.lng + 0.05)
          : activeJob.pickupLocation.lng;

        const dist = calculateDistanceKm(lat, lng, targetLat, targetLng);
        const eta = estimateEtaMinutes(dist, Math.max(20, speed));

        updatedRequests = this.state.requests.map((r) => {
          if (r.id === truck.activeJobId) {
            return {
              ...r,
              etaMinutes: eta,
              driverLiveLocation: {
                lat,
                lng,
                updatedAt: new Date().toISOString(),
                heading,
                speed
              }
            };
          }
          return r;
        });
      }
    }

    this.state = {
      ...this.state,
      trucks: updatedTrucks,
      requests: updatedRequests
    };
    this.saveState(this.state);
    this.notify();

    cloudDb.broadcastDriverLocation(truckId, lat, lng, heading, speed);
    if (truck && truck.activeJobId) {
      const activeReq = updatedRequests.find((r) => r.id === truck.activeJobId);
      if (activeReq) cloudDb.syncTowRequest(activeReq);
    }
  }

  // --- REVIEWS ---

  public addReview(data: {
    customerName: string;
    evModel: string;
    rating: number;
    comment: string;
    serviceType?: string;
  }): Review {
    const authorToken = 'user-' + Math.random().toString(36).substring(2, 10);
    const newReview: Review = {
      id: 'REV-' + Date.now().toString().slice(-4),
      customerName: data.customerName,
      evModel: data.evModel,
      rating: data.rating,
      comment: data.comment,
      date: 'Just now',
      serviceType: data.serviceType || 'EV Roadside Flatbed Towing',
      authorToken,
      verified: true
    };

    // Store author token in localStorage
    if (typeof window !== 'undefined') {
      try {
        const tokens: string[] = JSON.parse(localStorage.getItem(REVIEW_TOKENS_KEY) || '[]');
        tokens.push(authorToken);
        localStorage.setItem(REVIEW_TOKENS_KEY, JSON.stringify(tokens));
      } catch (e) {
        console.error('Error saving review token', e);
      }
    }

    const updatedReviews = [newReview, ...this.state.reviews];
    this.state = { ...this.state, reviews: updatedReviews };
    this.saveState(this.state);
    this.notify();
    cloudDb.syncReview(newReview);
    return newReview;
  }

  public isReviewAuthor(reviewId: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const review = this.state.reviews.find((r) => r.id === reviewId);
      if (!review) return false;
      const tokens: string[] = JSON.parse(localStorage.getItem(REVIEW_TOKENS_KEY) || '[]');
      return tokens.includes(review.authorToken);
    } catch {
      return false;
    }
  }

  public deleteReview(reviewId: string, isAdmin: boolean = false): boolean {
    const review = this.state.reviews.find((r) => r.id === reviewId);
    if (!review) return false;

    if (!isAdmin && !this.isReviewAuthor(reviewId)) {
      return false;
    }

    const updatedReviews = this.state.reviews.filter((r) => r.id !== reviewId);
    this.state = { ...this.state, reviews: updatedReviews };
    this.saveState(this.state);
    this.notify();
    return true;
  }

  public resetToDemo(): void {
    const defaultState: AppState = {
      requests: INITIAL_REQUESTS,
      trucks: INITIAL_TRUCKS,
      reviews: INITIAL_REVIEWS,
      serviceableLocations: INITIAL_SERVICEABLE_LOCATIONS
    };
    this.state = defaultState;
    this.saveState(defaultState);
    this.notify();
  }

  // --- SERVICEABLE LOCATIONS ---

  public getServiceableLocations(): ServiceableLocation[] {
    return this.state.serviceableLocations || INITIAL_SERVICEABLE_LOCATIONS;
  }

  public addServiceableLocation(data: Omit<ServiceableLocation, 'id'>): ServiceableLocation {
    const newId = 'LOC-' + Math.floor(100 + Math.random() * 900);
    const newLocation: ServiceableLocation = {
      ...data,
      id: newId
    };
    const updated = [newLocation, ...(this.state.serviceableLocations || INITIAL_SERVICEABLE_LOCATIONS)];
    this.state = { ...this.state, serviceableLocations: updated };
    this.saveState(this.state);
    this.notify();
    return newLocation;
  }

  public toggleServiceableLocation(id: string): void {
    const updated = (this.state.serviceableLocations || INITIAL_SERVICEABLE_LOCATIONS).map((loc) => {
      if (loc.id === id) {
        return { ...loc, isActive: !loc.isActive };
      }
      return loc;
    });
    this.state = { ...this.state, serviceableLocations: updated };
    this.saveState(this.state);
    this.notify();
  }

  public removeServiceableLocation(id: string): void {
    const updated = (this.state.serviceableLocations || INITIAL_SERVICEABLE_LOCATIONS).filter((loc) => loc.id !== id);
    this.state = { ...this.state, serviceableLocations: updated };
    this.saveState(this.state);
    this.notify();
  }

  public getBaseGarage(): typeof BASE_GARAGE {
    return BASE_GARAGE;
  }
}

export const store = new StoreService();
