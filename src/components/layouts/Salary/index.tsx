"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SalaryTopContent from "./SalaryTopContent";
import useSalaryColumn from "./useSalaryColumn";
import { SalaryTotal } from "./SalaryForm/SalaryReview";
import Table from "@/components/Table";
import Accordion, { AccordionItem } from "@/components/Accordion";
import { useProfileStore } from "@/stores/useProfileStore";
import { StaffProps } from "@/stores/useStaffStore";
import { SalaryProps, useSalaryStore } from "@/stores/useSalaryStore";
import { formatCurrency, formatDate, isEmpty } from "@/utils";
import { ROLE, TEXT } from "@/constants";

export default function Salary({ staffById }: { staffById?: StaffProps }) {
    const searchParams = useSearchParams();

    //** Stores */
    const { profile } = useProfileStore();
    const { isLoading, salaries, getSalaries, cleanUpSalary } = useSalaryStore();

    //** Always call hooks at the top level */
    const columns = useSalaryColumn();

    //** Effects */
    useEffect(() => {
        if (staffById && !isEmpty(staffById)) {
            getSalaries({ staffId: staffById.id });
            return;
        }

        if (searchParams.get("startDate") && searchParams.get("endDate")) {
            getSalaries({
                startDate: searchParams.get("startDate"),
                endDate: searchParams.get("endDate"),
            });
            return;
        }

        getSalaries();
    }, [getSalaries, staffById, searchParams]);

    useEffect(() => {
        return () => {
            cleanUpSalary();
        };
    }, [cleanUpSalary]);

    //** Render */
    if (profile.role !== ROLE.ADMIN) {
        return (
            <Accordion>
                {salaries.map((salary: SalaryProps) => (
                    <AccordionItem
                        key={salary.id}
                        title={`${TEXT.SALARY_PERIOD}: ${formatDate(salary.startDate)} - ${formatDate(salary.endDate)}`}
                        subtitle={<b>{formatCurrency(salary.totalSalary)}</b>}
                    >
                        <SalaryTotal staffById={staffById} {...salary} />
                    </AccordionItem>
                ))}
            </Accordion>
        );
    }
    return (
        <Table
            rows={salaries}
            columns={columns}
            loading={isLoading}
            topContent={<SalaryTopContent />}
        />
    );
}
