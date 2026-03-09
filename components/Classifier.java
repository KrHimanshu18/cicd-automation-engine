
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class Classifier {

    public String classify() {

        String log = "";

        try {
            BufferedReader reader = new BufferedReader(new FileReader("input.txt"));
            log = reader.readLine();
            reader.close();
        } catch (IOException e) {
            System.out.println("Error reading input.txt");
        }

        if (log == null) {
            return "No Log Found";
        }

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
