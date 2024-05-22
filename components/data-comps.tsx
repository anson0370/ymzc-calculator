import { formatDate } from "@/lib/tools";
import { ClacResult1, ClacResult2 } from "@/lib/types";
import { ClipboardListIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./shadcn/ui/popover";

export function DataCeil({ title, data, titleClassName }: { title: string; data: string; titleClassName?: string }) {
  return (
    <div className="flex flex-col items-start">
      <div className={titleClassName ?? "text-slate-600"}>{title}</div>
      <div>{data}</div>
    </div>
  );
}

function WaterTimeList({ className, data }: { className?: string, data: Date[] }) {
  return (
    <Popover>
      <PopoverTrigger className={className} asChild>
        <div className="flex items-center cursor-pointer text-slate-600 underline">
          <ClipboardListIcon className="w-4 h-4 mr-1" />
          <span>浇水序列</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="max-w-xl">
        <div className="flex flex-col gap-y-1 font-mono">
          {data.map((item, index) => (
            <div key={index}>{`${index + 1}. ${formatDate(item)}`}</div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function R1Data({ result }: { result: ClacResult1 }) {
  return (
    <div className="w-full flex flex-col gap-y-2 items-start">
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
        <DataCeil title='满浇水收获时间' titleClassName="font-bold rainbow-text" data={formatDate(result.fullWaterTime)} />
        <DataCeil title='只浇第一水收获时间' data={formatDate(result.oneWaterTime)} />
        {result.twoWaterTime != null && (
          <DataCeil title='只浇头尾水收获时间' data={formatDate(result.twoWaterTime)} />
        )}
        <DataCeil title='倒二浇时间' data={formatDate(result.lastWaterTime)} />
      </div>
      {result.waterTimes != null && (
        <WaterTimeList data={result.waterTimes} />
      )}
    </div>
  )
}

export function R2Data({ result }: { result: ClacResult2 }) {
  return (
    <div className="w-full flex flex-col gap-y-2 items-start">
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
        <DataCeil title='收获时间' titleClassName="font-bold rainbow-text" data={formatDate(result.fullWaterTime)} />
        {result.endWaterTime != null && (
          <DataCeil title='只浇尾水收获时间' data={formatDate(result.endWaterTime)} />
        )}
        <DataCeil title='倒二浇时间' data={formatDate(result.lastWaterTime)} />
      </div>
      {result.waterTimes != null && (
        <WaterTimeList data={result.waterTimes} />
      )}
    </div>
  )
}
