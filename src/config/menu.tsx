import { ReactNode } from "react";
import {
    BanknotesIcon,
    CalendarDateRangeIcon,
    DocumentTextIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ROLE, ROUTE, TEXT } from "@/constants";

export interface MenuItem {
    url: string;
    label: string;
    icon?: ReactNode;
    roles?: string[];
}

export const MENU: MenuItem[] = [
    {
        url: ROUTE.TARGET,
        label: TEXT.TARGET,
        icon: <DocumentTextIcon className="w-5" />,
        roles: [ROLE.ADMIN, ROLE.STAFF],
    },
    {
        url: ROUTE.WORK,
        label: TEXT.WORK,
        icon: <CalendarDateRangeIcon className="w-5" />,
        roles: [ROLE.ADMIN],
    },
    {
        url: ROUTE.EMPLOYEE,
        label: TEXT.EMPLOYEE,
        roles: [ROLE.ADMIN],
        icon: <UserCircleIcon className="w-5" />,
    },
    {
        url: ROUTE.SALARY,
        label: TEXT.SALARY,
        icon: <BanknotesIcon className="w-5" />,
        roles: [ROLE.ADMIN],
    },
];

/** Menu items visible to the given role (no `roles` means visible to everyone). */
export const getMenusForRole = (role?: string) =>
    MENU.filter(menu => !menu.roles || menu.roles.includes(role || ""));
