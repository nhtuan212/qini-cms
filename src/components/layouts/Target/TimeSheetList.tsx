import React from "react";
import { TimeSheetProps } from "@/stores/useTimeSheetStore";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { TEXT } from "@/constants/text";

export default function TimeSheetList({ timeSheets }: { timeSheets: TimeSheetProps }) {
    return (
        <div className="mt-4">
            <h3 className="mb-2 font-semibold text-gray-900">{TEXT.TIME_SHEET}</h3>

            <div className="mt-3 pt-3 border-t border-gray-200">
                <h6 className="flex items-center gap-x-2 mb-2 text-sm font-medium text-gray-700">
                    <UserGroupIcon className="w-4 h-4" />
                    Chấm công ({timeSheets.length} nhân viên)
                </h6>

                <div className="space-y-2">
                    {timeSheets.map((timeSheet: TimeSheetProps) => (
                        <div key={timeSheet.id} className="bg-primary-100 rounded-md p-2">
                            <div className="flex justify-between items-center text-xs px-3 py-2">
                                <div className="font-medium text-gray-800">
                                    {timeSheet.staffName || "Chưa đặt tên"}
                                    {/* <div className="text-xs text-gray-600">
                                        {`${TEXT.TARGET}: ${formatCurrency(timeSheet.target)}`}
                                    </div> */}
                                </div>

                                <span className="font-medium text-gray-900">
                                    {`${timeSheet.checkIn || "--"} - ${timeSheet.checkOut || "--"} (${timeSheet.workingHours}h)`}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
