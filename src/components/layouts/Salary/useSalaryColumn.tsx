import React from "react";
import SalaryForm from "./SalaryForm";
import SalaryTotal, { SalaryTotalProps } from "./SalaryTotal";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { SalaryProps, useSalaryStore } from "@/stores/useSalaryStore";
import { useModalStore } from "@/stores/useModalStore";
import { formatCurrency, formatDate } from "@/utils";
import { TEXT } from "@/constants";

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
            key: TEXT.PAID_LEAVE,
            name: TEXT.PAID_LEAVE,
            className: "min-w-24",
            content: (params: SalaryProps) => params.row.paidLeave,
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
            className: "min-w-28",
            content: (params: SalaryProps) => formatCurrency(params.row.bonus),
        },
        {
            key: TEXT.TOTAL,
            name: TEXT.TOTAL,
            className: "min-w-44",
            content: (params: SalaryProps) => (
                <>
                    <b>{formatCurrency(params.row.total)}</b>
                    <div className="text-xs text-gray-600 mt-1 whitespace-pre-line">
                        {params.row.description}
                    </div>
                </>
            ),
        },
        {
            key: "action",
            name: "",
            className: "min-w-32",
            content: (params: SalaryProps) => (
                <div className="flex justify-end items-center gap-x-2">
                    <Button
                        isIconOnly
                        size="sm"
                        startContent={<EyeIcon className="w-4 h-4" />}
                        onPress={() =>
                            getModal({
                                isOpen: true,
                                modalHeader: params.row.staffName,
                                modalBody: <SalaryTotal {...(params.row as SalaryTotalProps)} />,
                            })
                        }
                    />
                    <Button
                        isIconOnly
                        size="sm"
                        className="hidden"
                        startContent={<PencilIcon className="w-4 h-4" />}
                        onPress={() => {
                            getModal({
                                isOpen: true,
                                size: "full",
                                modalHeader: params.row.staffName,
                                modalBody: <SalaryForm {...params.row} />,
                            });
                        }}
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
