"use client";

import React from "react";
import StaffModal from "./StaffModal";
import StaffModalDetail from "./StaffModalDetail";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/Dropdown";
import {
    EllipsisVerticalIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useProfileStore } from "@/stores/useProfileStore";
import { useReportsOnStaffsStore } from "@/stores/useReportsOnStaffsStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { useModalStore } from "@/stores/useModalStore";
import { ROLE } from "@/constants";
import { TEXT } from "@/constants/text";
import { getCurrentMonth } from "@/utils";
import { ModalActionProps } from "@/lib/types";
import { StaffProps } from "@/types/staffProps";

export default function StaffActions({ item }: { item: StaffProps }) {
    //** Destructuring */
    const { id } = item;

    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();
    const { getStaff, getStaffById, deleteStaff } = useStaffStore();
    const { getReportsOnStaff } = useReportsOnStaffsStore();

    //** Variables */
    const disabledKeys: string[] = [];

    switch (profile.role) {
        case ROLE.USER:
        case ROLE.REPORT:
            disabledKeys.push("edit", "delete");
            break;
        default:
            break;
    }

    //** Functions */
    const handleViewStaff = async (id: string) => {
        await getStaffById(id);
        await getReportsOnStaff({
            staffId: id,
            ...getCurrentMonth(),
        });

        getModal({
            isOpen: true,
            size: "3xl",
            modalHeader: TEXT.StaffDetail,
            action: ModalActionProps.UPDATE,
            modalBody: <StaffModalDetail />,
        });
    };

    const handleUpdateStaff = async (id: string) => {
        await getStaffById(id);

        getModal({
            isOpen: true,
            modalHeader: TEXT.editStaff,
            action: ModalActionProps.UPDATE,
            modalBody: <StaffModal />,
        });
    };

    const handleDeleteStaff = (id: string) => {
        getModal({
            isOpen: true,
            action: ModalActionProps.UPDATE,
            modalHeader: TEXT.confirmDelete,
            modalBody: (
                <ConfirmModal
                    onConfirm={async () => {
                        await deleteStaff(id);
                        await getStaff();

                        getModal({ isOpen: false });
                    }}
                />
            ),
        });
    };

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button className="min-w-0 h-auto bg-transparent p-0 text-black">
                    <EllipsisVerticalIcon className="w-6" />
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Staff actions" disabledKeys={disabledKeys}>
                <DropdownItem
                    key="detail"
                    startContent={<EyeIcon className="w-5" />}
                    textValue={TEXT.DETAIL}
                    onClick={() => handleViewStaff(id)}
                >
                    {TEXT.DETAIL}
                </DropdownItem>
                <DropdownItem
                    key="edit"
                    startContent={<PencilSquareIcon className="w-5" />}
                    textValue={TEXT.EDIT}
                    onClick={() => handleUpdateStaff(id)}
                >
                    {TEXT.EDIT}
                </DropdownItem>
                <DropdownItem
                    key="delete"
                    startContent={<TrashIcon className="w-5" />}
                    textValue={TEXT.DELETE}
                    onClick={() => handleDeleteStaff(id)}
                >
                    {TEXT.DELETE}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
