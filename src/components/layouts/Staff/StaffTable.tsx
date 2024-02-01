"use client";

import React, { useEffect } from "react";
import Table from "@/components/Table";
import StaffColumns from "./StaffColumns";
import TopContent from "./TopContent";
import AddStaff from "./AddStaff";
import { useStaffStore } from "@/stores/useStaffStore";
import { StaffProps } from "@/types/staffProps";

export default function StaffTable() {
    //** Stores */
    const { staff, staffId, getStaff } = useStaffStore();

    //** Effects */
    useEffect(() => {
        getStaff();
    }, [getStaff]);

    return (
        <>
            <Table
                columns={StaffColumns()}
                topContent={<TopContent />}
                rows={staff}
                isPagination
                pageSize={10}
                rowsPerPage={[10, 15]}
            />

            {/* Popup add new staff */}
            <AddStaff staffId={staffId as StaffProps} />
        </>
    );
}
