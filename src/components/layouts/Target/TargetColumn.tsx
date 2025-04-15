"use client";

import React from "react";
import TargetModal from "./TargetModal";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import { Tooltip } from "@heroui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useProfileStore } from "@/stores/useProfileStore";
import { TargetProps, useTargetStore } from "@/stores/useTargetStore";
import { useModalStore } from "@/stores/useModalStore";
import { currencyFormat, formatDate } from "@/utils";
import { ROLE } from "@/constants";
import { TEXT } from "@/constants/text";
import { ModalActionProps } from "@/lib/types";

export default function TargetColumn() {
    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();
    const { getTargetById, deleteTarget, emptyTargetById } = useTargetStore();

    //** Functions */
    const handleDeleteTarget = (id: string) => {
        getModal({
            isOpen: true,
            action: ModalActionProps.UPDATE,
            modalHeader: TEXT.CONFIRM_DELETE,
            modalBody: (
                <ConfirmModal
                    onConfirm={async () => {
                        deleteTarget(id).then(() => getModal({ isOpen: false }));
                    }}
                />
            ),
        });
    };

    //** Render */
    const columns = [
        {
            key: TEXT.DATE,
            name: TEXT.DATE,
            className: "min-w-28",
            content: (params: TargetProps) => formatDate(params.row.targetAt),
        },
        {
            key: TEXT.NAME,
            name: TEXT.NAME,
            className: "min-w-60",
            content: (params: TargetProps) => (
                <Button
                    className="flex items-center gap-2"
                    variant="flat"
                    onPress={async () => {
                        await getTargetById(params.row.id);

                        await getModal({
                            isOpen: true,
                            size: "5xl",
                            modalHeader: params.row.name,
                            modalBody: <TargetModal />,
                            action: ModalActionProps.UPDATE,
                            isDismissable: false,
                            onClose: () => emptyTargetById(),
                        });
                    }}
                >
                    {`${params.row.name} ngày ${formatDate(params.row.targetAt)}`}
                </Button>
            ),
        },
        {
            key: TEXT.REVENUE,
            name: TEXT.REVENUE,
            className: "min-w-28",
            content: (params: TargetProps) => currencyFormat(params.row.revenue),
        },
        {
            key: TEXT.TRANSFER,
            name: TEXT.TRANSFER,
            className: "min-w-28",
            content: (params: TargetProps) => currencyFormat(params.row.transfer),
        },
        {
            key: TEXT.DEDUCTION,
            name: TEXT.DEDUCTION,
            className: "min-w-28",
            content: (params: TargetProps) => currencyFormat(params.row.deduction),
        },
        {
            key: TEXT.CASH,
            name: TEXT.CASH,
            className: "min-w-28",
            content: (params: TargetProps) => currencyFormat(params.row.cash),
        },
        {
            key: "actions",
            name: "",
            className: "min-w-28",
            content: (params: TargetProps) => {
                return (
                    <div className="flex justify-end gap-1">
                        {profile.role === ROLE.ADMIN && (
                            <Tooltip content={TEXT.DELETE}>
                                <Button
                                    className="min-w-0 bg-transparent p-0 text-default-500"
                                    onPress={() => handleDeleteTarget(params.row.id)}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </Button>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
    ];

    return columns;
}
