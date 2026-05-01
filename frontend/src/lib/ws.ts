'use client';

/**
 * Legacy WebSocket module (not used in MVP)
 * Kept for backward compatibility
 */

export type WsStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export function attachRealtimeSync(callback: (status: WsStatus) => void): () => void {
  callback('connected');
  return () => {};
}

export function subscribeToChannel(channel: string, callback: (data: unknown) => void): () => void {
  console.log('Subscribe to channel (not implemented):', channel);
  return () => {};
}
