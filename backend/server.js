const WebSocket = require('ws'); 
const wss = new WebSocket.Server({ port: 8080 }); 

console.log('Neptune AI: WebSocket Relay Server running on ws://localhost:8080'); 

wss.on('connection', (ws) => { 
    console.log('[NODE] Dashboard or ESP32 connected.'); 

    ws.on('message', (message) => { 
        // Instantly broadcast incoming ESP32 data to all connected dashboards 
        wss.clients.forEach((client) => { 
            if (client !== ws && client.readyState === WebSocket.OPEN) { 
                client.send(message.toString()); 
            } 
        }); 
    }); 

    ws.on('close', () => console.log('[NODE] Client disconnected.')); 
}); 
