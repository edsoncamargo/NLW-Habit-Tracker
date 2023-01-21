import * as Checkbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { Check } from 'phosphor-react';
import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';

const avaibleWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export function NewHabitForm() {
  const [title, setTitle] = useState('');
  const [weekDays, setWeekDays] = useState<number[]>([]);

  function handleToggleChackbox(weekDay: number) {
    if (weekDays.includes(weekDay)) {
      setWeekDays(weekDays.filter((wd) => wd !== weekDay));
    } else {
      setWeekDays([...weekDays, weekDay]);
    }
  }

  async function createNewHabit(event: FormEvent) {
    event.preventDefault();

    if (!title.trim() || weekDays.length === 0) {
      return;
    }

    await api.post('habits', {
      title,
      habitWeekDays: weekDays,
    });

    setTitle('');
    setWeekDays([]);
  }

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label className="font-semibold leading-tight" htmlFor="title">
        What is your commitment?
      </label>
      <input
        type="text"
        id="title"
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
        placeholder="ex: workouts, sleep well, etc..."
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label className="font-semibold leading-tight mt-6" htmlFor="recurrence">
        What is the recurrence?
      </label>
      {avaibleWeekDays.map((weekDay, index) => {
        return (
          <div key={weekDay} className="flex flex-col gap-2 mt-3">
            <Checkbox.Root
              className="flex items-center gap-3 group"
              checked={weekDays.includes(index)}
              onCheckedChange={() => handleToggleChackbox(index)}
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-violet-600 group-data-[state=checked]:border-violet-600 focus:border-violet-800 transtion-all">
                <Checkbox.Indicator>
                  <Check size={20} className="text-white " />
                </Checkbox.Indicator>
              </div>

              <span className="text-white leading-tight transition-all">
                {weekDay}
              </span>
            </Checkbox.Root>
          </div>
        );
      })}

      <button
        type="submit"
        className={clsx(
          'flex flex-1 flex-row items-center justify-center mt-6 rounded-lg p-4 gap-3 font-semibold bg-violet-600 hover:bg-violet-500 transition-all',
          {
            'opacity-30 pointer-events-none cursor-not-allowed':
              !title.trim() || weekDays.length === 0,
          }
        )}
      >
        <Check fontSize={20} weight="bold" />
        Confirm
      </button>
    </form>
  );
}
