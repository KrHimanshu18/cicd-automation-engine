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