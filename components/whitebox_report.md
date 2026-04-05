## **White Box Testing of FailureDetector Program**

### **1. Aim**

To perform **white-box testing** on a Java program that detects failure types based on log input.

---

### **2. Objective**

- To analyze internal logic of the program
- To design test cases covering all branches
- To execute and validate outputs

---

### **3. Description of the Program**

The program consists of two classes:

- **FailureDetector** → Main class that calls the classifier
- **Classifier** → Reads input from a file and classifies failure type

### **Logic Used**

The classification is based on keywords:

- "syntax" → Build Failure
- "test" → Test Failure
- "connection" → Deployment Failure
- Otherwise → Runtime Failure
- If no log → No Log Found

---

### **4. White Box Testing Approach**

White-box testing is performed by analyzing:

- Internal conditions (`if-else`)
- Control flow
- Execution paths

The following conditions are tested:

1. File read exception
2. `log == null`
3. Contains "syntax"
4. Contains "test"
5. Contains "connection"
6. Default condition

---

### **5. Test Cases**

| TC ID | Input (input.txt)      | Expected Output    | Actual Output      | Result |
| ----- | ---------------------- | ------------------ | ------------------ | ------ |
| TC1   | syntax error           | Build Failure      | Build Failure      | Pass   |
| TC2   | test failed            | Test Failure       | Test Failure       | Pass   |
| TC3   | connection timeout     | Deployment Failure | Deployment Failure | Pass   |
| TC4   | random crash           | Runtime Failure    | Runtime Failure    | Pass   |
| TC5   | (empty file)           | No Log Found       | No Log Found       | Pass   |
| TC6   | SYNTAX ERROR           | Build Failure      | Build Failure      | Pass   |
| TC7   | syntax test connection | Build Failure      | Build Failure      | Pass   |

---

### **6. Execution Procedure**

1. Create a file named `input.txt`
2. Enter test input into the file
3. Compile the program:

   ```
   javac FailureDetector.java Classifier.java
   ```

4. Run the program:

   ```
   java FailureDetector
   ```

5. Observe output and compare with expected results

---

### **7. Output Sample**

```
Detected Failure Type: Build Failure
```

---

### **8. Coverage Achieved**

- ✔ Statement Coverage
- ✔ Branch Coverage
- ✔ Condition Coverage

All possible paths in the program were executed.

---

### **9. Result**

The program was successfully tested using white-box testing techniques.
All test cases passed, and the program produced correct outputs for all conditions.

---

### **10. Conclusion**

White-box testing helped in verifying the internal logic and control flow of the program.
All branches were tested, ensuring correctness and reliability of the failure detection system.

---

## **White Box Testing of CI/CD Automation Dashboard (UI)**

---

### **1. Aim**

To perform **white-box testing** on a CI/CD Automation Dashboard UI by analyzing internal JavaScript logic and execution paths.

---

### **2. Objective**

- To understand internal working of UI functions
- To test control flow and decision-making logic
- To validate API interaction and UI updates

---

### **3. Description of the System**

The system is a **web-based CI/CD dashboard** with the following features:

- Create Pipeline
- Run Pipeline
- Display Build, Test, and Deploy status
- Show logs and notifications

### **Technologies Used**

- HTML
- CSS
- JavaScript (Frontend logic)

---

### **4. White Box Testing Scope**

White-box testing is applied to:

- JavaScript functions:
  - `createPipeline()`
  - `runPipeline()`
  - `setStatus()`
  - `log()`
  - `notify()`

- Decision points:
  - `if (!currentPipelineId)`
  - `if (data.result === "Deploy")`
  - Random test result logic

---

### **5. Control Flow Analysis**

#### Key Decision Points:

1. Pipeline created or not
2. API response success or failure
3. Test success vs failure
4. UI status updates

---

### **6. Test Cases**

| TC ID | Scenario                      | Input/Condition            | Expected Output                    | Actual Result |
| ----- | ----------------------------- | -------------------------- | ---------------------------------- | ------------- |
| TC1   | Run without creating pipeline | `currentPipelineId = null` | Alert message shown                | Pass          |
| TC2   | Create pipeline               | Click "Create Pipeline"    | Pipeline ID generated, log updated | Pass          |
| TC3   | Run pipeline success          | API returns `"Deploy"`     | All statuses → Success             | Pass          |
| TC4   | Run pipeline failure          | API returns not `"Deploy"` | Test → Failed, Deploy not executed | Pass          |
| TC5   | Log function                  | Call `log()`               | Message appended in log box        | Pass          |
| TC6   | Notification function         | Call `notify()`            | Message added to list              | Pass          |
| TC7   | Status update                 | Call `setStatus()`         | UI updated correctly               | Pass          |

---

### **7. Result**

The UI logic was successfully tested using white-box testing.
All functions behaved as expected for different conditions.

---

### **8. Conclusion**

White-box testing of the UI helped verify the internal logic of JavaScript functions, including API handling, condition checks, and UI updates. The system correctly handles both success and failure scenarios.

---
