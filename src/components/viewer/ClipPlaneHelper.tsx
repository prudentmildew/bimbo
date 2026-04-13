import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../../store';

const BUILDING_BOUNDS = {
  x: { min: -12, max: 12 },
  y: { min: -1, max: 10 },
  z: { min: -8, max: 8 },
};

const PLANE_SIZE = 30;

export function ClipPlaneHelper() {
  const clipState = useAppStore((s) => s.clipPlane);
  const { gl } = useThree();

  const plane = useMemo(() => new THREE.Plane(), []);

  useEffect(() => {
    if (!clipState.enabled) {
      gl.clippingPlanes = [];
      return;
    }

    const bounds = BUILDING_BOUNDS[clipState.axis];
    const worldPos =
      bounds.min + clipState.position * (bounds.max - bounds.min);

    const normal = new THREE.Vector3();
    if (clipState.axis === 'x') normal.set(1, 0, 0);
    else if (clipState.axis === 'y') normal.set(0, 1, 0);
    else normal.set(0, 0, 1);

    if (clipState.flipped) normal.negate();

    plane.setFromNormalAndCoplanarPoint(
      normal,
      new THREE.Vector3(
        clipState.axis === 'x' ? worldPos : 0,
        clipState.axis === 'y' ? worldPos : 0,
        clipState.axis === 'z' ? worldPos : 0,
      ),
    );

    gl.clippingPlanes = [plane];
    gl.localClippingEnabled = true;

    return () => {
      gl.clippingPlanes = [];
    };
  }, [clipState, gl, plane]);

  if (!clipState.enabled) return null;

  const bounds = BUILDING_BOUNDS[clipState.axis];
  const worldPos = bounds.min + clipState.position * (bounds.max - bounds.min);

  const position: [number, number, number] = [
    clipState.axis === 'x' ? worldPos : 0,
    clipState.axis === 'y' ? worldPos : 4.5,
    clipState.axis === 'z' ? worldPos : 0,
  ];

  const rotation: [number, number, number] = [
    clipState.axis === 'z' ? Math.PI / 2 : 0,
    0,
    clipState.axis === 'x' ? Math.PI / 2 : 0,
  ];

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[PLANE_SIZE, PLANE_SIZE]} />
      <meshBasicMaterial
        color="#4fc3f7"
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
