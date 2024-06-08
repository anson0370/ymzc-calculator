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
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string>('');

  const valueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const strValue = e.target.value;
    const numberValue = strValue === '' ? 0 : Math.abs(parseInt(strValue));
    if (Number.isNaN(numberValue)) {
      return;
    }
    const hour = Math.floor(numberValue / 100);
    const minute = numberValue % 100;
    if (onTimeChange != null) {
      onTimeChange({ hour, minute });
    }
    if (onDurationChange != null) {
      onDurationChange(hour * 60 + minute);
    }
    if (strValue.length <= 4) {
      setInputValue(strValue);
    } else {
      setInputValue(strValue.slice(-4));
    }
  }

  const hourStr = inputValue.slice(-4, -2);
  const minStr = inputValue.slice(-2);

  return (
    <div
      className={clsx(
        "relative group",
        "rounded-md border border-slate-200 bg-white text-sm",
        "focus-within:border-blue-500",
        {
          "cursor-not-allowed opacity-50": disabled,
        },
      )}
      onClick={() => {inputRef.current?.focus()}}
    >
      <div className="flex items-center p-2 relative z-10">
        <span className="font-mono w-7 px-1 text-right align-bottom">{hourStr === '' ? '0' : hourStr}</span>
        <span className="text-slate-600">{mode === 'time' ? '点' : '小时'}</span>
        <span className="font-mono w-7 px-1 pr-[1px] text-right">{minStr === '' ? '0' : minStr}</span>
        <span className="w-[2px] h-4 mr-[1px] group-focus-within:bg-blue-500 group-focus-within:animate-blink" />
        <span className="text-slate-600">分</span>
      </div>
      <input
        ref={inputRef}
        type="number"
        className={clsx(
          "absolute z-0 inset-0 opacity-0 cursor-pointer",
        )}
        value={inputValue}
        onChange={valueChange}
        disabled={disabled}
      />
    </div>
  )
}
