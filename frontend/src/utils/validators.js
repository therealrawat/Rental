export const validators = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address"
    }
  },
  phone: {
    required: "Phone number is required",
    pattern: {
      value: /^\+?[1-9]\d{1,14}$/,
      message: "Invalid phone number"
    }
  },
  amount: {
    required: "Amount is required",
    pattern: {
      value: /^\d+(\.\d{1,2})?$/,
      message: "Invalid amount (max 2 decimal places)"
    },
    min: {
      value: 0,
      message: "Amount must be positive"
    }
  },
  integer: {
    required: "This field is required",
    pattern: {
      value: /^\d+$/,
      message: "Must be a whole number"
    },
    min: {
      value: 0,
      message: "Must be at least 0"
    }
  }
};
