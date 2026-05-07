# TradeNexus - Distributed Smart E-Commerce System

TradeNexus is a full microservices-based e-commerce platform for CS-432 (Distributed Computing), designed with industry-grade service boundaries, API gateway routing, JWT auth, and Docker-first deployment.

---

## 🚀 Quick Start (How to Run)

### 1. Prerequisites
- **Docker Desktop** installed and running.

### 2. Start the System
Run the following command in the root folder:
```bash
docker compose up --build
```

### 3. Access
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Gateway Health**: [http://localhost:4000/health](http://localhost:4000/health)

---

## 📄 Project Documentation
For the full **Design & Analysis Document**, including:
- Problem Statement
- Architectural Diagrams
- Sustainability & Environmental Analysis (CLO-3)
- Performance Benchmarking

Please refer to: **[Distributed_System_Report.md](./Distributed_System_Report.md)**

---

## 🛠️ Distributed Architecture
- `api-gateway` (Port `4000`) - routing, auth, logging.
- `user-service` (Port `4001`) - JWT auth & profiles.
- `product-service` (Port `4002`) - catalog management.
- `order-service` (Port `4003`) - orchestration & lifecycle.
- `payment-service` (Port `4004`) - simulation.
- `frontend` (Port `5173`) - Premium React Dashboard.

---

## 📊 Performance Benchmarking
To run the load simulation:
```bash
node scripts/benchmark.js
```
This demonstrates the system's ability to handle concurrent distributed requests.

