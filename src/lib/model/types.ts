export type Discipline = 'architectural' | 'structural' | 'mep';

export interface BimObject {
  id: string;
  name: string;
  ifcType: string;
  material: string;
  discipline: Discipline;
  floor: number;
  dimensions: { width: number; height: number; depth: number };
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  properties: Record<string, string | number>;
}
