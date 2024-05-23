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
import DatePickerNextUI from "@/components/DatePickerNextUI";
import { parseDate } from "@internationalized/date";
import moment from "moment";
import { DatePicker } from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";

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

    //** Datepicker */
    const [value, setValue] = React.useState<any>(
        parseDate(moment(new Date("2024-05-01")).format("YYYY-MM-DD")),
    );
    const handleSetDate = (date: any) => {
        setValue(parseDate(moment(new Date(date)).format("YYYY-MM-DD")));

        console.log({
            moment: moment(new Date(`${date} ${moment().format("hh:mm")}`)).format(
                "YYYY-MM-DD hh:mm:ss",
            ),
            moment24H: moment(new Date(`${date} ${moment().format("HH:mm")}`)).format(
                "YYYY-MM-DD HH:mm:ss",
            ),
        });
    };

    const [date, setDate] = React.useState<any>(
        parseDate(moment(new Date("2024-05-01")).format("YYYY-MM-DD")),
        // parseAbsoluteToLocal("2021-04-07T18:45:22Z"),
    );

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

            <div className="flex flex-col gap-4 mb-4">
                <I18nProvider locale="vi-VN">
                    <DatePicker
                        // showMonthAndYearPickers
                        variant="bordered"
                        className="max-w-md"
                        label="Appointment date"
                        value={date}
                        onChange={setDate}
                    />
                </I18nProvider>
                <DatePickerNextUI
                    className="max-w-[284px]"
                    label="Date (controlled)"
                    value={value}
                    onChange={date => handleSetDate(date)}
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

            <div>
                <Table
                    columns={Columns()}
                    rows={rows}
                    selectionMode
                    paginationMode={{ pageSize: 5, pageSizeOptions: [5, 10] }}
                />
            </div>
        </>
    );
}
