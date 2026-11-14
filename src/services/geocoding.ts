export interface ReverseGeocodeResult {
  address: string;
  road?: string;
  suburb?: string;
  city?: string;
  state?: string;
  postcode?: string;
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'VoltRescue-EV-App/1.0'
        },
        signal: controller.signal
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.display_name) {
        // Build clean readable address
        const parts = [];
        if (data.address.road) parts.push(data.address.road);
        if (data.address.neighbourhood || data.address.suburb) parts.push(data.address.neighbourhood || data.address.suburb);
        if (data.address.city || data.address.town || data.address.village) parts.push(data.address.city || data.address.town || data.address.village);
        if (data.address.state) parts.push(data.address.state);
        
        return parts.length > 0 ? parts.join(', ') : data.display_name;
      }
    }
  } catch {
    // Graceful fallback to readable coordinates format
  }

  // Fallback if nominatim fails or times out
  return `GPS Pin (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
}
