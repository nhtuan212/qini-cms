import { create } from "zustand";

interface MenuState {
    isMenuOpen: boolean;
    setIsMenuOpen: (status: boolean) => void;
}

export const useMenuStore = create<MenuState>()(set => ({
    isMenuOpen: false,
    setIsMenuOpen: status => set(() => ({ isMenuOpen: status })),
}));
