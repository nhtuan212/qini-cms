"use client";

import React, { Fragment } from "react";
import ImageComponent from "@/components/Image";
import Button from "@/components/Button";
import { signOut } from "next-auth/react";
import { useProfileStore } from "@/stores/useProfileStore";
import {
    ArrowRightStartOnRectangleIcon,
    Cog8ToothIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { TEXT } from "@/constants/text";

export default function Profile() {
    //** Store */
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
                        <Button
                            fullWidth
                            variant="light"
                            className={"justify-start text-gray-700"}
                        >
                            <UserCircleIcon className="w-6" />
                            {profile?.username}
                        </Button>
                    </Menu.Item>
                    <Menu.Item>
                        <Button
                            fullWidth
                            variant="light"
                            className={"justify-start text-gray-700"}
                        >
                            <Cog8ToothIcon className="w-6" />
                            {TEXT.SETTING}
                        </Button>
                    </Menu.Item>
                    <Menu.Item>
                        <Button
                            fullWidth
                            variant="light"
                            className={"justify-start text-gray-700"}
                            onClick={async () =>
                                await signOut().then(() => {
                                    localStorage.clear();
                                })
                            }
                        >
                            <ArrowRightStartOnRectangleIcon className="w-6" />
                            {TEXT.LOGOUT}
                        </Button>
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
