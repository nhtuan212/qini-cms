import React, { Key, useMemo } from "react";
import { Tab, Tabs } from "@/components/Tab";
import { ArrowTrendingUpIcon, BanknotesIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { ProfileProps } from "@/stores/useProfileStore";
import { twMerge } from "tailwind-merge";
import { REVENUE_STATUS, ROLE, TEXT } from "@/constants";
import { TargetProps } from "@/types";
import { formatCurrency } from "@/utils";

export default function TargetTotal({
    role,
    targets,
    setTargetFilterTab,
}: {
    role: ProfileProps["role"];
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
        // Avoid percentage heights (h-full) here: old Safari (< 15.4) resolves them
        // incorrectly inside auto-sized grid rows, blowing the cards up and
        // overlapping the content below. Grid stretch + flex-1 gives the same look.
        <div
            className={twMerge(
                "flex flex-col justify-between space-y-2 p-4 text-white rounded-md shadow-xl",
                className,
            )}
        >
            <div className="flex-1 flex items-center gap-x-2 font-semibold uppercase">
                {icon} {title}
            </div>

            <h3 className="font-bold sm:text-xl">{formatCurrency(value)}</h3>
        </div>
    );

    return (
        <div className="flex flex-col gap-y-4">
            <Tabs className="ml-auto" onSelectionChange={setTargetFilterTab}>
                <Tab key={REVENUE_STATUS.ALL} title={TEXT.ALL}></Tab>
                <Tab key={REVENUE_STATUS.UN_COLLECTED} title={TEXT.UNCOLLECTED}></Tab>
            </Tabs>

            <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
                {role === ROLE.ADMIN &&
                    renderTotal({
                        title: TEXT.REVENUE,
                        icon: <ArrowTrendingUpIcon className="w-5 h-5" />,
                        value: total.revenue,
                        className: "bg-primary",
                    })}
                {role === ROLE.ADMIN &&
                    renderTotal({
                        title: TEXT.TRANSFER,
                        icon: <BanknotesIcon className="w-5 h-5" />,
                        value: total.transfer,
                        className: "bg-secondary",
                    })}
                {renderTotal({
                    title: TEXT.CASH,
                    icon: <BanknotesIcon className="w-5 h-5" />,
                    value: total.cash,
                    className: "bg-success-600",
                })}
                {renderTotal({
                    title: `${TEXT.CASH} ${TEXT.UNCOLLECTED}`,
                    icon: <MinusCircleIcon className="w-5 h-5" />,
                    value: total.uncollectedCash,
                    className: "bg-danger",
                })}
            </div>
        </div>
    );
}
