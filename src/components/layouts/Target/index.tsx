"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import NotFound from "@/app/not-found";
import TargetList from "./TargetList";
import TargetFilter from "./TargetFilter";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useProfileStore } from "@/stores/useProfileStore";
import { useShiftStore } from "@/stores/useShiftsStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { useTargetStore } from "@/stores/useTargetStore";
import { useLocationCheck } from "@/hooks/useLocationCheck";
import { camelCaseQueryString, getDateTime } from "@/utils";
import { ROLE, TEXT } from "@/constants";

export default function Target() {
    const searchParams = useSearchParams();

    //** Stores */
    const { profile } = useProfileStore();
    const { targets, getTarget } = useTargetStore();
    const { getShifts } = useShiftStore();
    const { getStaff } = useStaffStore();

    //** Custom Hooks */
    const { isLocationValid } = useLocationCheck();

    //** Effects */
    useEffect(() => {
        getShifts();
        getStaff();
    }, [getShifts, getStaff]);

    useEffect(() => {
        const params = camelCaseQueryString({
            startDate: searchParams.get("startDate") || getDateTime().firstDayOfMonth,
            endDate: searchParams.get("endDate") || getDateTime().lastDayOfMonth,
        });

        getTarget(params);
    }, [searchParams, getTarget]);

    //** Render */
    if (isLocationValid !== null && !isLocationValid && profile?.role !== ROLE.ADMIN) {
        return <NotFound />;
    }

    return (
        <div className="flex flex-col gap-y-4 rounded-xl">
            <h2 className="flex items-center gap-x-2 py-4">
                <CalendarIcon className="w-6 h-6" />
                {TEXT.LIST_TARGET}
            </h2>

            <TargetFilter />

            <TargetList targets={targets} />
        </div>
    );
}
