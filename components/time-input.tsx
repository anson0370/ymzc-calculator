import clsx from "clsx";
import { ChangeEvent, useRef, useState } from "react";

export default function TimeInput({
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
  const firstInputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);

  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);

  const hourValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const strValue = e.target.value;
    const hourValue = strValue == "" ? 0 : parseInt(strValue);
    if (Number.isNaN(hourValue)) {
      return;
    }
    const validHourValue = Math.max(0, Math.min(99, hourValue));
    setHour(validHourValue);
    if (onTimeChange != null) {
      onTimeChange({ hour: validHourValue, minute });
    }
    if (onDurationChange != null) {
      onDurationChange(validHourValue * 60 + minute);
    }
    if (validHourValue >= 10) {
      secondInputRef.current?.focus();
    }
  }

  const minuteValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const strValue = e.target.value;
    const minuteValue = strValue == "" ? 0 : parseInt(strValue);
    if (Number.isNaN(minuteValue)) {
      return;
    }
    const validMinuteValue = Math.max(0, Math.min(59, minuteValue));
    setMinute(validMinuteValue);
    if (onTimeChange != null) {
      onTimeChange({ hour, minute: validMinuteValue });
    }
    if (onDurationChange != null) {
      onDurationChange(hour * 60 + validMinuteValue);
    }
    if (strValue == "") {
      firstInputRef.current?.focus();
    }
  }

  return (
    <div className={clsx(
      "flex items-center px-2",
      "rounded-md border border-slate-200 bg-white text-sm",
      {
        "cursor-not-allowed opacity-50": disabled,
      },
    )}>
      <input disabled={disabled} ref={firstInputRef} type="number" max={99} min={0} className="font-mono number-input-noarrow w-8 p-2 text-right bg-transparent" placeholder="0" value={hour.toString()} onChange={hourValueChange} />
      <span className="text-slate-600">{mode === 'time' ? '点' : '小时'}</span>
      <input disabled={disabled} ref={secondInputRef} type="number" max={60} min={0} className="font-mono number-input-noarrow w-8 p-2 text-right bg-transparent" placeholder="0" value={minute.toString()} onChange={minuteValueChange} />
      <span className="text-slate-600">分</span>
    </div>
  )
}
