import { useState } from "react";
import IsTarget from "./IsTarget";
import TimeSheets from "../TimeSheets";
import Loading from "@/components/Loading";
import Chip from "@/components/Chip";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { useInvoice, useTargetShift } from "@/hooks";
import { TEXT } from "@/constants";
import { TargetProps, TargetShiftProps } from "@/types";

export default function TargetShiftItem({
    targetShift,
    targetAt,
}: {
    targetShift: TargetShiftProps;
    targetAt: TargetProps["targetAt"];
}) {
    const { isCollectMoney, shiftName, startTime, endTime } = targetShift;

    //** States */
    const [isCollect, setIsCollect] = useState(isCollectMoney);

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

            <div className="flex justify-between items-center">
                <h5 className="sm:text-base text-sm font-semibold text-gray-900">
                    {`${shiftName} (${startTime} - ${endTime})`}
                </h5>
                <Chip
                    color={isCollect ? "success" : "default"}
                    startContent={<BanknotesIcon className="w-4 h-4" />}
                >
                    {isCollect ? TEXT.SUCCESS : TEXT.PENDING}
                </Chip>
            </div>

            <div className="h-full space-y-2">
                {targetShift.isTarget && (
                    <IsTarget
                        targetShift={targetShift}
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
