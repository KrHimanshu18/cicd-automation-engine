# I. Hosting Plan for Application Components  

## 1. Host Site

### GitHub Repository
- Hosted on **GitHub Cloud**
- Stores source code
- Triggers CI/CD pipeline on code push

### CI/CD Orchestrator
- Hosted on **GitHub Actions**
- Controls pipeline execution

### Build and Test Service
- Runs inside **GitHub Actions Ubuntu Runner**
- Executes Node.js build and Jest tests

### Docker Engine
- Installed on:
  - GitHub Actions runner (for image build)
  - AWS EC2 (for container execution)

### Deployment Service (AWS EC2)
- Hosted on **AWS EC2 (Ubuntu Server)**
- Pulls Docker image and runs application container

### Log Monitoring Service
- Hosted on **AWS EC2**
- Collects logs from running containers

### Failure Detection Module
- Hosted on **AWS EC2**
- Analyzes logs for errors

### AI Failure Classification Service
- Hosted as a **separate microservice on AWS EC2**
- Exposes REST API for failure prediction

### Recovery and Rollback Manager
- Hosted on **AWS EC2**
- Executes container restart or rollback logic

### Notification Service
- Hosted on **AWS EC2**
- Sends alerts via Email/Slack API

## 2. Deployment Strategy 

1. **Code Push**
   - Developer pushes code to GitHub.
   - GitHub triggers CI/CD Orchestrator.

2. **Build & Test**
   - GitHub Actions runner installs dependencies.
   - Automated tests are executed.
   - If tests fail → pipeline stops.

3. **Docker Image Creation**
   - Docker image built using Dockerfile.
   - Image pushed to container registry.

4. **Deployment to AWS EC2**
   - CI connects to EC2 via SSH.
   - Pulls latest Docker image.
   - Runs container using Docker.

5. **Log Monitoring**
   - Log Monitoring Service collects container logs.
   - Logs sent to Failure Detection Module.

6. **AI Failure Classification**
   - Failure Detection Module sends logs via REST API.
   - AI service predicts failure type.

7. **Recovery & Rollback**
   - Recovery Manager restarts container or rolls back to stable version.

8. **Notification**
   - Notification Service alerts developer with failure/recovery status.

## 3. Server Configuration

### AWS EC2 Setup
- Ubuntu 22.04 LTS
- Docker Engine installed
- Node.js runtime installed
- Ports 80/443 open via Security Groups
- SSH access using key-based authentication

### CI Environment
- GitHub-hosted Ubuntu runner
- Node.js and Docker configured in workflow

## 4. API Communication Between Components

- REST APIs used for service interaction:
  - Log Monitoring → Failure Detection
  - Failure Detection → AI Classification
  - AI Classification → Recovery Manager
  - Recovery Manager → Notification Service
- JSON used for data exchange
- Internal communication secured via private EC2 network

