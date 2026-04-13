import { useMemo, useState } from 'react';
import type { Discipline } from '../../lib/model/types';
import { useAppStore } from '../../store';

const DISCIPLINE_LABELS: Record<Discipline, string> = {
  architectural: 'Architecture',
  structural: 'Structure',
  mep: 'MEP',
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

  const toggleExpand = (discipline: string) => {
    setExpanded((prev) => ({ ...prev, [discipline]: !prev[discipline] }));
  };

  const allVisible = Object.values(disciplineVisibility).every(Boolean);

  return (
    <div style={{ padding: '8px 0' }}>
      <div style={headerRowStyle}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: '#6b7280',
          }}
        >
          Layers
        </span>
        <button
          type="button"
          onClick={() => setAllVisible(!allVisible)}
          style={showAllBtnStyle}
        >
          {allVisible ? 'Hide all' : 'Show all'}
        </button>
      </div>

      {(Object.keys(DISCIPLINE_LABELS) as Discipline[]).map((discipline) => {
        const isVisible = disciplineVisibility[discipline];
        const isExpanded = expanded[discipline] ?? false;
        const types = tree[discipline];

        return (
          <div key={discipline}>
            <div style={disciplineRowStyle}>
              <button
                type="button"
                onClick={() => toggleExpand(discipline)}
                style={expandBtnStyle}
              >
                {isExpanded ? '\u25BC' : '\u25B6'}
              </button>
              <label style={labelStyle}>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={() => toggleDiscipline(discipline)}
                  style={checkboxStyle}
                />
                {DISCIPLINE_LABELS[discipline]}
              </label>
            </div>

            {isExpanded &&
              [...types].sort().map((ifcType) => {
                const typeVisible = typeVisibility[ifcType] ?? true;
                return (
                  <div key={ifcType} style={typeRowStyle}>
                    <label style={labelStyle}>
                      <input
                        type="checkbox"
                        checked={typeVisible && isVisible}
                        disabled={!isVisible}
                        onChange={() => toggleType(ifcType)}
                        style={checkboxStyle}
                      />
                      <span
                        style={{ color: !isVisible ? '#4b5563' : '#d1d5db' }}
                      >
                        {ifcType}
                      </span>
                    </label>
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}

const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 8px 6px',
};

const showAllBtnStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#9ca3af',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
};

const disciplineRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '3px 8px',
};

const expandBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#9ca3af',
  cursor: 'pointer',
  fontSize: 8,
  padding: '0 4px 0 0',
  width: 16,
};

const typeRowStyle: React.CSSProperties = {
  padding: '2px 8px 2px 28px',
};

const labelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  color: '#d1d5db',
  cursor: 'pointer',
};

const checkboxStyle: React.CSSProperties = {
  margin: 0,
  accentColor: '#4fc3f7',
};
