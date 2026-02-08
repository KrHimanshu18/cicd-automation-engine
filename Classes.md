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


Class: BuildService
Description: Responsible for building the application.

Attributes:

- buildStatus : String

Methods:

+ buildProject() : boolean

+ generateBuildReport() : String


Class: TestService
Description: Runs automated tests.

Attributes:

- testStatus : String

Methods:

+ runTests() : boolean


Class: DeploymentService
Description: Deploys application to server (like AWS EC2).

Attributes:

- deploymentStatus : String

Methods:

+ deploy() : boolean

+ rollback() : void


Class: FailureHandler
Description: Handles failure and recovery actions.

Attributes:

- failureType : String

Methods:

+ classifyFailure(log : String) : String

+ applyRecoveryAction() : void


Class: AIFailureClassifier
Description: Classifies the failure using AI model.

Attributes:

- modelName : String

Methods:

+ predictFailure(log : String) : String


Class: Developer

Description: Represents the user who pushes code.

Attributes:

- name : String

- email : String

Methods:

+ pushCode() : void


Visibility Symbols Used

+ → Public

- → Private