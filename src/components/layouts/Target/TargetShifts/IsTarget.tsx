import React, { useState } from "react";
import TargetShiftModal from "../TargetShiftModal";
import Input from "@/components/Input";
import Button from "@/components/Button";
import {
    ArrowPathIcon,
    BanknotesIcon,
    CheckIcon,
    CreditCardIcon,
    PencilSquareIcon,
    StopIcon,
} from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { useProfileStore } from "@/stores/useProfileStore";
import { useModalStore } from "@/stores/useModalStore";
import { formatCurrency, formatDate } from "@/utils";
import { ROLE, TEXT } from "@/constants";
import { TargetProps, TargetShiftProps } from "@/types";

interface IsTargetProps {
    targetShift: TargetShiftProps;
    targetAt: TargetProps["targetAt"];
    getInvoice: any;
    updateTargetShift: any;
    handleCollectMoney: (status: boolean) => void;
}

export default function IsTarget({
    targetShift,
    targetAt,
    getInvoice,
    updateTargetShift,
    handleCollectMoney,
}: IsTargetProps) {
    const {
        id,
        kiotId,
        shiftName,
        startTime,
        endTime,
        revenue,
        transfer,
        point,
        cash,
        description,
        isCollectMoney,
    } = targetShift;

    //** States */
    const [isCollect, setIsCollect] = useState(isCollectMoney);

    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();

    //** Variable */
    const isAdmin = profile.role === ROLE.ADMIN;

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

    const handleSyncInvoice = async () => {
        if (!kiotId) return;

        const invoices = await getInvoice({
            soldById: kiotId,
            targetAt: formatDate(targetAt, "YYYY-MM-DD"),
        });

        await updateTargetShift({
            id: id,
            params: invoices,
        });
    };

    const handleToggleCollectMoney = () => {
        if (!isAdmin) return true;

        setIsCollect(!isCollect);
        handleCollectMoney(!isCollect);

        updateTargetShift({
            id,
            params: { isCollectMoney: !isCollect },
        });
    };

    //** Render */
    const renderAmount = (
        name: string,
        value: number,
        icon: React.ReactNode,
        className?: string,
    ) => {
        return (
            <div
                className={twMerge(
                    "flex items-center justify-between text-sm ",
                    className && className,
                )}
            >
                <span className="flex items-center gap-x-2 text-gray-600">
                    {icon} {name}
                </span>
                <span className="font-medium">{formatCurrency(value)}</span>
            </div>
        );
    };

    return (
        <>
            <div className="flex items-center justify-end">
                <span className="font-bold text-blue-600">{formatCurrency(revenue)}</span>

                <div>
                    <Button
                        size="sm"
                        variant="light"
                        color="default"
                        isIconOnly
                        onPress={() => {
                            getModal({
                                isOpen: true,
                                modalHeader: TEXT.UPDATE(shiftName),
                                modalBody: <TargetShiftModal {...targetShift} />,
                            });
                        }}
                        isDisabled={!isWithinShiftTime(profile?.role, startTime, endTime)}
                    >
                        <PencilSquareIcon className="w-4 h-4 text-gray-400" />
                    </Button>

                    <Button
                        size="sm"
                        variant="light"
                        isIconOnly
                        onPress={() => handleSyncInvoice}
                        isDisabled={!isWithinShiftTime(profile?.role, startTime, endTime)}
                    >
                        <ArrowPathIcon className="w-4 h-4 text-gray-400" />
                    </Button>
                </div>
            </div>

            {renderAmount(TEXT.TRANSFER, transfer, <CreditCardIcon className="w-4 h-4" />)}
            {renderAmount(TEXT.POINT, point, <CreditCardIcon className="w-4 h-4" />)}
            {renderAmount(
                TEXT.CASH,
                cash,
                <BanknotesIcon className="w-4 h-4" />,
                "py-2 text-lg border-t",
            )}

            {description && (
                <Input label={TEXT.NOTE} type="textarea" value={description} isReadOnly />
            )}

            <Button
                className={!isCollect ? "bg-black" : ""}
                color={isCollect ? "success" : "primary"}
                fullWidth
                startContent={
                    isCollect ? <CheckIcon className="w-4 h-4" /> : <StopIcon className="w-4 h-4" />
                }
                onPress={handleToggleCollectMoney}
                isDisabled={!isAdmin}
            >
                {TEXT.COLLECT_MONEY}
            </Button>
        </>
    );
}
