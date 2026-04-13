import type { BimObject } from './types';

const FLOOR_HEIGHT = 3;
const BUILDING_WIDTH = 20;
const BUILDING_DEPTH = 12;
const WALL_THICKNESS = 0.3;
const SLAB_THICKNESS = 0.3;
const COLUMN_SIZE = 0.4;
const BEAM_HEIGHT = 0.4;
const BEAM_WIDTH = 0.3;
const PIPE_RADIUS = 0.08;
const DUCT_SIZE = 0.3;

function makeObject(
  partial: Omit<BimObject, 'properties'> & {
    properties?: Record<string, string | number>;
  },
): BimObject {
  return {
    ...partial,
    properties: {
      ...partial.properties,
      ifcType: partial.ifcType,
      material: partial.material,
      discipline: partial.discipline,
      floor: partial.floor,
    },
  };
}

function generateSlabs(): BimObject[] {
  const slabs: BimObject[] = [];
  for (let floor = 0; floor < 3; floor++) {
    slabs.push(
      makeObject({
        id: `slab-${floor}`,
        name: `Floor Slab ${floor}`,
        ifcType: 'IfcSlab',
        material: 'Concrete',
        discipline: 'architectural',
        floor,
        dimensions: {
          width: BUILDING_WIDTH,
          height: SLAB_THICKNESS,
          depth: BUILDING_DEPTH,
        },
        position: [0, floor * FLOOR_HEIGHT, 0],
        rotation: [0, 0, 0],
        color: '#cccccc',
      }),
    );
  }
  return slabs;
}

function generateExteriorWalls(): BimObject[] {
  const walls: BimObject[] = [];
  for (let floor = 0; floor < 3; floor++) {
    const y = floor * FLOOR_HEIGHT + SLAB_THICKNESS / 2;
    const wallHeight = FLOOR_HEIGHT - SLAB_THICKNESS;

    // Front wall
    walls.push(
      makeObject({
        id: `ext-wall-front-${floor}`,
        name: `Exterior Wall Front F${floor}`,
        ifcType: 'IfcWall',
        material: 'Concrete',
        discipline: 'architectural',
        floor,
        dimensions: {
          width: BUILDING_WIDTH,
          height: wallHeight,
          depth: WALL_THICKNESS,
        },
        position: [0, y + wallHeight / 2, -BUILDING_DEPTH / 2],
        rotation: [0, 0, 0],
        color: '#e8e0d0',
      }),
    );
    // Back wall
    walls.push(
      makeObject({
        id: `ext-wall-back-${floor}`,
        name: `Exterior Wall Back F${floor}`,
        ifcType: 'IfcWall',
        material: 'Concrete',
        discipline: 'architectural',
        floor,
        dimensions: {
          width: BUILDING_WIDTH,
          height: wallHeight,
          depth: WALL_THICKNESS,
        },
        position: [0, y + wallHeight / 2, BUILDING_DEPTH / 2],
        rotation: [0, 0, 0],
        color: '#e8e0d0',
      }),
    );
    // Left wall
    walls.push(
      makeObject({
        id: `ext-wall-left-${floor}`,
        name: `Exterior Wall Left F${floor}`,
        ifcType: 'IfcWall',
        material: 'Concrete',
        discipline: 'architectural',
        floor,
        dimensions: {
          width: WALL_THICKNESS,
          height: wallHeight,
          depth: BUILDING_DEPTH,
        },
        position: [-BUILDING_WIDTH / 2, y + wallHeight / 2, 0],
        rotation: [0, 0, 0],
        color: '#e8e0d0',
      }),
    );
    // Right wall
    walls.push(
      makeObject({
        id: `ext-wall-right-${floor}`,
        name: `Exterior Wall Right F${floor}`,
        ifcType: 'IfcWall',
        material: 'Concrete',
        discipline: 'architectural',
        floor,
        dimensions: {
          width: WALL_THICKNESS,
          height: wallHeight,
          depth: BUILDING_DEPTH,
        },
        position: [BUILDING_WIDTH / 2, y + wallHeight / 2, 0],
        rotation: [0, 0, 0],
        color: '#e8e0d0',
      }),
    );
  }
  return walls;
}

