"use client";

import React, { useEffect } from "react";
import Button from "@/components/Button";
import TargetDetail from "./TargetDetail";
import { currencyFormat, sumArray } from "@/utils";
import { TEXT } from "@/constants/text";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { useReportStore } from "@/stores/useReportStore";
import { MODAL } from "@/constants";
import { StaffProps } from "@/types/staffProps";
import { ReportProps } from "@/types/reportProps";

export default function Target() {
    //** Stores */
    const { openModal } = useModalStore();
    const { staff, getStaff, getStaffById } = useStaffStore();
    const { report, getReport, getReportByStaff } = useReportStore();

    //** Functions */
    const handleOpenModal = ({ item }: { item: StaffProps }) => {
        getStaffById(item.id);
        getReportByStaff(item.id);
        openModal(MODAL.TARGET_DETAIL);
    };

    //** Effects */
    useEffect(() => {
        getStaff();
        getReport();
    }, [getStaff, getReport]);

    return (
        <>
            <div className="flex flex-col justify-center py-32">
                <div className="grid sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-2">
                    {staff.map((item: StaffProps) => {
                        const reportByStaff = report.filter(
                            (reportItem: any) => reportItem.staffId === item.id,
                        );
                        const targetByStaff = reportByStaff.map((item: ReportProps) => item.target);
                        const sum = sumArray(targetByStaff);

                        return (
                            <div
                                key={item.id}
                                className="flex flex-col justify-between h-36 p-3 border rounded shadow-md"
                            >
                                <p className="text-lg">{item.name}</p>
                                <p>
                                    {`${TEXT.TARGET}: `}
                                    <b className="text-lg text-primary">{currencyFormat(sum)}</b>
                                </p>

                                <Button
                                    className="h-auto justify-end bg-transparent gap-1 p-0 text-link hover:underline"
                                    onClick={() =>
                                        handleOpenModal({
                                            item,
                                        })
                                    }
                                >
                                    <p className="text-sm">{TEXT.DETAIL}</p>
                                    <ChevronDoubleRightIcon className="w-5" />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Popup show detail */}
            <TargetDetail />
        </>
    );
}
