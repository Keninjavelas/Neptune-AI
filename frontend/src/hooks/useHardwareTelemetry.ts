import { useState, useEffect } from 'react'; 
import { TelemetryPacket } from '../types/telemetry'; 

export const useHardwareTelemetry = () => { 
    const [telemetry, setTelemetry] = useState<TelemetryPacket | null>(null); 
    const [isHardwareConnected, setIsHardwareConnected] = useState(false); 

    useEffect(() => { 
        const ws = new WebSocket('ws://localhost:8080'); 

        ws.onopen = () => setIsHardwareConnected(true); 
        
        ws.onmessage = (event) => { 
            try { 
                const data = JSON.parse(event.data); 
                setTelemetry(data); 
            } catch (err) { 
                console.error('Failed to parse hardware telemetry packet', err); 
            } 
        }; 

        ws.onclose = () => setIsHardwareConnected(false); 

        return () => ws.close(); 
    }, []); 

    return { telemetry, isHardwareConnected }; 
}; 
