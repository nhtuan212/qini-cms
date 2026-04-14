import React, { Key, useMemo } from "react";
import { Tab, Tabs } from "@/components/Tab";
import { ArrowTrendingUpIcon, BanknotesIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { REVENUE_STATUS, TEXT } from "@/constants";
import { TargetProps } from "@/types";
import { formatCurrency } from "@/utils";

export default function TargetTotal({
    targets,
    setTargetFilterTab,
}: {
    targets: TargetProps[];
    setTargetFilterTab: (key: Key) => void;
}) {
    //** Variables */
    const total = useMemo(() => {
        const targetShifts = targets.flatMap(ts => ts.targetShifts);

        return {
            revenue: targets.reduce((acc, curr) => acc + curr.revenue, 0),
            transfer: targets.reduce((acc, curr) => acc + curr.transfer, 0),
            cash: targets.reduce((acc, curr) => acc + curr.cash, 0),
            uncollectedCash: targetShifts
                .filter(shift => shift.isTarget && !shift.isCollectMoney)
                .reduce((acc, curr) => acc + curr.cash, 0),
        };
    }, [targets]);

    //** Render */
    const renderTotal = ({
        title,
        icon,
        value,
        className,
    }: {
        title: string;
        icon: React.ReactNode;
        value: number;
        className?: string;
    }) => (
        <div className={twMerge("space-y-2 px-8 py-6 text-white rounded-md shadow-xl", className)}>
            <div className="flex items-center gap-x-2 font-semibold uppercase">
                {icon} {title}
            </div>

            <h3 className="font-bold text-2xl">{formatCurrency(value)}</h3>
        </div>
    );

    return (
        <div className="flex flex-col gap-y-4">
            <Tabs className="ml-auto" onSelectionChange={setTargetFilterTab}>
                <Tab key={REVENUE_STATUS.ALL} title={TEXT.ALL}></Tab>
                <Tab key={REVENUE_STATUS.UN_COLLECTED} title={TEXT.UNCOLLECTED}></Tab>
            </Tabs>

            <div className="grid md:grid-cols-4 grid-cols-2 items-center gap-4">
                {renderTotal({
                    title: TEXT.REVENUE,
                    icon: <ArrowTrendingUpIcon className="w-6 h-6" />,
                    value: total.revenue,
                    className: "bg-primary",
                })}
                {renderTotal({
                    title: TEXT.TRANSFER,
                    icon: <BanknotesIcon className="w-6 h-6" />,
                    value: total.transfer,
                    className: "bg-secondary",
                })}
                {renderTotal({
                    title: TEXT.CASH,
                    icon: <BanknotesIcon className="w-6 h-6" />,
                    value: total.cash,
                    className: "bg-success-600",
                })}
                {renderTotal({
                    title: `${TEXT.CASH} ${TEXT.UNCOLLECTED}`,
                    icon: <MinusCircleIcon className="w-6 h-6" />,
                    value: total.uncollectedCash,
                    className: "bg-danger",
                })}
            </div>
        </div>
    );
}
