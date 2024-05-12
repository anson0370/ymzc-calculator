'use client';

import { DataCeil, R1Data, R2Data } from "@/components/data-comps";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/shadcn/ui/select";
import { Switch } from "@/components/shadcn/ui/switch";
import TimeInput from "@/components/time-input";
import { realHarvestTime } from "@/lib/calc";
import { vegetables } from "@/lib/data";
import useHistory from "@/lib/history";
import { formatDate, minutesToTimeString } from "@/lib/tools";
import { ClacHistoryItem, ClacResult1, ClacResult2, Vegetable } from "@/lib/types";
import { SelectValue } from "@radix-ui/react-select";
import { AlarmClockCheckIcon, AlarmClockIcon, CarrotIcon, DatabaseIcon, FileClockIcon, ListIcon } from "lucide-react";
import { Fragment, useMemo, useState } from "react";

export default function Home() {
  const [selectedVegetable, setSelectedVegetable] = useState<Vegetable | null>(null);

  const [useCurrentTime, setUseCurrentTime] = useState<boolean>(true);
  const [baseTime, setBaseTime] = useState<{ hour: number, minute: number }>({ hour: 0, minute: 0 });
  const [harvestTimeResult, setHarvestTimeResult] = useState<ClacResult1 | null>(null);

  const [toHarvestDuration, setToHarvestDuration] = useState<number>(0);
  const [waterKeepDuration, setWaterKeepDuration] = useState<number>(0);

  const [goingToharvestTimeResult, setGoingToHarvestTimeResult] = useState<ClacResult2 | null>(null);

  const { histories, addHistory, addComment } = useHistory();

  const calculatedTime = useMemo(() => {
    if (selectedVegetable == null) return null;
    return {
      realHarvestTime: realHarvestTime(selectedVegetable.harvestTime, selectedVegetable.waterKeepTime),
      invalideWaterTime: Math.round(selectedVegetable.waterKeepTime * 0.1),
    }
  }, [selectedVegetable]);

  const onVegetableChange = (value: string) => {
    const index = parseInt(value);
    setSelectedVegetable(vegetables[index]);
    setHarvestTimeResult(null);
    setGoingToHarvestTimeResult(null);
  }

  const calculateHarvestTime = () => {
    if (selectedVegetable == null || calculatedTime == null) return;

    const baseDate = new Date();
    if (!useCurrentTime) {
      baseDate.setHours(baseTime.hour);
      baseDate.setMinutes(baseTime.minute);
    }
    const fullWaterTime = new Date(baseDate);
    const oneWaterTime = new Date(baseDate);
    const lastWaterTime = new Date(baseDate);
    fullWaterTime.setMinutes(fullWaterTime.getMinutes() + calculatedTime.realHarvestTime);
    oneWaterTime.setMinutes(oneWaterTime.getMinutes() + selectedVegetable.harvestTime - Math.round(selectedVegetable.waterKeepTime * 0.25));
    lastWaterTime.setMinutes(lastWaterTime.getMinutes() + calculatedTime.realHarvestTime - Math.round(selectedVegetable.waterKeepTime * 0.1));

    const result: ClacResult1 = {
      fullWaterTime,
      oneWaterTime,
      lastWaterTime,
    };
    setHarvestTimeResult(result);

    const history: ClacHistoryItem = {
      type: 'R1',
      result,
      baseTime: baseDate,
      vegetable: selectedVegetable.name,
    };
    addHistory(history);
  };

  const calculateGoingToHarvestTime = () => {
    if (selectedVegetable == null || calculatedTime == null) return;

    const baseDate = new Date();
    const fullWaterTime = new Date(baseDate);
    const lastWaterTime = new Date(baseDate);

    const realHarvestDuration = realHarvestTime(toHarvestDuration, selectedVegetable.waterKeepTime - waterKeepDuration);

    fullWaterTime.setMinutes(fullWaterTime.getMinutes() + realHarvestDuration);
    lastWaterTime.setMinutes(lastWaterTime.getMinutes() + realHarvestDuration - Math.round(selectedVegetable.waterKeepTime * 0.1));

    const result: ClacResult2 = {
      fullWaterTime,
      lastWaterTime,
    };
    setGoingToHarvestTimeResult(result);

    const history: ClacHistoryItem = {
      type: 'R2',
      result,
      baseTime: baseDate,
      vegetable: selectedVegetable.name,
    };
    addHistory(history);
  };

  return (
    <main className="flex w-full min-h-screen flex-col items-center">
      <div className="flex flex-col items-stretch gap-y-4 w-full max-w-3xl py-6 px-6 lg:px-0">
        <CarrotIcon className="w-10 h-10 text-slate-500" />
        <h1 className="text-2xl">元梦之星种菜计算器</h1>
        <h2 className="text-lg border-b mt-4">
          <ListIcon className="inline mr-1 -mt-1 w-6 h-6 text-slate-500" />
          <span>选择蔬菜</span>
        </h2>
        <Select onValueChange={onVegetableChange}>
          <SelectTrigger>
            <SelectValue placeholder="请选择蔬菜">
              <div>{selectedVegetable?.name}</div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {vegetables.map((vegetable, i) => (
              <SelectItem key={i} value={i.toString()}>{vegetable.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedVegetable && (
          <>
            <h2 className="text-lg border-b mt-4">
              <DatabaseIcon className="inline mr-1 -mt-1 w-6 h-6 text-slate-500" />
              <span>基础数据</span>
            </h2>
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
              <DataCeil title='不浇水成熟时间' data={minutesToTimeString(selectedVegetable.harvestTime)} />
              <DataCeil title='满浇水成熟时间' data={minutesToTimeString(calculatedTime!.realHarvestTime)} />
              <DataCeil title='水分保持时间' data={minutesToTimeString(selectedVegetable.waterKeepTime)} />
              <DataCeil title='禁止浇水时间' data={minutesToTimeString(calculatedTime!.invalideWaterTime)} />
            </div>
            <h2 className="text-lg border-b mt-4">
              <AlarmClockCheckIcon className="inline mr-1 -mt-1 w-6 h-6 text-slate-500" />
              <span>计算新种收获时间（R1）</span>
            </h2>
            <div>选择基准时间</div>
            <div className="flex flex-col items-start gap-y-2 sm:flex-row sm:items-center sm:gap-x-2">
              <div className="flex items-center gap-x-2">
                <Label htmlFor="use-current-time">使用当前时间</Label>
                <Switch id="use-current-time" checked={useCurrentTime} onCheckedChange={setUseCurrentTime} />
              </div>
              <div className="flex items-center gap-x-2">
                <Label>自选时间</Label>
                <TimeInput mode="time" disabled={useCurrentTime} onTimeChange={setBaseTime} />
              </div>
            </div>
            <Button onClick={calculateHarvestTime}>算TMD</Button>
            {harvestTimeResult && (
              <R1Data result={harvestTimeResult} />
            )}
            <h2 className="text-lg border-b mt-4">
              <AlarmClockIcon className="inline mr-1 -mt-1 w-6 h-6 text-slate-500" />
              <span>计算在途收获时间（R2）</span>
            </h2>
            <div className="flex flex-col items-start gap-y-2 sm:flex-row sm:items-center sm:gap-x-2">
              <div className="flex items-center gap-x-2">
                <Label>待成熟时间</Label>
                <TimeInput mode="duration" onDurationChange={setToHarvestDuration} />
              </div>
              <div className="flex items-center gap-x-2">
                <Label>水分保持时间</Label>
                <TimeInput mode="duration" onDurationChange={setWaterKeepDuration} />
              </div>
            </div>
            <Button onClick={calculateGoingToHarvestTime}>算TMD</Button>
            {goingToharvestTimeResult && (
              <R2Data result={goingToharvestTimeResult} />
            )}
          </>
        )}
        {histories.length > 0 && (
          <>
            <h2 className="text-lg border-b mt-4">
              <FileClockIcon className="inline mr-1 -mt-1 w-6 h-6 text-slate-500" />
              <span>计算历史</span>
            </h2>
            {histories.map((history, i) => {
              if (history.type === 'R1') {
                return (
                  <Fragment key={i}>
                    <h3>{`${history.vegetable}(R1@${formatDate(history.baseTime)})`}</h3>
                    <R1Data result={history.result} />
                  </Fragment>
                );
              } else if (history.type === 'R2') {
                return (
                  <Fragment key={i}>
                    <h3>{`${history.vegetable}(R2@${formatDate(history.baseTime)})`}</h3>
                    <R2Data result={history.result} />
                  </Fragment>
                );
              } else {
                return null;
              }
            })}
          </>
        )}
      </div>
    </main>
  );
}
