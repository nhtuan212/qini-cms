"use client";

import React, { useEffect } from "react";
import StaffModal from "./StaffModal";
import StaffActions from "./StaffActions";
import ValidateStaffPassword from "./ValidateStaffPassword";
import StaffDetail from "./StaffDetail";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Card from "@/components/Card";
import { BanknotesIcon, ClockIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useProfileStore } from "@/stores/useProfileStore";
import { useModalStore } from "@/stores/useModalStore";
import { StaffProps, useStaffStore } from "@/stores/useStaffStore";
import { ROLE, TEXT } from "@/constants";

export default function Staff() {
    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();
    const { isLoading, staff, getStaff } = useStaffStore();

    //** Effects */
    useEffect(() => {
        getStaff();
    }, [getStaff]);

    //** Render */
    return (
        <>
            {isLoading && <Loading />}

            <div className="flex justify-between items-center">
                <div className="title">{TEXT.STAFF}</div>
                <Button
                    onPress={() =>
                        getModal({
                            isOpen: true,
                            modalHeader: TEXT.ADD_STAFF,
                            modalBody: <StaffModal />,
                        })
                    }
                >
                    {TEXT.ADD_NEW}
                    <PlusIcon className="w-5 ml-2" />
                </Button>
            </div>

            <div className="flex flex-col justify-center mt-4">
                <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-4 gap-2">
                    {staff &&
                        staff.length > 0 &&
                        staff?.map((staff: StaffProps) => {
                            return (
                                <Card
                                    key={staff.id}
                                    className="h-36 flex flex-col justify-between gap-4 bg-gray-50 p-3 border rounded-lg shadow-md"
                                >
                                    <div className="flex justify-between items-center">
                                        {staff.name}

                                        {(profile.role === ROLE.ADMIN ||
                                            profile.role === ROLE.REPORT) && (
                                            <StaffActions item={staff} />
                                        )}
                                    </div>
                                    <div className="flex items-center flex-wrap gap-2">
                                        {(profile.role === ROLE.ADMIN ||
                                            profile.role === ROLE.MANAGER) && (
                                            <Button
                                                variant="flat"
                                                color="success"
                                                className="flex-1"
                                                startContent={<BanknotesIcon className="w-5 h-5" />}
                                                onPress={() => {
                                                    getModal({
                                                        isOpen: true,
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
                                                    modalBody: (
                                                        <ValidateStaffPassword staff={staff} />
                                                    ),
                                                    modalFooter: <></>,
                                                });
                                            }}
                                        >
                                            {TEXT.TIME_SHEET}
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                </div>
            </div>
        </>
    );
}
