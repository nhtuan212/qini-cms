import { ReactNode } from "react";
import {
    BanknotesIcon,
    DocumentTextIcon,
    MapPinIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ROLE, ROUTE, TEXT } from "@/constants";

export interface MenuItem {
    url: string;
    label: string;
    icon?: ReactNode;
    roles?: string[];
    requiresTarget?: boolean;
}

export const MENU: MenuItem[] = [
    {
        url: ROUTE.TARGET,
        label: TEXT.TARGET,
        icon: <DocumentTextIcon className="w-5" />,
        roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.STAFF],
        requiresTarget: true,
    },
    {
        url: ROUTE.EMPLOYEE,
        label: TEXT.EMPLOYEE,
        icon: <UserCircleIcon className="w-5" />,
        roles: [ROLE.ADMIN, ROLE.MANAGER],
    },
    {
        url: ROUTE.SALARY,
        label: TEXT.SALARY,
        icon: <BanknotesIcon className="w-5" />,
        roles: [ROLE.ADMIN],
    },
    {
        url: ROUTE.LOCATION,
        label: TEXT.LOCATION,
        icon: <MapPinIcon className="w-5" />,
        roles: [ROLE.ADMIN],
    },
];

/**
 * Menu items visible to the given profile.
 * - `roles` gates by role (no `roles` means visible to everyone).
 * - `requiresTarget` additionally hides the item from STAFF who lack `isTarget`;
 *   ADMIN and MANAGER are never gated by `isTarget`.
 */
export const getMenusForRole = (role?: string, isTarget?: boolean) =>
    MENU.filter(menu => {
        if (menu.roles && !menu.roles.includes(role || "")) return false;
        if (menu.requiresTarget && role === ROLE.STAFF && !isTarget) return false;
        return true;
    });
