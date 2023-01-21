import * as Popover from '@radix-ui/react-popover';
import { ProgressBar } from './ProgressBar';

import clsx from 'clsx';
import dayjs from 'dayjs';
import { HabitDayList } from './HabitDayList';
import { useState } from 'react';

interface HabitDayPros {
  date: string;
  defaultCompleted?: number;
  amount?: number;
}

export function HabitDay({
  defaultCompleted = 0,
  amount = 0,
  date,
}: HabitDayPros) {
  const [completed, setCompleted] = useState(defaultCompleted);
  const completedPercentage =
    amount > 0 ? Math.round((completed / amount) * 100) : 0;
  const parsedDate = dayjs(date);
  const today = parsedDate.endOf('day').isSame(dayjs(new Date()).endOf('day'));

  function handleAmountCompletedChanged(completed: number) {
    setCompleted(completed);
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        className={clsx(
          'w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg transition-colors',
          {
            'bg-zinc-900 border-zinc-800': completedPercentage === 0,
            'bg-violet-900 border-violet-700':
              completedPercentage > 0 && completedPercentage < 20,
            'bg-violet-800 border-violet-600':
              completedPercentage >= 20 && completedPercentage < 40,
            'bg-violet-700 border-violet-500':
              completedPercentage >= 40 && completedPercentage < 60,
            'bg-violet-600 border-violet-500':
              completedPercentage >= 60 && completedPercentage < 80,
            'bg-violet-500 border-violet-400': completedPercentage >= 80,
            'border-white border-4': today,
          }
        )}
      />
      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
          <span className="font-semibold text-zinc-400">
            {parsedDate.format('dddd')}
          </span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">
            {parsedDate.format('DD/MM')}
          </span>

          <ProgressBar progress={completedPercentage} />

          <HabitDayList
            date={date}
            onCompletedChanged={handleAmountCompletedChanged}
          />

          <Popover.Arrow className="fill-zinc-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
