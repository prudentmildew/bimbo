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

const DISCIPLINE_CSS: Record<Discipline, string> = {
  architectural: 'var(--color-architecture)',
  structural: 'var(--color-structure)',
  mep: 'var(--color-mep)',
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
    <div className="sidebar-panel">
      <div className="sidebar-panel-header">
        <span className="mono-label">Layers</span>
        <button
          type="button"
          onClick={() => setAllVisible(!allVisible)}
          className="sidebar-panel-action"
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
            <div className="layer-row">
              <CollapsibleTrigger className="layer-expand-btn">
                {isExpanded ? '\u25BC' : '\u25B6'}
              </CollapsibleTrigger>
              <span
                className="layer-dot"
                style={{ background: DISCIPLINE_CSS[discipline] }}
              />
              <div className="layer-check-row">
                <Checkbox
                  checked={isVisible}
                  onCheckedChange={() => toggleDiscipline(discipline)}
                />
                <span>{DISCIPLINE_LABELS[discipline]}</span>
              </div>
            </div>

            <CollapsibleContent>
              {[...types].sort().map((ifcType) => {
                const typeVisible = typeVisibility[ifcType] ?? true;
                return (
                  <div key={ifcType} className="layer-type-row">
                    <div className="layer-check-row">
                      <Checkbox
                        checked={typeVisible && isVisible}
                        disabled={!isVisible}
                        onCheckedChange={() => toggleType(ifcType)}
                      />
                      <span
                        className={
                          isVisible ? 'layer-type-label' : 'layer-type-label muted'
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
