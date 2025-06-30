import React, { useState } from "react";
import TargetShifts from "./TargetShifts";
import Loading from "@/components/Loading";
import Button from "@/components/Button";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { TargetProps, useTargetStore } from "@/stores/useTargetStore";
import { formatCurrency, formatDate } from "@/utils";
import { TEXT } from "@/constants";

export default function TargetList({ targets }: { targets: TargetProps[] }) {
    //** Stores */
    const { isLoading } = useTargetStore();

    //** States */
    const [openTargetId, setOpenTargetId] = useState<string | null>(null);

    //** Render */
    if (isLoading) return <Loading />;

    const renderTarget = (name: string, value: number) => {
        return (
            <div className="flex-1 flex items-center gap-x-2">
                <div className="flex flex-col gap-y-1">
                    <p className="text-sm text-gray-600">{name}</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(value)}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-y-4">
            {targets.map(target => (
                <div
                    key={target.id}
                    className="relative flex flex-col gap-y-6 bg-white p-6 rounded-xl shadow-md"
                >
                    {isLoading && <Loading />}

                    <div className="flex items-center gap-x-2">
                        <Button
                            size="sm"
                            variant="light"
                            color="default"
                            isIconOnly
                            onPress={() =>
                                setOpenTargetId(openTargetId === target.id ? null : target.id)
                            }
                        >
                            <ChevronRightIcon
                                className={twMerge(
                                    "w-5 h-5 transition-all duration-300",
                                    openTargetId === target.id && "rotate-90",
                                )}
                            />
                        </Button>

                        <div className="flex items-center justify-between w-full">
                            <div className="flex-1">
                                <div key={target.id} className="flex items-center gap-x-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{`${target.name} ngày ${formatDate(target.targetAt)}`}</h3>
                                </div>

                                <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-y-2 gap-x-6 mt-2 text-gray-600">
                                    {renderTarget(TEXT.REVENUE, target.revenue)}
                                    {renderTarget(TEXT.TRANSFER, target.transfer)}
                                    {renderTarget(TEXT.DEDUCTION, target.deduction)}
                                    {renderTarget(TEXT.CASH, target.cash)}
                                </div>
                            </div>

                            {/* <div className="flex items-center">
                                <Button size="sm" variant="light" color="default" isIconOnly>
                                    <PencilSquareIcon className="w-5 h-5 text-gray-500" />
                                </Button>

                                <Button size="sm" variant="light" color="default" isIconOnly>
                                    <TrashIcon className="w-5 h-5 text-gray-500" />
                                </Button>
                            </div> */}
                        </div>
                    </div>

                    {openTargetId === target.id && <TargetShifts target={target} />}
                </div>
            ))}
        </div>
    );
}
