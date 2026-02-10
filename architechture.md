## I.B. Justification of Architecture Style Choice  

### Why Microservices is the Best Fit?

### 1. Scalability
- Each service (CI Orchestrator, Log Monitor, AI Failure Classifier, Notification Service) can scale independently.
- High-load components (e.g., Log Monitoring) can be scaled without affecting others.
