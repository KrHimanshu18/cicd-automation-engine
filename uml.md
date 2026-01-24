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

# Use Case Relationships

## Associations

- Developer → Push Source Code
- Developer → Monitor Logs
- Developer → Receive Notifications
- GitHub → Trigger CI/CD Pipeline
- AWS EC2 → Deploy Application

## Include Relationships

- Deploy Application **includes** Build Docker Image
- Detect Failure **includes** Monitor Logs
- Apply Recovery Action **includes** Classify Failure

## Extend Relationships

- Rollback Deployment **extends** Deploy Application *(only if deployment fails)*
- Notify User **extends** Detect Failure *(only when failure occurs)*