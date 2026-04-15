import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock @react-three/fiber before any imports that use it
vi.mock('@react-three/fiber', () => ({
  useThree: () => ({
    camera: {
      position: { add: vi.fn() },
      getWorldDirection: vi.fn(),
      up: { x: 0, y: 1, z: 0 },
    },
  }),
  useFrame: vi.fn(),
}));

// Mock @react-three/drei controls as simple divs
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  PointerLockControls: () => null,
}));

import { act, render } from '@testing-library/react';
import { getAppStore } from '../../store';
import { CameraRig } from './CameraRig';

describe('CameraRig pointer lock cleanup', () => {
  beforeEach(() => {
    // jsdom doesn't have exitPointerLock by default
    document.exitPointerLock = vi.fn();
    document.body.style.cursor = '';
    // Reset store to orbit mode
    getAppStore().setState({ navigationMode: 'orbit' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls document.exitPointerLock and resets cursor when switching from first-person to orbit', () => {
    // Start in first-person mode
    getAppStore().setState({ navigationMode: 'first-person' });

    const { rerender } = render(<CameraRig />);

    // Simulate cursor being set by BimMesh hover
    document.body.style.cursor = 'pointer';

    // Switch to orbit mode
    act(() => {
      getAppStore().setState({ navigationMode: 'orbit' });
    });
    rerender(<CameraRig />);

    expect(document.exitPointerLock).toHaveBeenCalled();
    expect(document.body.style.cursor).toBe('default');
  });

  it('does not call exitPointerLock when already in orbit mode', () => {
    getAppStore().setState({ navigationMode: 'orbit' });

    render(<CameraRig />);

    // exitPointerLock should not have been called (already in orbit, no transition)
    expect(document.exitPointerLock).not.toHaveBeenCalled();
  });
});
