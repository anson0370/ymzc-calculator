import { ClacResult1, ClacResult2 } from "@/lib/types";
import { DropletsIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./shadcn/ui/popover";
import clsx from "clsx";
import TimerTrigger from "./timer-trigger";

export function DataCeil({ title, children }: { title: React.ReactNode; children: React.ReactNode; }) {
  return (
    <div className="flex flex-col items-start">
      <div className={"text-slate-600"}>{title}</div>
      <div>{children}</div>
    </div>
  );
}

function WaterTimeList({ className, data }: { className?: string, data: Date[] }) {
  return (
    <Popover>
      <PopoverTrigger className={clsx('cursor-pointer', className)} asChild>
        <DropletsIcon className="w-4 h-4" />
      </PopoverTrigger>
      <PopoverContent className="max-w-xl">
        <div className="flex flex-col gap-y-1">
          <div className="border-b">浇水时间</div>
          {data.map((item, index) => (
            <div className="text-slate-600 font-mono" key={index}>
              <span className="mr-2">{index + 1}</span>
              <TimerTrigger toTime={item}/>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function R1Data({ result }: { result: ClacResult1 }) {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
      <DataCeil
        title={(
          <div className="flex items-center gap-x-1">
            <span className="font-bold rainbow-text">满浇收获时间</span>
            {result.waterTimes != null && (
              <WaterTimeList data={result.waterTimes} />
            )}
          </div>
        )}
      >
        <TimerTrigger toTime={result.fullWaterTime}/>
      </DataCeil>
      <DataCeil title='只浇第一水收获时间'>
        <TimerTrigger toTime={result.oneWaterTime}/>
      </DataCeil>
      {result.twoWaterTime != null && (
        <DataCeil title='只浇头尾水收获时间'>
          <TimerTrigger toTime={result.twoWaterTime}/>
        </DataCeil>
      )}
      <DataCeil title='倒二浇时间'>
        <TimerTrigger toTime={result.lastWaterTime}/>
      </DataCeil>
    </div>
  )
}

export function R2Data({ result }: { result: ClacResult2 }) {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
      <DataCeil
        title={(
          <div className="flex items-center gap-x-1">
            <span className="font-bold rainbow-text">满浇收获时间</span>
            {result.waterTimes != null && (
              <WaterTimeList data={result.waterTimes} />
            )}
          </div>
        )}
      >
        <TimerTrigger toTime={result.fullWaterTime}/>
      </DataCeil>
      {result.endWaterTime != null && (
        <DataCeil title='只浇尾水收获时间'>
          <TimerTrigger toTime={result.endWaterTime}/>
        </DataCeil>
      )}
      <DataCeil title='倒二浇时间'>
        <TimerTrigger toTime={result.lastWaterTime}/>
      </DataCeil>
    </div>
  )
}
