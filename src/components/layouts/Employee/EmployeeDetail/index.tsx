import { useState } from "react";
import useEmployeeDetailColumns from "./useEmployeeDetailColumns";
import EmployeeDetailTopContent from "./EmployeeDetailTopContent";
import Table from "@/components/Table";
import { useTimeSheet } from "@/hooks";
import { getDateTime } from "@/utils";
import { EmployeeProps } from "@/types";

export default function EmployeeModalDetail({ employee }: { employee: EmployeeProps }) {
    //** States */
    const [dateValue, setDateValue] = useState({
        start: getDateTime().firstDayOfMonth,
        end: getDateTime().lastDayOfMonth,
    });

    //** Queries */
    const { isLoading, timeSheetRecords } = useTimeSheet(employee.id, {
        startDate: dateValue.start,
        endDate: dateValue.end,
    });

    //** Render */
    return (
        <Table
            columns={useEmployeeDetailColumns()}
            rows={timeSheetRecords.data}
            loading={isLoading}
            topContent={
                <EmployeeDetailTopContent
                    timeSheetRecords={timeSheetRecords}
                    dateRange={dateValue}
                    onChangeDateRange={setDateValue}
                />
            }
        />
    );
}
