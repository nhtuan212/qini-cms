"use client";

import React, { useEffect } from "react";
import Button from "@/components/Button";
import Table from "@/components/Table";
import SalaryColumns from "./SalaryColumns";
import StaffDetailTopContent from "./StaffDetailTopContent";
import { useReportStore } from "@/stores/useReportStore";
import { TEXT } from "@/constants/text";
import { getCurrentMonth } from "@/utils";

export default function SalaryPay() {
    //** Stores */
    const { getReport, salaryByStaff, getSalaryByStaff } = useReportStore();

    //** Effects */
    useEffect(() => {
        getReport();
        getSalaryByStaff(getCurrentMonth());
    }, [getReport, getSalaryByStaff]);

    return (
        <>
            <Table
                columns={SalaryColumns()}
                rows={salaryByStaff}
                topContent={<StaffDetailTopContent />}
            />

            <div className="flex flex-row-reverse mt-4">
                <Button type="submit">{TEXT.SAVE}</Button>
            </div>
        </>
    );
}
