"use client";

import React from "react";
import ReportModal from "./ReportModal";
import Button from "../../Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { TEXT } from "@/constants/text";

export default function TopContent() {
    //** Stores */
    const { getModal } = useModalStore();

    //** Render */
    return (
        <div className="flex flex-col gap-4 mb-5">
            <div className="flex justify-between items-center gap-3">
                <div className="title">{TEXT.REPORT}</div>
                <div className="flex gap-3">
                    <Button
                        onPress={() =>
                            getModal({
                                isOpen: true,
                                size: "3xl",
                                modalHeader: TEXT.ADD_REPORT,
                                modalBody: <ReportModal />,
                            })
                        }
                    >
                        {TEXT.ADD_NEW}
                        <PlusIcon className="w-5 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
