export default function SortDropdown({ value, onChange }: any) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-3 py-2"
    >
      <option value="created_at">Created Date</option>
      <option value="updated_at">Updated Date</option>
      <option value="safety_first">Safety First</option>
      <option value="maintenance_first">Maintenance First</option>
    </select>
  );
}
