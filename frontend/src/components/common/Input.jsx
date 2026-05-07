import React from "react";

const Input = React.forwardRef(function Input({ label, error, className = "", ...props }, ref) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm font-medium text-gray-700">{label}</div> : null}
      <input
        ref={ref}
        className={[
          "w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition",
          error ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-indigo-200",
          className
        ].join(" ")}
        {...props}
      />
      {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
    </label>
  );
});

export default Input;

