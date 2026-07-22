"use client";

import EmployeeDetail from "./EmployeeDetail";
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
                    modalHeader: employee.name,
                    modalBody: <EmployeeDetail employee={employee} />,
                })
            }
        >
            {TEXT.DETAIL}
        </Button>
    );
}
