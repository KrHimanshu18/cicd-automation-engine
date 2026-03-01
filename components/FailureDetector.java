
public class FailureDetector {

    public static void main(String[] args) {

        String logMessage = "Build failed due to syntax error";

        // Create classifier object
        AIFailureClassifier classifier = new AIFailureClassifier();

        // Send log to classifier
        String result = classifier.classify(logMessage);

        System.out.println("Detected Failure Type: " + result);
    }
}
