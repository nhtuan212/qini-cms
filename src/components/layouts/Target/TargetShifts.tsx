import React from "react";
import TimeSheets from "./TimeSheets";
import TargetShiftModal from "./TargetShiftModal";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {
    ArrowPathIcon,
    BanknotesIcon,
    CreditCardIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useProfileStore } from "@/stores/useProfileStore";
import { TargetShiftProps, useTargetShiftStore } from "@/stores/useTargetShiftStore";
import { useModalStore } from "@/stores/useModalStore";
import { useInvoiceStore } from "@/stores/useInvoice";
import { TargetProps } from "@/stores/useTargetStore";
import { formatCurrency, formatDate } from "@/utils";
import { ROLE, TEXT } from "@/constants";

export default function TargetShifts({ target }: { target: TargetProps }) {
    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();
    const { getTargetShiftById, updateTargetShift } = useTargetShiftStore();
    const { getInvoice } = useInvoiceStore();

    //** Functions */
    const isWithinShiftTime = (
        userRole: string | undefined,
        startTime: string,
        endTime: string,
    ) => {
        if (userRole === ROLE.ADMIN) return true;
        if (!startTime || !endTime) return false;

        const now = new Date();
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);
        const start = new Date(now);
        const end = new Date(now);

        start.setHours(startHour, startMinute, 0, 0);
        end.setHours(endHour, endMinute, 0, 0);

        // Adjust window: 30 min before start, 30 min after end
        const startWindow = new Date(start.getTime() - 30 * 60 * 1000);
        const endWindow = new Date(end.getTime() + 30 * 60 * 1000);
        return now >= startWindow && now <= endWindow;
    };

    //** Render */
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

            {target.targetShifts.map((targetShift: TargetShiftProps) => (
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
                        {targetShift.isTarget && (
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
                                            await getTargetShiftById(targetShift.id);
                                            await getModal({
                                                isOpen: true,
                                                modalHeader: TEXT.UPDATE(targetShift.shiftName),
                                                modalBody: <TargetShiftModal />,
                                            });
                                        }}
                                        isDisabled={
                                            !isWithinShiftTime(
                                                profile?.role,
                                                targetShift.startTime,
                                                targetShift.endTime,
                                            )
                                        }
                                    >
                                        <PencilSquareIcon className="w-4 h-4 text-gray-400" />
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="light"
                                        isIconOnly
                                        onPress={async () => {
                                            const invoices = await getInvoice({
                                                soldById: targetShift.kiotId,
                                                targetAt: formatDate(target.targetAt, "YYYY-MM-DD"),
                                            }).then(invoice => invoice);

                                            await updateTargetShift({
                                                id: targetShift.id,
                                                bodyParams: invoices,
                                            });
                                        }}
                                        isDisabled={
                                            !isWithinShiftTime(
                                                profile?.role,
                                                targetShift.startTime,
                                                targetShift.endTime,
                                            )
                                        }
                                    >
                                        <ArrowPathIcon className="w-4 h-4 text-gray-400" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    {targetShift.isTarget && (
                        <div className="space-y-2">
                            {renderAmount(
                                TEXT.TRANSFER,
                                targetShift.transfer,
                                <CreditCardIcon className="w-4 h-4" />,
                            )}
                            {renderAmount(
                                TEXT.POINT,
                                targetShift.point,
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
                    )}

                    <TimeSheets
                        targetAt={target.targetAt}
                        targetShift={targetShift}
                        timeSheets={targetShift.timeSheets}
                    />
                </div>
            ))}
        </div>
    );
}
