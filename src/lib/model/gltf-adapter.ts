import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { BimObject } from './types';

function inferIfcType(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('wall')) return 'IfcWall';
  if (lower.includes('slab') || lower.includes('floor')) return 'IfcSlab';
  if (lower.includes('column')) return 'IfcColumn';
  if (lower.includes('beam')) return 'IfcBeam';
  if (lower.includes('pipe')) return 'IfcPipeSegment';
  if (lower.includes('duct')) return 'IfcDuctSegment';
  if (lower.includes('door')) return 'IfcDoor';
  if (lower.includes('window')) return 'IfcWindow';
  return 'IfcBuildingElementProxy';
}

export async function parseGltfFile(
  file: File,
): Promise<{ objects: BimObject[]; scene: THREE.Group }> {
  const buffer = await file.arrayBuffer();
  const loader = new GLTFLoader();

  const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
    loader.parse(buffer, '', resolve, reject);
  });

  const objects: BimObject[] = [];
  let index = 0;

  gltf.scene.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) return;

    const box = new THREE.Box3().setFromObject(node);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const name = node.name || `Mesh ${index}`;

    objects.push({
      id: `gltf-${index}`,
      name,
      ifcType: inferIfcType(name),
      material:
        node.material instanceof THREE.Material
          ? node.material.name || 'Unknown'
          : 'Unknown',
      discipline: 'architectural',
      floor: 0,
      dimensions: {
        width: Math.max(size.x, 0.01),
        height: Math.max(size.y, 0.01),
        depth: Math.max(size.z, 0.01),
      },
      position: [center.x, center.y, center.z],
      rotation: [0, 0, 0],
      color: '#cccccc',
      properties: {},
    });

    index++;
  });

  return { objects, scene: gltf.scene };
}
