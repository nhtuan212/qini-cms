"use client";

import React, { useEffect } from "react";
import Button from "@/components/Button";
import AddStaff from "./AddStaff";
import StaffActions from "./StaffActions";
import StaffDetail from "./Detail";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useProfileStore } from "@/stores/useProfileStore";
import { useModalStore } from "@/stores/useModalStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { MODAL, ROLE } from "@/constants";
import { StaffProps } from "@/types/staffProps";
import { TEXT } from "@/constants/text";

export default function Staff() {
    //** Stores */
    const { profile } = useProfileStore();
    const { openModal } = useModalStore();
    const { staff, getStaff } = useStaffStore();

    //** Effects */
    useEffect(() => {
        getStaff();
    }, [getStaff]);

    return (
        <>
            <div className="flex justify-between items-center">
                <div className="title">{TEXT.STAFF}</div>
                <Button onClick={() => openModal(MODAL.ADD_STAFF)}>
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
                                        {profile.role === ROLE.ADMIN && (
                                            <StaffActions item={item} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Popup add new staff */}
            <AddStaff />

            {/* Popup staff detail */}
            <StaffDetail />
        </>
    );
}
