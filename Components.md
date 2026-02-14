## II. Components of the Software Engineering Project (Application Components)

The following are the main application components of the **CI/CD Automation with AI Failure Handling System**:

### 1. CI/CD Orchestrator

- Manages the overall pipeline workflow.
- Triggers build, test, containerization, and deployment stages.
- Coordinates interactions with GitHub Actions/Jenkins, Docker, and deployment services.

### 2. Source Code Repository (GitHub)

- Stores application source code and configuration files.
- Triggers CI/CD pipeline on code push events.
- Maintains version history and supports collaboration.

### 3. Build & Test Service

- Compiles the application and resolves dependencies.
- Executes automated unit and integration tests.
- Generates build and test reports.

### 4. Containerization Service (Docker Engine)

- Builds Docker images from application artifacts.
- Tags and stores images in a container registry.
- Ensures environment consistency across deployments.

### 5. Deployment Service (AWS EC2)

- Deploys Docker containers to cloud infrastructure.
- Manages application runtime lifecycle (start, stop, restart).
- Supports rollback to previous stable versions if deployment fails.

### 6. Log Monitoring Service

- Collects logs and runtime metrics from deployed services.
- Performs health checks and monitors system performance.
- Streams logs to failure detection and analysis components.

### 7. Failure Detection Module

- Identifies build, test, deployment, and runtime failures.
- Extracts error patterns from logs and status codes.
- Triggers further analysis when anomalies are detected.

### 8. AI Failure Classification Service

- Classifies detected failures using ML models or rule-based logic.
- Determines failure categories (build, test, configuration, infrastructure, runtime).
- Suggests appropriate recovery strategies based on failure type.

### 9. Recovery & Rollback Manager

- Applies automated recovery actions (retry build, redeploy, restart services).
- Initiates rollback to last stable deployment when necessary.
- Ensures system stability after failures.

### 10. Notification Service

- Sends alerts and status updates to developers and stakeholders.
- Supports multiple channels (email, Slack, dashboards).
- Notifies users about failures, recoveries, and pipeline status changes.
