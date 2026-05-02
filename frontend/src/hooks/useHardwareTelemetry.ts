import { useState, useEffect, useRef, useCallback } from 'react'; 
import { TelemetryPacket } from '../types/telemetry'; 

const WS_URL = 'ws://localhost:8080';
const RECONNECT_INTERVAL = 3000;

export const useHardwareTelemetry = () => { 
    const [telemetry, setTelemetry] = useState<TelemetryPacket | null>(null); 
    const [isHardwareConnected, setIsHardwareConnected] = useState(false); 
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) return;

        // Cleanup existing connection if any
        if (wsRef.current) {
            console.log('[WS] Cleaning up previous connection attempt');
            wsRef.current.onopen = null;
            wsRef.current.onmessage = null;
            wsRef.current.onclose = null;
            wsRef.current.onerror = null;
            wsRef.current.close();
        }

        console.log('[WS] Establishing connection to Hardware Bridge...');
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('[WS] Uplink Established');
            setIsHardwareConnected(true);
            
            // Identify as dashboard to the backend
            ws.send(JSON.stringify({ type: 'dashboard' }));
            
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Atomic update from the packet with timestamp
                setTelemetry({
                    ...data,
                    lastUpdated: Date.now()
                });
            } catch (err) {
                console.error('[WS] Data Parse Error:', err);
            }
        };

        ws.onclose = (event) => {
            console.warn(`[WS] Connection Lost (Code: ${event.code})`);
            setIsHardwareConnected(false);
            wsRef.current = null;
            
            // Avoid multiple reconnect attempts
            if (!reconnectTimeoutRef.current) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log('[WS] Retrying Uplink...');
                    reconnectTimeoutRef.current = null;
                    connect();
                }, RECONNECT_INTERVAL);
            }
        };

        ws.onerror = (error) => {
            console.error('[WS] Transport Error:', error);
            // Error usually precedes onclose, so we don't need to manually close here
        };
    }, []);

    useEffect(() => {
        connect();
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connect]);

    const sendCommand = useCallback((command: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ command }));
            console.log(`[WS] Command sent: ${command}`);
            return true;
        } else {
            console.error('[WS] Cannot send command: WebSocket not connected');
            // Proactively try to reconnect if we're attempting actions
            connect();
            return false;
        }
    }, [connect]);

    return { telemetry, isHardwareConnected, sendCommand }; 
}; 
