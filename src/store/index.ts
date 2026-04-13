import { createStore, useStore } from 'zustand';
import { generateProceduralBuilding } from '../lib/model/procedural';
import type { BimObject, Discipline } from '../lib/model/types';

export interface AppState {
  // Model
  objects: BimObject[];
  modelSource: 'procedural' | 'gltf' | null;
  isLoading: boolean;
  loadProceduralModel: () => void;
  getObjectById: (id: string) => BimObject | undefined;

  // Viewer
  navigationMode: 'orbit' | 'first-person';
  selectedObjectId: string | null;
  hoveredObjectId: string | null;
  clipPlane: {
    enabled: boolean;
    axis: 'x' | 'y' | 'z';
    position: number;
    flipped: boolean;
  };
  setNavigationMode: (mode: 'orbit' | 'first-person') => void;
  selectObject: (id: string | null) => void;
  setHoveredObject: (id: string | null) => void;

  // Layers
  disciplineVisibility: Record<Discipline, boolean>;
  typeVisibility: Record<string, boolean>;
  toggleDiscipline: (discipline: Discipline) => void;
  toggleType: (ifcType: string) => void;
  setAllVisible: (visible: boolean) => void;
  isObjectVisible: (obj: BimObject) => boolean;

  // Layout
  leftSidebarOpen: boolean;
  rightPanelOpen: boolean;
  activeModule: string;
  toggleLeftSidebar: () => void;
  toggleRightPanel: () => void;
  setActiveModule: (module: string) => void;
}

export function createAppStore() {
  return createStore<AppState>((set, get) => ({
    // Model
    objects: [],
    modelSource: null,
    isLoading: false,
    loadProceduralModel: () => {
      const objects = generateProceduralBuilding();
      set({ objects, modelSource: 'procedural', isLoading: false });
    },
    getObjectById: (id) => get().objects.find((o) => o.id === id),

    // Viewer
    navigationMode: 'orbit',
    selectedObjectId: null,
    hoveredObjectId: null,
    clipPlane: { enabled: false, axis: 'y', position: 0.5, flipped: false },
    setNavigationMode: (mode) => set({ navigationMode: mode }),
    selectObject: (id) =>
      set((s) => ({
        selectedObjectId: id,
        ...(id != null && !s.rightPanelOpen ? { rightPanelOpen: true } : {}),
      })),
    setHoveredObject: (id) => set({ hoveredObjectId: id }),

    // Layers
    disciplineVisibility: {
      architectural: true,
      structural: true,
      mep: true,
    },
    typeVisibility: {},
    toggleDiscipline: (discipline) =>
      set((s) => {
        const newVis = {
          ...s.disciplineVisibility,
          [discipline]: !s.disciplineVisibility[discipline],
        };
        const selected = s.selectedObjectId
          ? s.objects.find((o) => o.id === s.selectedObjectId)
          : null;
        const shouldClear = selected && !newVis[selected.discipline];
        return {
          disciplineVisibility: newVis,
          ...(shouldClear ? { selectedObjectId: null } : {}),
        };
      }),
    toggleType: (ifcType) =>
      set((s) => {
        const newTypeVis = {
          ...s.typeVisibility,
          [ifcType]: !(s.typeVisibility[ifcType] ?? true),
        };
        const selected = s.selectedObjectId
          ? s.objects.find((o) => o.id === s.selectedObjectId)
          : null;
        const shouldClear = selected && !(newTypeVis[selected.ifcType] ?? true);
        return {
          typeVisibility: newTypeVis,
          ...(shouldClear ? { selectedObjectId: null } : {}),
        };
      }),
    setAllVisible: (visible) =>
      set({
        disciplineVisibility: {
          architectural: visible,
          structural: visible,
          mep: visible,
        },
        typeVisibility: {},
      }),
    isObjectVisible: (obj) => {
      const state = get();
      if (!state.disciplineVisibility[obj.discipline]) return false;
      return state.typeVisibility[obj.ifcType] ?? true;
    },

    // Layout
    leftSidebarOpen: true,
    rightPanelOpen: true,
    activeModule: 'viewer',
    toggleLeftSidebar: () =>
      set((s) => ({ leftSidebarOpen: !s.leftSidebarOpen })),
    toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
    setActiveModule: (module) => set({ activeModule: module }),
  }));
}

// Singleton store for the app
let store: ReturnType<typeof createAppStore> | null = null;

export function getAppStore() {
  if (!store) {
    store = createAppStore();
  }
  return store;
}

export function useAppStore<T>(selector: (state: AppState) => T): T {
  return useStore(getAppStore(), selector);
}
