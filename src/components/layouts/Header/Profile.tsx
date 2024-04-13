"use client";

import React from "react";
import ImageComponent from "@/components/Image";
import { signOut } from "next-auth/react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import {
    ArrowRightStartOnRectangleIcon,
    Cog8ToothIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useProfileStore } from "@/stores/useProfileStore";
import { TEXT } from "@/constants/text";

export default function Profile() {
    //** Store */
    const { profile } = useProfileStore();

    return (
        <Dropdown>
            <DropdownTrigger>
                <div className="w-8 h-8 cursor-pointer">
                    <ImageComponent
                        className="rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                    />
                </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Staff actions">
                <DropdownItem
                    startContent={<UserCircleIcon className="w-6" />}
                    textValue={profile?.username}
                >
                    {profile?.username}
                </DropdownItem>
                <DropdownItem
                    startContent={<Cog8ToothIcon className="w-6" />}
                    textValue={TEXT.SETTING}
                >
                    {TEXT.SETTING}
                </DropdownItem>
                <DropdownItem
                    startContent={<ArrowRightStartOnRectangleIcon className="w-6" />}
                    textValue={TEXT.LOGOUT}
                    onClick={async () =>
                        await signOut().then(() => {
                            localStorage.clear();
                        })
                    }
                >
                    {TEXT.LOGOUT}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
