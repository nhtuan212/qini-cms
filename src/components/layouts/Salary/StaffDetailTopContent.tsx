"use client";

import React, { useState } from "react";
import moment from "moment";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { useReportStore } from "@/stores/useReportStore";
import { TEXT } from "@/constants/text";
import { getCurrentMonth } from "@/utils";

export default function StaffDetailTopContent() {
    //** Stores */
    const { getSalaryByStaff } = useReportStore();

    //** States */
    const [dateValue, setDateValue] = useState<DateValueType>(getCurrentMonth());

    //** Functions */
    const handleValueChange = (newValue: DateValueType) => {
        getSalaryByStaff(newValue);
        setDateValue(newValue);
    };

    return (
        <div className="flex flex-col gap-4 mb-5">
            <div className="flex justify-between items-center gap-3">
                <div className="flex-1">
                    <h3 className="title">{`${TEXT.PAYROLL_MONTH} ${moment(dateValue?.startDate).format("MM/YYYY")}`}</h3>
                </div>
                <div className="flex-1">
                    <Datepicker
                        containerClassName="datepicker"
                        value={dateValue}
                        onChange={handleValueChange}
                        useRange={false}
                        displayFormat={"DD/MM/YYYY"}
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
}
