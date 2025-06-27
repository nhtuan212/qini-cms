"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import clsx from "clsx";
import Profile from "./Profile";
import Logo from "@/components/Icons/Logo";
import Switch from "@/components/Switch";
import {
    Navbar as NavbarNextUI,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
} from "@heroui/react";
import { useMenuStore } from "@/stores/useMenuStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { MENU } from "@/config/menu";
import { ROUTE } from "@/constants";

export default function Header() {
    const pathname = usePathname();

    //** Store */
    const { isMobileMenuOpen, openMobileMenu } = useMenuStore();
    const { theme, setTheme } = useTheme();
    const { profile } = useProfileStore();

    //** States */
    const [activeRoute, setActiveRoute] = useState("");
    const [themeMode, setThemeMode] = useState<string | undefined>("");

    //** Variables */
    const menus = MENU.filter(menu => !menu.roles || menu.roles.includes(profile?.role || ""));

    //** Functions */
    const onModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTheme(event.target.checked ? "light" : "dark");
    };

    //** Effects */
    useEffect(() => {
        setActiveRoute(pathname);
    }, [pathname]);

    useEffect(() => {
        setThemeMode(theme);
    }, [theme, setThemeMode]);

    return (
        <NavbarNextUI
            classNames={{
                wrapper: "container max-w-[auto]",
            }}
            onMenuOpenChange={() => openMobileMenu(!isMobileMenuOpen)}
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <Link href={ROUTE.HOME} className="flex items-center ml-4 lg:ml-0">
                        <Logo className="w-16 h-16" />
                        <span className="ml-2">{process.env.NEXT_PUBLIC_SITE_NAME}</span>
                    </Link>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent justify="end">
                {menus.map(menu => (
                    <NavbarItem key={menu.url} className="hidden sm:flex">
                        <Link
                            className={clsx(
                                "flex items-center text-sm font-medium hover:underline",
                                activeRoute === menu.url && "text-primary",
                            )}
                            href={menu.url}
                        >
                            {menu.icon && <span className="mr-1">{menu.icon}</span>}
                            {menu.label}
                        </Link>
                    </NavbarItem>
                ))}

                <NavbarItem>
                    <div className="flex items-center ml-auto">
                        <Switch
                            className="invisible"
                            defaultSelected
                            isSelected={themeMode === "light"}
                            color="success"
                            startContent={<SunIcon />}
                            endContent={<MoonIcon />}
                            onChange={event => onModeChange(event)}
                        />
                        <div className="ml-3">
                            <Profile />
                        </div>
                    </div>
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu className="gap-4">
                {menus.map(menu => (
                    <NavbarMenuItem key={menu.url}>
                        <Link
                            href={menu.url}
                            className={clsx(
                                "flex items-center font-medium hover:underline",
                                activeRoute === menu.url && "text-primary",
                            )}
                            color="primary"
                        >
                            {menu.icon && <span className="mr-1">{menu.icon}</span>}
                            {menu.label}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </NavbarNextUI>
    );
}
