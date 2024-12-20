'use client';

import { DataCeil, R1Data, R2Data, R3Data } from "@/components/data-comps";
import { ConfirmHolder } from "@/components/dialog";
import { Button } from "@/components/shadcn/ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/shadcn/ui/drawer";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/shadcn/ui/select";
import { Switch } from "@/components/shadcn/ui/switch";
import { Textarea } from "@/components/shadcn/ui/textarea";
import TimeInput from "@/components/time-input";
import { calcWaterList, calcRealHarvestTime } from "@/lib/calc";
import { vegetables } from "@/lib/data";
import useHistory from "@/lib/history";
import { formatDate, formatDateToHHmm, minutesToTimeString } from "@/lib/tools";
import { ClacHistoryItem, ClacResult1, ClacResult2, Vegetable } from "@/lib/types";
import { useLocalStorage } from "@mantine/hooks";
import { SelectValue } from "@radix-ui/react-select";
import { AccessibilityIcon, BeanIcon, CalculatorIcon, CarrotIcon, DatabaseIcon, FenceIcon, FileClockIcon, Flower2Icon, GlassWaterIcon, HelpCircleIcon, NotebookPenIcon, SproutIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function CommentDrawer({
  open,
  onOpenChange,
  comment,
  onCommentSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comment?: string;
  onCommentSave: (comment: string) => void;
}) {
  const [commentValue, setCommentValue] = useState<string>(comment ?? '');

  useEffect(() => {
    if (open === true) {
      setCommentValue(comment ?? '');
    }
  }, [comment, open]);

  const doSaveComment = () => {
    onCommentSave(commentValue);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>备注</DrawerTitle>
          </DrawerHeader>
          <div className="px-4">
            <Textarea rows={5} value={commentValue} onChange={(e) => setCommentValue(e.target.value)} />
          </div>
          <DrawerFooter>
            <Button onClick={doSaveComment}>保存</Button>
            <Button onClick={() => onOpenChange(false)} variant='outline'>取消</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function Comment({
  index,
  comment,
  onCommentClick,
}: {
  index: number,
  comment?: string,
  onCommentClick: (index: number, comment?: string) => void;
}) {
  return (
    <div className="ml-2 px-2 border-l-4 border-slate-600 rounded text-slate-600 hover:cursor-pointer" onClick={() => onCommentClick(index, comment)}>
      <div className="flex items-center text-sm">
        <NotebookPenIcon className="w-3 h-3 mr-1"/>
        <span>备注</span>
      </div>
      <pre>{comment}</pre>
    </div>
  );
}

export default function Home() {
  const [selectedVegetableIndex, setSelectedVegetableIndex] = useState<number>(3);
  const [selectedVegetable, setSelectedVegetable] = useState<Vegetable>(vegetables[3]);
  const [buildingBuffer, setBuildingBuffer] = useLocalStorage({
    key: 'building-buffer',
    defaultValue: {
      waterKeepBuffer: 0,
    },
  });

  const [useCurrentTime, setUseCurrentTime] = useState<boolean>(true);
  const [baseTime, setBaseTime] = useState<{ hour: number, minute: number }>({ hour: 0, minute: 0 });
  const [harvestTimeResult, setHarvestTimeResult] = useState<ClacResult1 | null>(null);

  const [toHarvestDuration, setToHarvestDuration] = useState<number>(0);
  const [waterKeepDuration, setWaterKeepDuration] = useState<number>(0);
  const [goingToharvestTimeResult, setGoingToHarvestTimeResult] = useState<ClacResult2 | null>(null);

  const [planHarvestTime, setPlanHarvestTime] = useState<{ hour: number, minute: number }>({ hour: 0, minute: 0 });
  const [planHarvestTimeResult, setPlanHarvestTimeResult] = useState<ClacResult1 | null>(null);


  const { histories, addHistory, addComment } = useHistory();
  const [commentDrawerOpen, setCommentDrawerOpen] = useState<boolean>(false);
  const [commentInfo, setCommentInfo] = useState<{ index: number, comment?: string } | null>(null);

  const openCommentDrawer = (index: number, comment?: string) => {
    setCommentInfo({ index, comment });
    setCommentDrawerOpen(true);
  };

  const saveComment = (comment: string) => {
    if (commentInfo == null) return;
    addComment(commentInfo.index, comment);
  };

  const calculatedTime = useMemo(() => {
    const waterKeepTime = Math.round(selectedVegetable.waterKeepTime * (1 + buildingBuffer.waterKeepBuffer / 100));
    return {
      realHarvestTime: calcRealHarvestTime(selectedVegetable.harvestTime, waterKeepTime),
      invalideWaterTime: Math.round(waterKeepTime * 0.1),
      waterKeepTime,
    }
  }, [selectedVegetable, buildingBuffer]);

  const onVegetableChange = (value: string) => {
    const index = parseInt(value);
    setSelectedVegetableIndex(index);
    setSelectedVegetable(vegetables[index]);
    setHarvestTimeResult(null);
    setGoingToHarvestTimeResult(null);
  }

  const calculateHarvestTime = () => {
    const baseDate = new Date();
    if (!useCurrentTime) {
      baseDate.setHours(baseTime.hour);
      baseDate.setMinutes(baseTime.minute);
    }
    const fullWaterTime = new Date(baseDate);
    fullWaterTime.setMinutes(fullWaterTime.getMinutes() + calculatedTime.realHarvestTime);

    const oneWaterTime = new Date(baseDate);
    oneWaterTime.setMinutes(oneWaterTime.getMinutes() + selectedVegetable.harvestTime - Math.round(calculatedTime.waterKeepTime * 0.25));

    const twoWaterTime = new Date(oneWaterTime);
    twoWaterTime.setMinutes(twoWaterTime.getMinutes() - Math.round(calculatedTime.waterKeepTime * 0.25));

    const lastWaterTime = new Date(fullWaterTime);
    lastWaterTime.setMinutes(lastWaterTime.getMinutes() - Math.round(calculatedTime.waterKeepTime * 0.1));

    const waterList = calcWaterList(calculatedTime.realHarvestTime, 0, calculatedTime.waterKeepTime);
    const waterTimes = waterList.map((time) => {
      const date = new Date(baseDate);
      date.setMinutes(date.getMinutes() + time);
      return date;
    });

    const result: ClacResult1 = {
      fullWaterTime,
      oneWaterTime,
      twoWaterTime,
      lastWaterTime,
      waterTimes,
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
    const baseDate = new Date();
    const fullWaterTime = new Date(baseDate);
    const realHarvestDuration = calcRealHarvestTime(toHarvestDuration, calculatedTime.waterKeepTime - waterKeepDuration, calculatedTime.invalideWaterTime);
    fullWaterTime.setMinutes(fullWaterTime.getMinutes() + realHarvestDuration);

    const endWaterTime = new Date(baseDate);
    // 用一水时间和满浇时间取大的就是只浇尾水的时间
    endWaterTime.setMinutes(endWaterTime.getMinutes() + Math.max(realHarvestDuration, toHarvestDuration - Math.floor(calculatedTime.waterKeepTime * 0.25)));

    const lastWaterTime = new Date(fullWaterTime);
    lastWaterTime.setMinutes(lastWaterTime.getMinutes() - Math.round(calculatedTime.waterKeepTime * 0.1));

    const waterList = calcWaterList(realHarvestDuration, calculatedTime.waterKeepTime - waterKeepDuration, calculatedTime.waterKeepTime);
    const waterTimes = waterList.map((time) => {
      const date = new Date(baseDate);
      date.setMinutes(date.getMinutes() + time);
      return date;
    });

    const result: ClacResult2 = {
      fullWaterTime,
      endWaterTime,
      lastWaterTime,
      waterTimes,
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

  const calculatePlanHarvestTime = () => {
    const baseDate = new Date();
    baseDate.setHours(planHarvestTime.hour);
    baseDate.setMinutes(planHarvestTime.minute);
    const fullWaterTime = new Date(baseDate);
    fullWaterTime.setMinutes(fullWaterTime.getMinutes() - calculatedTime.realHarvestTime);

    const oneWaterTime = new Date(baseDate);
    oneWaterTime.setMinutes(oneWaterTime.getMinutes() - (selectedVegetable.harvestTime - Math.round(calculatedTime.waterKeepTime * 0.25)));

    const twoWaterTime = new Date(oneWaterTime);
    twoWaterTime.setMinutes(twoWaterTime.getMinutes() + Math.round(calculatedTime.waterKeepTime * 0.25));

    const lastWaterTime = new Date(baseDate);
    lastWaterTime.setMinutes(lastWaterTime.getMinutes() - Math.round(calculatedTime.waterKeepTime * 0.1));

    const waterList = calcWaterList(calculatedTime.realHarvestTime, 0, calculatedTime.waterKeepTime);
    const waterTimes = waterList.map((time) => {
      const date = new Date(fullWaterTime);
      date.setMinutes(date.getMinutes() + time);
      return date;
    });

    const result: ClacResult1 = {
      fullWaterTime,
      oneWaterTime,
      twoWaterTime,
      lastWaterTime,
      waterTimes,
    };
    setPlanHarvestTimeResult(result);

    const history: ClacHistoryItem = {
      type: 'R3',
      result,
      baseTime: baseDate,
      vegetable: selectedVegetable.name,
    };
    addHistory(history);
  };

  return (
    <main className="flex w-full min-h-screen flex-col items-center">
      <div className="flex flex-col items-stretch gap-y-4 w-full max-w-3xl p-4">
        <div className="flex items-center justify-between">
          <FenceIcon className="w-10 h-10 text-slate-500" />
          <Popover>
            <PopoverTrigger><HelpCircleIcon className="w-6 h-6 text-slate-400"/></PopoverTrigger>
            <PopoverContent className="text-sm">
              计算新种收获时间（R1）：
              <br/>
              计算新种植一种作物后的收获时间，可以选择按当前时间计算，也可以自选种植时间计算，方便规划收菜时间。
              <br/>
              <br/>
              计算在途收获时间（R2）：
              <br/>
              计算已种下一段时间后的作物的收获时间，在游戏内查看待成熟时间和水分保持时间填入后就可算出收菜时间（方便偷别人的菜🐶）。
              <br/>
              <br/>
              倒二浇时间：
              <br/>
              指倒数第二次可浇水的最晚时间，避免浇水后因为禁浇时间的缘故，导致在最后收菜时间前无法浇水。
              <br/>
              <br/>
              iOS 系统点击时间可直接设置一个提前一分钟的闹钟，需要先导入<a href='https://www.icloud.com/shortcuts/2f7fc09c232a42f3becda7826cd9fb7a' target='_blank' className="underline">这个快捷指令</a>。
            </PopoverContent>
          </Popover>
        </div>
        <h1 className="text-2xl">元梦之星种菜计算器</h1>
        <div className="bg-white pt-2 pb-[1px] sticky top-0 z-[100]">
          <div className="flex flex-col items-stretch gap-y-2 -mx-2 p-2 rounded bg-slate-100 shadow">
            <h2 className="text-lg px-1">
              <CarrotIcon className="inline mr-1 -mt-1 w-6 h-6 text-slate-500" />
              <span>选择蔬菜</span>
            </h2>
            <Select value={selectedVegetableIndex.toString()} onValueChange={onVegetableChange}>
              <SelectTrigger>
                <SelectValue placeholder="请选择蔬菜">
                  <div>{selectedVegetable.name}</div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {vegetables.map((vegetable, i) => (
                  <SelectItem key={i} value={i.toString()}>{vegetable.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <h2 className="px-1">
          <AccessibilityIcon className="inline mr-1 -mt-1 w-5 h-5 text-slate-500" />
          <span>设施加成</span>
        </h2>
        <div className="grid grid-cols-2 gap-2 -mt-2">
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-1 text-slate-500">
              <GlassWaterIcon className="w-4 h-4" />
              <span>水分保持加成</span>
            </div>
            <div className="flex items-center gap-x-1">
              <Input type="number" value={buildingBuffer.waterKeepBuffer} onChange={(e) => setBuildingBuffer({ ...buildingBuffer, waterKeepBuffer: parseInt(e.target.value) })} />
              <span>%</span>
            </div>
          </div>
        </div>
        <h2 className="text-lg p-1 rounded bg-slate-100 mt-2">
          <DatabaseIcon className="inline mr-1 -mt-1 w-6 h-6 text-slate-500" />
          <span>基础数据</span>
        </h2>
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
          <DataCeil title='不浇水成熟时间'>
            {minutesToTimeString(selectedVegetable.harvestTime)}
          </DataCeil>
          <DataCeil title='满浇水成熟时间'>
            {minutesToTimeString(calculatedTime!.realHarvestTime)}
          </DataCeil>
          <DataCeil title='水分保持时间'>
            {minutesToTimeString(calculatedTime!.waterKeepTime)}
          </DataCeil>
          <DataCeil title='禁止浇水时间'>
            {minutesToTimeString(calculatedTime!.invalideWaterTime)}
          </DataCeil>
        </div>
        <h2 className="flex items-center text-lg p-1 rounded bg-slate-100 mt-4">
          <SproutIcon className="mr-1 w-6 h-6 text-slate-500" />
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
        <Button onClick={calculateHarvestTime}>
          <CalculatorIcon className='w-4 h-4 mr-1' />
          <span>计算</span>
        </Button>
        {harvestTimeResult && (
          <R1Data result={harvestTimeResult} />
        )}
        <h2 className="flex items-center text-lg p-1 rounded bg-slate-100 mt-4">
          <Flower2Icon className="mr-1 w-6 h-6 text-slate-500" />
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
        <Button onClick={calculateGoingToHarvestTime}>
          <CalculatorIcon className='w-4 h-4 mr-1' />
          <span>计算</span>
        </Button>
        {goingToharvestTimeResult && (
          <R2Data result={goingToharvestTimeResult} />
        )}
        <h2 className="flex items-center text-lg p-1 rounded bg-slate-100 mt-4">
          <BeanIcon className="mr-1 w-6 h-6 text-slate-500" />
          <span>计算收获倒推时间（R3）</span>
        </h2>
        <div className="flex flex-col items-start gap-y-2 sm:flex-row sm:items-center sm:gap-x-2">
          <div className="flex items-center gap-x-2">
            <Label>计划收获时间</Label>
            <TimeInput mode="time" onTimeChange={setPlanHarvestTime} />
          </div>
        </div>
        <Button onClick={calculatePlanHarvestTime}>
          <CalculatorIcon className='w-4 h-4 mr-1' />
          <span>计算</span>
        </Button>
        {planHarvestTimeResult && (
          <R3Data result={planHarvestTimeResult} />
        )}
        {histories.length > 0 && (
          <>
            <CommentDrawer
              open={commentDrawerOpen}
              onOpenChange={setCommentDrawerOpen}
              onCommentSave={saveComment}
              comment={commentInfo?.comment}
            />
            <h2 className="text-lg p-1 rounded bg-slate-100 mt-4">
              <FileClockIcon className="inline mr-1 -mt-1 w-6 h-6 text-slate-500" />
              <span>计算历史</span>
            </h2>
            {histories.map((history, i) => {
              return (
                <div key={history.baseTime.toString()} className="flex flex-col items-stretch gap-y-2 pb-2 border-b">
                  {function() {
                    switch (history.type) {
                      case 'R1':
                        return (
                          <>
                            <h3 className="font-medium flex items-center">
                              <SproutIcon className="w-5 h-5 text-slate-500" />
                              <span>{`新种收获计算: ${history.vegetable}`}</span>
                            </h3>
                            <span className="-mt-2">{`种下时间: ${formatDate(history.baseTime)}`}</span>
                          </>
                        );
                      case 'R2':
                        return (
                          <>
                            <h3 className="font-medium flex items-center">
                              <Flower2Icon className="w-5 h-5 text-slate-500" />
                              <span>{`在途收获计算: ${history.vegetable}`}</span>
                            </h3>
                            <span className="-mt-2">{`计算时间: ${formatDate(history.baseTime)}`}</span>
                          </>
                        );
                      case 'R3':
                        return (
                          <>
                            <h3 className="font-medium flex items-center">
                              <BeanIcon className="w-5 h-5 text-slate-500" />
                              <span>{`收获倒推计算: ${history.vegetable}`}</span>
                            </h3>
                            <span className="-mt-2">{`计划收获时间: ${formatDateToHHmm(history.baseTime)}`}</span>
                          </>
                        );
                      default:
                        return null;
                    }
                  }()}
                  <Comment index={i} comment={history.comment} onCommentClick={openCommentDrawer} />
                  {function() {
                    switch (history.type) {
                      case 'R1':
                        return (
                          <R1Data result={history.result} />
                        );
                      case 'R2':
                        return (
                          <R2Data result={history.result} />
                        );
                      case 'R3':
                        return (
                          <R3Data result={history.result} />
                        );
                      default:
                        return null;
                    }
                  }()}
                </div>
              )
            })}
          </>
        )}
        <p className="text-center mt-8 mb-4 space-x-1">
          <FenceIcon className="inline w-4 h-4 text-pink-400"/>
          <FenceIcon className="inline w-4 h-4 text-red-400"/>
          <FenceIcon className="inline w-4 h-4 text-yellow-400"/>
          <FenceIcon className="inline w-4 h-4 text-green-400"/>
          <FenceIcon className="inline w-4 h-4 text-cyan-400"/>
          <FenceIcon className="inline w-4 h-4 text-blue-400"/>
          <FenceIcon className="inline w-4 h-4 text-purple-400"/>
        </p>
      </div>
      <ConfirmHolder />
    </main>
  );
}
