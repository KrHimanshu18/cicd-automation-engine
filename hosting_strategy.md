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

