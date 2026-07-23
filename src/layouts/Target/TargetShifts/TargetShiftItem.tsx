import IsTarget from "./IsTarget";
import TimeSheets from "../TimeSheets";
import Loading from "@/components/Loading";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { useCollectMoneyStore } from "@/stores/useCollectMoneyStore";
import { useInvoice, useTargetShift } from "@/hooks";
import { TargetProps, TargetShiftProps } from "@/types";

export default function TargetShiftItem({
    targetShift,
    targetAt,
}: {
    targetShift: TargetShiftProps;
    targetAt: TargetProps["targetAt"];
}) {
    const { id, shiftName, startTime, endTime } = targetShift;

    //** Stores */
    const { setCollectMoney, isCollected } = useCollectMoneyStore();

    //** Queries */
    const { isLoading: isInvoiceLoading, getInvoice } = useInvoice();
    const { isLoading, updateTargetShift } = useTargetShift();

    //** Functions */
    const handleCollectMoney = (status: boolean) => {
        setCollectMoney(id, status);
    };

    //** Variables */
    const isCollect = isCollected(id);

    //** Render */
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={twMerge(
                "relative flex flex-col justify-between gap-2 p-2 border border-gray-200 rounded-lg shadow-md",
                isCollect && "bg-success-50",
            )}
        >
            {(isLoading || isInvoiceLoading) && <Loading />}

            <h5 className="sm:text-base text-sm font-semibold text-gray-900">
                {`${shiftName} (${startTime} - ${endTime})`}
            </h5>

            <div className="h-full space-y-2">
                {targetShift.isTarget && (
                    <IsTarget
                        targetShift={targetShift}
                        targetAt={targetAt}
                        getInvoice={getInvoice}
                        updateTargetShift={updateTargetShift}
                        isCollect={isCollect}
                        handleCollectMoney={handleCollectMoney}
                    />
                )}
            </div>

            <TimeSheets
                targetAt={targetAt}
                targetShift={targetShift}
                timeSheets={targetShift.timeSheets}
            />
        </motion.div>
    );
}
