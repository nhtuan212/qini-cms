"use client";

import React, { useEffect } from "react";
import Button from "@/components/Button";
import TargetDetail from "./TargetDetail";
import { currencyFormat } from "@/utils";
import { TEXT } from "@/constants/text";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { MODAL } from "@/constants";
import { StaffProps } from "@/types/staffProps";

export default function Target() {
    //** Stores */
    const { openModal } = useModalStore();
    const { staff, getStaff } = useStaffStore();

    //** States */
    const [name, setName] = React.useState<string>("");

    //** Functions */
    const handleOpenModal = ({ name }: { name: string }) => {
        setName(name);
        openModal(MODAL.TARGET_DETAIL);
    };

    //** Effects */
    useEffect(() => {
        getStaff();
    }, [getStaff]);

    return (
        <>
            <div className="flex flex-col justify-center py-32">
                <div className="grid sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-2">
                    {staff.map((item: StaffProps) => (
                        <div
                            key={item.id}
                            className="flex flex-col justify-between h-36 p-3 border rounded shadow-md"
                        >
                            <p className="text-lg">{item.name}</p>
                            <p>
                                {`${TEXT.TARGET}: `}
                                <b className="text-lg text-primary">{currencyFormat(10000000)}</b>
                            </p>

                            <Button
                                className="h-auto justify-end bg-transparent gap-1 p-0 text-link hover:underline"
                                onClick={() =>
                                    handleOpenModal({
                                        name: item.name,
                                    })
                                }
                            >
                                <p className="text-sm">{TEXT.DETAIL}</p>
                                <ChevronDoubleRightIcon className="w-5" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popup show detail */}
            <TargetDetail name={name} />
        </>
    );
}
