import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import dayjs from 'dayjs';

interface HabitDayListProps {
  date: string;
  onCompletedChanged: (completed: number) => void;
}

interface HabitsInfo {
  habits: Array<{ id: string; title: string; created_at: string }>;
  completedHabits: Array<string>;
}

export function HabitDayList({ date, onCompletedChanged }: HabitDayListProps) {
  const [habitInfo, setHabitsInfo] = useState<HabitsInfo>();

  useEffect(() => {
    api
      .get('day', {
        params: {
          date: date.toString(),
        },
      })
      .then((response) => {
        setHabitsInfo(response.data);
      });
  }, []);

  async function handleToggleHabitStatus(id: string) {
    if (habitInfo?.completedHabits.includes(id)) {
      habitInfo!.completedHabits = habitInfo?.completedHabits.filter(
        (completedId) => completedId !== id
      );
    } else {
      habitInfo!.completedHabits = [...habitInfo!.completedHabits, id];
    }

    onCompletedChanged(habitInfo!.completedHabits.length);

    await api.patch(`habits/${id}/toggle`);
  }

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitInfo?.habits.map((habit, index) => {
        return (
          <Checkbox.Root
            key={habit.id}
            defaultChecked={habitInfo?.completedHabits.includes(habit.id)}
            disabled={isDateInPast}
            onCheckedChange={() => handleToggleHabitStatus(habit.id)}
            className="flex items-center gap-3 group disabled:cursor-not-allowed transtion-all"
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-violet-600 group-data-[state=checked]:border-violet-600 focus:border-violet-800 transtion-colors">
              <Checkbox.Indicator>
                <Check size={20} className="text-white " />
              </Checkbox.Indicator>
            </div>

            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400 transtion-all">
              {habit.title}
            </span>
          </Checkbox.Root>
        );
      })}
    </div>
  );
}
