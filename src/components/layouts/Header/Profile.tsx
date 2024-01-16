import React, { Fragment } from "react";
import Link from "next/link";
import ImageComponent from "@/components/Image";
import { Menu, Transition } from "@headlessui/react";
import { useProfileStore } from "@/stores/useProfileStore";
import { TEXT } from "@/constants/text";

export default function Profile() {
    //** Zustand */
    const { profile } = useProfileStore();

    return (
        <Menu as="div" className="relative">
            {/* Profile dropdown */}
            <div>
                <Menu.Button className="relative flex rounded-full bg-primary text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
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
                            className={"block px-4 py-2 text-sm text-gray-700"}
                        >
                            {TEXT.SETTING}
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link
                            href="#"
                            className={"block px-4 py-2 text-sm text-gray-700"}
                        >
                            {TEXT.LOGOUT}
                        </Link>
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
