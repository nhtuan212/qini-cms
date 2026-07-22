"use client";

import ValidateEmployeePassword from "./ValidateEmployeePassword";
import Button from "@/components/Button";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { useEmployeeStore } from "@/stores/useEmployeeStore";
import { TEXT } from "@/constants";
import { EmployeeProps } from "@/types";

export default function EmployeeCheckIn({ employee }: { employee: EmployeeProps }) {
    //** Stores */
    const { getModal } = useModalStore();
    const { setSelectedEmployee } = useEmployeeStore();

    //** Render */
    return (
        <Button
            isIconOnly
            className="w-fit min-w-fit p-0"
            size="sm"
            variant="light"
            aria-label={TEXT.TIME_SHEET}
            title={TEXT.TIME_SHEET}
            onPress={() => {
                setSelectedEmployee(employee);
                getModal({
                    isOpen: true,
                    modalHeader: employee.name,
                    modalBody: <ValidateEmployeePassword />,
                });
            }}
        >
            <ClockIcon className="w-5 h-5" />
        </Button>
    );
}
