"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import Button from "../Button";
import clsx from "clsx";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMenuStore } from "@/stores/useMenuStore";
import { MENU } from "@/config/menu";

export default function MenuMobile({ activeRoute }: { activeRoute: string }) {
    //** Store */
    const { isMobileMenuOpen, openMobileMenu } = useMenuStore();

    return (
        <Transition.Root show={isMobileMenuOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50 lg:hidden"
                onClose={() => openMobileMenu(false)}
            >
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 z-40 flex">
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                            <div className="flex px-4 pb-2 pt-5">
                                <Button
                                    className="bg-transparent -m-2 p-2 text-gray-400"
                                    onClick={() => openMobileMenu(false)}
                                >
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </Button>
                            </div>

                            <div className="space-y-6 border-gray-200 px-4 py-6">
                                {MENU.map(menu => (
                                    <Link
                                        key={menu.url}
                                        className={clsx(
                                            "-m-2 block p-2 font-medium text-gray-900",
                                            activeRoute === menu.url && "text-primary",
                                        )}
                                        href={menu.url}
                                    >
                                        {menu.label}
                                    </Link>
                                ))}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
