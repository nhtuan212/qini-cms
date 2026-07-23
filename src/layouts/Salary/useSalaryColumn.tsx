import SalaryTotal from "./SalaryTotal";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { useSalary } from "@/hooks";
import { formatCurrency, formatDate } from "@/utils";
import { TEXT } from "@/constants";
import { SalaryProps } from "@/types";

//** Custom hook */
export default function useSalaryColumn() {
    //** Stores */
    const { getModal } = useModalStore();
    const { deleteSalary } = useSalary();

    //** Variables */
    const columns = [
        {
            key: TEXT.EMPLOYEE,
            name: TEXT.EMPLOYEE,
            className: "min-w-24",
            content: (params: { row: SalaryProps }) => params.row.employeeName,
        },
        {
            key: TEXT.SALARY_PERIOD,
            name: TEXT.SALARY_PERIOD,
            className: "min-w-48",
            content: (params: { row: SalaryProps }) =>
                `${formatDate(params.row.startDate)} - ${formatDate(params.row.endDate)}`,
        },
        {
            key: TEXT.SALARY,
            name: TEXT.SALARY,
            className: "min-w-24",
            content: (params: { row: SalaryProps }) => formatCurrency(params.row.salary),
        },
        {
            key: TEXT.WORKING_HOURS,
            name: TEXT.WORKING_HOURS,
            className: "min-w-24",
            content: (params: { row: SalaryProps }) => params.row.workingHours,
        },
        // {
        //     key: TEXT.PAID_LEAVE,
        //     name: TEXT.PAID_LEAVE,
        //     className: "min-w-24",
        //     content: (params: { row: SalaryProps }) => params.row.paidLeave,
        // },
        {
            key: TEXT.TARGET,
            name: TEXT.TARGET,
            className: "min-w-24",
            content: (params: { row: SalaryProps }) => formatCurrency(params.row.target),
        },
        {
            key: TEXT.BONUS,
            name: TEXT.BONUS,
            className: "min-w-28",
            content: (params: { row: SalaryProps }) => formatCurrency(params.row.bonus),
        },
        {
            key: TEXT.TOTAL,
            name: TEXT.TOTAL,
            className: "min-w-44",
            content: (params: { row: SalaryProps }) => (
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
            content: (params: { row: SalaryProps }) => (
                <div className="flex justify-end items-center gap-x-2">
                    <Button
                        isIconOnly
                        size="sm"
                        startContent={<EyeIcon className="w-4 h-4" />}
                        onPress={() =>
                            getModal({
                                isOpen: true,
                                modalHeader: params.row.employeeName,
                                modalBody: (
                                    <SalaryTotal {...params.row} target={params.row.target * 100} />
                                ),
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
