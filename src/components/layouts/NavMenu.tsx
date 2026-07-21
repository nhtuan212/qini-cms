"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { useProfileStore } from "@/stores/useProfileStore";
import { getMenusForRole } from "@/config/menu";

export default function NavMenu({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();

    //** Store */
    const { profile } = useProfileStore();

    //** States */
    const [activeRoute, setActiveRoute] = useState("");

    //** Variables */
    const menus = getMenusForRole(profile?.role);

    //** Effects */
    useEffect(() => {
        setActiveRoute(pathname);
    }, [pathname]);

    //** Render */
    return (
        <nav className="flex flex-col gap-1">
            {menus.map(menu => (
                <Link
                    key={menu.url}
                    href={menu.url}
                    className={clsx(
                        "flex items-center gap-2 rounded-md px-3 py-2 font-medium transition-colors hover:bg-default-100",
                        activeRoute === menu.url
                            ? "bg-default-100 text-primary"
                            : "text-foreground",
                    )}
                    onClick={onNavigate}
                >
                    {menu.icon && <span>{menu.icon}</span>}
                    {menu.label}
                </Link>
            ))}
        </nav>
    );
}
