"use client";

import { useMemo } from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import { useProfileStore } from "@/stores/useProfileStore";
import { EmployeeProps } from "@/types";

export default function Attendance({ employee }: { employee?: EmployeeProps }) {
    //** Store */
    const { profile } = useProfileStore();

    //** Variables */
    const currentEmployee = useMemo<EmployeeProps | null>(() => {
        if (employee) return employee;
        if (!profile?.id) return null;

        return { ...profile, userId: profile.id } as EmployeeProps;
    }, [employee, profile]);

    //** Render */
    if (!currentEmployee) return null;

    return (
        <div className="max-h-[80vh] sm:p-4 p-3 bg-gradient-to-br from-primary-300 to-primary-500 rounded-lg overflow-y-auto">
            <Header />
            <Navigation employee={currentEmployee} />
        </div>
    );
}
