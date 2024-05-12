import { formatDate } from "@/lib/tools";
import { ClacResult1, ClacResult2 } from "@/lib/types";

export function DataCeil({ title, data }: { title: string; data: string }) {
  return (
    <div className="flex flex-col items-start">
      <div className="text-slate-600">{title}</div>
      <div>{data}</div>
    </div>
  );
}

export function R1Data({ result }: { result: ClacResult1 }) {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
      <DataCeil title='满浇水收获时间' data={formatDate(result.fullWaterTime)} />
      <DataCeil title='只浇第一水收获时间' data={formatDate(result.oneWaterTime)} />
      <DataCeil title='倒二浇时间' data={formatDate(result.lastWaterTime)} />
    </div>
  )
}

export function R2Data({ result }: { result: ClacResult2 }) {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
      <DataCeil title='收获时间' data={formatDate(result.fullWaterTime)} />
      <DataCeil title='倒二浇时间' data={formatDate(result.lastWaterTime)} />
    </div>
  )
}
