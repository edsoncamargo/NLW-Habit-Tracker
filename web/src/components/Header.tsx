import { Plus, X } from 'phosphor-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

import logoImage from '../assets/logo.svg';
import { NewHabitForm } from './NewHabitForm';

export function Header() {
  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
      <img src={logoImage} alt="Habits"></img>

      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <a
            type="button"
            className="border border-violet-500 font-semibold rounded-lg px-6 py-4 flex items-center gap-3 hover:border-violet-300 transition-all"
          >
            Novo hábito
          </a>
        </AlertDialog.Trigger>

        <AlertDialog.Portal>
          <AlertDialog.Overlay className="w-screen h-screen bg-black/80 fixed inset-0" />
          <AlertDialog.Content className="absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
            <AlertDialog.Title className="text-3xl leading-tight font-extrebold">
              Add Habit
            </AlertDialog.Title>
            <AlertDialog.Description />
            <AlertDialog.Cancel
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-200"
              aria-label="Close"
            >
              <X />
            </AlertDialog.Cancel>

            <NewHabitForm />
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}
