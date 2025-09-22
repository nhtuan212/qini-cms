"use client";

import React, { useEffect } from "react";
import SalaryTopContent from "./SalaryTopContent";
import useSalaryColumn from "./useSalaryColumn";
import Table from "@/components/Table";
import { useSalaryStore } from "@/stores/useSalaryStore";

export default function Salary() {
    //** Stores */
    const { isLoading, salaries, getSalaries } = useSalaryStore();

    //** Effects */
    useEffect(() => {
        getSalaries();
    }, [getSalaries]);

    //** Render */
    return (
        <Table
            rows={salaries}
            columns={useSalaryColumn()}
            loading={isLoading}
            topContent={<SalaryTopContent />}
        />
    );
}
