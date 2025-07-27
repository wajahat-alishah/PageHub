import { BoxSelect } from 'lucide-react';

export function PageHubLogo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <BoxSelect className="h-7 w-7 text-primary" />
      <h2 className="font-headline text-xl font-bold tracking-tighter">
        PageHub
      </h2>
    </div>
  );
}
