"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import MenuMobile from "../MenuMobile";
import Logo from "../../Icons/Logo";
import Button from "../../Button";
import Profile from "./Profile";
import Switch from "@/components/Switch";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Bars3Icon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useMenuStore } from "@/stores/useMenuStore";
import { MENU } from "@/config/menu";
import { ROUTE } from "@/config/routes";

export default function Header() {
    //** Store */
    const { openMobileMenu } = useMenuStore();
    const { theme, setTheme } = useTheme();

    //** Variables */
    const pathname = usePathname();

    //** States */
    const [activeRoute, setActiveRoute] = useState("");
    const [themeMode, setThemeMode] = useState<string | undefined>("");

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
        <>
            <MenuMobile activeRoute={activeRoute} />

            <header className="relative bg-white dark:bg-black z-40">
                <nav aria-label="Top" className="container">
                    <div className="border-b border-gray-200">
                        <div className="flex h-16 items-center">
                            {/* Toggle mobile menu */}
                            <Button
                                className="bg-white p-2 text-gray-400 lg:hidden"
                                onClick={() => openMobileMenu(true)}
                            >
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open menu</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </Button>

                            {/* Logo */}
                            <Link href={ROUTE.HOME} className="flex items-center ml-4 lg:ml-0">
                                <Logo width="64" height="58" className="w-[1.5rem] h-[1.5rem]" />
                                <span className="ml-2">{process.env.NEXT_PUBLIC_SITE_NAME}</span>
                            </Link>

                            {/* Desktop menus */}
                            <div className="hidden lg:ml-8 lg:block lg:self-stretch">
                                <div className="flex items-center h-full space-x-8">
                                    {MENU.map(menu => (
                                        <Link
                                            key={menu.url}
                                            className={clsx(
                                                "flex items-center text-sm font-medium hover:underline",
                                                activeRoute === menu.url && "text-primary",
                                            )}
                                            href={menu.url}
                                        >
                                            {menu.icon && <span className="mr-1">{menu.icon}</span>}
                                            {menu.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center ml-auto">
                                <Switch
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
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}
