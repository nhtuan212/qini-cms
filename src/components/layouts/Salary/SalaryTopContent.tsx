"use client";

import React from "react";
import SalaryForm from "./SalaryForm";
import Button from "@/components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useProfileStore } from "@/stores/useProfileStore";
import { useModalStore } from "@/stores/useModalStore";
import { ROLE, TEXT } from "@/constants";

export default function SalaryTopContent() {
    //** Store */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();

    //** Render */
    return (
        <>
            <h3 className="title text-black">{TEXT.SALARY}</h3>

            <div className="flex justify-between items-center">
                <div>Input</div>

                {profile.role === ROLE.ADMIN && (
                    <Button
                        startContent={<PlusIcon className="w-5 h-5" />}
                        onPress={() => {
                            getModal({
                                isOpen: true,
                                size: "5xl",
                                modalHeader: TEXT.CALCULATE_SALARY,
                                modalBody: <SalaryForm />,
                            });
                        }}
                    >
                        {TEXT.ADD_NEW}
                    </Button>
                )}
            </div>
        </>
    );
}
