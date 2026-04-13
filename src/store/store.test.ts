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
});
