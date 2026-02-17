export default function Navbar() {
  return (
    <div className="bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="font-semibold text-lg">
          <span className="text-slate-900">Incident</span>{" "}
          <span className="text-sky-700">Report</span>
        </h1>
        <a
          href="/deleted"
          className="text-sm text-gray-700 hover:text-black px-3 py-2 rounded-lg hover:bg-gray-50"
        >
          Deleted History
        </a>
      </div>
    </div>
  );
}
