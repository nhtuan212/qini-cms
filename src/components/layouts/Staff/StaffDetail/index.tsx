"use client";

import React from "react";
import Table from "@/components/Table";
import StaffDetailColumns from "./StaffDetailColumns";
import StaffDetailTopContent from "./StaffDetailTopContent";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";

export default function StaffModalDetail() {
    //** Stores */
    const { isLoading } = useTimeSheetStore();

    //** Render */
    return (
        <Table
            className="[&>.tableContainer]:h-[40rem]"
            columns={StaffDetailColumns()}
            rows={[]}
            loading={isLoading}
            topContent={<StaffDetailTopContent />}
        />
    );
}
