# AquaFlow AI - Developer Checklist & ESP32 Setup

## ✅ Backend Setup Checklist

- [ ] **Install Node.js 18+** – Download from nodejs.org
- [ ] **Install Docker Desktop** – With Docker Compose
- [ ] **Clone the repository** – `git clone ...`
- [ ] **Run `npm run install:all`** – Install all dependencies
- [ ] **Create `.env` file** in `backend/` with:
  ```env
  NODE_ENV=development
  PORT=3000
  DATABASE_URL=postgresql://aquaflow:aquaflow@localhost:5432/aquaflow
  MQTT_BROKER_URL=mqtt://localhost:1883
  CORS_ORIGIN=http://localhost:3000
  ```
- [ ] **Run `npm run dev:infra`** – Start PostgreSQL + MQTT
- [ ] **Run `npm run dev` in backend** – Start Express API
- [ ] **Run `npm run dev` in frontend** – Start Next.js dashboard
- [ ] **Visit http://localhost:3000** – Verify dashboard loads

---

## 🔧 ESP32 Hardware Setup

### Components Needed
- [ ] ESP32 Dev Kit (or equivalent)
- [ ] YF-S201 Flow Sensor
- [ ] SG90 Servo Motor
- [ ] Mini DC Water Pump (3-6V)
- [ ] USB Power Supply (5V)
- [ ] Flexible Tubing (10mm)
- [ ] Breadboard & Jumper Wires
- [ ] MicroUSB Cable (for programming)

### Pinout (ESP32)
```
YF-S201 Sensor:
  RED     → 5V Power
  BLACK   → GND
  YELLOW  → GPIO 4 (Pulse input)

SG90 Servo:
  RED     → 5V Power
  BROWN   → GND
  ORANGE  → GPIO 25 (PWM)

Pump Motor:
  RED     → 5V Power (via transistor)
  BLACK   → GND
```

---

## 📝 ESP32 Arduino Code Template

Create a new Arduino sketch with this structure:

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <ESP32Servo.h>

// ===== Configuration =====
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "192.168.1.100";  // Your backend IP
const int mqtt_port = 1883;
const char* mqtt_clientId = "esp32-01";

// ===== Pins =====
const int FLOW_SENSOR_PIN = 4;
const int SERVO_PIN = 25;
const int PUMP_PIN = 26;

// ===== Variables =====
WiFiClient espClient;
PubSubClient mqttClient(espClient);
Servo servo;

volatile int pulseCount = 0;
unsigned long lastMillis = 0;
float flowRate = 0.0;  // L/min

// ===== ISR for Flow Sensor =====
void IRAM_ATTR countPulse() {
  pulseCount++;
}

// ===== Setup =====
void setup() {
  Serial.begin(115200);
  
  // Flow sensor
  pinMode(FLOW_SENSOR_PIN, INPUT);
  attachInterrupt(FLOW_SENSOR_PIN, countPulse, RISING);
  
  // Servo
  servo.attach(SERVO_PIN);
  servo.write(90);  // Neutral position
  
  // Pump
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, HIGH);  // Start pump
  
  // WiFi
  connectToWiFi();
  
  // MQTT
  mqttClient.setServer(mqtt_server, mqtt_port);
  mqttClient.setCallback(onMqttMessage);
  connectToMqtt();
}

// ===== WiFi Connection =====
void connectToWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  }
}

// ===== MQTT Connection =====
void connectToMqtt() {
  while (!mqttClient.connected()) {
    Serial.println("Connecting to MQTT...");
    
    if (mqttClient.connect(mqtt_clientId)) {
      Serial.println("MQTT connected!");
      mqttClient.subscribe("aquaflow/esp32/esp32-01/servo/command");
    } else {
      Serial.print("Failed, rc=");
      Serial.print(mqttClient.state());
      delay(2000);
    }
  }
}

// ===== MQTT Callback (Servo Control) =====
void onMqttMessage(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  // Parse JSON: {"angle": 45}
  // For MVP, just parse the angle number
  int angle = message.toInt();
  
  if (angle >= 0 && angle <= 180) {
    servo.write(angle);
    Serial.print("Servo set to: ");
    Serial.println(angle);
  }
}

