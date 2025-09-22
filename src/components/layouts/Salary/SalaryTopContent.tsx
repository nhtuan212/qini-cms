"use client";

import React from "react";
import SalaryForm from "./SalaryForm";
import Button from "@/components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { TEXT } from "@/constants";

export default function SalaryTopContent() {
    //** Store */
    const { getModal } = useModalStore();

    //** Render */
    return (
        <>
            <h3 className="title text-black">{TEXT.SALARY}</h3>

            <div className="flex justify-between items-center">
                <div>Input</div>

                <Button
                    startContent={<PlusIcon className="w-5 h-5" />}
                    onPress={() => {
                        getModal({
                            isOpen: true,
                            size: "full",
                            modalHeader: TEXT.CALCULATE_SALARY,
                            modalBody: <SalaryForm />,
                        });
                    }}
                >
                    {TEXT.ADD_NEW}
                </Button>
            </div>
        </>
    );
}
