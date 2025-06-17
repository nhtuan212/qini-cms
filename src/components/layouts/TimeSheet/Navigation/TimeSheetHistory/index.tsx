"use client";

import React from "react";
import { useTimeSheetHistoryColumns } from "./useTimeSheetHistoryColumns";
import Card from "@/components/Card";
import Table from "@/components/Table";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { TEXT } from "@/constants";

export default function TimeSheetHistory() {
    //** Stores */
    const { timeSheetByStaffId } = useTimeSheetStore();

    //** Variables */
    const columns = useTimeSheetHistoryColumns();

    //** Render */
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">{TEXT.TIME_SHEET_HISTORY}</h2>
                <p className="text-gray-600">Xem lại các lần chấm công gần đây</p>
            </div>
            <Card className="bg-primary-50">
                <Table columns={columns} rows={timeSheetByStaffId} />
            </Card>
        </div>
    );
}
