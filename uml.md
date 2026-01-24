# UML FILE

# Overview
## Core Workflow-
- A Developer pushes source code to GitHub.
- This automatically triggers the CI/CD pipeline.

## The pipeline:

- Builds the application

- Runs automated tests

- Builds a Docker image

- Deploys the container to AWS EC2

- The system monitors logs and runtime status throughout execution.

# Actors

| Actor                               | Description                               |
| ----------------------------------- | ----------------------------------------- |
| Developer                           | Pushes code and monitors pipeline results |
| GitHub                              | Hosts the source code repository          |
| CI/CD Tool (GitHub Actions/Jenkins) | Executes pipeline stages                  |
| Docker Engine                       | Builds Docker images                      |
| AWS EC2 Server                      | Hosts deployed application                |
| AI Failure Classifier               | Classifies failures using ML or rules     |
| Notification Service                | Sends alerts to users                     |

# Use Cases

| Use Case               | Description                                 |
| ---------------------- | ------------------------------------------- |
| Push Source Code       | Developer pushes code to GitHub             |
| Trigger CI/CD Pipeline | Pipeline starts automatically on commit     |
| Build Application      | Compiles source code                        |
| Run Automated Tests    | Executes test cases and generates reports   |
| Build Docker Image     | Creates Docker container                    |
| Deploy Application     | Deploys container to AWS EC2                |
| Monitor Logs & Status  | Tracks logs and runtime health              |
| Detect Failure         | Identifies build/test/deploy/runtime errors |
| Classify Failure       | Determines failure type using AI/rules      |
| Apply Recovery Action  | Retries build, fixes config, or redeploys   |
| Rollback Deployment    | Reverts to last stable version              |
| Notify User            | Sends failure and recovery notifications    |

# Use Case Relationships

## Associations

- Developer -> Push Source Code
- Developer -> Monitor Logs
- Developer -> Receive Notifications
- GitHub -> Trigger CI/CD Pipeline
- AWS EC2 -> Deploy Application

## Include Relationships

- Deploy Application **includes** Build Docker Image
- Detect Failure **includes** Monitor Logs
- Apply Recovery Action **includes** Classify Failure

## Extend Relationships

- Rollback Deployment **extends** Deploy Application _(only if deployment fails)_
- Notify User **extends** Detect Failure _(only when failure occurs)_
