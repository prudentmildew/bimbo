import { OrbitControls, PointerLockControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useAppStore } from '../../store';

const MOVE_SPEED = 8;
const FAST_MULTIPLIER = 3;

export function CameraRig() {
  const navigationMode = useAppStore((s) => s.navigationMode);
  const keysRef = useRef<Set<string>>(new Set());
  const { camera } = useThree();
  const orbitRef = useRef<OrbitControlsImpl>(null);

  const prevModeRef = useRef(navigationMode);
  useEffect(() => {
    const prevMode = prevModeRef.current;
    prevModeRef.current = navigationMode;
    if (prevMode === 'first-person' && navigationMode !== 'first-person') {
      document.exitPointerLock();
      document.body.style.cursor = 'default';
    }
  }, [navigationMode]);

  useEffect(() => {
    if (navigationMode !== 'first-person') return;

    const onKeyDown = (e: KeyboardEvent) => keysRef.current.add(e.code);
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      keysRef.current.clear();
    };
  }, [navigationMode]);

  useFrame((_, delta) => {
    if (navigationMode !== 'first-person') return;

    const keys = keysRef.current;
    if (keys.size === 0) return;

    const speed =
      MOVE_SPEED *
      delta *
      (keys.has('ShiftLeft') || keys.has('ShiftRight') ? FAST_MULTIPLIER : 1);

    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    if (keys.has('KeyW') || keys.has('ArrowUp')) direction.add(forward);
    if (keys.has('KeyS') || keys.has('ArrowDown'))
      direction.add(forward.clone().negate());
    if (keys.has('KeyA') || keys.has('ArrowLeft'))
      direction.add(right.clone().negate());
    if (keys.has('KeyD') || keys.has('ArrowRight')) direction.add(right);
    if (keys.has('KeyR')) direction.y += 1;
    if (keys.has('KeyF')) direction.y -= 1;

    if (direction.length() > 0) {
      direction.normalize().multiplyScalar(speed);
      camera.position.add(direction);
    }
  });

  if (navigationMode === 'orbit') {
    return (
      <OrbitControls
        ref={orbitRef}
        target={[0, 4.5, 0]}
        enableDamping
        dampingFactor={0.1}
      />
    );
  }

  return <PointerLockControls />;
}
