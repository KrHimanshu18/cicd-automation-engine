
public class AIFailureClassifier {

    public String classify(String log) {

        log = log.toLowerCase();

        if (log.contains("syntax")) {
            return "Build Failure";
        } else if (log.contains("test")) {
            return "Test Failure";
        } else if (log.contains("connection")) {
            return "Deployment Failure";
        } else {
            return "Runtime Failure";
        }
    }
}
