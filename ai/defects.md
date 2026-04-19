# Bug Report: Fuzzy Matching Analysis

---

## Defect 1

| Field        | Details |
| ------------ | ------- |
| **Bug ID**   | FA-001  |
| **Severity** | Medium  |

### Description

The `similarity()` function incorrectly calculates similarity by comparing characters only at the same index positions. This leads to inaccurate results for strings that are similar but slightly shifted or rearranged.

### Steps to Reproduce

1. Call `similarity("npm install", "npm isntall")`
2. Observe the returned similarity score

### Expected Result

The function should return a **high** similarity score since both strings are nearly identical (just a typo).

### Actual Result

The function returns a **low** similarity score because it compares characters strictly by index, missing transpositions.

### Suggested Fix

Use a proper string similarity algorithm such as:

- **Levenshtein Distance**
- **Jaro-Winkler similarity**

**Example fix (conceptual):**

```js
// Use a library
const levenshtein = require("fast-levenshtein");
```

---

## Defect 2

| Field        | Details |
| ------------ | ------- |
| **Bug ID**   | FA-002  |
| **Severity** | High    |

### Description

The fuzzy matching logic extracts only two words after `"npm"`, which fails for commands longer than two words (e.g., `npm run build`).

### Steps to Reproduce

1. Pass `log: "Error: npm run buld failed"`
2. Check detected command

### Expected Result

The system should correctly detect `"npm run build"` as the intended command.

### Actual Result

It extracts only `"npm run"` → causing incorrect or weak similarity matching.

### Suggested Fix

Capture the full command instead of limiting to two words.

**Example fix:**

```js
detectedCommand = words.slice(npmIndex, npmIndex + 3).join(" ");
```

Or dynamically capture until the next separator.

---

## Defect 3

| Field        | Details |
| ------------ | ------- |
| **Bug ID**   | FA-003  |
| **Severity** | Medium  |

### Description

The system fails to detect cases where the log contains a valid command but with punctuation or formatting, e.g., `"npm install;"` or `"npm install,"`.

### Steps to Reproduce

1. Input: `"Error running npm install; dependency failed"`
2. Run `analyzeFailure(log)`

### Expected Result

Should recognize `"npm install"` and provide the correct suggestion.

### Actual Result

Similarity fails because `"npm install;"` ≠ `"npm install"` due to punctuation.

### Suggested Fix

Clean input before processing:

```js
const cleanedMsg = msg.replace(/[^\w\s]/g, "");
```

---

## Summary

| Bug ID | Description                                         | Severity |
| ------ | --------------------------------------------------- | -------- |
| FA-001 | `similarity()` uses index-based char comparison     | Medium   |
| FA-002 | Command extraction limited to two words after `npm` | High     |
| FA-003 | Punctuation in log breaks similarity matching       | Medium   |
