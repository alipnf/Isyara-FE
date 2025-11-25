import { create } from 'zustand';

interface LayoutState {
  isNavbarHidden: boolean;
  setNavbarHidden: (hidden: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  isNavbarHidden: false,
  setNavbarHidden: (hidden) => set({ isNavbarHidden: hidden }),
}));
