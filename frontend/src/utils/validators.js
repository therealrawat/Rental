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
      value: /^[6-9]\d{9}$/,
      message: "Invalid Indian phone number (10 digits starting with 6-9)"
    }
  },
  aadhaar: {
    pattern: {
      value: /^\d{12}$/,
      message: "Aadhaar must be exactly 12 digits"
    }
  },
  pan: {
    pattern: {
      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      message: "Invalid PAN format (e.g. ABCDE1234F)"
    }
  },
  amount: {
    required: "Amount is required",
    pattern: {
      value: /^\d+(\.\d{1,2})?$/,
      message: "Invalid amount"
    },
    min: {
      value: 1,
      message: "Amount must be at least 1"
    }
  },
  integer: {
    required: "Required",
    pattern: {
      value: /^\d+$/,
      message: "Must be a whole number"
    }
  },
  name: {
    required: "Name is required",
    minLength: {
      value: 2,
      message: "Min 2 characters"
    },
    maxLength: {
      value: 50,
      message: "Max 50 characters"
    }
  }
};