function generateInteriorWalls(): BimObject[] {
  const walls: BimObject[] = [];
  for (let floor = 0; floor < 3; floor++) {
    const y = floor * FLOOR_HEIGHT + SLAB_THICKNESS / 2;
    const wallHeight = FLOOR_HEIGHT - SLAB_THICKNESS;

    // Longitudinal divider
    walls.push(
      makeObject({
        id: `int-wall-long-${floor}`,
        name: `Interior Wall Longitudinal F${floor}`,
        ifcType: 'IfcWall',
        material: 'Drywall',
        discipline: 'architectural',
        floor,
        dimensions: {
          width: BUILDING_WIDTH - 2 * WALL_THICKNESS,
          height: wallHeight,
          depth: 0.15,
        },
        position: [0, y + wallHeight / 2, 0],
        rotation: [0, 0, 0],
        color: '#f0ece4',
      }),
    );
    // Transverse divider
    walls.push(
      makeObject({
        id: `int-wall-trans-${floor}`,
        name: `Interior Wall Transverse F${floor}`,
        ifcType: 'IfcWall',
        material: 'Drywall',
        discipline: 'architectural',
        floor,
        dimensions: {
          width: 0.15,
          height: wallHeight,
          depth: BUILDING_DEPTH - 2 * WALL_THICKNESS,
        },
        position: [0, y + wallHeight / 2, 0],
        rotation: [0, 0, 0],
        color: '#f0ece4',
      }),
    );
  }
  return walls;
}

function generateColumns(): BimObject[] {
  const columns: BimObject[] = [];
  const xPositions = [-BUILDING_WIDTH / 4, BUILDING_WIDTH / 4];
  const zPositions = [-BUILDING_DEPTH / 4, BUILDING_DEPTH / 4];

  for (let floor = 0; floor < 3; floor++) {
    const y = floor * FLOOR_HEIGHT + SLAB_THICKNESS / 2;
    const colHeight = FLOOR_HEIGHT - SLAB_THICKNESS;
    let colIndex = 0;

    for (const x of xPositions) {
      for (const z of zPositions) {
        columns.push(
          makeObject({
            id: `column-${floor}-${colIndex}`,
            name: `Column ${colIndex} F${floor}`,
            ifcType: 'IfcColumn',
            material: 'Steel',
            discipline: 'structural',
            floor,
            dimensions: {
              width: COLUMN_SIZE,
              height: colHeight,
              depth: COLUMN_SIZE,
            },
            position: [x, y + colHeight / 2, z],
            rotation: [0, 0, 0],
            color: '#8899aa',
          }),
        );
        colIndex++;
      }
    }
  }
  return columns;
}

function generateBeams(): BimObject[] {
  const beams: BimObject[] = [];
  const xPositions = [-BUILDING_WIDTH / 4, BUILDING_WIDTH / 4];
  const zPositions = [-BUILDING_DEPTH / 4, BUILDING_DEPTH / 4];

  for (let floor = 0; floor < 3; floor++) {
    const y = floor * FLOOR_HEIGHT + FLOOR_HEIGHT - BEAM_HEIGHT / 2;

    // Beams along X axis
    for (const z of zPositions) {
      beams.push(
        makeObject({
          id: `beam-x-${floor}-${z > 0 ? 'p' : 'n'}`,
          name: `Beam X F${floor} Z${z > 0 ? '+' : '-'}`,
          ifcType: 'IfcBeam',
          material: 'Steel',
          discipline: 'structural',
          floor,
          dimensions: {
            width: BUILDING_WIDTH / 2,
            height: BEAM_HEIGHT,
            depth: BEAM_WIDTH,
          },
          position: [0, y, z],
          rotation: [0, 0, 0],
          color: '#778899',
        }),
      );
    }

    // Beams along Z axis
    for (const x of xPositions) {
      beams.push(
        makeObject({
          id: `beam-z-${floor}-${x > 0 ? 'p' : 'n'}`,
          name: `Beam Z F${floor} X${x > 0 ? '+' : '-'}`,
          ifcType: 'IfcBeam',
          material: 'Steel',
          discipline: 'structural',
          floor,
          dimensions: {
            width: BEAM_WIDTH,
            height: BEAM_HEIGHT,
            depth: BUILDING_DEPTH / 2,
          },
          position: [x, y, 0],
          rotation: [0, 0, 0],
          color: '#778899',
        }),
      );
    }
  }
  return beams;
}

