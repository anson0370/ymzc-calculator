import { useState } from "react";
import clsx from "clsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./shadcn/ui/select";

const hours = Array.from({ length: 24 }, (_, i) => i);
const durationHours = Array.from({ length: 48 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

export default function TimeSelect({
  mode = 'duration',
  disabled = false,
  onTimeChange,
  onDurationChange,
}: {
  mode?: 'time' | 'duration';
  disabled?: boolean;
  onTimeChange?: (time: { hour: number, minute: number }) => void;
  onDurationChange?: (duration: number) => void;
}) {
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);

  const onHourChange = (value: string) => {
    if (value.trim() === '') return;
    const hourValue = parseInt(value);
    const validHourValue = Math.max(0, Math.min(23, hourValue));
    setHour(validHourValue);
    if (onTimeChange != null) {
      onTimeChange({ hour: validHourValue, minute });
    }
    if (onDurationChange != null) {
      onDurationChange(validHourValue * 60 + minute);
    }
  }

  const onMinuteChange = (value: string) => {
    if (value.trim() === '') return;
    const minuteValue = parseInt(value);
    const validMinuteValue = Math.max(0, Math.min(59, minuteValue));
    setMinute(validMinuteValue);
    if (onTimeChange != null) {
      onTimeChange({ hour, minute: validMinuteValue });
    }
    if (onDurationChange != null) {
      onDurationChange(hour * 60 + validMinuteValue);
    }
  }

  return (
    <div className={clsx(
      "flex items-center gap-x-1",
      {
        'text-slate-500': disabled,
      }
    )}>
      {/* <Input disabled={disabled} type='number' max={23} min={0} className="w-16" value={hour} onChange={(e) => onHourChange(e.target.value)} /> */}
      <Select disabled={disabled} value={hour.toString()} onValueChange={onHourChange}>
        <SelectTrigger className="w-16">
          <SelectValue>
            {hour}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {(mode === 'time' ? hours : durationHours).map((i) => (
            <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span>{mode === 'time' ? '点' : '小时'}</span>
      {/* <Input disabled={disabled} type='number' max={59} min={0} className="w-16" value={minute} onChange={(e) => onMinuteChange(e.target.value)} /> */}
      <Select disabled={disabled} value={minute.toString()} onValueChange={onMinuteChange}>
        <SelectTrigger className="w-16">
          <SelectValue>
            {minute}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {minutes.map((i) => (
            <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span>分</span>
    </div>
  );
}
