import { ScrollArea } from '@/components/ui/scroll-area';
import { ObjectProperties } from '../properties/ObjectProperties';

export function RightPanel() {
  return (
    <aside className="flex flex-col w-[280px] shrink-0 border-l border-border bg-card">
      <div className="p-3 border-b border-border">
        <h2 className="m-0 text-[13px] font-semibold text-foreground">
          Properties
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <ObjectProperties />
      </ScrollArea>
    </aside>
  );
}
