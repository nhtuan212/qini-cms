"use client";

import React, { useState } from "react";
import Table from "@/components/Table";
import Columns from "./columns";
import { rows } from "@/components/layouts/Example/apis";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { useModalStore } from "@/stores/useModalStore";
import DatePickerComponent from "@/components/DatePicker";
import { DateValueType } from "react-tailwindcss-datepicker";
import Switch from "@/components/Switch";
import { SunIcon } from "@heroicons/react/24/outline";
import { MoonIcon } from "@heroicons/react/24/outline";

export default function Example() {
    //** Stores */
    const { modalName, openModal } = useModalStore();
    const [themeMode, setThemeMode] = useState<string | undefined>("");

    //** States */
    const [dateValue, setDateValue] = useState<DateValueType>({
        startDate: null,
        endDate: null,
    });

    //** Functions */
    const handleValueChange = (newValue: DateValueType) => {
        setDateValue(newValue);
    };

    const onModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setThemeMode(event.target.checked ? "light" : "dark");
    };

    return (
        <>
            <div className="mb-4">
                <Button onClick={() => openModal("Test")}>Button</Button>

                <Modal open={modalName === "Test"} size="4xl" onClose={() => openModal("")}>
                    <Modal.Header>
                        <div>Modal Header</div>
                    </Modal.Header>
                    <Modal.Body>
                        <div>Modal Body</div>
                    </Modal.Body>
                </Modal>
            </div>
            <div className="flex flex-col gap-4 mb-4">
                <Input placeholder="Input" />
                <DatePickerComponent
                    useRange={false}
                    asSingle={true}
                    value={dateValue}
                    onChange={handleValueChange}
                />
            </div>
            <div className="mb-4">
                <Switch
                    // className="invisible"
                    defaultSelected
                    isSelected={themeMode === "light"}
                    color="success"
                    startContent={<SunIcon className="w-5" />}
                    endContent={<MoonIcon className="w-5" />}
                    onChange={event => onModeChange(event)}
                />
            </div>
            <Table
                columns={Columns()}
                rows={rows}
                selectionMode
                paginationMode={{ pageSize: 5, pageSizeOptions: [5, 10] }}
            />
        </>
    );
}
