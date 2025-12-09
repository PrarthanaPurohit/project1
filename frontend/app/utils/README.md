# Utils

This directory contains utility functions used throughout the application.

## Modules

### validation.ts
Form validation utilities:
- `validateEmail(email)` - Validates email format
- `validateRequired(value)` - Checks if value is not empty
- `validateMobileNumber(mobile)` - Validates mobile number format
- `validateMaxLength(value, maxLength)` - Checks string length
- `getValidationErrors(data, rules)` - Batch validation with error collection

### formatters.ts
Data formatting utilities:
- `formatDate(dateString)` - Formats date to readable string
- `formatDateTime(dateString)` - Formats date and time
- `truncateText(text, maxLength)` - Truncates long text with ellipsis
- `getImageUrl(imagePath)` - Constructs full image URL from path

## Usage

```typescript
import { validateEmail, formatDate } from '~/utils';

if (!validateEmail(email)) {
  // Show error
}

const formattedDate = formatDate(project.createdAt);
```
