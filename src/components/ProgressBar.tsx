import * as Progress from '@radix-ui/react-progress';

interface ProgressProps {
  progress: number;
}

export function ProgressBar(props: ProgressProps) {
  return (
    <Progress.Root
      className="h-3 rounded-xl bg-zinc-700 w-full mt-4 overflow-hidden"
      value={props.progress}
    >
      <Progress.Indicator
        className="h-3 rounded-xl bg-violet-600 transition-transform duration-500"
        style={{ transform: `translateX(-${100 - props.progress}%)` }}
      />
    </Progress.Root>
  );
}
