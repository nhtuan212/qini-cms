"use client";

import React, { useEffect } from "react";
import StaffDetailColumns from "./StaffDetailColumns";
import StaffDetailTopContent from "./StaffDetailTopContent";
import Table from "@/components/Table";
import { useStaffStore } from "@/stores/useStaffStore";
import { useReportsOnStaffsStore } from "@/stores/useReportsOnStaffsStore";
import { getDateTime } from "@/utils";
import { useParams } from "next/navigation";

export default function StaffModalDetail() {
    const { slug } = useParams();

    //** Stores */
    const { getStaffById } = useStaffStore();
    const { isLoading, reportsOnStaff, getReportsOnStaff } = useReportsOnStaffsStore();

    //** Effects */
    useEffect(() => {
        getReportsOnStaff({
            staffId: slug,
            startDate: getDateTime().firstDayOfMonth.toString(),
            endDate: getDateTime().lastDayOfMonth.toString(),
        });

        getStaffById(slug);
    }, [getReportsOnStaff, getStaffById, slug]);

    return (
        <Table
            className="[&>.tableContainer]:h-full"
            columns={StaffDetailColumns()}
            rows={reportsOnStaff}
            loading={isLoading}
            topContent={<StaffDetailTopContent />}
        />
    );
}
