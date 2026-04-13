import { useCallback, useMemo, useRef } from 'react';
import type { Mesh } from 'three';
import * as THREE from 'three';
import type { BimObject } from '../../lib/model/types';
import { useAppStore } from '../../store';

interface BimMeshProps {
  object: BimObject;
}

export function BimMesh({ object }: BimMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const selectedObjectId = useAppStore((s) => s.selectedObjectId);
  const hoveredObjectId = useAppStore((s) => s.hoveredObjectId);
  const selectObject = useAppStore((s) => s.selectObject);
  const setHoveredObject = useAppStore((s) => s.setHoveredObject);

  const isSelected = selectedObjectId === object.id;
  const isHovered = hoveredObjectId === object.id;

  const geometry = useMemo(() => {
    const { width, height, depth } = object.dimensions;

    if (
      object.ifcType === 'IfcPipeSegment' ||
      object.ifcType === 'IfcDuctSegment'
    ) {
      if (height > width && height > depth) {
        return new THREE.CylinderGeometry(width / 2, width / 2, height, 12);
      }
      const geo = new THREE.CylinderGeometry(depth / 2, depth / 2, width, 12);
      geo.rotateZ(Math.PI / 2);
      return geo;
    }

    return new THREE.BoxGeometry(width, height, depth);
  }, [object.dimensions, object.ifcType]);

  const color = useMemo(() => {
    if (isSelected) return '#4fc3f7';
    if (isHovered) return '#81d4fa';
    return object.color;
  }, [isSelected, isHovered, object.color]);

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      selectObject(object.id);
    },
    [selectObject, object.id],
  );

  const handlePointerOver = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHoveredObject(object.id);
      document.body.style.cursor = 'pointer';
    },
    [setHoveredObject, object.id],
  );

  const handlePointerOut = useCallback(() => {
    setHoveredObject(null);
    document.body.style.cursor = 'default';
  }, [setHoveredObject]);

  return (
    <mesh
      ref={meshRef}
      position={object.position}
      rotation={object.rotation}
      geometry={geometry}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <meshStandardMaterial
        color={color}
        emissive={isSelected ? '#1a6b8a' : isHovered ? '#0d3d50' : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : isHovered ? 0.15 : 0}
      />
    </mesh>
  );
}
