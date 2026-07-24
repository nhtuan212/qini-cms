import { useState, useRef, useEffect } from "react";
import TargetShifts from "./TargetShifts";
import Loading from "@/components/Loading";
import Button from "@/components/Button";
import { ArrowTrendingUpIcon, BanknotesIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";
import { useCollectMoneyStore } from "@/stores/useCollectMoneyStore";
import { formatCurrency, formatDate } from "@/utils";
import { TEXT } from "@/constants";
import { TargetProps } from "@/types";

export default function TargetList({
    isLoading,
    targets,
}: {
    isLoading: boolean;
    targets: TargetProps[];
}) {
    //** Refs */
    const targetRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    //** States */
    const [openTargetId, setOpenTargetId] = useState<string | null>(null);

    //** Stores */
    const { isCollected, setCollectMoney } = useCollectMoneyStore();

    //** Functions */
    const handleToggleTarget = (targetId: string) => {
        const newOpenTargetId = openTargetId === targetId ? null : targetId;
        setOpenTargetId(newOpenTargetId);

        // Scroll to the target div when opening
        if (newOpenTargetId && targetRefs.current[targetId]) {
            setTimeout(() => {
                const element = targetRefs.current[targetId];
                if (!element) return;

                // Calculate menu height on the top
                const elementTop = element.getBoundingClientRect().top + window.scrollY;
                const offset = 65 + 16;

                window.scrollTo({
                    top: elementTop - offset,
                    behavior: "smooth",
                });
            }, 100); // Small delay to ensure the content is rendered
        }
    };

    //** Effects */
    useEffect(() => {
        // Sync all target shifts collect money status to store on initial load
        targets.map(target => {
            target.targetShifts
                .filter(ts => ts.isTarget)
                .forEach(ts => setCollectMoney(ts.id, ts.isCollectMoney));
        });
    }, [setCollectMoney, targets]);

    //** Render */
    const renderTarget = ({
        name,
        value,
        icon,
        className,
    }: {
        name: string;
        value: number;
        icon?: React.ReactNode;
        className?: string;
    }) => {
        return (
            <div className={twMerge("space-y-1", className)}>
                <p className="flex items-center gap-x-1 text-black">
                    {icon}
                    <span className="text-sm">{name}</span>
                </p>
                <p className="font-semibold">{formatCurrency(value)}</p>
            </div>
        );
    };

    return (
        <div className="relative h-full min-h-[70vh] flex flex-col gap-y-4">
            {isLoading && <Loading />}

            {targets.map(target => {
                const shiftTargets = target.targetShifts.filter(ts => ts.isTarget).map(ts => ts.id);

                return (
                    <div
                        key={target.id}
                        ref={el => {
                            targetRefs.current[target.id] = el;
                        }}
                        className="relative flex flex-col gap-y-2 bg-white px-2 py-4 border rounded-xl shadow-md even:bg-gray-50"
                    >
                        <div
                            className="grid md:grid-cols-3 grid-cols-2 gap-4 cursor-pointer"
                            onClick={() => handleToggleTarget(target.id)}
                        >
                            <div className="flex items-center justify-between w-full">
                                <Button
                                    size="sm"
                                    variant="light"
                                    color="default"
                                    isIconOnly
                                    onPress={() => handleToggleTarget(target.id)}
                                >
                                    <ChevronRightIcon
                                        className={twMerge(
                                            "w-5 h-5 transition-all duration-300",
                                            openTargetId === target.id && "rotate-90",
                                        )}
                                    />
                                </Button>

                                <div className="flex-1 space-y-1">
                                    <div key={target.id}>
                                        <h3 className="text-base font-semibold text-gray-900">{`${target.name} ngày ${formatDate(target.targetAt)}`}</h3>
                                    </div>

                                    <div className="flex items-center gap-x-1">
                                        {shiftTargets.map(id => (
                                            <div
                                                key={id}
                                                className={twMerge(
                                                    "w-2.5 h-2.5 rounded-full transition-colors border border-success",
                                                    isCollected(id) && "bg-success",
                                                )}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 grid sm:grid-cols-3 grid-cols-2 gap-2 ml-6 uppercase">
                                {renderTarget({
                                    name: TEXT.REVENUE,
                                    value: target.revenue,
                                    icon: <ArrowTrendingUpIcon className="w-4 h-4" />,
                                    className: "text-primary",
                                })}
                                {renderTarget({
                                    name: TEXT.TRANSFER,
                                    value: target.transfer,
                                    icon: <BanknotesIcon className="w-4 h-4" />,
                                    className: "text-secondary",
                                })}
                                {renderTarget({
                                    name: TEXT.CASH,
                                    value: target.cash,
                                    icon: <BanknotesIcon className="w-4 h-4" />,
                                    className: "sm:col-span-1 col-span-2 text-success",
                                })}
                            </div>
                        </div>

                        <AnimatePresence>
                            {openTargetId === target.id && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <TargetShifts target={target} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
