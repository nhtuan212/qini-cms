"use client";

import React, { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import SalaryTopContent from "./SalaryTopContent";
import useSalaryColumn from "./useSalaryColumn";
import SalaryTotal, { SalaryTotalProps } from "./SalaryTotal";
import { Accordion, AccordionItem } from "@/components/Accordion";
import Table from "@/components/Table";
import { StaffProps } from "@/stores/useStaffStore";
import { useSalary } from "@/hooks";
import { formatCurrency, formatDate } from "@/utils";
import { ROUTE, TEXT } from "@/constants";
import { SalaryParams } from "@/types";

export default function Salary({ staff }: { staff?: StaffProps }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    //** Variables */
    const columns = useSalaryColumn();

    const salaryParams = useMemo((): SalaryParams | undefined => {
        if (staff?.id) {
            return { staffId: staff.id };
        }

        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        if (startDate && endDate) {
            return { startDate, endDate };
        }

        return undefined; // fetch all
    }, [staff, searchParams]);

    //** Data fe */
    const { isFetching, salaries } = useSalary(salaryParams);

    //** Render */
    if (pathname !== ROUTE.SALARY) {
        return (
            <Accordion>
                {salaries.map(salary => (
                    <AccordionItem
                        key={salary.id}
                        title={`${TEXT.SALARY_PERIOD}: ${formatDate(salary.startDate)} - ${formatDate(salary.endDate)}`}
                        subtitle={<b>{formatCurrency(salary.total)}</b>}
                    >
                        <SalaryTotal {...(salary as SalaryTotalProps)} />
                    </AccordionItem>
                ))}
            </Accordion>
        );
    }

    return (
        <Table
            rows={salaries}
            columns={columns}
            loading={isFetching}
            className="[&>.tableContainer]:min-h-[45rem]"
            topContent={<SalaryTopContent />}
        />
    );
}
