import React from "react";
import { BanknotesIcon, DocumentTextIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { ROLE, ROUTE, TEXT } from "@/constants";

export const MENU = [
    {
        url: ROUTE.TARGET,
        label: TEXT.TARGET,
        icon: <DocumentTextIcon className="w-5" />,
        roles: [ROLE.ADMIN, ROLE.REPORT],
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
