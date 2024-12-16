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
import { breakStringIntoLines, currencyFormat, formatDate } from "@/utils";
import { ROLE } from "@/constants";
import { TEXT } from "@/constants/text";
import { ModalActionProps } from "@/lib/types";
import { ReportProps } from "@/types/reportProps";

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
            size: "3xl",
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
            modalHeader: TEXT.CONFIRM_DELETE,
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

    //** Render */
    const columns = [
        {
            key: TEXT.DATE,
            name: TEXT.DATE,
            content: (params: ReportProps) => formatDate(params.row.createAt),
        },
        {
            key: "WORK_SHIFT",
            className: "flex-initial min-w-16",
            name: TEXT.WORK_SHIFT,
            content: (params: ReportProps) => params.row.shift.name,
        },
        {
            key: TEXT.NAME,
            className: "flex-initial min-w-20",
            name: TEXT.NAME,
            content: (params: ReportProps) => {
                const staff = params.row.reportsOnStaffs.map(
                    (item: ReportProps["reportsOnStaffs"]) => item.staff.name,
                );

                return staff.map((item: ReportProps["staffName"], index: number) => (
                    <div key={item + index}>{item}</div>
                ));
            },
        },
        {
            key: TEXT.TIME_SHEET,
            name: TEXT.TIME_SHEET,
            content: (params: ReportProps) => {
                return params.row.reportsOnStaffs.map(
                    (item: ReportProps["reportsOnStaffs"], index: number) => (
                        <div key={item + index}>
                            {item.checkIn} - {item.checkOut}
                        </div>
                    ),
                );
            },
        },
        {
            key: TEXT.TIME_NUMBER,
            className: "flex-initial min-w-16",
            name: TEXT.TIME_NUMBER,
            content: (params: ReportProps) => {
                return params.row.reportsOnStaffs.map(
                    (item: ReportProps["reportsOnStaffs"], index: number) => (
                        <div key={item + index}>{item.timeWorked}</div>
                    ),
                );
            },
        },
        {
            key: TEXT.AMOUNT,
            className: "flex-[4] [&.headCell]:justify-end",
            name: TEXT.AMOUNT,
            content: (params: ReportProps) => {
                const revenue = params.row.revenue;
                const deduction = params.row.deduction;
                const cash = params.row.cash;
                const transfer = params.row.transfer;

                return (
                    <div className="flex items-end gap-4">
                        <div className="flex-1 font-bold">
                            <div className="flex items-end border-b">
                                <span className="flex-1 font-normal text-black">
                                    {TEXT.REVENUE}
                                </span>
                                <span className="text-primary">{currencyFormat(revenue)}</span>
                            </div>
                            <div className="flex items-end">
                                <span className="flex-1 font-normal text-black">
                                    {TEXT.TRANSFER}
                                </span>
                                {currencyFormat(transfer)}
                            </div>
                            {deduction > 0 && (
                                <div className="flex items-end italic">
                                    <span className="flex-1 font-normal text-black">
                                        {TEXT.DEDUCTION}
                                    </span>
                                    <span className="text-error">{`- ${currencyFormat(deduction)}`}</span>
                                </div>
                            )}
                            <div className="flex items-end">
                                <span className="flex-1 font-normal text-black">{TEXT.CASH}</span>
                                {currencyFormat(cash)}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            key: TEXT.NOTE,
            className: "flex-[3]",
            name: TEXT.NOTE,
            content: (params: ReportProps) => {
                return breakStringIntoLines(params.row.description).map(
                    (line: string, index: number) => {
                        if (line === "") return <div key={line + index} className="h-2"></div>;

                        return <div key={line + index}>{line}</div>;
                    },
                );
            },
        },
        {
            key: "actions",
            name: "",
            content: (params: ReportProps) => {
                const isApproved = params.row.isApproved;

                return (
                    <div className="flex justify-end gap-1">
                        <Tooltip content={TEXT.PAID}>
                            <Button
                                className="min-w-0 bg-transparent p-0 text-default-500"
                                onClick={() => {
                                    handleReportApproved(params.row);
                                }}
                            >
                                {isApproved ? (
                                    <CheckCircleIconActive className="w-5 text-primary" />
                                ) : (
                                    <CheckCircleIcon className="w-5" />
                                )}
                            </Button>
                        </Tooltip>
                        <Tooltip content={TEXT.DETAIL}>
                            <Button
                                className="min-w-0 bg-transparent p-0 text-default-500"
                                onClick={() => {
                                    handleGetReportById(params.row.id);
                                }}
                            >
                                <EyeIcon className="w-5" />
                            </Button>
                        </Tooltip>
                        <Tooltip content={TEXT.EDIT}>
                            <Button className="min-w-0 bg-transparent p-0 text-default-500">
                                <PencilSquareIcon
                                    className="w-5"
                                    onClick={() => {
                                        handleEditReport(params.row.id);
                                    }}
                                />
                            </Button>
                        </Tooltip>
                        {profile.role === ROLE.ADMIN && (
                            <Tooltip content={TEXT.DELETE}>
                                <Button
                                    className="min-w-0 bg-transparent p-0 text-default-500"
                                    onClick={() => handleDeleteReport(params.row.id)}
                                >
                                    <TrashIcon className="w-5" />
                                </Button>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
    ];

    return columns;
}