function generatePipes(): BimObject[] {
  const pipes: BimObject[] = [];

  // Vertical risers — 2 risers spanning all floors
  const riserPositions: [number, number][] = [
    [BUILDING_WIDTH / 4 + 1, -BUILDING_DEPTH / 4],
    [BUILDING_WIDTH / 4 + 1, BUILDING_DEPTH / 4],
  ];

  for (let i = 0; i < riserPositions.length; i++) {
    const [x, z] = riserPositions[i];
    pipes.push(
      makeObject({
        id: `pipe-riser-${i}`,
        name: `Pipe Riser ${i}`,
        ifcType: 'IfcPipeSegment',
        material: 'Copper',
        discipline: 'mep',
        floor: 0,
        dimensions: {
          width: PIPE_RADIUS * 2,
          height: FLOOR_HEIGHT * 3,
          depth: PIPE_RADIUS * 2,
        },
        position: [x, (FLOOR_HEIGHT * 3) / 2, z],
        rotation: [0, 0, 0],
        color: '#cc6633',
      }),
    );
  }

  // Horizontal pipe runs per floor
  for (let floor = 0; floor < 3; floor++) {
    const y = floor * FLOOR_HEIGHT + FLOOR_HEIGHT * 0.8;
    pipes.push(
      makeObject({
        id: `pipe-horiz-${floor}`,
        name: `Horizontal Pipe Run F${floor}`,
        ifcType: 'IfcPipeSegment',
        material: 'Copper',
        discipline: 'mep',
        floor,
        dimensions: {
          width: BUILDING_WIDTH * 0.6,
          height: PIPE_RADIUS * 2,
          depth: PIPE_RADIUS * 2,
        },
        position: [BUILDING_WIDTH / 4 + 1, y, 0],
        rotation: [0, 0, 0],
        color: '#cc6633',
      }),
    );
  }

  return pipes;
}

function generateDucts(): BimObject[] {
  const ducts: BimObject[] = [];

  // Ducts on top floor only
  const ductPositions: [number, number][] = [
    [-BUILDING_WIDTH / 4, -BUILDING_DEPTH / 4],
    [-BUILDING_WIDTH / 4, BUILDING_DEPTH / 4],
    [0, 0],
  ];

  for (let i = 0; i < ductPositions.length; i++) {
    const [x, z] = ductPositions[i];
    ducts.push(
      makeObject({
        id: `duct-${i}`,
        name: `Duct Segment ${i}`,
        ifcType: 'IfcDuctSegment',
        material: 'Galvanized Steel',
        discipline: 'mep',
        floor: 2,
        dimensions: {
          width: BUILDING_WIDTH * 0.3,
          height: DUCT_SIZE,
          depth: DUCT_SIZE,
        },
        position: [x, 2 * FLOOR_HEIGHT + FLOOR_HEIGHT * 0.85, z],
        rotation: [0, 0, 0],
        color: '#999999',
      }),
    );
  }

  return ducts;
}

export function generateProceduralBuilding(): BimObject[] {
  return [
    ...generateSlabs(),
    ...generateExteriorWalls(),
    ...generateInteriorWalls(),
    ...generateColumns(),
    ...generateBeams(),
    ...generatePipes(),
    ...generateDucts(),
  ];
}
