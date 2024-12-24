"use client";

import React, { useEffect } from "react";
import dayjs from "dayjs";
import ReportDetailColumns from "./ReportDetailColumns";
import Table from "@/components/Table";
import Input from "@/components/Input";
import { useModalStore } from "@/stores/useModalStore";
import { useReportsStore } from "@/stores/useReportsStore";
import { currencyFormat } from "@/utils";
import { TEXT } from "@/constants/text";

export default function ReportDetailModalModal() {
    //** Stores */
    const { modal } = useModalStore();
    const { isLoading, reportById, resetReport } = useReportsStore();

    //** Spread syntax */
    const { revenue, transfer, cash, deduction, createAt, reportsOnStaffs, shift } = reportById;

    //** Effects */
    useEffect(() => {
        if (!modal.isOpen) {
            resetReport();
        }
    }, [modal, resetReport]);

    //** Render */
    return (
        <>
            <p>{`${dayjs(createAt).format("DD/MM/YYYY")} - ${shift?.name}`}</p>

            <div className="grid md:grid-cols-3 justify-end gap-2">
                <div className="md:col-start-2 text-right">
                    {TEXT.TRANSFER}:
                    <span className="ml-2 font-bold text-primary">
                        {currencyFormat(transfer as number)}
                    </span>
                </div>

                <div className="md:col-start-3 text-right">
                    {TEXT.DEDUCTION}:
                    <span className="ml-2 font-bold text-primary">
                        {currencyFormat(deduction as number)}
                    </span>
                </div>

                <div className="md:col-start-3 text-right">
                    {TEXT.CASH}:
                    <span className="ml-2 font-bold text-primary">
                        {currencyFormat(cash as number)}
                    </span>
                </div>

                <div className="md:col-start-3 text-right">
                    {TEXT.TOTAL_TARGET}:
                    <span className="ml-2 font-bold text-primary">
                        {currencyFormat(revenue as number)}
                    </span>
                </div>
            </div>

            <Table
                className="min-h-10 [&>.tableContainer]:h-60"
                columns={ReportDetailColumns()}
                rows={reportsOnStaffs}
                loading={isLoading}
            />

            <Input
                type="textarea"
                minRows={4}
                readOnly
                label={TEXT.NOTE}
                value={reportById?.description || ""}
            />
        </>
    );
}
