"use client";

import React from "react";
import Button from "@/components/Button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
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
import { MODAL, ROLE } from "@/constants";
import { TEXT } from "@/constants/text";
import { StaffProps } from "@/types/staffProps";
import { getCurrentMonth } from "@/utils";

export default function StaffActions({ item }: { item: StaffProps }) {
    //** Destructuring */
    const { id, name } = item;

    //** Stores */
    const { profile } = useProfileStore();
    const { getStaff, getStaffById, deleteStaff } = useStaffStore();
    const { getReportsOnStaff } = useReportsOnStaffsStore();
    const { openModal, openConfirmModal } = useModalStore();

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
    const handleDetailStaff = (id: string) => {
        getStaffById(id);

        getReportsOnStaff({
            staffId: id,
            ...getCurrentMonth(),
        });

        openModal(MODAL.STAFF_DETAIL);
    };

    const handleEditStaff = (id: string) => {
        getStaffById(id);
        openModal(MODAL.ADD_STAFF, "edit");
    };

    const handleDeleteStaff = (id: string) => {
        openConfirmModal({
            modalName: MODAL.CONFIRM,
            modalMessage: `Bạn có chắc chắn muốn xoá ${name} không ?`,
            onConfirm: () =>
                deleteStaff(id).then(() => {
                    getStaff();
                    openModal("");
                }),
            onCancel: () => openModal(""),
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
                    onClick={() => handleDetailStaff(id)}
                >
                    {TEXT.DETAIL}
                </DropdownItem>
                <DropdownItem
                    key="edit"
                    startContent={<PencilSquareIcon className="w-5" />}
                    textValue={TEXT.EDIT}
                    onClick={() => handleEditStaff(id)}
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
