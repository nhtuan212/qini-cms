import React from "react";
import TimeSheetList from "./TimeSheetList";
import TargetShiftModal from "./TargetShiftModal";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { BanknotesIcon, CreditCardIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { TargetShiftProps, useTargetShiftStore } from "@/stores/useTargetShiftStore";
import { useModalStore } from "@/stores/useModalStore";
import { formatCurrency, isEmpty } from "@/utils";
import { TEXT } from "@/constants";

export default function TargetShiftItem({ targetShifts }: { targetShifts: TargetShiftProps[] }) {
    //** Stores */
    const { getModal } = useModalStore();
    const { getTargetShift } = useTargetShiftStore();

    //** Functions */
    const renderAmount = (name: string, value: number, icon: React.ReactNode) => {
        return (
            <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-x-2 text-gray-600">
                    {icon} {name}
                </span>
                <span className="font-medium">{formatCurrency(value)}</span>
            </div>
        );
    };

    return (
        <div className="relative flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-900">{TEXT.DETAIL_SHIFT}</h4>
                {/* <Button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm">
                    Thêm ca
                </Button> */}
            </div>

            {targetShifts.map(targetShift => (
                <div
                    key={targetShift.id}
                    className="bg-success-50 rounded-lg p-4 border border-gray-200"
                >
                    <div className="grid sm:grid-cols-2 grid-cols-1 justify-between mb-3">
                        <div className="flex items-center">
                            <h5 className="font-semibold text-gray-900">
                                {`${targetShift.shiftName} (${targetShift.startTime} - ${targetShift.endTime})`}
                            </h5>
                        </div>
                        <div className="flex items-center sm:justify-end justify-between">
                            <span className="mr-6 text-lg font-bold text-blue-600">
                                {formatCurrency(targetShift.revenue)}
                            </span>

                            <div>
                                <Button
                                    size="sm"
                                    variant="light"
                                    color="default"
                                    isIconOnly
                                    onPress={async () => {
                                        await getTargetShift(targetShift.id);
                                        await getModal({
                                            isOpen: true,
                                            modalHeader: TEXT.UPDATE(targetShift.shiftName),
                                            modalBody: <TargetShiftModal />,
                                        });
                                    }}
                                >
                                    <PencilSquareIcon className="w-4 h-4 text-gray-400" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {renderAmount(
                            TEXT.TRANSFER,
                            targetShift.transfer,
                            <CreditCardIcon className="w-4 h-4" />,
                        )}
                        {renderAmount(
                            TEXT.DEDUCTION,
                            targetShift.deduction,
                            <CreditCardIcon className="w-4 h-4" />,
                        )}
                        {renderAmount(
                            TEXT.CASH,
                            targetShift.cash,
                            <BanknotesIcon className="w-4 h-4" />,
                        )}

                        {targetShift.description && (
                            <Input
                                label={TEXT.NOTE}
                                type="textarea"
                                value={targetShift.description}
                                isReadOnly
                            />
                        )}
                    </div>

                    {!isEmpty(targetShift.timeSheet) && (
                        <TimeSheetList timeSheets={targetShift.timeSheet} />
                    )}
                </div>
            ))}
        </div>
    );
}
