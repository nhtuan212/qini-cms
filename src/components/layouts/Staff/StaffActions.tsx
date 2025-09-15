"use client";

import React from "react";
import StaffModal from "./StaffModal";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/Dropdown";
import {
    EllipsisVerticalIcon,
    PauseCircleIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useProfileStore } from "@/stores/useProfileStore";
import { StaffProps, useStaffStore } from "@/stores/useStaffStore";
import { useModalStore } from "@/stores/useModalStore";
import { ROLE, TEXT } from "@/constants";
import { ModalActionProps } from "@/lib/types";

export default function StaffActions({ item }: { item: StaffProps }) {
    //** Destructuring */
    const { id } = item;

    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();
    const { getStaffById, deleteStaff, inActiveStaff } = useStaffStore();

    //** Variables */
    const disabledKeys: string[] = [];

    switch (profile.role) {
        case ROLE.REPORT:
        case ROLE.MANAGER:
            disabledKeys.push("edit", "inActive", "delete");
            break;
        default:
            break;
    }

    //** Functions */
    const handleUpdateStaff = async (id: string) => {
        await getStaffById(id);

        await getModal({
            isOpen: true,
            modalHeader: TEXT.UPDATE_STAFF,
            action: ModalActionProps.UPDATE,
            isDismissable: false,
            modalBody: <StaffModal />,
        });
    };

    const handleInActiveStaff = (id: string) => {
        getModal({
            isOpen: true,
            action: ModalActionProps.UPDATE,
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

    const handleDeleteStaff = (id: string) => {
        getModal({
            isOpen: true,
            action: ModalActionProps.UPDATE,
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
                    onPress={() => handleUpdateStaff(id)}
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
