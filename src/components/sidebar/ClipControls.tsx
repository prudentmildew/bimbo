import type * as React from 'react';
import { useAppStore } from '../../store';

const AXES = ['x', 'y', 'z'] as const;

export function ClipControls() {
  const clipPlane = useAppStore((s) => s.clipPlane);
  const setClipPlane = useAppStore((s) => s.setClipPlane);
  const resetClipPlane = useAppStore((s) => s.resetClipPlane);

  return (
    <div style={{ padding: '8px 0' }}>
      <div style={headerRowStyle}>
        <span style={headerLabelStyle}>Clip Plane</span>
        <label style={toggleLabelStyle}>
          <input
            type="checkbox"
            checked={clipPlane.enabled}
            onChange={() => setClipPlane({ enabled: !clipPlane.enabled })}
            style={{ margin: 0, accentColor: '#4fc3f7' }}
          />
          <span style={{ fontSize: 10, color: '#9ca3af' }}>
            {clipPlane.enabled ? 'On' : 'Off'}
          </span>
        </label>
      </div>

      {clipPlane.enabled && (
        <div style={{ padding: '4px 8px' }}>
          <div style={rowStyle}>
            <span style={fieldLabelStyle}>Axis</span>
            <div style={{ display: 'flex', gap: 2 }}>
              {AXES.map((axis) => (
                <button
                  key={axis}
                  type="button"
                  onClick={() => setClipPlane({ axis })}
                  style={{
                    ...axisBtnStyle,
                    background: clipPlane.axis === axis ? '#4fc3f7' : '#374151',
                    color: clipPlane.axis === axis ? '#000' : '#d1d5db',
                  }}
                >
                  {axis.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={rowStyle}>
            <span style={fieldLabelStyle}>Position</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={clipPlane.position}
              onChange={(e) =>
                setClipPlane({ position: Number(e.target.value) })
              }
              style={{ flex: 1, accentColor: '#4fc3f7' }}
            />
          </div>

          <div style={rowStyle}>
            <span style={fieldLabelStyle}>Direction</span>
            <button
              type="button"
              onClick={() => setClipPlane({ flipped: !clipPlane.flipped })}
              style={flipBtnStyle}
            >
              {clipPlane.flipped ? '\u21C5 Flipped' : '\u21C5 Normal'}
            </button>
          </div>

          <button type="button" onClick={resetClipPlane} style={resetBtnStyle}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 8px 6px',
};

const headerLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 1,
  color: '#6b7280',
};

const toggleLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  cursor: 'pointer',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 6,
};

const fieldLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#9ca3af',
  width: 52,
  flexShrink: 0,
};

const axisBtnStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 3,
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
};

const flipBtnStyle: React.CSSProperties = {
  background: '#374151',
  border: 'none',
  borderRadius: 3,
  padding: '2px 8px',
  fontSize: 11,
  color: '#d1d5db',
  cursor: 'pointer',
};

const resetBtnStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 4,
  background: '#374151',
  border: 'none',
  borderRadius: 3,
  padding: '4px 0',
  fontSize: 11,
  color: '#d1d5db',
  cursor: 'pointer',
};
