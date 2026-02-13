## I.A. Chosen Software Architecture Style

### Microservices Architecture

### 1.Justification for Choosing Microservices Architecture

- System is divided into small, independent services
- Each service performs a specific function
- Services communicate using APIs
- Each service can be deployed independently

### 2.How Our Project Fits Microservices Architecture
Our Project is divided into separate functional components, such as:
- Build Service
- Test Service
- Deployment Service
- Monitoring Service
- Failure Handler Service
- AI Failure Classifier Service
- Notification Service

#### Each of these:
- Has its own responsibility
- Can work independently
- Can be scaled separately
- Communicates with the main pipeline

### 3. Granularity of Software Components
- Granularity = size and responsibility of components.
#### In our system:
- Fine-Grained Services (High Granularity)
- Each service performs one specific task ,BuildService will only build projects, TestService will only run tests.
- This shows high cohesion and low coupling, which is a key feature of Microservices Architecture.

## I.B. Justification of Architecture Style Choice  

### Why Microservices is the Best Fit?

### 1. Scalability
- Each service (CI Orchestrator, Log Monitor, AI Failure Classifier, Notification Service) can scale independently.
- High-load components (e.g., Log Monitoring) can be scaled without affecting others.

### 2. Maintainability
- Clear separation of concerns:
  - CI Orchestrator (build/test/deploy)
  - Monitoring Service
  - AI Failure Classification Service
  - Notification Service
- Teams can modify or upgrade individual services without impacting the entire system.

### 3. Fault Isolation & Reliability
- Failure in one service (e.g., AI classifier) does not crash the CI pipeline.
- Enables graceful degradation (pipeline can continue with rule-based handling if AI service fails).

### 4. Performance
- Asynchronous communication between services (e.g., logs → classifier → notifier) reduces blocking.
- Parallel processing of build/test/monitoring improves pipeline throughput.

### 5. Technology Flexibility
- Different services can use different tech stacks (e.g., Node.js for CI orchestration, Python for AI model).
- Easier to integrate third-party services (GitHub Actions, Docker, AWS).

### 6. Deployment & Evolution
- Independent deployment of services allows faster iteration and updates.
- Supports incremental enhancements (e.g., upgrading AI model without redeploying the entire system).
