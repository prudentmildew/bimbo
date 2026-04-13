import { describe, expect, it } from 'vitest';
import { createAppStore } from './index';

describe('appStore', () => {
  it('starts with no objects loaded', () => {
    const store = createAppStore();
    expect(store.getState().objects).toEqual([]);
  });

  it('loads procedural model into the store', () => {
    const store = createAppStore();
    store.getState().loadProceduralModel();
    const state = store.getState();
    expect(state.objects.length).toBeGreaterThan(0);
    expect(state.modelSource).toBe('procedural');
  });

  it('getObjectById returns the correct object', () => {
    const store = createAppStore();
    store.getState().loadProceduralModel();
    const obj = store.getState().getObjectById('slab-0');
    expect(obj).toBeDefined();
    expect(obj?.name).toBe('Floor Slab 0');
  });

  it('getObjectById returns undefined for unknown id', () => {
    const store = createAppStore();
    store.getState().loadProceduralModel();
    expect(store.getState().getObjectById('nonexistent')).toBeUndefined();
  });

  it('exposes layout sidebar toggle', () => {
    const store = createAppStore();
    expect(store.getState().leftSidebarOpen).toBe(true);
    store.getState().toggleLeftSidebar();
    expect(store.getState().leftSidebarOpen).toBe(false);
    store.getState().toggleLeftSidebar();
    expect(store.getState().leftSidebarOpen).toBe(true);
  });

  it('exposes right panel toggle', () => {
    const store = createAppStore();
    expect(store.getState().rightPanelOpen).toBe(true);
    store.getState().toggleRightPanel();
    expect(store.getState().rightPanelOpen).toBe(false);
  });

  it('auto-opens right panel when an object is selected', () => {
    const store = createAppStore();
    store.getState().toggleRightPanel(); // close it
    expect(store.getState().rightPanelOpen).toBe(false);

    store.getState().selectObject('slab-0');
    expect(store.getState().selectedObjectId).toBe('slab-0');
    expect(store.getState().rightPanelOpen).toBe(true);
  });

  it('clears selection when selecting null', () => {
    const store = createAppStore();
    store.getState().selectObject('slab-0');
    expect(store.getState().selectedObjectId).toBe('slab-0');

    store.getState().selectObject(null);
    expect(store.getState().selectedObjectId).toBeNull();
  });

  it('does not close right panel when deselecting', () => {
    const store = createAppStore();
    expect(store.getState().rightPanelOpen).toBe(true);
    store.getState().selectObject('slab-0');
    store.getState().selectObject(null);
    expect(store.getState().rightPanelOpen).toBe(true);
  });

  it('clears selection when toggling off the selected object discipline', () => {
    const store = createAppStore();
    store.getState().loadProceduralModel();
    // slab-0 is architectural
    store.getState().selectObject('slab-0');
    expect(store.getState().selectedObjectId).toBe('slab-0');

    store.getState().toggleDiscipline('architectural');
    expect(store.getState().selectedObjectId).toBeNull();
  });

  it('clears selection when toggling off the selected object type', () => {
    const store = createAppStore();
    store.getState().loadProceduralModel();
    // slab-0 is IfcSlab
    store.getState().selectObject('slab-0');
    expect(store.getState().selectedObjectId).toBe('slab-0');

    store.getState().toggleType('IfcSlab');
    expect(store.getState().selectedObjectId).toBeNull();
  });

  it('does not clear selection when toggling unrelated discipline', () => {
    const store = createAppStore();
    store.getState().loadProceduralModel();
    store.getState().selectObject('slab-0'); // architectural
    store.getState().toggleDiscipline('mep');
    expect(store.getState().selectedObjectId).toBe('slab-0');
  });

  it('isObjectVisible respects discipline toggle', () => {
    const store = createAppStore();
    store.getState().loadProceduralModel();
    const slab = store.getState().objects.find((o) => o.id === 'slab-0')!;

    expect(store.getState().isObjectVisible(slab)).toBe(true);
    store.getState().toggleDiscipline('architectural');
    expect(store.getState().isObjectVisible(slab)).toBe(false);
    store.getState().toggleDiscipline('architectural');
    expect(store.getState().isObjectVisible(slab)).toBe(true);
  });

  it('isObjectVisible respects type toggle', () => {
    const store = createAppStore();
    store.getState().loadProceduralModel();
    const slab = store.getState().objects.find((o) => o.id === 'slab-0')!;

    store.getState().toggleType('IfcSlab');
    expect(store.getState().isObjectVisible(slab)).toBe(false);
    store.getState().toggleType('IfcSlab');
    expect(store.getState().isObjectVisible(slab)).toBe(true);
  });

  it('setAllVisible resets all layers', () => {
    const store = createAppStore();
    store.getState().loadProceduralModel();
    store.getState().toggleDiscipline('architectural');
    store.getState().toggleType('IfcBeam');

    store.getState().setAllVisible(true);
    const state = store.getState();
    expect(state.disciplineVisibility.architectural).toBe(true);
    expect(state.disciplineVisibility.structural).toBe(true);
    expect(state.disciplineVisibility.mep).toBe(true);
    expect(state.typeVisibility).toEqual({});
  });

  it('updates clip plane state', () => {
    const store = createAppStore();
    store.getState().setClipPlane({ enabled: true, axis: 'x', position: 0.3 });
    const clip = store.getState().clipPlane;
    expect(clip.enabled).toBe(true);
    expect(clip.axis).toBe('x');
    expect(clip.position).toBe(0.3);
    expect(clip.flipped).toBe(false); // unchanged default
  });

  it('resets clip plane to defaults', () => {
    const store = createAppStore();
    store
      .getState()
      .setClipPlane({ enabled: true, axis: 'z', position: 0.8, flipped: true });
    store.getState().resetClipPlane();
    const clip = store.getState().clipPlane;
    expect(clip.enabled).toBe(false);
    expect(clip.axis).toBe('y');
    expect(clip.position).toBe(0.5);
    expect(clip.flipped).toBe(false);
  });
});
