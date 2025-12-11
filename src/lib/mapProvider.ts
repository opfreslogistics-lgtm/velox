/**
 * Map Provider Utility
 * Provides system-wide access to the current map provider setting
 */

export type MapProvider = 'google' | 'openstreetmap' | 'mapbox';

let cachedProvider: MapProvider | null = null;
let providerPromise: Promise<MapProvider> | null = null;

/**
 * Get the current map provider from the API
 * Results are cached to avoid repeated API calls
 */
export async function getCurrentMapProvider(): Promise<MapProvider> {
  // Return cached value if available
  if (cachedProvider) {
    return cachedProvider;
  }

  // Return existing promise if already fetching
  if (providerPromise) {
    return providerPromise;
  }

  // Fetch from API
  providerPromise = fetch('/api/map-provider')
    .then((res) => res.json())
    .then((data) => {
      const provider = (data.provider || 'google') as MapProvider;
      cachedProvider = provider;
      return provider;
    })
    .catch((err) => {
      console.error('Failed to fetch map provider:', err);
      return 'google' as MapProvider; // Default fallback
    })
    .finally(() => {
      providerPromise = null; // Clear promise after completion
    });

  return providerPromise;
}

/**
 * Clear the cached provider (call after updating provider)
 */
export function clearMapProviderCache() {
  cachedProvider = null;
  providerPromise = null;
}

/**
 * Check if a specific provider is currently selected
 */
export async function isMapProvider(provider: MapProvider): Promise<boolean> {
  const current = await getCurrentMapProvider();
  return current === provider;
}

/**
 * Check if OpenStreetMap is selected (for showing manual coordinate fields)
 */
export async function isOpenStreetMapSelected(): Promise<boolean> {
  return isMapProvider('openstreetmap');
}

