"use client";

import EmployeeModal from "./EmployeeModal";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import {
    ArrowPathRoundedSquareIcon,
    PencilSquareIcon,
    TrashIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { useUser } from "@/hooks";
import { TEXT } from "@/constants";
import { EmployeeProps } from "@/types";

export default function EmployeeActions({ employee }: { employee: EmployeeProps }) {
    //** Destructuring */
    const { userId } = employee;

    //** Stores */
    const { getModal } = useModalStore();

    //** Queries */
    const { resetPassword, inActiveUser, deleteUser } = useUser();

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

    const confirmAction = (content: string, action: () => Promise<unknown>) => {
        getModal({
            isOpen: true,
            modalHeader: TEXT.SUBMIT,
            modalBody: (
                <ConfirmModal
                    content={content}
                    onConfirm={async () => {
                        await action();
                        getModal({ isOpen: false });
                    }}
                />
            ),
        });
    };

    //** Render */
    return (
        <div className="flex items-center justify-end gap-1">
            <Button
                isIconOnly
                size="sm"
                variant="light"
                color="warning"
                aria-label={TEXT.EDIT}
                title={TEXT.EDIT}
                onPress={handleUpdateEmployee}
            >
                <PencilSquareIcon className="w-5 h-5" />
            </Button>

            <Button
                isIconOnly
                size="sm"
                variant="light"
                color="secondary"
                aria-label={TEXT.RESET_PASSWORD}
                title={TEXT.RESET_PASSWORD}
                onPress={() =>
                    confirmAction(TEXT.CONFIRM_RESET_PASSWORD, () => resetPassword(userId))
                }
            >
                <ArrowPathRoundedSquareIcon className="w-5 h-5" />
            </Button>

            {employee.isActive && (
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-label={TEXT.IN_ACTIVE}
                    title={TEXT.IN_ACTIVE}
                    onPress={() =>
                        confirmAction(TEXT.CONFIRM_IN_ACTIVE, () => inActiveUser(userId))
                    }
                >
                    <XCircleIcon className="w-5 h-5" />
                </Button>
            )}

            {!employee.isActive && (
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    aria-label={TEXT.DELETE}
                    title={TEXT.DELETE}
                    onPress={() => confirmAction(TEXT.CONFIRM_DELETE, () => deleteUser(userId))}
                >
                    <TrashIcon className="w-5 h-5" />
                </Button>
            )}
        </div>
    );
}
