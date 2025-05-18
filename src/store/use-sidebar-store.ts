import { create, StateCreator } from 'zustand';

interface SidebarState {
    isOpen: boolean;
    toggleSidebar: () => void;
}

/**
 * Zustand store for managing sidebar state
 * @returns {SidebarState} Object containing sidebar state and actions
 */
export const useSidebarStore = create<SidebarState>((set: StateCreator<SidebarState>['setState']) => ({
    isOpen: true,
    toggleSidebar: () => set((state: SidebarState) => ({ isOpen: !state.isOpen })),
})); 