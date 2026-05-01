/**
 * Simple API client for AquaFlow AI
 * Handles valve control and alert fetching
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

/**
 * Send valve control command to backend
 */
export async function setValveAngle(angle: number): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/api/valve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ angle }),
    });

    if (!response.ok) {
      console.error('Failed to set valve angle:', response.statusText);
    }
  } catch (error) {
    console.error('Error setting valve angle:', error);
  }
}

/**
 * Fetch alerts from backend
 */
export async function fetchAlerts(): Promise<any[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/alerts`);
    if (!response.ok) {
      console.error('Failed to fetch alerts:', response.statusText);
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
}

/**
 * Check system health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

