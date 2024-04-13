"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import Button from "../Button";
import Modal from "../Modal";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMenuStore } from "@/stores/useMenuStore";
import { MENU } from "@/config/menu";

export default function MenuMobile({ activeRoute }: { activeRoute: string }) {
    //** Store */
    const { isMobileMenuOpen, openMobileMenu } = useMenuStore();

    return (
        <Modal
            open={isMobileMenuOpen}
            isCloseIcon={false}
            size="full"
            onClose={() => openMobileMenu(false)}
            className={clsx(
                "fixed !justify-start inset-0 z-40 flex !py-0 shadow-xl",
                "[&>div]:max-w-xs",
                "[&>div]:animate-fadeInLeft",
            )}
        >
            <Modal.Body>
                <Button
                    className="bg-transparent -m-2 p-2 text-gray-400"
                    onClick={() => openMobileMenu(false)}
                >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </Button>

                <div className="py-6 border-gray-200">
                    {MENU.map(menu => (
                        <Link
                            key={menu.url}
                            className={clsx(
                                "block py-4 font-medium text-gray-900",
                                activeRoute === menu.url && "text-primary",
                            )}
                            href={menu.url}
                            onClick={() => openMobileMenu(false)}
                        >
                            {menu.label}
                        </Link>
                    ))}
                </div>
            </Modal.Body>
        </Modal>
    );
}
