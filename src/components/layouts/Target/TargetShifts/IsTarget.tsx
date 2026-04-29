import React from "react";
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
    isCollect: boolean;
    handleCollectMoney: (status: boolean) => void;
}

export default function IsTarget({
    targetShift,
    targetAt,
    getInvoice,
    updateTargetShift,
    isCollect,
    handleCollectMoney,
}: IsTargetProps) {
    const { id, kiotId, shiftName, revenue, transfer, point, cash, description } = targetShift;

    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();

    //** Variable */
    const isAdmin = profile.role === ROLE.ADMIN;

    //** Functions */
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
            <div className="flex items-center justify-end gap-x-2">
                <Button
                    className={twMerge("mr-auto", !isCollect ? "bg-black" : "")}
                    size="sm"
                    color={isCollect ? "success" : "primary"}
                    startContent={
                        isCollect ? (
                            <CheckIcon className="w-4 h-4" />
                        ) : (
                            <StopIcon className="w-4 h-4" />
                        )
                    }
                    endContent={<BanknotesIcon className="w-4 h-4" />}
                    onPress={handleToggleCollectMoney}
                    isDisabled={!isAdmin}
                >
                    {TEXT.COLLECT_MONEY}
                </Button>

                <span className="font-bold text-blue-600">{formatCurrency(revenue)}</span>

                {isAdmin && (
                    <Button
                        size="sm"
                        color="secondary"
                        isIconOnly
                        onPress={() => {
                            getModal({
                                isOpen: true,
                                modalHeader: TEXT.UPDATE(shiftName),
                                modalBody: <TargetShiftModal {...targetShift} />,
                            });
                        }}
                    >
                        <PencilSquareIcon className="w-4 h-4" />
                    </Button>
                )}

                <Button size="sm" color="primary" isIconOnly onPress={handleSyncInvoice}>
                    <ArrowPathIcon className="w-4 h-4" />
                </Button>
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
        </>
    );
}
