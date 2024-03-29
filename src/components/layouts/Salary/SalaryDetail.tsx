"use client";

import React from "react";
import Image from "next/image";
import clsx from "clsx";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { useReportStore } from "@/stores/useReportStore";
import { currencyFormat } from "@/utils";
import { MODAL } from "@/constants";
import { TEXT } from "@/constants/text";

export default function SalaryDetail() {
    //** Stores */
    const { staffById } = useStaffStore();
    const { modalName, openModal } = useModalStore();
    const { salaryByStaff } = useReportStore();

    //** Variables */
    const { performance, rank, rate, staffName, total, totalTarget, totalTime } =
        salaryByStaff.find(item => item.staffId === staffById.id) || {};

    const detailColumn = clsx("flex border-b last:border-b-0");
    const detailColumnItem = clsx(
        "px-4 py-2",
        "first:border-r first:flex-[2]",
        "last:flex last:items-center last:flex-1",
    );

    //** Functions */
    const renderRank = () => {
        switch (rank) {
            case "A":
                return (
                    <div>
                        <Image src="/assets/1st.svg" width={40} height={40} alt="1st" />
                    </div>
                );
            case "B":
                return (
                    <div>
                        <Image src="/assets/2nd.svg" width={30} height={30} alt="2nd" />
                    </div>
                );
            default:
                return (
                    <div>
                        <Image src="/assets/normalRank.svg" width={20} height={20} alt="2nd" />
                    </div>
                );
        }
    };

    return (
        <Modal
            isOpen={modalName === MODAL.SALARY_DETAIL}
            size="2xl"
            onOpenChange={() => openModal("")}
        >
            <Modal.Header>
                <div className="title flex items-center gap-2">
                    {renderRank()}
                    {`${TEXT.SALARY_OF} ${staffName}`}
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="border">
                    <div className={detailColumn}>
                        <div className={detailColumnItem}>{TEXT.SALARY_EACH_TIME}</div>
                        <div className={detailColumnItem}>{currencyFormat(22500)}</div>
                    </div>
                    <div className={detailColumn}>
                        <div className={detailColumnItem}>{TEXT.TIME_NUMBER}</div>
                        <div className={detailColumnItem}>{totalTime}</div>
                    </div>
                    <div className={detailColumn}>
                        <div className={detailColumnItem}>{TEXT.REVENUE}</div>
                        <div className={detailColumnItem}>{currencyFormat(totalTarget || 0)}</div>
                    </div>
                    <div className={detailColumn}>
                        <div className={detailColumnItem}>
                            {TEXT.PERFORMANCE}
                            <p className="font-bold text-sm">{` (${TEXT.REVENUE} / ${TEXT.TIME_NUMBER})`}</p>
                        </div>
                        <div className={detailColumnItem}>{currencyFormat(performance || 0)}</div>
                    </div>
                    <div className={detailColumn}>
                        <div className={detailColumnItem}>{TEXT.RATE}</div>
                        <div className={detailColumnItem}>{rate}</div>
                    </div>
                    <div className={detailColumn}>
                        <div className={detailColumnItem}>
                            {TEXT.SALARY_BY_TIME}
                            <p className="font-bold text-sm">{` (${TEXT.SALARY_EACH_TIME} * ${TEXT.TIME_NUMBER})`}</p>
                        </div>
                        <div className={clsx(detailColumnItem, "font-bold")}>
                            {currencyFormat((totalTime || 0) * 22500)}
                        </div>
                    </div>
                    <div className={detailColumn}>
                        <div className={detailColumnItem}>
                            {TEXT.SALARY_BY_PERFORMANCE}
                            <p className="font-bold text-sm">{` (${TEXT.REVENUE} * ${TEXT.RATE})`}</p>
                        </div>
                        <div className={clsx(detailColumnItem, "font-bold")}>
                            {currencyFormat((totalTarget || 0) * (rate as number))}
                        </div>
                    </div>
                    <div className={detailColumn}>
                        <div className={detailColumnItem}>
                            {TEXT.TOTAL}
                            <p className="font-bold text-sm">{` (${TEXT.SALARY_BY_TIME} + ${TEXT.SALARY_BY_PERFORMANCE})`}</p>
                        </div>
                        <div className={clsx(detailColumnItem, "font-bold")}>
                            {currencyFormat(total || 0)}
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button>
                    <ClipboardDocumentIcon className="w-5 mr-2" />
                    {TEXT.COPY}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
