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
import { Bars3Icon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useMenuStore } from "@/stores/useMenuStore";
import { MENU } from "@/config/menu";
import { ROUTE } from "@/config/routes";

export default function Header2() {
    //** Zustand */
    const { openMobileMenu } = useMenuStore();

    //** Variables */
    const pathname = usePathname();

    //** States */
    const [activeRoute, setActiveRoute] = useState("");

    //** Effects */
    useEffect(() => {
        setActiveRoute(pathname);
    }, [pathname]);

    return (
        <>
            <MenuMobile activeRoute={activeRoute} />

            <header className="relative bg-white">
                <nav aria-label="Top" className="container">
                    <div className="border-b border-gray-200">
                        <div className="flex h-16 items-center">
                            {/* Toggle mobile menu */}
                            <Button
                                className="relative min-w-0 rounded-md bg-white p-2 text-gray-400 lg:hidden"
                                onClick={() => openMobileMenu(true)}
                            >
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open menu</span>
                                <Bars3Icon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                />
                            </Button>

                            {/* Logo */}
                            <div className="ml-4 flex lg:ml-0">
                                <Link href={ROUTE.HOME}>
                                    <Logo
                                        width="64"
                                        height="58"
                                        className="w-[1.5rem] h-[1.5rem]"
                                    />
                                </Link>
                            </div>

                            {/* Desktop menus */}
                            <div className="hidden lg:ml-8 lg:block lg:self-stretch">
                                <div className="flex h-full space-x-8">
                                    {MENU.map(menu => (
                                        <Link
                                            key={menu.url}
                                            className={clsx(
                                                "flex items-center text-sm font-medium hover:underline",
                                                activeRoute === menu.url &&
                                                    "text-primary",
                                            )}
                                            href={menu.url}
                                        >
                                            {menu.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center ml-auto">
                                <Switch
                                    defaultSelected
                                    color="success"
                                    startContent={<SunIcon />}
                                    endContent={<MoonIcon />}
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
