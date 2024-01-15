import { create } from "zustand";

interface MenuState {
    isMobileMenuOpen: boolean;
    openMobileMenu: (status: boolean) => void;
}

export const useMenuStore = create<MenuState>()(set => ({
    isMobileMenuOpen: false,
    openMobileMenu: status => set(() => ({ isMobileMenuOpen: status })),
}));
