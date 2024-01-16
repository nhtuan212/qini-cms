//** Remove later */

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import Logo from "../Icons/Logo";
import { usePathname } from "next/navigation";
import {
    Navbar,
    NavbarBrand,
    NavbarMenuToggle,
    NavbarMenuItem,
    NavbarMenu,
    NavbarContent,
    NavbarItem,
    Dropdown,
    DropdownTrigger,
    Avatar,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import { useProfileStore } from "@/stores/useProfileStore";
import { ROUTE } from "@/config/routes";
import { TEXT } from "@/constants/text";
import { MENU } from "@/config/menu";

export default function Header() {
    //** Variables */
    const pathname = usePathname();

    //** Zustand */
    const { profile } = useProfileStore();

    //** States */
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeRoute, setActiveRoute] = useState("");

    //** Effects */
    useEffect(() => {
        setActiveRoute(pathname);
    }, [pathname]);

    return (
        <Navbar
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
        >
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                />
            </NavbarContent>

            <NavbarContent className="flex gap-4" justify="center">
                <NavbarBrand>
                    <Link href={ROUTE.HOME}>
                        <Logo
                            width="64"
                            height="58"
                            className="w-[1.5rem] h-[1.5rem]"
                        />
                    </Link>
                    <p className="ml-2 font-bold">
                        {process.env.NEXT_PUBLIC_SITE_NAME}
                    </p>
                </NavbarBrand>

                {MENU.map(item => (
                    <NavbarItem key={item.url} className="hidden sm:block">
                        <Link
                            className={clsx(
                                activeRoute === item.url && "text-primary",
                            )}
                            href={item.url}
                        >
                            {item.label}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent as="div" justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="primary"
                            name={profile?.username}
                            size="sm"
                            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="profile" textValue="profile">
                            <p className="font-semibold">{`${TEXT.ACCOUNT}: ${profile?.username}`}</p>
                        </DropdownItem>
                        <DropdownItem key="settings">
                            {TEXT.SETTING}
                        </DropdownItem>
                        <DropdownItem key="logout" color="danger">
                            {TEXT.LOGOUT}
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>

            <NavbarMenu>
                {MENU.map(item => (
                    <NavbarMenuItem key={item.url}>
                        <Link
                            className={clsx(
                                activeRoute === item.url && "text-primary",
                            )}
                            href={item.url}
                        >
                            {item.label}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
