Class: CICDPipeline
Description:Main class that controls the complete CI/CD process.

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


Class: BuildService

Description: Responsible for building the application.

Attributes:

- buildStatus : String

Methods:

+ buildProject() : boolean

+ generateBuildReport() : String