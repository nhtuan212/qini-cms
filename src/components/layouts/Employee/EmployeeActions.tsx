"use client";

import EmployeeModal from "./EmployeeModal";
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
import { useEmployee } from "@/hooks";
import { ROLE, TEXT } from "@/constants";
import { EmployeeProps } from "@/types";

export default function EmployeeActions({ employee }: { employee: EmployeeProps }) {
    //** Destructuring */
    const { id } = employee;

    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();

    //** Queries */
    const { inActiveEmployee, deleteEmployee } = useEmployee();

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
    const handleUpdateEmployee = () => {
        getModal({
            isOpen: true,
            size: "3xl",
            modalHeader: TEXT.UPDATE_EMPLOYEE,
            isDismissable: false,
            modalBody: <EmployeeModal employee={employee} />,
        });
    };

    const handleInActiveEmployee = (id: EmployeeProps["id"]) => {
        getModal({
            isOpen: true,
            modalHeader: TEXT.CONFIRM_IN_ACTIVE,
            modalBody: (
                <ConfirmModal
                    onConfirm={async () => {
                        await inActiveEmployee(id);
                        getModal({ isOpen: false });
                    }}
                />
            ),
        });
    };

    const handleDeleteEmployee = (id: EmployeeProps["id"]) => {
        getModal({
            isOpen: true,
            modalHeader: TEXT.CONFIRM_DELETE,
            modalBody: (
                <ConfirmModal
                    onConfirm={async () => {
                        await deleteEmployee(id);
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
            <DropdownMenu aria-label="Employee actions" disabledKeys={disabledKeys}>
                <DropdownItem
                    key="edit"
                    startContent={<PencilSquareIcon className="w-5" />}
                    textValue={TEXT.EDIT}
                    onPress={() => handleUpdateEmployee()}
                >
                    {TEXT.EDIT}
                </DropdownItem>
                <DropdownItem
                    key="inActive"
                    startContent={<PauseCircleIcon className="w-5" />}
                    textValue={TEXT.IN_ACTIVE}
                    onPress={() => handleInActiveEmployee(id)}
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
                    onPress={() => handleDeleteEmployee(id)}
                >
                    {TEXT.DELETE}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
