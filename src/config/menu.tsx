import React from "react";
import {
    BanknotesIcon,
    CalendarDateRangeIcon,
    DocumentTextIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ROLE, ROUTE, TEXT } from "@/constants";

export const MENU = [
    {
        url: ROUTE.TARGET,
        label: TEXT.TARGET,
        icon: <DocumentTextIcon className="w-5" />,
        roles: [ROLE.ADMIN, ROLE.REPORT],
    },
    {
        url: ROUTE.WORK,
        label: TEXT.WORK,
        icon: <CalendarDateRangeIcon className="w-5" />,
        roles: [ROLE.ADMIN],
    },
    {
        url: ROUTE.STAFF,
        label: TEXT.STAFF,
        icon: <UserCircleIcon className="w-5" />,
    },
    {
        url: ROUTE.SALARY,
        label: TEXT.SALARY,
        icon: <BanknotesIcon className="w-5" />,
        roles: [ROLE.ADMIN],
    },
];
