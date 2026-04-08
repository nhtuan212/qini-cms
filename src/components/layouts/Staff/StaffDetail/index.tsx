import { useState } from "react";
import useStaffDetailColumns from "./useStaffDetailColumns";
import StaffDetailTopContent from "./StaffDetailTopContent";
import Table from "@/components/Table";
import { useTimeSheet } from "@/hooks";
import { getDateTime } from "@/utils";
import { StaffProps } from "@/types";

export default function StaffModalDetail({ staff }: { staff: StaffProps }) {
    //** States */
    const [dateValue, setDateValue] = useState({
        start: getDateTime().firstDayOfMonth,
        end: getDateTime().lastDayOfMonth,
    });

    //** Queries */
    const { isLoading, timeSheetRecords } = useTimeSheet(staff.id, {
        startDate: dateValue.start,
        endDate: dateValue.end,
    });

    //** Render */
    return (
        <Table
            columns={useStaffDetailColumns()}
            rows={timeSheetRecords.data}
            loading={isLoading}
            topContent={
                <StaffDetailTopContent
                    timeSheetRecords={timeSheetRecords}
                    dateRange={dateValue}
                    onChangeDateRange={setDateValue}
                />
            }
        />
    );
}
