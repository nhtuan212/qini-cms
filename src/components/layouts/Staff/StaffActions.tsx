"use client";

import React from "react";
import StaffModal from "./StaffModal";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/Dropdown";
import {
    ArrowPathRoundedSquareIcon,
    EllipsisVerticalIcon,
    PauseCircleIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useProfileStore } from "@/stores/useProfileStore";
import { useModalStore } from "@/stores/useModalStore";
import { useStaff } from "@/hooks";
import { ROLE, TEXT } from "@/constants";
import { StaffProps } from "@/types";

export default function StaffActions({ staff }: { staff: StaffProps }) {
    //** Destructuring */
    const { id } = staff;

    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();

    //** Queries */
    const { inActiveStaff, deleteStaff } = useStaff();

    //** Variables */
    const disabledKeys: string[] = [];

    switch (profile.role) {
        case ROLE.REPORT:
        case ROLE.MANAGER:
            disabledKeys.push("edit", "inActive", "delete", "resetPassword");
            break;
        default:
            break;
    }

    //** Functions */
    const handleUpdateStaff = () => {
        getModal({
            isOpen: true,
            size: "3xl",
            modalHeader: TEXT.UPDATE_STAFF,
            isDismissable: false,
            modalBody: <StaffModal staff={staff} />,
        });
    };

    const handleInActiveStaff = (id: StaffProps["id"]) => {
        getModal({
            isOpen: true,
            modalHeader: TEXT.CONFIRM_IN_ACTIVE,
            modalBody: (
                <ConfirmModal
                    onConfirm={async () => {
                        await inActiveStaff(id);
                        getModal({ isOpen: false });
                    }}
                />
            ),
        });
    };

    const handleDeleteStaff = (id: StaffProps["id"]) => {
        getModal({
            isOpen: true,
            modalHeader: TEXT.CONFIRM_DELETE,
            modalBody: (
                <ConfirmModal
                    onConfirm={async () => {
                        await deleteStaff(id);
                        getModal({ isOpen: false });
                    }}
                />
            ),
        });
    };

    //** Render */
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button className="min-w-0 h-auto bg-transparent p-0 text-black">
                    <EllipsisVerticalIcon className="w-6" />
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Staff actions" disabledKeys={disabledKeys}>
                <DropdownItem
                    key="edit"
                    startContent={<PencilSquareIcon className="w-5" />}
                    textValue={TEXT.EDIT}
                    onPress={() => handleUpdateStaff()}
                >
                    {TEXT.EDIT}
                </DropdownItem>
                <DropdownItem
                    key="inActive"
                    startContent={<PauseCircleIcon className="w-5" />}
                    textValue={TEXT.IN_ACTIVE}
                    onPress={() => handleInActiveStaff(id)}
                >
                    {TEXT.IN_ACTIVE}
                </DropdownItem>
                <DropdownItem
                    key="resetPassword"
                    startContent={<ArrowPathRoundedSquareIcon className="w-5" />}
                    textValue={TEXT.RESET_PASSWORD}
                    onPress={() => {}}
                >
                    {TEXT.RESET_PASSWORD}
                </DropdownItem>
                <DropdownItem
                    key="delete"
                    startContent={<TrashIcon className="w-5" />}
                    textValue={TEXT.DELETE}
                    onPress={() => handleDeleteStaff(id)}
                >
                    {TEXT.DELETE}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
