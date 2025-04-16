import React from "react";
import { DocumentTextIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { ROUTE } from "./routes";
import { TEXT } from "@/constants";

export const MENU = [
    {
        url: ROUTE.TARGET,
        label: TEXT.TARGET,
        icon: <DocumentTextIcon className="w-5" />,
    },
    {
        url: ROUTE.STAFF,
        label: TEXT.STAFF,
        icon: <UserCircleIcon className="w-5" />,
    },
];
