'use client';

import { DataCeil, R1Data, R2Data } from "@/components/data-comps";
import { Button } from "@/components/shadcn/ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/shadcn/ui/drawer";
import { Label } from "@/components/shadcn/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/shadcn/ui/select";
import { Switch } from "@/components/shadcn/ui/switch";
import { Textarea } from "@/components/shadcn/ui/textarea";
import TimeInput from "@/components/time-input";
import { realHarvestTime } from "@/lib/calc";
import { vegetables } from "@/lib/data";
import useHistory from "@/lib/history";
import { formatDate, minutesToTimeString } from "@/lib/tools";
import { ClacHistoryItem, ClacResult1, ClacResult2, Vegetable } from "@/lib/types";
import { SelectValue } from "@radix-ui/react-select";
import { AlarmClockCheckIcon, AlarmClockIcon, CalculatorIcon, CarrotIcon, DatabaseIcon, FenceIcon, FileClockIcon, HelpCircleIcon, NotebookPenIcon } from "lucide-react";
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

  const [useCurrentTime, setUseCurrentTime] = useState<boolean>(true);
  const [baseTime, setBaseTime] = useState<{ hour: number, minute: number }>({ hour: 0, minute: 0 });
  const [harvestTimeResult, setHarvestTimeResult] = useState<ClacResult1 | null>(null);

  const [toHarvestDuration, setToHarvestDuration] = useState<number>(0);
  const [waterKeepDuration, setWaterKeepDuration] = useState<number>(0);

  const [goingToharvestTimeResult, setGoingToHarvestTimeResult] = useState<ClacResult2 | null>(null);

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
    return {
      realHarvestTime: realHarvestTime(selectedVegetable.harvestTime, selectedVegetable.waterKeepTime),
      invalideWaterTime: Math.round(selectedVegetable.waterKeepTime * 0.1),
    }
  }, [selectedVegetable]);

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
        <FenceIcon className="w-10 h-10 text-slate-500" />
        <h1 className="text-2xl">元梦之星种菜计算器</h1>
        <h2 className="text-lg p-1 rounded bg-slate-100 mt-4">
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
        <h2 className="text-lg p-1 rounded bg-slate-100 mt-4">
          <DatabaseIcon className="inline mr-1 -mt-1 w-6 h-6 text-slate-500" />
          <span>基础数据</span>
        </h2>
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
          <DataCeil title='不浇水成熟时间' data={minutesToTimeString(selectedVegetable.harvestTime)} />
          <DataCeil title='满浇水成熟时间' data={minutesToTimeString(calculatedTime!.realHarvestTime)} />
          <DataCeil title='水分保持时间' data={minutesToTimeString(selectedVegetable.waterKeepTime)} />
          <DataCeil title='禁止浇水时间' data={minutesToTimeString(calculatedTime!.invalideWaterTime)} />
        </div>
        <h2 className="flex items-center text-lg p-1 rounded bg-slate-100 mt-4">
          <AlarmClockCheckIcon className="mr-1 w-6 h-6 text-slate-500" />
          <span>计算新种收获时间（R1）</span>
          <Popover>
            <PopoverTrigger className="ml-4"><HelpCircleIcon className="w-5 h-5"/></PopoverTrigger>
            <PopoverContent>
              计算新种植一种作物后的收获时间，可以选择按当前时间计算，也可以自选种植时间计算，方便规划收菜时间。
              <br/>
              倒二浇时间：指倒数第二次可浇水的最晚时间，避免浇水后因为禁浇时间的缘故，导致在最后收菜时间前无法浇水。
            </PopoverContent>
          </Popover>
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
          <AlarmClockIcon className="mr-1 w-6 h-6 text-slate-500" />
          <span>计算在途收获时间（R2）</span>
          <Popover>
            <PopoverTrigger className="ml-4"><HelpCircleIcon className="w-5 h-5"/></PopoverTrigger>
            <PopoverContent>
              计算已种下一段时间后的作物的收获时间，在游戏内查看待成熟时间和水分保持时间填入后就可算出收菜时间（方便偷别人的菜🐶）。
              <br/>
              倒二浇时间：指倒数第二次可浇水的最晚时间，避免浇水后因为禁浇时间的缘故，导致在最后收菜时间前无法浇水。
            </PopoverContent>
          </Popover>
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
                <div key={history.baseTime.toString()} className="flex flex-col items-stretch gap-y-2 border-b">
                  <h3>{`${history.vegetable}(${history.type}@${formatDate(history.baseTime)})`}</h3>
                  <Comment index={i} comment={history.comment} onCommentClick={openCommentDrawer} />
                  {function() {
                    if (history.type === 'R1') {
                      return (
                        <R1Data result={history.result} />
                      );
                    } else if (history.type === 'R2') {
                      return (
                        <R2Data result={history.result} />
                      );
                    } else {
                      return null;
                    }
                  }()}
                </div>
              )
            })}
          </>
        )}
      </div>
    </main>
  );
}
