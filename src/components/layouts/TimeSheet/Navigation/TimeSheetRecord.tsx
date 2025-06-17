import React, { useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { Select, SelectItem } from "@/components/Select";
import {
    ArrowRightEndOnRectangleIcon,
    ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { TimeSheetProps, useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { useShiftStore } from "@/stores/useShiftsStore";
import { ShiftProps } from "@/stores/useShiftsStore";
import { TEXT } from "@/constants";
import { formatDate, isEmpty, validateUserIP } from "@/utils";

export default function TimeSheetRecord() {
    //** Stores */
    const { staffById } = useStaffStore();
    const { shifts } = useShiftStore();

    //** States */
    const [error, setError] = useState("");
    const [selectedShift, setSelectedShift] = useState<string | null>(null);
    const [shiftError, setShiftError] = useState<string | null>(null);

    //** Variables */
    const { isLoading, timeSheetByStaffId, recordTimeSheet } = useTimeSheetStore();

    //** Functions */
    const handleRecordTimeSheet = async () => {
        setError("");

        if (!selectedShift) {
            setShiftError(TEXT.IS_REQUIRED);
            return;
        }

        // Validate IP address using common utility
        const ipValidation = await validateUserIP();

        if (!ipValidation.isValid) {
            setError(ipValidation.error || "IP validation failed");
            return;
        }

        const bodyParams: Pick<TimeSheetProps, "staffId" | "shiftId"> = {
            staffId: staffById.id,
            shiftId: selectedShift,
        };

        await recordTimeSheet(bodyParams)
            .then(res => res)
            .catch(() => {
                setError(TEXT.ERROR);
            });
    };

    //** Render */
    return (
        <div className="space-y-6">
            {/* Current Status */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">{TEXT.CHECK_IN_TODAY}</h2>
                <p className="text-gray-600">
                    {formatDate(new Date(), "dddd, DD MMMM, YYYY", "vi")}
                </p>
            </div>

            {/* Check In/Out Group */}
            <Card className="flex flex-col items-center justify-center gap-y-4 bg-success-50 p-4 border-2 border-success-200">
                <Select
                    label={TEXT.WORK_SHIFT_SELECT}
                    color="primary"
                    isInvalid={!!shiftError}
                    errorMessage={shiftError}
                    classNames={{
                        trigger: "bg-white border-primary-300",
                    }}
                    onChange={e => {
                        setError("");
                        setShiftError("");
                        setSelectedShift(e.target.value);
                    }}
                >
                    {shifts.map((shift: ShiftProps) => (
                        <SelectItem key={shift.id}>{shift.name}</SelectItem>
                    ))}
                </Select>

                <div className="w-full flex gap-x-2">
                    <Button
                        color="success"
                        size="lg"
                        className="w-full"
                        isLoading={isLoading}
                        startContent={<ArrowRightEndOnRectangleIcon className="w-5 h-5" />}
                        isDisabled={
                            !!timeSheetByStaffId.find(item => item.shiftId === selectedShift)
                                ?.checkIn
                        }
                        onPress={handleRecordTimeSheet}
                    >
                        {TEXT.CHECK_IN}
                    </Button>

                    <Button
                        color="danger"
                        size="lg"
                        className="w-full"
                        isLoading={isLoading}
                        endContent={<ArrowRightStartOnRectangleIcon className="w-5 h-5" />}
                        isDisabled={
                            !!timeSheetByStaffId.find(item => item.shiftId === selectedShift)
                                ?.checkOut
                        }
                        onPress={handleRecordTimeSheet}
                    >
                        {TEXT.CHECK_OUT}
                    </Button>
                </div>

                {error && <span className="text-red-500">{error}</span>}
            </Card>

            {/* Today's Summary */}
            <Card className="bg-primary-50 p-4 border border-primary-200">
                <h4 className="font-semibold text-gray-800 mb-3">Tóm tắt hôm nay</h4>
                {!isEmpty(timeSheetByStaffId) &&
                    timeSheetByStaffId.map(item => (
                        <div key={item.id}>
                            <div className="grid grid-cols-4 gap-2 text-sm">
                                <div>
                                    <span className="text-gray-600">{`${TEXT.WORK_SHIFT}:`}</span>
                                    <span className="ml-2 font-medium">{item.shiftName}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">{`${TEXT.CHECK_IN}:`}</span>
                                    <span className="ml-2 font-medium">{item.checkIn}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">{`${TEXT.CHECK_OUT}:`}</span>
                                    <span className="ml-2 font-medium">{item.checkOut}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">{`${TEXT.WORKING_HOURS}:`}</span>
                                    <span className="ml-2 font-medium">{item.workingHours}</span>
                                </div>
                            </div>
                        </div>
                    ))}
            </Card>
        </div>
    );
}
