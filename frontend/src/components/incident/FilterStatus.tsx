export default function FilterStatus({ value, onChange }: any) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-3 py-2"
    >
      <option value="">All Status</option>
      <option value="open">Open</option>
      <option value="in_progress">In Progress</option>
      <option value="success">Success</option>
    </select>
  );
}
