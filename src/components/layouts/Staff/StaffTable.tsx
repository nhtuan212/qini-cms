"use client";

import React, { useEffect } from "react";
import Table from "@/components/Table";
import StaffColumns from "./StaffColumns";
import TopContent from "./TopContent";
import StaffModal from "./StaffModal";
import { useStaffStore } from "@/stores/useStaffStore";

export default function StaffTable() {
    //** Stores */
    const { staff, getStaff } = useStaffStore();

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
            <StaffModal />
        </>
    );
}
