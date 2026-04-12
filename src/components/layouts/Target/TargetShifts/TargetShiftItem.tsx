import React, { useState } from "react";
import IsTarget from "./IsTarget";
import TimeSheets from "../TimeSheets";
import Loading from "@/components/Loading";
import { twMerge } from "tailwind-merge";
import { TargetProps, TargetShiftProps } from "@/types";
import { useInvoice, useTargetShift } from "@/hooks";

export default function TargetShiftItem({
    targetShift,
    targetAt,
}: {
    targetShift: TargetShiftProps;
    targetAt: TargetProps["targetAt"];
}) {
    const { shiftName, startTime, endTime } = targetShift;

    //** States */
    const [isCollect, setIsCollect] = useState(false);

    //** Queries */
    const { isLoading: isInvoiceLoading, getInvoice } = useInvoice();
    const { isLoading, updateTargetShift } = useTargetShift();

    //** Functions */
    const handleCollectMoney = (status: boolean) => {
        setIsCollect(status);
    };

    //** Render */
    return (
        <div
            className={twMerge(
                "relative flex flex-col justify-between gap-2 p-2 border border-gray-200 rounded-lg",
                isCollect && "bg-success-50",
            )}
        >
            {(isLoading || isInvoiceLoading) && <Loading />}
            <div className="grid grid-cols-2 justify-between items-center">
                <h5 className="sm:text-base text-sm font-semibold text-gray-900">
                    {`${shiftName} (${startTime} - ${endTime})`}
                </h5>
            </div>

            <div className="h-full space-y-2">
                {targetShift.isTarget && (
                    <IsTarget
                        data={targetShift}
                        targetAt={targetAt}
                        getInvoice={getInvoice}
                        updateTargetShift={updateTargetShift}
                        handleCollectMoney={handleCollectMoney}
                    />
                )}
            </div>

            <TimeSheets
                targetAt={targetAt}
                targetShift={targetShift}
                timeSheets={targetShift.timeSheets}
            />
        </div>
    );
}
