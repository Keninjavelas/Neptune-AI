const WebSocket = require('ws'); 
const ws = new WebSocket('ws://localhost:8080'); 

ws.on('open', () => { 
    console.log('[SIM_HARDWARE] Connected to Relay Server. Emitting telemetry...'); 
    
    setInterval(() => { 
        // Dummy payload matching our TelemetryPacket type 
        const payload = { 
            flowRate: parseFloat((Math.random() * (6.2 - 4.8) + 4.8).toFixed(2)), 
            tds: Math.floor(Math.random() * (150 - 90) + 90), 
            riskScore: Math.floor(Math.random() * 10), 
            valveState: 'OPEN', 
            relayState: true, 
            systemHealth: 'OPTIMAL', 
            anomalyLevel: 0, 
            alertStatus: 'SAFE', 
            telemetryStatus: 'ONLINE', 
            operationsLogs: [{ 
                id: Date.now().toString(), 
                timestamp: new Date().toISOString(), 
                level: 'INFO', 
                message: 'Hardware telemetry uplink stable', 
                nodeId: 'ESP32_CORE_01' 
            }], 
            timestamps: { lastUpdated: new Date().toISOString() } 
        }; 
        
        ws.send(JSON.stringify(payload)); 
    }, 1000); 
}); 
