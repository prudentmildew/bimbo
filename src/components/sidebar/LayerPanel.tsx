import { useMemo, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { Discipline } from '../../lib/model/types';
import { useAppStore } from '../../store';

const DISCIPLINE_LABELS: Record<Discipline, string> = {
  architectural: 'Architecture',
  structural: 'Structure',
  mep: 'MEP',
};

const DISCIPLINE_COLORS: Record<Discipline, string> = {
  architectural: 'bg-architecture',
  structural: 'bg-structure',
  mep: 'bg-mep',
};

export function LayerPanel() {
  const objects = useAppStore((s) => s.objects);
  const disciplineVisibility = useAppStore((s) => s.disciplineVisibility);
  const typeVisibility = useAppStore((s) => s.typeVisibility);
  const toggleDiscipline = useAppStore((s) => s.toggleDiscipline);
  const toggleType = useAppStore((s) => s.toggleType);
  const setAllVisible = useAppStore((s) => s.setAllVisible);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const tree = useMemo(() => {
    const map: Record<Discipline, Set<string>> = {
      architectural: new Set(),
      structural: new Set(),
      mep: new Set(),
    };
    for (const obj of objects) {
      map[obj.discipline].add(obj.ifcType);
    }
    return map;
  }, [objects]);

  const allVisible = Object.values(disciplineVisibility).every(Boolean);

  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-2 pb-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Layers
        </span>
        <button
          type="button"
          onClick={() => setAllVisible(!allVisible)}
          className="text-[10px] text-muted-foreground bg-transparent border-none cursor-pointer p-0 hover:text-foreground"
        >
          {allVisible ? 'Hide all' : 'Show all'}
        </button>
      </div>

      {(Object.keys(DISCIPLINE_LABELS) as Discipline[]).map((discipline) => {
        const isVisible = disciplineVisibility[discipline];
        const isExpanded = expanded[discipline] ?? false;
        const types = tree[discipline];

        return (
          <Collapsible
            key={discipline}
            open={isExpanded}
            onOpenChange={(open) =>
              setExpanded((prev) => ({ ...prev, [discipline]: open }))
            }
          >
            <div className="flex items-center px-2 py-0.5">
              <CollapsibleTrigger className="bg-transparent border-none text-muted-foreground cursor-pointer text-[8px] p-0 pr-1 w-4">
                {isExpanded ? '\u25BC' : '\u25B6'}
              </CollapsibleTrigger>
              <span
                className={`inline-block w-2 h-2 rounded-full mr-1.5 ${DISCIPLINE_COLORS[discipline]}`}
              />
              <div className="flex items-center gap-1.5 text-xs text-foreground/80 cursor-pointer">
                <Checkbox
                  checked={isVisible}
                  onCheckedChange={() => toggleDiscipline(discipline)}
                  className="h-3.5 w-3.5"
                />
                <span>{DISCIPLINE_LABELS[discipline]}</span>
              </div>
            </div>

            <CollapsibleContent>
              {[...types].sort().map((ifcType) => {
                const typeVisible = typeVisibility[ifcType] ?? true;
                return (
                  <div key={ifcType} className="py-0.5 px-2 pl-7">
                    <div className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <Checkbox
                        checked={typeVisible && isVisible}
                        disabled={!isVisible}
                        onCheckedChange={() => toggleType(ifcType)}
                        className="h-3.5 w-3.5"
                      />
                      <span
                        className={
                          isVisible
                            ? 'text-foreground/80'
                            : 'text-muted-foreground'
                        }
                      >
                        {ifcType}
                      </span>
                    </div>
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
