'use client';

/**
 * Simplified WebSocket hook (legacy - not used in MVP)
 * Kept for backward compatibility
 */

import { useCallback, useState } from 'react';

export interface WsStatus {
  isConnected: boolean;
  error: string | null;
}

export function useWebSocket() {
  const [status] = useState<WsStatus>({
    isConnected: false,
    error: null,
  });

  const subscribe = useCallback((channel: string, callback: (data: unknown) => void) => {
    console.log('Subscribe (not implemented in MVP):', channel);
    return () => {};
  }, []);

  return { subscribe, status };
}
