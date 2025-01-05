"use client";

import React, { useEffect } from "react";
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
import { StaffProps, useStaffStore } from "@/stores/useStaffStore";
import { useModalStore } from "@/stores/useModalStore";
import { ROLE } from "@/constants";
import { TEXT } from "@/constants/text";
import { getDateTime } from "@/utils";
import { ModalActionProps } from "@/lib/types";

export default function StaffActions({ item }: { item: StaffProps }) {
    //** Destructuring */
    const { id } = item;

    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();
    const { getStaff, getStaffById, deleteStaff, resetStaff } = useStaffStore();
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
        await Promise.all([
            getReportsOnStaff({
                staffId: id,
                startDate: getDateTime().firstDayOfMonth.toString(),
                endDate: getDateTime().lastDayOfMonth.toString(),
            }),
            getStaffById(id),
        ]).then(([, staff]) => {
            getModal({
                isOpen: true,
                size: "3xl",
                modalHeader: `${TEXT.STAFF}: ${staff.name}`,
                action: ModalActionProps.UPDATE,
                isDismissable: false,
                modalBody: <StaffModalDetail />,
            });
        });
    };

    const handleUpdateStaff = async (id: string) => {
        await getStaffById(id);

        getModal({
            isOpen: true,
            modalHeader: TEXT.UPDATE_STAFF,
            action: ModalActionProps.UPDATE,
            isDismissable: false,
            modalBody: <StaffModal />,
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
                        await getStaff();

                        getModal({ isOpen: false });
                    }}
                />
            ),
        });
    };

    //** Effects */
    useEffect(() => {
        return () => {
            resetStaff();
        };
    }, [resetStaff]);

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
                    key="detail"
                    startContent={<EyeIcon className="w-5" />}
                    textValue={TEXT.DETAIL}
                    onPress={() => handleViewStaff(id)}
                >
                    {TEXT.DETAIL}
                </DropdownItem>
                <DropdownItem
                    key="edit"
                    startContent={<PencilSquareIcon className="w-5" />}
                    textValue={TEXT.EDIT}
                    onPress={() => handleUpdateStaff(id)}
                >
                    {TEXT.EDIT}
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
