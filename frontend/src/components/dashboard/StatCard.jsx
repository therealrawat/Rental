export default function StatCard({ title, value, hint, icon }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</div>
        {icon && <div className="p-2 bg-gray-50 rounded-xl">{icon}</div>}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {hint ? <div className="mt-1 text-xs text-gray-400 font-medium">{hint}</div> : null}
      </div>
    </div>
  );
}
