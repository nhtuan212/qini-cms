"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table";
import SalaryColumns from "./SalaryColumns";
import StaffDetailTopContent from "./StaffDetailTopContent";
import SalaryDetail from "./SalaryDetail";
import { useReportStore } from "@/stores/useReportStore";
import { SalaryReportProps } from "@/stores/models/ReportModel";
import { getCurrentMonth, isEmpty } from "@/utils";

export default function SalaryPay() {
    //** Stores */
    const { getReport, getSalaryByStaff, salaryByStaff } = useReportStore();

    //** States */
    const [salarySortList, setSalarySortList] = useState<SalaryReportProps[]>(salaryByStaff);

    //** Effects */
    useEffect(() => {
        getReport();
        getSalaryByStaff(getCurrentMonth());
    }, [getReport, getSalaryByStaff]);

    useEffect(() => {
        // Sort by performance rank
        !isEmpty(salaryByStaff) &&
            setSalarySortList(
                (salaryByStaff as any).sort((a: any, b: any) =>
                    a.performance < b.performance ? 1 : a.performance > b.performance ? -1 : 0,
                ),
            );
    }, [salaryByStaff]);

    return (
        <>
            <Table
                columns={SalaryColumns()}
                rows={salarySortList}
                topContent={<StaffDetailTopContent />}
            />

            {/* Modal salary detail */}
            <SalaryDetail />
        </>
    );
}
