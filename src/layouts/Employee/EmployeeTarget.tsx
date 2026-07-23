"use client";

import TimeSheet from "../TimeSheet";
import Button from "@/components/Button";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { TEXT } from "@/constants";
import { EmployeeProps } from "@/types";

export default function EmployeeTarget({ employee }: { employee: EmployeeProps }) {
    //** Stores */
    const { getModal } = useModalStore();

    //** Render */
    return (
        <Button
            size="sm"
            variant="flat"
            color="success"
            startContent={<BanknotesIcon className="w-4 h-4" />}
            onPress={() =>
                getModal({
                    isOpen: true,
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
            {TEXT.DETAIL}
        </Button>
    );
}
