import React from "react";
import { BanknotesIcon, DocumentTextIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { ROUTE } from "./routes";
import { TEXT } from "@/constants/text";

export const MENU = [
    {
        url: ROUTE.REPORT,
        label: TEXT.REPORT,
        icon: <DocumentTextIcon className="w-5" />,
    },
    {
        url: ROUTE.TARGET,
        label: TEXT.TARGET,
        icon: <BanknotesIcon className="w-5" />,
    },
    {
        url: ROUTE.STAFF,
        label: TEXT.STAFF,
        icon: <UserCircleIcon className="w-5" />,
    },
];