// ===== Main Loop =====
void loop() {
  // Reconnect if needed
  if (!mqttClient.connected()) {
    connectToMqtt();
  }
  mqttClient.loop();
  
  // Calculate flow rate every 1 second
  unsigned long currentMillis = millis();
  if (currentMillis - lastMillis >= 1000) {
    // Pulses per second × (1000 / 5.5) = L/min
    // YF-S201 calibration: ~5.5 pulses per liter
    flowRate = (pulseCount * 60.0) / 5.5;
    
    // Create JSON payload
    char payload[100];
    snprintf(payload, sizeof(payload),
      "{\"flow\":%.2f,\"pressure\":%.1f,\"temperature\":%.1f,\"timestamp\":%lu}",
      flowRate, 2.5, 22.0, currentMillis);
    
    // Publish to MQTT
    mqttClient.publish("aquaflow/esp32/esp32-01/flow", payload);
    
    // Debug output
    Serial.print("Flow: ");
    Serial.print(flowRate);
    Serial.println(" L/min");
    
    // Reset for next second
    pulseCount = 0;
    lastMillis = currentMillis;
  }
  
  delay(10);
}
```

### Flow Sensor Calibration

The YF-S201 sensor outputs approximately **5.5 pulses per liter**. Adjust the calculation if your sensor differs:

```cpp
// Typical flow rate calculation:
// pulseCount = number of pulses in 1 second
// flowRate (L/min) = (pulseCount × 60) / pulses_per_liter
// For YF-S201: flowRate = (pulseCount × 60) / 5.5
```

To calibrate:
1. Measure exactly 1 liter into a container
2. Count pulses and note the time
3. Calculate `pulses_per_liter = pulseCount / liters`

---

## 🧪 Testing Without Hardware

You can test the entire system without ESP32 hardware:

### Option 1: Manual MQTT Publish
```bash
# Terminal with mosquitto client installed:
mosquitto_pub -h localhost -t "aquaflow/esp32/esp32-01/flow" \
  -m '{"flow": 5.2, "pressure": 2.5, "temperature": 22.1, "timestamp": 1234567890}'
```

### Option 2: Simple Node.js Publisher
Create `test-publisher.js`:
```javascript
const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('Connected to MQTT');
  
  setInterval(() => {
    const flow = 5.0 + (Math.random() - 0.5) * 0.5;  // Normal: ~5.0 L/min
    const payload = {
      flow: parseFloat(flow.toFixed(2)),
      pressure: 2.5,
      temperature: 22.0,
      timestamp: Date.now()
    };
    
    client.publish(
      'aquaflow/esp32/esp32-01/flow',
      JSON.stringify(payload)
    );
    
    console.log(`Published: ${JSON.stringify(payload)}`);
  }, 1000);
});

client.on('error', (err) => {
  console.error('MQTT Error:', err);
  process.exit(1);
});
```

Run with: `node test-publisher.js`

---

## 🎬 Live Demo Checklist

### Before the Demo (5 minutes setup)
- [ ] Backend running: `cd backend && npm run dev`
- [ ] Frontend running: `cd frontend && npm run dev`
- [ ] Dashboard open at http://localhost:3000
- [ ] ESP32 connected and publishing telemetry (or using test-publisher.js)
- [ ] No alerts on dashboard (normal operation)

### During the Demo (3-4 minutes)
1. **Show Dashboard** (30 seconds)
   - [ ] Point out real-time flow chart
   - [ ] Show valve status (open/closed)
   - [ ] Show "No alerts" message

2. **Simulate Normal Operation** (30 seconds)
   - [ ] Flow rate stable at ~5.0 L/min
   - [ ] Dashboard updates smoothly
   - [ ] Explain the system is monitoring...

3. **Trigger Leak** (1 minute)
   - [ ] Partially block pump inlet (or set flow to 2.0 in test script)
   - [ ] **Wait 1-2 seconds...**
   - [ ] **Alert appears!** 🚨
   - [ ] Point out: "System detected abnormal flow!"
   - [ ] Servo motor closes valve (or show command in MQTT)
   - [ ] Flow chart shows the spike/drop

4. **Manual Recovery** (30 seconds)
   - [ ] Unblock inlet (or restore flow to 5.0)
   - [ ] Use valve slider to reopen (or auto-resets)
   - [ ] System returns to normal
   - [ ] Alert clears

### Post-Demo
- [ ] Take questions
- [ ] Show code (`backend/src/services/apiService.js` for logic)
- [ ] Discuss future: ML, cloud deployment, etc.

---

## 🐛 Troubleshooting

### Dashboard shows "Offline"
- Check if backend is running: `curl http://localhost:3000/health`
- Check WebSocket connection: Browser DevTools → Network → WS

### No telemetry appearing
- Check MQTT broker: `docker logs aquaflow_mqtt`
- Verify ESP32 is publishing: Check MQTT topic with mosquitto_sub
- Check database: `psql` and query `flow_telemetry` table

### Servo not responding
- Check MQTT subscription: Backend should log incoming servo commands
- Verify servo pin (GPIO 25) in ESP32 code
- Test servo separately with simple PWM code

### Docker containers won't start
- Check ports: `netstat -an | grep 5432` (PostgreSQL should be on 5432)
- Restart Docker Desktop
- Run `docker system prune` to clean up

---

## 📚 Resources

- **ESP32 Documentation**: https://docs.espressif.com/projects/esp-idf/
- **Arduino IDE**: https://www.arduino.cc/en/software
- **MQTT Protocol**: http://mqtt.org/
- **PubSubClient Library**: https://github.com/knolleary/pubsubclient
- **Flow Sensor Datasheet**: YF-S201 (search online for pinout)

---

## 🚀 Next Steps After Hackathon

1. **Add more ESP32 devices** – Update MQTT topics in backend
2. **Implement ML anomaly detection** – Use historical flow patterns
3. **Add push notifications** – Alert users on their phones
4. **Deploy to cloud** – Azure Container Apps or AWS
5. **Water quality sensors** – Extend with pH, turbidity measurements
6. **Mobile app** – React Native frontend

---

**Good luck with your AquaFlow AI hackathon! 🌊**
