# Q1 (a) Test Plan for CI/CD Pipeline System

## 1. Objective of Testing
The objective of testing is to ensure that the CI/CD pipeline system functions correctly. It validates pipeline creation, execution, failure handling, AI-based analysis, and retry mechanisms. The goal is to ensure reliability, accuracy, and robustness of the system.


## 2. Scope of Testing
The following modules/features are included:

- Pipeline creation module  
- Pipeline execution (Clone, Build, Test, Deploy stages)  
- AI failure analysis module  
- Retry mechanism  
- Database operations (CRUD)  
- API endpoints (/pipeline, /run/:id, /pipelines)  
- Frontend UI interaction  


## 3. Types of Testing

- **Unit Testing**: Testing individual components like executor and AI analyzer  
- **Integration Testing**: Interaction between BLL, DAL, and executor  
- **System Testing**: End-to-end pipeline execution  
- **API Testing**: Testing REST endpoints  
- **Regression Testing**: Ensuring new changes don’t break existing features  


## 4. Tools Used

- **Jest** → Unit and integration testing  
- **Supertest** → API testing  
- **Node.js** → Runtime environment  
- **MySQL** → Database  
- **Browser DevTools** → UI testing  


## 5. Entry Criteria

- All modules are implemented  
- Database is configured  
- APIs are developed  
- Dependencies are installed  
- Test environment is ready  


## 6. Exit Criteria

- All test cases are executed  
- Critical bugs are fixed  
- System behaves as expected  
- No major defects remain  


# Q1 (b) Test Cases for Pipeline Execution Module

## Test Cases

### Test Case 1
- **ID:** TC01  
- **Scenario:** Successful pipeline execution  
- **Input:** Valid repo, correct build and test commands  
- **Expected Output:** `{status: "SUCCESS", stage: "DEPLOY"}`  
- **Actual Output:** `{status: "SUCCESS", stage: "DEPLOY"}`  
- **Status:** Pass  


### Test Case 2
- **ID:** TC02  
- **Scenario:** Clone failure  
- **Input:** Invalid repository URL  
- **Expected Output:** `{status: "FAILED", stage: "CLONE"}`  
- **Actual Output:** `{status: "FAILED", stage: "CLONE"}`  
- **Status:** Pass  


### Test Case 3
- **ID:** TC03  
- **Scenario:** Build failure  
- **Input:** Incorrect build command (`npm installll`)  
- **Expected Output:** `{status: "FAILED", stage: "BUILD"}`  
- **Actual Output:** `{status: "FAILED", stage: "BUILD"}`  
- **Status:** Pass  


### Test Case 4
- **ID:** TC04  
- **Scenario:** Test failure  
- **Input:** Incorrect test command (`npm testtt`)  
- **Expected Output:** `{status: "FAILED", stage: "TEST"}`  
- **Actual Output:** `{status: "FAILED", stage: "TEST"}`  
- **Status:** Pass  


### Test Case 5
- **ID:** TC05  
- **Scenario:** Retry after build failure  
- **Input:** Incorrect build command initially  
- **Expected Output:** System suggests fix → user retries → pipeline succeeds  
- **Actual Output:** Retry successful and pipeline completes  
- **Status:** Pass  


### Test Case 6
- **ID:** TC06  
- **Scenario:** Retry after test failure  
- **Input:** Incorrect test command initially  
- **Expected Output:** System suggests fix → user retries → pipeline succeeds  
- **Actual Output:** Retry successful and pipeline completes  
- **Status:** Pass  


### Test Case 7
- **ID:** TC07  
- **Scenario:** No fix available (AI cannot suggest a fix)  
- **Input:** Unknown/invalid command (`randomCommand123`)  
- **Expected Output:**  
  - `{status: "FAILED", stage: "BUILD"}`  
  - `fixCommand = null`  
  - AI suggests manual check  
- **Actual Output:**  
  - `{status: "FAILED", stage: "BUILD"}`  
  - No fix provided  
- **Status:** Pass  


### Test Case 8
- **ID:** TC08  
- **Scenario:** Fetch all pipelines  
- **Input:** `GET /pipelines`  
- **Expected Output:** List of pipelines  
- **Actual Output:** List returned successfully  
- **Status:** Pass  


## Note

The system distinguishes between:
- **Fixable errors** → Retry enabled  
- **Non-fixable errors** → Manual intervention required  

This improves reliability and prevents incorrect automated retries.