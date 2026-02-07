Class: CICDPipeline

Description: Main class that controls the complete CI/CD process.

Attributes:

- pipelineId : String

- status : String

Methods:

+ triggerPipeline() : void

+ buildApplication() : void

+ runTests() : void

+ deployApplication() : void

+ handleFailure() : void

+ getStatus() : String

- handleFailure() : void


Class: BuildService

Description: Responsible for building the application and generating Docker images.

 Attributes:

- buildId : String

- buildStatus : String

- dockerEngine : DockerEngine

 Methods:

+ buildApplication(sourcePath : String) : boolean

+ buildDockerImage(imageName : String) : boolean

+ getBuildStatus() : String

- validateBuild() : boolean

TestService

Description: Runs automated tests after build stage.

 Attributes:

- testSuiteName : String

- testResults : Map<String, Boolean>

- coveragePercentage : double

 Methods:

+ runAutomatedTests() : boolean

+ generateTestReport() : String

+ getTestResults() : Map<String, Boolean>

- validateTestEnvironment() : boolean


DeploymentService

Description: Handles deployment to AWS EC2 or target server.

Attributes:

- deploymentId : String

- deploymentStatus : String

- serverIP : String

Methods:

+ deployApplication(imageName : String) : boolean

+ rollbackDeployment() : void

+ getDeploymentStatus() : String

- verifyDeployment() : boolean