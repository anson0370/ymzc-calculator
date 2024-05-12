export function DataCeil({ title, data }: { title: string; data: string }) {
  return (
    <div className="flex flex-col items-start">
      <div className="text-slate-600">{title}</div>
      <div>{data}</div>
    </div>
  );
}
