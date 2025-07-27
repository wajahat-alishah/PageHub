import { PanelsTopLeft } from 'lucide-react';

export function PageHubLogo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <div className="relative h-7 w-7">
        <PanelsTopLeft className="absolute h-7 w-7 text-primary" />
        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-sm bg-accent opacity-75"></div>
      </div>
      <h2 className="font-headline text-xl font-bold tracking-tighter">
        PageHub
      </h2>
    </div>
  );
}
