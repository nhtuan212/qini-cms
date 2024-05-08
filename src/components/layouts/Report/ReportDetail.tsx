"use client";

import React from "react";
import moment from "moment";
import Modal from "@/components/Modal";
import Table from "@/components/Table";
import ReportDetailColumns from "./ReportDetailColumns";
import { useModalStore } from "@/stores/useModalStore";
import { currencyFormat } from "@/utils";
import { MODAL } from "@/constants";
import { TEXT } from "@/constants/text";
import { useReportsStore } from "@/stores/useReportsStore";

export default function ReportDetail() {
    //** Stores */
    const { reportDetail, isReportLoading } = useReportsStore();
    const { modalName, openModal } = useModalStore();

    //** Destructuring */
    const { revenue, createAt, reportsOnStaffs, shift } = reportDetail;

    //** Variables */
    const detailCreateAt =
        !isReportLoading && `${moment(createAt).format("DD/MM/YYYY")} - ${shift?.name}`;
    const detailRevenue = !isReportLoading ? currencyFormat(revenue as number) : 0;

    return (
        <Modal open={modalName === MODAL.REPORT_DETAIL} size="4xl" onClose={() => openModal("")}>
            <Modal.Header>
                {TEXT.REPORT_DATE}: {detailCreateAt}
            </Modal.Header>
            <Modal.Body>
                <div
                    dangerouslySetInnerHTML={{
                        __html: `<div class="flex justify-end mb-4">
                        ${TEXT.TOTAL_TARGET}: <span class="ml-2 font-bold text-primary">${detailRevenue}</span>
                    </div>`,
                    }}
                />
                <Table
                    columns={ReportDetailColumns()}
                    rows={reportsOnStaffs}
                    loading={isReportLoading}
                />
            </Modal.Body>
        </Modal>
    );
}
