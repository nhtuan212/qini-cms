"use client";

import React from "react";
import moment from "moment";
import Modal from "@/components/Modal";
import Table from "@/components/Table";
import Input from "@/components/Input";
import ReportDetailColumns from "./ReportDetailColumns";
import { useModalStore } from "@/stores/useModalStore";
import { currencyFormat } from "@/utils";
import { MODAL } from "@/constants";
import { TEXT } from "@/constants/text";
import { useReportsStore } from "@/stores/useReportsStore";

export default function ReportDetail() {
    //** Stores */
    const { reportById, isLoading } = useReportsStore();
    const { modalName, openModal } = useModalStore();

    //** Destructuring */
    const { revenue, transfer, cash, deduction, createAt, reportsOnStaffs, shift } = reportById;

    //** Variables */
    const detailCreateAt =
        !isLoading && `${moment(createAt).format("DD/MM/YYYY")} - ${shift?.name}`;
    const detailRevenue = !isLoading ? currencyFormat(revenue as number) : 0;
    const transferRevenue = !isLoading ? currencyFormat(transfer as number) : 0;
    const cashRevenue = !isLoading ? currencyFormat(cash as number) : 0;
    const deductionRevenue = !isLoading ? currencyFormat(deduction as number) : 0;

    return (
        <Modal open={modalName === MODAL.REPORT_DETAIL} size="4xl" onClose={() => openModal("")}>
            <Modal.Header>
                {TEXT.REPORT_DATE}: {detailCreateAt}
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4">
                <div className="grid md:grid-cols-4 grid-cols-2 justify-end gap-2">
                    <div className="md:col-start-3 text-right">
                        {TEXT.TRANSFER}:
                        <span className="ml-2 font-bold text-primary">{transferRevenue}</span>
                    </div>

                    <div className="md:col-start-4 text-right">
                        {TEXT.DEDUCTION}:
                        <span className="ml-2 font-bold text-primary">{deductionRevenue}</span>
                    </div>

                    <div className="md:col-start-4 text-right">
                        {TEXT.CASH}:
                        <span className="ml-2 font-bold text-primary">{cashRevenue}</span>
                    </div>

                    <div className="md:col-start-4 col-start-2 text-right">
                        {TEXT.TOTAL_TARGET}:
                        <span className="ml-2 font-bold text-primary">{detailRevenue}</span>
                    </div>
                </div>
                <Table columns={ReportDetailColumns()} rows={reportsOnStaffs} loading={isLoading} />

                <Input
                    type="textarea"
                    minRows={4}
                    readOnly
                    label={TEXT.NOTE}
                    value={reportById?.description || ""}
                />
            </Modal.Body>
        </Modal>
    );
}
