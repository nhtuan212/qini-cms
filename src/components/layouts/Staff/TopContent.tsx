"use client";

import React from "react";
import Button from "../../Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { TEXT } from "@/constants/text";
import { MODAL } from "@/constants";

export default function TopContent() {
    //** Stores */
    const { openModal } = useModalStore();

    return (
        <div className="flex flex-col gap-4 mb-5">
            <div className="flex justify-between items-center gap-3">
                <div className="title">{TEXT.STAFF}</div>
                <div className="flex gap-3">
                    <Button onClick={() => openModal(MODAL.ADD_STAFF)}>
                        {TEXT.ADD_NEW}
                        <PlusIcon className="w-5 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
