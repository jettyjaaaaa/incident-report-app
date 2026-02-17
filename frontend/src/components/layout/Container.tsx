export default function Container({ children }: any) {
  return (
    <div className="min-h-[calc(100vh-57px)] bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto p-4">{children}</div>
    </div>
  );
}
