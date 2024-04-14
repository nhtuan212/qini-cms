"use client";

import React from "react";
import moment from "moment";
import Modal from "@/components/Modal";
import Table from "@/components/Table";
import ReportColumns from "./ReportColumns";
import { useReportStore } from "@/stores/useReportStore";
import { useModalStore } from "@/stores/useModalStore";
import { currencyFormat, sumArray } from "@/utils";
import { MODAL } from "@/constants";
import { TEXT } from "@/constants/text";

export default function ReportDetail() {
    //** Stores */
    const { reportByRevenue } = useReportStore();
    const { modalName, openModal } = useModalStore();

    //** Variables */
    const totalRevenue = sumArray(reportByRevenue, "target");

    return (
        <Modal open={modalName === MODAL.REPORT_DETAIL} size="4xl" onClose={() => openModal("")}>
            <Modal.Header>
                <div>
                    {TEXT.REPORT_DATE}: {moment(reportByRevenue[0]?.createAt).format("DD/MM/YYYY")}
                </div>
            </Modal.Header>
            <Modal.Body>
                <div
                    dangerouslySetInnerHTML={{
                        __html: `<div class="flex justify-end mb-4">
                        ${TEXT.TOTAL_TARGET}: <span class="ml-2 font-bold text-primary">${currencyFormat(totalRevenue)}</span>
                    </div>`,
                    }}
                />
                <Table columns={ReportColumns()} rows={reportByRevenue} />
            </Modal.Body>
        </Modal>
    );
}
