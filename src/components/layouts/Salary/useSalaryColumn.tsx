"use client";

import React from "react";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { SalaryProps, useSalaryStore } from "@/stores/useSalaryStore";
import { useModalStore } from "@/stores/useModalStore";
import { formatCurrency, formatDate } from "@/utils";
import { TEXT } from "@/constants";
import { SalaryTotal } from "./SalaryForm/SalaryReview";

//** Custom hook */
export default function useSalaryColumn() {
    //** Stores */
    const { getModal } = useModalStore();
    const { deleteSalary } = useSalaryStore();

    //** Variables */
    const columns = [
        {
            key: TEXT.STAFF,
            name: TEXT.STAFF,
            className: "min-w-24",
            content: (params: SalaryProps) => params.row.staffName,
        },
        {
            key: TEXT.SALARY_PERIOD,
            name: TEXT.SALARY_PERIOD,
            className: "min-w-48",
            content: (params: SalaryProps) =>
                `${formatDate(params.row.startDate)} - ${formatDate(params.row.endDate)}`,
        },
        {
            key: TEXT.SALARY,
            name: TEXT.SALARY,
            className: "min-w-24",
            content: (params: SalaryProps) => formatCurrency(params.row.salary),
        },
        {
            key: TEXT.WORKING_HOURS,
            name: TEXT.WORKING_HOURS,
            className: "min-w-24",
            content: (params: SalaryProps) => params.row.workingHours,
        },
        {
            key: TEXT.TARGET,
            name: TEXT.TARGET,
            className: "min-w-24",
            content: (params: SalaryProps) => formatCurrency(params.row.target),
        },
        {
            key: TEXT.BONUS,
            name: TEXT.BONUS,
            content: (params: SalaryProps) => (
                <>
                    <p>{formatCurrency(params.row.bonus)}</p>
                    <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">
                        {params.row.description}
                    </p>
                </>
            ),
        },
        {
            key: TEXT.TOTAL,
            name: TEXT.TOTAL,
            content: (params: SalaryProps) => <b>{formatCurrency(params.row.totalSalary)}</b>,
        },
        {
            key: "action",
            name: "",
            className: "min-w-24",
            content: (params: SalaryProps) => (
                <div className="flex items-center gap-x-2">
                    <Button
                        isIconOnly
                        size="sm"
                        startContent={<EyeIcon className="w-4 h-4" />}
                        onPress={() =>
                            getModal({
                                isOpen: true,
                                modalHeader: params.row.staffName,
                                modalBody: <SalaryTotal {...params.row} />,
                            })
                        }
                    />
                    <Button
                        isIconOnly
                        size="sm"
                        startContent={<TrashIcon className="w-4 h-4" />}
                        onPress={() => {
                            getModal({
                                isOpen: true,
                                modalHeader: TEXT.DELETE,
                                modalBody: (
                                    <ConfirmModal
                                        onConfirm={async () => {
                                            await deleteSalary(params.row.id);
                                            getModal({ isOpen: false });
                                        }}
                                    />
                                ),
                            });
                        }}
                    />
                </div>
            ),
        },
    ];

    return columns;
}
