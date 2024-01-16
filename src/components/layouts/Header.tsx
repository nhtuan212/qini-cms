"use client";

import { Fragment, useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import MenuMobile from "./MenuMobile";
import Logo from "../Icons/Logo";
import Button from "../Button";
import ImageComponent from "../Image";
import { usePathname } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useProfileStore } from "@/stores/useProfileStore";
import { useMenuStore } from "@/stores/useMenuStore";
import { MENU } from "@/config/menu";
import { ROUTE } from "@/config/routes";
import { TEXT } from "@/constants/text";

export default function Header2() {
    //** Zustand */
    const { profile } = useProfileStore();
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

                            {/* Profile dropdown */}
                            <Menu as="div" className="relative ml-auto">
                                <div>
                                    <Menu.Button className="relative flex rounded-full bg-primary text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">
                                            Open user menu
                                        </span>
                                        <div className="w-8 h-8">
                                            <ImageComponent
                                                className="rounded-full"
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt=""
                                            />
                                        </div>
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <Menu.Item>
                                            <Link
                                                href="#"
                                                className={
                                                    "block px-4 py-2 font-semibold text-sm text-gray-700"
                                                }
                                            >
                                                {`${TEXT.ACCOUNT}: ${profile?.username}`}
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Link
                                                href="#"
                                                className={
                                                    "block px-4 py-2 text-sm text-gray-700"
                                                }
                                            >
                                                {TEXT.SETTING}
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Link
                                                href="#"
                                                className={
                                                    "block px-4 py-2 text-sm text-gray-700"
                                                }
                                            >
                                                {TEXT.LOGOUT}
                                            </Link>
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}
