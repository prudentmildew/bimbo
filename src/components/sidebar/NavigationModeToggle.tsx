import type * as React from 'react';
import { useAppStore } from '../../store';

export function NavigationModeToggle() {
  const navigationMode = useAppStore((s) => s.navigationMode);
  const setNavigationMode = useAppStore((s) => s.setNavigationMode);

  return (
    <div style={{ padding: '8px 0' }}>
      <div style={headerRowStyle}>
        <span style={headerLabelStyle}>Navigation</span>
      </div>
      <div style={{ display: 'flex', gap: 2, padding: '0 8px' }}>
        <button
          type="button"
          onClick={() => setNavigationMode('orbit')}
          style={{
            ...btnStyle,
            background: navigationMode === 'orbit' ? '#4fc3f7' : '#374151',
            color: navigationMode === 'orbit' ? '#000' : '#d1d5db',
          }}
        >
          Orbit
        </button>
        <button
          type="button"
          onClick={() => setNavigationMode('first-person')}
          style={{
            ...btnStyle,
            background:
              navigationMode === 'first-person' ? '#4fc3f7' : '#374151',
            color: navigationMode === 'first-person' ? '#000' : '#d1d5db',
          }}
        >
          First-Person
        </button>
      </div>
      {navigationMode === 'first-person' && (
        <p style={hintStyle}>
          Click canvas to lock. WASD/arrows to move. R/F up/down. Shift = fast.
          Esc to unlock.
        </p>
      )}
    </div>
  );
}

const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '0 8px 6px',
};

const headerLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 1,
  color: '#6b7280',
};

const btnStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  borderRadius: 3,
  padding: '4px 0',
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
};

const hintStyle: React.CSSProperties = {
  margin: '6px 8px 0',
  fontSize: 10,
  color: '#6b7280',
  lineHeight: 1.4,
};
