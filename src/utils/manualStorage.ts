import { ManualResource } from '../types';

const STORAGE_KEY = 'nutrilite_manual_user_resources_v1';

export function getUserManualResources(): ManualResource[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ManualResource[];
  } catch (error) {
    console.error('Failed to load manual resources:', error);
    return [];
  }
}

export function addUserManualResource(
  resource: Omit<ManualResource, 'id'>
): ManualResource | null {
  try {
    const current = getUserManualResources();
    const newResource: ManualResource = {
      ...resource,
      id: `manual_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    };
    const next = [...current, newResource];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return newResource;
  } catch (error) {
    console.error('Failed to add manual resource:', error);
    return null;
  }
}

