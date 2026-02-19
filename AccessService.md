# II. How End Users Access the Services

## End Users:

- Developers
- DevOps Engineers
- Project Maintainers

## Access Method:

- Developers push code to GitHub
- CI/CD pipeline automatically triggers
- Developers monitor:
      -> Web dashboard
      -> Email notifications
      -> Show alerts

## Access Flow: 
1. Developer pushes code to GitHub repository.
2. CI/CD Orchestrator detects push event.
3. Pipeline executes build, test, containerization.     
4. Deployment to Amazon EC2.
5. Logs monitored.
6. If failure occurs → AI module classifies it.
7. Recovery manager takes action.
8. Notification service alerts developer.
