"use client";

import React from "react";
import ImageComponent from "@/components/Image";
import { signOut } from "next-auth/react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/Dropdown";
import { ArrowRightStartOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
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
                        className="rounded-full border border-primary"
                        src="/assets/logo.png"
                        alt=""
                    />
                </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Staff actions">
                <DropdownItem
                    key="profile"
                    startContent={<UserCircleIcon className="w-6" />}
                    textValue={profile?.username}
                >
                    {profile?.username}
                </DropdownItem>
                <DropdownItem
                    key="logout"
                    startContent={<ArrowRightStartOnRectangleIcon className="w-6" />}
                    textValue={TEXT.LOGOUT}
                    onClick={() => signOut()}
                >
                    {TEXT.LOGOUT}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
