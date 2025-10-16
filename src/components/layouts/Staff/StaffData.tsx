"use client";

import React from "react";
import { StaffProps } from "@/stores/useStaffStore";
import ValidateStaffPassword from "./ValidateStaffPassword";
import StaffActions from "./StaffActions";
import StaffDetail from "./StaffDetail";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useProfileStore } from "@/stores/useProfileStore";
import { useModalStore } from "@/stores/useModalStore";
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import { ROLE, TEXT } from "@/constants";
import { formatDate } from "@/utils";

interface StaffDataProps {
    data: StaffProps[];
}

export default function StaffData({ data }: StaffDataProps) {
    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();

    //** Render */
    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-4 gap-2">
            {data &&
                data.length > 0 &&
                data?.map((staff: StaffProps) => {
                    return (
                        <Card
                            key={staff.id}
                            className="min-h-36 flex flex-col justify-between gap-4 bg-gray-50 p-3 border rounded-lg shadow-md"
                        >
                            <div className="flex justify-between items-center">
                                {staff.name}

                                {(profile.role === ROLE.ADMIN || profile.role === ROLE.REPORT) && (
                                    <StaffActions item={staff} />
                                )}
                            </div>

                            <div className="flex items-center flex-wrap gap-2">
                                {(profile.role === ROLE.ADMIN || profile.role === ROLE.MANAGER) && (
                                    <Button
                                        variant="flat"
                                        color="success"
                                        className="flex-1"
                                        startContent={<BanknotesIcon className="w-5 h-5" />}
                                        onPress={() => {
                                            getModal({
                                                isOpen: true,
                                                size: "3xl",
                                                modalHeader: staff.name,
                                                modalBody: <StaffDetail staff={staff} />,
                                                modalFooter: <></>,
                                            });
                                        }}
                                    >
                                        {TEXT.TARGET}
                                    </Button>
                                )}

                                <Button
                                    variant="flat"
                                    className="flex-1"
                                    startContent={<ClockIcon className="w-5 h-5" />}
                                    onPress={() => {
                                        getModal({
                                            isOpen: true,
                                            modalHeader: staff.name,
                                            modalBody: <ValidateStaffPassword staff={staff} />,
                                            modalFooter: <></>,
                                        });
                                    }}
                                >
                                    {TEXT.TIME_SHEET}
                                </Button>
                            </div>

                            {!staff.isActive && (
                                <div className="bg-danger-50 p-2 border-l-3 border-danger-200 rounded-md">
                                    <div className="text-tiny text-gray-500">
                                        {`${TEXT.OFF_FROM}: ${formatDate(staff.updatedAt)}`}
                                    </div>
                                </div>
                            )}
                        </Card>
                    );
                })}
        </div>
    );
}
