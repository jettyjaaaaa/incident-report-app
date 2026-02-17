export default function SearchBar({ value, onChange, className = "" }: any) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search incidents..."
      className={`border rounded-lg px-3 py-2 w-full ${className}`}
    />
  );
}
