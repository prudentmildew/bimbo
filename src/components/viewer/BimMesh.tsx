import { useMemo } from 'react';
import * as THREE from 'three';
import type { BimObject } from '../../lib/model/types';

interface BimMeshProps {
  object: BimObject;
}

export function BimMesh({ object }: BimMeshProps) {
  const geometry = useMemo(() => {
    const { width, height, depth } = object.dimensions;

    if (
      object.ifcType === 'IfcPipeSegment' ||
      object.ifcType === 'IfcDuctSegment'
    ) {
      // For pipes: height is the length, width/depth are diameter
      if (height > width && height > depth) {
        return new THREE.CylinderGeometry(width / 2, width / 2, height, 12);
      }
      // Horizontal pipe: width is the length
      const geo = new THREE.CylinderGeometry(depth / 2, depth / 2, width, 12);
      geo.rotateZ(Math.PI / 2);
      return geo;
    }

    return new THREE.BoxGeometry(width, height, depth);
  }, [object.dimensions, object.ifcType]);

  return (
    <mesh
      position={object.position}
      rotation={object.rotation}
      geometry={geometry}
    >
      <meshStandardMaterial color={object.color} />
    </mesh>
  );
}
