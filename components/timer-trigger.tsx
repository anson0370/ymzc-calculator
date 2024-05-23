'use client';

import { formatDate, formatDateToHHmm } from "@/lib/tools";
import { useConfirm } from "./dialog";
import { Input } from "./shadcn/ui/input";

export default function TimerTrigger({ toTime }: { toTime: Date | string }) {
  const { confirm } = useConfirm();

  const time = new Date(toTime);

  const onTimeClick = () => {
    const duration = time.getTime() - Date.now();
    if (duration <= 0) {
      return;
    }

    const alarmTime = new Date(toTime);
    alarmTime.setMinutes(alarmTime.getMinutes() - 1);
    const timeStr = formatDateToHHmm(alarmTime);

    confirm({
      title: '设置闹钟',
      body: (<div>
        <p>将设置时间为 <strong>{timeStr}</strong> 的闹钟</p>
        <div className="flex items-center mt-2">
          <span className="shrink-0">闹钟名：</span>
          <Input id="alarm-name" defaultValue='浇水收菜' />
        </div>
      </div>),
      confirmText: '设置',
      cancelText: '取消',
      onConfirm: () => {
        const alarmName = (document.getElementById('alarm-name') as HTMLInputElement).value;
        window.open(`shortcuts://run-shortcut?name=种菜闹钟&input=${encodeURIComponent(JSON.stringify({ time: timeStr, name: alarmName }))}`);
      },
    });
  }

  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onTimeClick(); }} className="hover:underline">
      {formatDate(toTime)}
    </a>
  )
}
