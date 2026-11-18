/**
 * Cloud Database Service (Free Tier Compatible)
 * 
 * Supports:
 * 1. Supabase (Free Tier: 500MB DB, 200 Realtime connections, unlimited API calls)
 * 2. Firebase Realtime DB / Firestore (Spark Free Plan: 20k writes/day, 50k reads/day)
 * 3. Local + Cross-Tab Reactive Store (Zero Config, 100% Free out-of-the-box via BroadcastChannel)
 */

import { TowRequest, TowTruck, Review } from '../types';

export interface DatabaseConfig {
  provider: 'local' | 'supabase' | 'firebase';
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  firebaseDbUrl?: string;
}

// Read configuration from Vite environment variables
export const dbConfig: DatabaseConfig = {
  provider: (import.meta.env.VITE_DB_PROVIDER as 'supabase' | 'firebase') ||
    (import.meta.env.VITE_SUPABASE_URL ? 'supabase' : import.meta.env.VITE_FIREBASE_DB_URL ? 'firebase' : 'local'),
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  firebaseDbUrl: import.meta.env.VITE_FIREBASE_DB_URL,
};

class CloudDbService {
  private config: DatabaseConfig;
  private isOnline: boolean = true;

  constructor(config: DatabaseConfig) {
    this.config = config;
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      window.addEventListener('online', () => { this.isOnline = true; });
      window.addEventListener('offline', () => { this.isOnline = false; });
    }
  }

  public getProvider(): string {
    return this.config.provider;
  }

  public isCloudConnected(): boolean {
    if (this.config.provider === 'supabase') {
      return Boolean(this.config.supabaseUrl && this.config.supabaseAnonKey);
    }
    if (this.config.provider === 'firebase') {
      return Boolean(this.config.firebaseDbUrl);
    }
    return false;
  }

  /**
   * Sync a Tow Request to cloud database if configured
   */
  public async syncTowRequest(request: TowRequest): Promise<boolean> {
    if (!this.isCloudConnected() || !this.isOnline) return false;

    try {
      if (this.config.provider === 'supabase' && this.config.supabaseUrl && this.config.supabaseAnonKey) {
        // Upsert to Supabase 'tow_requests' table via standard PostgREST API
        const res = await fetch(`${this.config.supabaseUrl}/rest/v1/tow_requests`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.config.supabaseAnonKey,
            'Authorization': `Bearer ${this.config.supabaseAnonKey}`,
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(request)
        });
        return res.ok;
      }

      if (this.config.provider === 'firebase' && this.config.firebaseDbUrl) {
        // Write to Firebase Realtime Database
        const res = await fetch(`${this.config.firebaseDbUrl}/tow_requests/${request.id}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request)
        });
        return res.ok;
      }
    } catch (err) {
      console.warn('[CloudDB] Cloud sync failed, falling back to local store:', err);
    }
    return false;
  }

  /**
   * Broadcast Driver Live GPS Coordinates (throttled to 5 seconds)
   * Stored in cloud as lightweight coordinate object to conserve bandwidth & free tier writes.
   */
  public async broadcastDriverLocation(
    truckId: string,
    lat: number,
    lng: number,
    heading?: number,
    speed?: number
  ): Promise<boolean> {
    if (!this.isCloudConnected() || !this.isOnline) return false;

    const payload = {
      truckId,
      lat,
      lng,
      heading: heading || 0,
      speed: speed || 0,
      updatedAt: new Date().toISOString()
    };

    try {
      if (this.config.provider === 'supabase' && this.config.supabaseUrl && this.config.supabaseAnonKey) {
        await fetch(`${this.config.supabaseUrl}/rest/v1/truck_telemetry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.config.supabaseAnonKey,
            'Authorization': `Bearer ${this.config.supabaseAnonKey}`,
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(payload)
        });
        return true;
      }

      if (this.config.provider === 'firebase' && this.config.firebaseDbUrl) {
        await fetch(`${this.config.firebaseDbUrl}/truck_telemetry/${truckId}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return true;
      }
    } catch (err) {
      // Non-blocking telemetry warning
      console.debug('[CloudDB] Telemetry write skipped:', err);
    }
    return false;
  }

  /**
   * Sync Review to cloud
   */
  public async syncReview(review: Review): Promise<boolean> {
    if (!this.isCloudConnected() || !this.isOnline) return false;

    try {
      if (this.config.provider === 'supabase' && this.config.supabaseUrl && this.config.supabaseAnonKey) {
        const res = await fetch(`${this.config.supabaseUrl}/rest/v1/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.config.supabaseAnonKey,
            'Authorization': `Bearer ${this.config.supabaseAnonKey}`,
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(review)
        });
        return res.ok;
      }

      if (this.config.provider === 'firebase' && this.config.firebaseDbUrl) {
        const res = await fetch(`${this.config.firebaseDbUrl}/reviews/${review.id}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(review)
        });
        return res.ok;
      }
    } catch (err) {
      console.warn('[CloudDB] Sync review failed:', err);
    }
    return false;
  }

  /**
   * Fetch a single tow request by ID from cloud (Supabase or Firebase)
   */
  public async fetchTowRequestById(id: string): Promise<TowRequest | null> {
    if (!this.isCloudConnected() || !this.isOnline) return null;

    try {
      if (this.config.provider === 'firebase' && this.config.firebaseDbUrl) {
        const res = await fetch(`${this.config.firebaseDbUrl}/tow_requests/${id}.json`);
        if (!res.ok) return null;
        const data = await res.json();
        return data as TowRequest | null;
      }

      if (this.config.provider === 'supabase' && this.config.supabaseUrl && this.config.supabaseAnonKey) {
        const res = await fetch(`${this.config.supabaseUrl}/rest/v1/tow_requests?id=eq.${id}`, {
          headers: {
            'apikey': this.config.supabaseAnonKey,
            'Authorization': `Bearer ${this.config.supabaseAnonKey}`
          }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.[0] || null;
      }
    } catch (err) {
      console.warn('[CloudDB] Fetch single request failed:', err);
    }
    return null;
  }

  /**
   * Fetch all tow requests from cloud (Supabase or Firebase)
   */
  public async fetchTowRequests(): Promise<TowRequest[] | null> {
    if (!this.isCloudConnected() || !this.isOnline) return null;

    try {
      if (this.config.provider === 'firebase' && this.config.firebaseDbUrl) {
        const res = await fetch(`${this.config.firebaseDbUrl}/tow_requests.json`);
        if (!res.ok) return null;
        const data = await res.json();
        if (!data) return [];
        return Object.values(data) as TowRequest[];
      }

      if (this.config.provider === 'supabase' && this.config.supabaseUrl && this.config.supabaseAnonKey) {
        const res = await fetch(`${this.config.supabaseUrl}/rest/v1/tow_requests?select=*`, {
          headers: {
            'apikey': this.config.supabaseAnonKey,
            'Authorization': `Bearer ${this.config.supabaseAnonKey}`
          }
        });
        if (!res.ok) return null;
        return (await res.json()) as TowRequest[];
      }
    } catch (err) {
      console.warn('[CloudDB] Fetch requests failed:', err);
    }
    return null;
  }

  /**
   * Fetch reviews from cloud (Supabase or Firebase)
   */
  public async fetchReviews(): Promise<Review[] | null> {
    if (!this.isCloudConnected() || !this.isOnline) return null;

    try {
      if (this.config.provider === 'firebase' && this.config.firebaseDbUrl) {
        const res = await fetch(`${this.config.firebaseDbUrl}/reviews.json`);
        if (!res.ok) return null;
        const data = await res.json();
        if (!data) return [];
        return Object.values(data) as Review[];
      }

      if (this.config.provider === 'supabase' && this.config.supabaseUrl && this.config.supabaseAnonKey) {
        const res = await fetch(`${this.config.supabaseUrl}/rest/v1/reviews?select=*`, {
          headers: {
            'apikey': this.config.supabaseAnonKey,
            'Authorization': `Bearer ${this.config.supabaseAnonKey}`
          }
        });
        if (!res.ok) return null;
        return (await res.json()) as Review[];
      }
    } catch (err) {
      console.warn('[CloudDB] Fetch reviews failed:', err);
    }
    return null;
  }
}

export const cloudDb = new CloudDbService(dbConfig);
