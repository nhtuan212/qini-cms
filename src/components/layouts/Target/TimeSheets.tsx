import React from "react";
import TimeSheetModal from "./TimeSheetModal";
import Button from "@/components/Button";
import { PencilIcon, PlusIcon, TrashIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { TimeSheetProps, useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { useModalStore } from "@/stores/useModalStore";
import { TargetShiftProps } from "@/stores/useTargetShiftStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { ROLE, TEXT } from "@/constants";

export default function TimeSheets({
    targetAt,
    targetShift,
    timeSheets,
}: {
    targetAt: string;
    targetShift: TargetShiftProps;
    timeSheets: TimeSheetProps;
}) {
    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();
    const { deleteTimeSheet } = useTimeSheetStore();

    //** Render */
    return (
        <div className="mt-4">
            <h3 className="mb-2 font-semibold text-gray-900">{TEXT.TIME_SHEET}</h3>

            <div className="flex flex-col gap-y-2 mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <h6 className="flex items-center gap-x-2 mb-2 text-sm font-medium text-gray-700">
                        <UserGroupIcon className="w-4 h-4" />
                        Chấm công ({timeSheets?.length || 0} nhân viên)
                    </h6>

                    {profile.role === ROLE.ADMIN && (
                        <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            startContent={<PlusIcon className="w-4 h-4" />}
                            onPress={() => {
                                getModal({
                                    isOpen: true,
                                    size: "lg",
                                    modalHeader: TEXT.ADD_TIME_SHEET,
                                    modalBody: (
                                        <TimeSheetModal
                                            targetAt={targetAt}
                                            targetShift={targetShift}
                                        />
                                    ),
                                });
                            }}
                        />
                    )}
                </div>

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

                                <div className="flex items-center gap-x-2">
                                    <span className="font-medium text-gray-900">
                                        {`${timeSheet.checkIn || "--"} - ${timeSheet.checkOut || "--"} (${timeSheet.workingHours}h)`}
                                    </span>

                                    {profile.role === ROLE.ADMIN && (
                                        <div className="flex items-center">
                                            <Button
                                                size="sm"
                                                variant="light"
                                                color="default"
                                                isIconOnly
                                                startContent={<PencilIcon className="w-4 h-4" />}
                                                onPress={() => {
                                                    getModal({
                                                        isOpen: true,
                                                        size: "lg",
                                                        modalHeader: TEXT.ADD_TIME_SHEET,
                                                        modalBody: (
                                                            <TimeSheetModal
                                                                currentTimeSheet={timeSheet}
                                                                targetAt={targetAt}
                                                                targetShift={targetShift}
                                                            />
                                                        ),
                                                    });
                                                }}
                                            />
                                            <Button
                                                size="sm"
                                                variant="light"
                                                color="default"
                                                isIconOnly
                                                startContent={<TrashIcon className="w-4 h-4" />}
                                                onPress={() => {
                                                    deleteTimeSheet(timeSheet.id);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
