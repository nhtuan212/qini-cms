"use client";

import React from "react";
import ReportAddNew from "./ReportAddNew";
import ReportDetail from "./ReportDetail";
import ConfirmModal from "@/components/ConfirmModal";
import Button from "@/components/Button";
import { Tooltip } from "@nextui-org/react";
import { CheckCircleIcon, EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleIconActive } from "@heroicons/react/24/solid";
import { useReportsStore } from "@/stores/useReportsStore";
import { useModalStore } from "@/stores/useModalStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { currencyFormat, formatDate } from "@/utils";
import { ROLE } from "@/constants";
import { TEXT } from "@/constants/text";
import { ReportProps } from "@/types/reportProps";
import { ModalActionProps } from "@/lib/types";

export default function RevenueColumns() {
    //** Stores */
    const { profile } = useProfileStore();
    const { getReport, getReportById, updateReport, deleteReport } = useReportsStore();
    const { getModal } = useModalStore();

    //** Functions */
    const handleReportApproved = (params: ReportProps) => {
        if (profile.role !== ROLE.ADMIN) return console.error("You are not authorized");

        const { id, isApproved } = params;

        if (!id) return console.error("Report ID is not found");

        updateReport({
            id,
            reports: {
                isApproved: !isApproved,
            },
        }).then(() => {
            getReport();
        });
    };

    const handleGetReportById = async (id: string) => {
        await getReportById(id);
        await getModal({
            isOpen: true,
            size: "5xl",
            modalHeader: TEXT.REPORT,
            modalBody: <ReportDetail />,
        });
    };

    const handleEditReport = async (id: string) => {
        await getReportById(id);
        await getModal({
            isOpen: true,
            size: "3xl",
            action: ModalActionProps.UPDATE,
            modalHeader: TEXT.EDIT_REPORT,
            modalBody: <ReportAddNew />,
        });
    };

    const handleDeleteReport = (id: string) => {
        getModal({
            isOpen: true,
            action: ModalActionProps.UPDATE,
            modalHeader: TEXT.confirmDelete,
            modalBody: (
                <ConfirmModal
                    onConfirm={async () => {
                        await deleteReport(id);
                        await getReport();

                        getModal({ isOpen: false });
                    }}
                />
            ),
        });
    };

    const columns = [
        {
            key: "createAt",
            name: TEXT.DATE,
            content: (params: any) => formatDate(params.row[0]),
        },
        {
            key: "detail",
            name: TEXT.DETAIL,
            className: "flex-[6]",
            content: (params: any) => {
                const shift = params.row[1].map((item: any) => item.shift.name);
                const reportsOnStaffs = params.row[1].map((item: any) => item.reportsOnStaffs);

                return shift.map((item: any, index: number) => {
                    const revenue = params.row[1][index].revenue;
                    const deduction = params.row[1][index].deduction;
                    const cash = params.row[1][index].cash;
                    const transfer = params.row[1][index].transfer;
                    const staff = reportsOnStaffs[index].map((staff: any) => staff.staff.name);
                    const timeSheet = reportsOnStaffs[index].map(
                        (timeSheet: any) => `${timeSheet.checkIn} - ${timeSheet.checkOut}`,
                    );
                    const isApproved = params.row[1][index].isApproved;

                    return (
                        <div
                            key={item + index}
                            className="flex justify-between items-center flex-wrap gap-6 py-2 border-b last:border-b-0"
                        >
                            <Button
                                className="min-w-0 bg-transparent p-0 text-default-500"
                                onClick={() => {
                                    handleReportApproved(params.row[1][index]);
                                }}
                            >
                                {isApproved ? (
                                    <CheckCircleIconActive className="w-5 text-primary" />
                                ) : (
                                    <CheckCircleIcon className="w-5" />
                                )}
                            </Button>

                            <div className="flex-1">{item}</div>

                            <div className="flex-[10] flex items-center flex-wrap gap-2">
                                <div className="flex-1">
                                    {staff.map((staffName: any, index: number) => (
                                        <div key={staffName + index}>{staffName}</div>
                                    ))}
                                </div>
                                <div className="flex-1">
                                    {timeSheet.map((time: any, index: number) => (
                                        <div key={time + index}>{time}</div>
                                    ))}
                                </div>
                                <div className="md:flex-[6] w-full flex items-center gap-4">
                                    <div className="flex-1 font-bold">
                                        <div className="flex items-end border-b">
                                            <span className="flex-1 font-normal text-black">
                                                {TEXT.REVENUE}
                                            </span>
                                            <span className="text-primary">
                                                {currencyFormat(revenue)}
                                            </span>
                                        </div>
                                        <div className="flex items-end">
                                            <span className="flex-1 font-normal text-black">
                                                {TEXT.TRANSFER}
                                            </span>
                                            {currencyFormat(transfer)}
                                        </div>
                                        {deduction && (
                                            <div className="flex items-end italic">
                                                <span className="flex-1 font-normal text-black">
                                                    {TEXT.DEDUCTION}
                                                </span>
                                                <span className="text-error">{`- ${currencyFormat(deduction)}`}</span>
                                            </div>
                                        )}
                                        <div className="flex items-end">
                                            <span className="flex-1 font-normal text-black">
                                                {TEXT.CASH}
                                            </span>
                                            {currencyFormat(cash)}
                                        </div>
                                    </div>
                                    <div className="flex-1">{params.row[1][index].description}</div>
                                    <div className="flex justify-end gap-1">
                                        <Tooltip content="Details">
                                            <Button
                                                className="min-w-0 bg-transparent p-0 text-default-500"
                                                onClick={() => {
                                                    handleGetReportById(params.row[1][index].id);
                                                }}
                                            >
                                                <EyeIcon className="w-5" />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Edit">
                                            <Button className="min-w-0 bg-transparent p-0 text-default-500">
                                                <PencilSquareIcon
                                                    className="w-5"
                                                    onClick={() => {
                                                        handleEditReport(params.row[1][index].id);
                                                    }}
                                                />
                                            </Button>
                                        </Tooltip>
                                        {profile.role === ROLE.ADMIN && (
                                            <Tooltip content="Remove">
                                                <Button
                                                    className="min-w-0 bg-transparent p-0 text-default-500"
                                                    onClick={() =>
                                                        handleDeleteReport(params.row[1][index].id)
                                                    }
                                                >
                                                    <TrashIcon className="w-5" />
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                });
            },
        },
    ];

    return columns;
}
