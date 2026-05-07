export default function Button({ className = "", variant = "primary", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const styles =
    variant === "primary"
      ? "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500"
      : variant === "ghost"
        ? "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400"
        : variant === "outline"
          ? "border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50 focus:ring-emerald-200"
          : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-700";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

