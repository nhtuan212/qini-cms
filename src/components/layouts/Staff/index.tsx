"use client";

import React, { useEffect } from "react";
import StaffModal from "./StaffModal";
import StaffActions from "./StaffActions";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useProfileStore } from "@/stores/useProfileStore";
import { useModalStore } from "@/stores/useModalStore";
import { StaffProps, useStaffStore } from "@/stores/useStaffStore";
import { ROLE } from "@/constants";
import { TEXT } from "@/constants/text";

export default function Staff() {
    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();
    const { isLoading, staff, getStaff } = useStaffStore();

    //** Effects */
    useEffect(() => {
        getStaff();
    }, [getStaff]);

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
                <div className="grid sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-2">
                    {staff &&
                        staff.length > 0 &&
                        staff?.map((item: StaffProps) => {
                            return (
                                <div
                                    key={item.id}
                                    className="flex flex-col justify-between h-36 p-3 border rounded shadow-md"
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="text-lg">{item.name}</p>
                                        {(profile.role === ROLE.ADMIN ||
                                            profile.role === ROLE.REPORT) && (
                                            <StaffActions item={item} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
}
