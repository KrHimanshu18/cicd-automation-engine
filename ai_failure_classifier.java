class AIFailureClassifier {

    public String classifyFailure(String log) {

        if (log.contains("BUILD FAILED")) {
            return "Build Failure";
        } 
        else if (log.contains("TEST FAILED")) {
            return "Test Failure";
        } 
        else if (log.contains("DEPLOY ERROR")) {
            return "Deployment Failure";
        } 
        else if (log.contains("RUNTIME EXCEPTION")) {
            return "Runtime Failure";
        } 
        else {
            return "Unknown Failure";
        }
    }
}
