"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import TargetList from "./TargetList";
import Button from "@/components/Button";
import { CalendarIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useShiftStore } from "@/stores/useShiftsStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { useTargetStore } from "@/stores/useTargetStore";
import { snakeCaseQueryString } from "@/utils";
import { TEXT } from "@/constants";

export default function Target() {
    const searchParams = useSearchParams();

    //** Stores */
    const { targets, createTarget, getTarget } = useTargetStore();
    const { getShifts } = useShiftStore();
    const { getStaff } = useStaffStore();

    //** Effects */
    useEffect(() => {
        getShifts();
        getStaff();
    }, [getShifts, getStaff]);

    useEffect(() => {
        const params = snakeCaseQueryString(searchParams);

        getTarget(params);
    }, [searchParams, getTarget]);

    //** Render */
    return (
        <div className="flex flex-col gap-y-4 rounded-xl">
            <div className="flex justify-between items-center">
                <h2 className="flex items-center gap-x-2 py-4">
                    <CalendarIcon className="w-6 h-6" />
                    {TEXT.LIST_TARGET}
                </h2>

                <Button
                    startContent={<PlusIcon className="w-4 h-4" />}
                    onPress={() => {
                        createTarget({
                            name: TEXT.TARGET,
                            targetAt: new Date().toISOString(),
                        });
                    }}
                >
                    {TEXT.ADD_TARGET}
                </Button>
            </div>

            <TargetList targets={targets} />
        </div>
    );
}
