import { describe, expect, it } from 'vitest';
import { generateProceduralBuilding } from './procedural';
import type { Discipline } from './types';

describe('generateProceduralBuilding', () => {
  const objects = generateProceduralBuilding();

  it('generates approximately 50 objects', () => {
    expect(objects.length).toBeGreaterThanOrEqual(40);
    expect(objects.length).toBeLessThanOrEqual(60);
  });

  it('spans 3 floors', () => {
    const floors = new Set(objects.map((o) => o.floor));
    expect(floors).toEqual(new Set([0, 1, 2]));
  });

  it('includes all three disciplines', () => {
    const disciplines = new Set(objects.map((o) => o.discipline));
    const expected: Set<Discipline> = new Set([
      'architectural',
      'structural',
      'mep',
    ]);
    expect(disciplines).toEqual(expected);
  });

  it('includes architectural objects (walls, slabs)', () => {
    const archTypes = new Set(
      objects
        .filter((o) => o.discipline === 'architectural')
        .map((o) => o.ifcType),
    );
    expect(archTypes).toContain('IfcWall');
    expect(archTypes).toContain('IfcSlab');
  });

  it('includes structural objects (columns, beams)', () => {
    const structTypes = new Set(
      objects
        .filter((o) => o.discipline === 'structural')
        .map((o) => o.ifcType),
    );
    expect(structTypes).toContain('IfcColumn');
    expect(structTypes).toContain('IfcBeam');
  });

  it('includes MEP objects (pipes, ducts)', () => {
    const mepTypes = new Set(
      objects.filter((o) => o.discipline === 'mep').map((o) => o.ifcType),
    );
    expect(mepTypes).toContain('IfcPipeSegment');
    expect(mepTypes).toContain('IfcDuctSegment');
  });

  it('assigns deterministic unique IDs', () => {
    const ids = objects.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each object has essential IFC properties', () => {
    for (const obj of objects) {
      expect(obj.id).toBeTruthy();
      expect(obj.name).toBeTruthy();
      expect(obj.ifcType).toBeTruthy();
      expect(obj.material).toBeTruthy();
      expect(obj.discipline).toBeTruthy();
      expect(obj.floor).toBeGreaterThanOrEqual(0);
      expect(obj.dimensions.width).toBeGreaterThan(0);
      expect(obj.dimensions.height).toBeGreaterThan(0);
      expect(obj.dimensions.depth).toBeGreaterThan(0);
      expect(obj.position).toHaveLength(3);
      expect(obj.rotation).toHaveLength(3);
      expect(obj.color).toBeTruthy();
    }
  });
});
