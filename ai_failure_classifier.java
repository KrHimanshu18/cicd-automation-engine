class AIFailureClassifier {

    public String classifyFailure(String log) {

        if (log.contains("BUILD FAILED")) {
            return "Build Failure";
        } 
        else if (log.contains("TEST FAILED")) {
            return "Test Failure";
        } 
        
        else {
            return "Unknown Failure";
        }
    }
}
