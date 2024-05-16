"use client";

import React from "react";
import Button from "@/components/Button";
import { Tooltip } from "@nextui-org/react";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useReportsStore } from "@/stores/useReportsStore";
import { useModalStore } from "@/stores/useModalStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { currencyFormat, dateFormat } from "@/utils";
import { MODAL, ROLE } from "@/constants";
import { TEXT } from "@/constants/text";

export default function RevenueColumns() {
    //** Stores */
    const { profile } = useProfileStore();
    const { getReport, getReportDetail, deleteReport } = useReportsStore();
    const { openModal, openConfirmModal } = useModalStore();

    //** Functions */
    const handleReportDetail = (id: string) => {
        openModal(MODAL.REPORT_DETAIL);
        getReportDetail(id);
    };

    const handleDeleteReport = (id: string) => {
        openConfirmModal({
            modalName: MODAL.CONFIRM,
            modalMessage: "Bạn có chắc chắn muốn xoá báo cáo này không ?",
            onConfirm: () =>
                deleteReport(id).then(() => {
                    openModal("");
                    getReport();
                }),
            onCancel: () => openModal(""),
        });
    };

    const columns = [
        {
            key: "createAt",
            name: TEXT.DATE,
            content: (params: any) => {
                console.log({
                    params: params.row,
                });

                return dateFormat(params.row[0]);
            },
        },

        {
            key: "detail",
            name: TEXT.DETAIL,
            className: "flex-[3]",
            content: (params: any) => {
                const shift = params.row[1].map((item: any) => item.shift.name);
                const reportsOnStaffs = params.row[1].map((item: any) => item.reportsOnStaffs);

                return shift.map((item: any, index: number) => {
                    const staff = reportsOnStaffs[index].map((staff: any) => staff.staff.name);
                    const timeSheet = reportsOnStaffs[index].map(
                        (timeSheet: any) => `${timeSheet.checkIn} - ${timeSheet.checkOut}`,
                    );
                    const target = reportsOnStaffs[index].reduce((acc: number, item: any) => {
                        return acc + item.target;
                    }, 0);

                    return (
                        <div
                            key={item + index}
                            className="flex justify-between items-center flex-wrap gap-3 py-2 border-b last:border-b-0"
                        >
                            <div className="flex-1">{item}</div>

                            <div className="md:flex-[3] w-full flex items-center flex-wrap gap-2">
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
                                <div className="md:flex-1 w-full flex items-center text-primary">
                                    <div className="flex-1 font-bold">{currencyFormat(target)}</div>
                                    <div className="flex-1 flex justify-end">
                                        <Tooltip content="Details">
                                            <Button
                                                className="min-w-0 bg-transparent p-0 text-default-500"
                                                onClick={() => {
                                                    handleReportDetail(params.row[1][index].id);
                                                }}
                                            >
                                                <EyeIcon className="w-5" />
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

        //** old UI */

        // {
        //     key: "shift",
        //     name: TEXT.WORK_SHIFT,
        //     content: (params: any) => params.row.shift.name,
        // },
        // {
        //     key: "staff",
        //     name: TEXT.STAFF,
        //     content: (params: any) => {
        //         const staff = params.row.reportsOnStaffs.map((item: any) => item.staff.name);

        //         return staff.map((item: any, index: number) => (
        //             <div key={item + index}>{item}</div>
        //         ));
        //     },
        // },
        // {
        //     key: "timeSheet",
        //     name: TEXT.TIME_SHEET,
        //     content: (params: any) => {
        //         const timeSheet = params.row.reportsOnStaffs.map(
        //             (item: any) => `${item.checkIn} - ${item.checkOut}`,
        //         );

        //         return timeSheet.map((item: any, index: number) => (
        //             <div key={item + index}>{item}</div>
        //         ));
        //     },
        // },
        // {
        //     key: "revenue",
        //     name: TEXT.REVENUE,
        //     content: (params: any) => currencyFormat(params.row.revenue),
        // },
        // {
        //     key: "actions",
        //     name: "ACTIONS",
        //     className: "w-[8rem] text-end",
        //     content: (params: any) => (
        //         <div className="relative flex justify-end items-center gap-2">
        //             <Tooltip content="Details">
        //                 <Button
        //                     className="min-w-0 bg-transparent p-0 text-default-500"
        //                     onClick={() => {
        //                         handleReportDetail(params.row.id);
        //                     }}
        //                 >
        //                     <EyeIcon className="w-5" />
        //                 </Button>
        //             </Tooltip>
        //             {/* <Tooltip content="Edit">
        //                 <Button className="min-w-0 bg-transparent p-0 text-default-500">
        //                     <PencilSquareIcon className="w-5" />
        //                 </Button>
        //             </Tooltip> */}
        //             {profile.role === ROLE.ADMIN && (
        //                 <Tooltip content="Remove">
        //                     <Button
        //                         className="min-w-0 bg-transparent p-0 text-default-500"
        //                         onClick={() => handleDeleteReport(params.row.id)}
        //                     >
        //                         <TrashIcon className="w-5" />
        //                     </Button>
        //                 </Tooltip>
        //             )}
        //         </div>
        //     ),
        // },
    ];

    return columns;
}
