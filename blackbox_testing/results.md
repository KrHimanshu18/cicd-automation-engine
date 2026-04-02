# Black Box Testing Summary

Black box testing focuses on testing the system without knowing internal implementation details. The goal is to validate whether the system behaves correctly based on inputs and expected outputs.

## UI Testing (Frontend)
 ### Objective

Verify that user interactions correctly trigger backend operations and display appropriate responses.

1.``` Button Click Functionality ```\
Input: Click "Create Pipeline" button\
Expected Output: API call to /pipeline is triggered\
Result: Request sent successfully (check Network tab)

2.``` API Response Handling ```\
Input: Valid request from UI\
Expected Output: JSON response displayed or logged\
Error Case:
If server fails → error message shown (no crash)

3.``` Network Failure ```\
Input: Backend not running\
Expected Output:
- UI shows error OR logs failure
- No page crash