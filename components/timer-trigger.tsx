'use client';

import { formatDate } from "@/lib/tools";

export default function TimerTrigger({ toTime }: { toTime: Date | string }) {
  const time = new Date(toTime);

  const onTimeClick = () => {
    const duration = time.getTime() - Date.now();
    if (duration <= 0) {
      return;
    }
    const minutes = Math.floor(duration / 1000 / 60) - 1;
    window.open(`shortcuts://run-shortcut?name=倒计时&input=${minutes}`);
  }

  return (
    <a href="#" onClick={onTimeClick} className="hover:underline">
      {formatDate(toTime)}
    </a>
  )
}
