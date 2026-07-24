"use client";

import TimeSheet from "../TimeSheet";
import Button from "@/components/Button";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { TEXT } from "@/constants";
import { EmployeeProps } from "@/types";

export default function EmployeeCheckIn({ employee }: { employee: EmployeeProps }) {
    //** Stores */
    const { getModal } = useModalStore();

    //** Render */
    return (
        <Button
            isIconOnly
            className="w-fit min-w-fit p-0"
            size="sm"
            variant="light"
            aria-label={TEXT.TIME_SHEET}
            title={TEXT.TIME_SHEET}
            onPress={() =>
                getModal({
                    isOpen: true,
                    isDismissable: false,
                    size: "3xl",
                    modalHeader: (
                        <h3 className="sm:text-2xl text-lg font-bold text-gray-800">
                            {employee.name}
                        </h3>
                    ),
                    modalBody: <TimeSheet employee={employee} />,
                })
            }
        >
            <ClockIcon className="w-5 h-5" />
        </Button>
    );
}
