/**
 * Validation utility functions for form inputs
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value) => {
  return value.trim().length > 0;
};

export const validateMobileNumber = (mobile) => {
  // Basic validation for mobile numbers (10-15 digits)
  const mobileRegex = /^\d{10,15}$/;
  return mobileRegex.test(mobile.replace(/[\s-]/g, ''));
};

export const validateMaxLength = (value, maxLength) => {
  return value.length <= maxLength;
};

export const getValidationErrors = (data, rules) => {
  const errors = [];

  Object.keys(rules).forEach((field) => {
    const value = data[field] || '';
    const fieldRules = rules[field];

    for (const rule of fieldRules) {
      const result = rule(value);
      if (result !== true) {
        errors.push({
          field,
          message: typeof result === 'string' ? result : `${field} is invalid`,
        });
        break; // Only show first error per field
      }
    }
  });

  return errors;
};
