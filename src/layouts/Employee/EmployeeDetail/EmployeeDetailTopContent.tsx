import DateRangePicker from "@/components/DateRangePicker";
import { RangeValue } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { formatCurrency } from "@/utils";
import { TEXT } from "@/constants";
import { TimesheetRecordProps } from "@/types";

export default function TargetTopContent({
    timeSheetRecords,
    dateRange,
    onChangeDateRange,
    isTarget = true,
}: {
    timeSheetRecords: TimesheetRecordProps;
    dateRange: RangeValue<CalendarDate>;
    onChangeDateRange: (dateRange: RangeValue<CalendarDate>) => void;
    isTarget?: boolean;
}) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex-1 flex flex-wrap gap-4 items-center">
                <DateRangePicker
                    label={TEXT.DATE_PICKER}
                    className="flex-1 w-fit"
                    value={dateRange}
                    onChange={newValue =>
                        onChangeDateRange({
                            start: newValue?.start as CalendarDate,
                            end: newValue?.end as CalendarDate,
                        })
                    }
                />
            </div>

            <div className="flex-1 flex justify-between items-center">
                <div>{TEXT.TIME_NUMBER}:</div>
                <b>{timeSheetRecords.totalWorkingHours}</b>
            </div>

            {isTarget && (
                <div className="flex-1 flex justify-between items-center">
                    <div>{TEXT.TOTAL_TARGET}:</div>
                    <b>{formatCurrency(timeSheetRecords.totalTarget)}</b>
                </div>
            )}
        </div>
    );
}
