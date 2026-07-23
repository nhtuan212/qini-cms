import TimeSheetModal from "./TimeSheetModal";
import Button from "@/components/Button";
import { PencilIcon, PlusIcon, TrashIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useTimeSheet } from "@/hooks";
import { ROLE, TEXT } from "@/constants";
import { TargetShiftProps, TimesheetData } from "@/types";

export default function TimeSheets({
    targetAt,
    targetShift,
    timeSheets,
}: {
    targetAt: string;
    targetShift: TargetShiftProps;
    timeSheets: TimesheetData[];
}) {
    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();

    //** Queries */
    const { deleteTimeSheet } = useTimeSheet();

    //** Render */
    return (
        <>
            <h4 className="font-semibold text-gray-900">{TEXT.TIME_SHEET}</h4>

            <div className="flex flex-col border-t border-gray-200">
                <div className="flex justify-between items-center pt-2">
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
                    {timeSheets.map((timeSheet: TimesheetData) => (
                        <div key={timeSheet.id} className="bg-primary-100 rounded-md p-2">
                            <div className="flex justify-between items-center text-xs">
                                <div className="font-medium text-gray-800">
                                    {timeSheet.name || "Chưa đặt tên"}
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
                                                onPress={() => deleteTimeSheet(timeSheet.id)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
